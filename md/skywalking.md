# SkyWalking APM 基于 Docker 的搭建方案

[Apache SkyWalking](http://skywalking.apache.org/)

>Skywalking 是一个可观测性分析平台和应用性能管理系统。
>提供分布式跟踪，服务网格遥测分析，度量聚合和可视化一体化解决方案。

## docker-compose 方案
>从 skywalking 官网下载 docker-compose 文件

- 启动成功后即可访问 skywalking 可视化界面
- http://120.0.0.1:8080

```yml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.5.0
    container_name: elasticsearch
    restart: always
    ports:
      - 9200:9200
    healthcheck:
      test: ["CMD-SHELL", "curl --silent --fail localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    environment:
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
  oap:
    image: apache/skywalking-oap-server:8.3.0-es7
    container_name: oap
    depends_on:
      - elasticsearch
    links:
      - elasticsearch
    restart: always
    ports:
      - 11800:11800
      - 12800:12800
    healthcheck:
      test: ["CMD-SHELL", "/skywalking/bin/swctl ch"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    environment:
      SW_STORAGE: elasticsearch7
      SW_STORAGE_ES_CLUSTER_NODES: elasticsearch:9200
      SW_HEALTH_CHECKER: default
      SW_TELEMETRY: prometheus
  ui:
    image: apache/skywalking-ui:8.3.0
    container_name: ui
    depends_on:
      - oap
    links:
      - oap
    restart: always
    ports:
      - 8080:8080
    environment:
      SW_OAP_ADDRESS: oap:12800
```

## 服务监控配置
### IDEA 或原生方式启动方案
>在启动参数上配置

[源码包下载地址](http://skywalking.apache.org/downloads/)

##### idea 上启动在VM( ->Edit Configurations -> VM)那一栏添加以下参数即可


- skywalking-agent.jar (skywalking 源码包中 agent 目录下的jar包)
- Dskywalking.agent.service_name 
- backend_service 后面跟着skywalking部署的地址和skywalking-oap-server服务的端口
- 更多配置选项请查看 \agent\config\agent.config 文件

```
-javaagent:你的储存地址\skywalking-agent.jar
-Dskywalking.agent.service_name=模块名称
-Dskywalking.collector.backend_service=skywalking部署的服务器ip:11800
```

### docker 启动

- 首先打包一个带有 skywalking agent 的基础镜像

##### 基础镜像 Dockerfile 文件

```
FROM centos:7
 
WORKDIR /app
 
RUN yum install -y wget && \
    yum install -y java-1.8.0-openjdk

# 从官网上下载这个文件，放到同级目录
COPY ./apache-skywalking-apm-es7-8.3.0.tar.gz /app

# 解压放到指定文件下 ，我这里放到 /app/skywalking 目录下
RUN tar -xf apache-skywalking-apm-es7-8.3.0.tar.gz && \
    mv apache-skywalking-apm-bin-es7 skywalking
 
RUN ls /app
```
文件创建好之后，执行 docker build 打包命令

```
docker build -t jdk-8.0-skywalking-8:0.0.1 .
```

##### 创建需要被监控的服务对象
- SW_APPLICATION_CODE : 被监控的服务名
- SW_COLLECTOR_SERVERS ：skywalking-aop 的 ip 及 port

```
FROM jdk-8.0-skywalking-8:0.0.1

LABEL maintainer="young.yg@foxmail.com"

ENV SW_APPLICATION_CODE=serve-app \
    SW_COLLECTOR_SERVERS=127.0.0.1:11800,127.0.0.1:12800

COPY app.jar /app.jar

EXPOSE 8088

# 更多参数请参考官方agent.config文件
ENTRYPOINT java -javaagent:/app/skywalking/agent/skywalking-agent.jar -Dskywalking.agent.service_name=${SW_APPLICATION_CODE} -Dskywalking.collector.backend_service=${SW_COLLECTOR_SERVERS} -Dserver.port=8088 -jar /app.jar

```

文件创建好之后，执行 docker build 打包命令

```
docker build -t serve-app:0.0.1 .
```

构建完成后 启动服务

```
docker run -it -d -p 8088:8088 serve-app:0.0.1
```