# SkyWalking APM

[Apache SkyWalking](http://skywalking.apache.org/)

>Skywalking 是一个可观测性分析平台和应用性能管理系统。
>提供分布式跟踪，服务网格遥测分析，度量聚合和可视化一体化解决方案。

## docker-compose 方案
>注意版本对应 skywalking-oap-server:6.6.0 --> es6 , 7+ --> es 7+


- 启动成功后即可访问 skywalking 可视化界面
- 120.0.0.1:8080

```yml
version: '3.3'
services:
  elasticsearch:
    image: elasticsearch:6.8.7
    container_name: elasticsearch
    restart: always
    ports:
      - 9200:9200
    environment:
      discovery.type: single-node
    ulimits:
      memlock:
        soft: -1
        hard: -1
  oap:
    image: apache/skywalking-oap-server:6.6.0-es6
    container_name: oap
    depends_on:
      - elasticsearch
    links:
      - elasticsearch
    restart: always
    ports:
      - 11800:11800
      - 12800:12800
    environment:
      SW_STORAGE: elasticsearch
      SW_STORAGE_ES_CLUSTER_NODES: elasticsearch:9200
  ui:
    image: apache/skywalking-ui:6.6.0
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

## 服务配置
>在启动参数上配置

##### idea上启动在VM( ->Edit Configurations -> VM)那一栏添加以下参数即可
[源码包下载地址](http://skywalking.apache.org/downloads/)

- skywalking-agent.jar (skywalking 源码包中 agent 目录下的jar包)
- agent.config (skywalking 源码包中 agent 目录下config下的配置文件)
- backend_service 后面跟着skywalking部署的地址和skywalking-oap-server服务的端口


```
-javaagent:你的储存地址\skywalking-agent.jar
-Dskywalking_config=你的储存地址\agent.config
-Dskywalking.agent.service_name=模块名称
-Dskywalking.collector.backend_service=skywalking部署的服务器ip:11800
```

>jar包
- jar包版本对应，加入我上面使用的是 6.6.0 那么jar应该也有对应的 6.6.0版本

```
<dependency>
    <groupId>org.apache.skywalking</groupId>
    <artifactId>apm-toolkit-trace</artifactId>
    <version>x.x.x</version>
</dependency>
```

## docker-compose.yml服务文件配置

```
environment:
  - JAVA_OPTS="-javaagent:你的储存地址\skywalking-agent.jar
                -Dskywalking_config=你的储存地址\agent.config
                -Dskywalking.agent.service_name=模块名称
                -Dskywalking.collector.backend_service=skywalking部署的服务器ip:11800"
```



