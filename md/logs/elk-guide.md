# Docker 部署 ELK (ElasticSearch/Logstash/Kibana) 日志收集分析系统

## 首先安装 ELK (ElasticSearch/Logstash/Kibana)

### 配置文件

- docker-compose.yml

```yaml
# es.yml
version: '3'
services:
  elasticsearch:
    image: elasticsearch:7.8.0
    container_name: elk-es
    restart: always
    environment:
      # 开启内存锁定
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - "TAKE_FILE_OWNERSHIP=true"
      # 指定单节点启动
      - discovery.type=single-node
    ulimits:
      # 取消内存相关限制  用于开启内存锁定
      memlock:
        soft: -1
        hard: -1
    volumes:
      - ./logs/data:/usr/share/elasticsearch/data
      - ./logs:/usr/share/elasticsearch/logs
      - ./logs/plugins:/usr/share/elasticsearch/plugins
    ports:
      - "9200:9200"
  kibana:
    image: kibana:7.8.0
    container_name: elk-kibana
    restart: always
    environment:
      ELASTICSEARCH_HOSTS: http://elk-es:9200
      I18N_LOCALE: zh-CN
    ports:
      - "5601:5601"
  logstash:
    image: logstash:7.8.0
    container_name: elk-logstash
    restart: always
    environment:
      XPACK_MONITORING_ENABLED: "false"
      pipeline.batch.size: 10
    volumes:
      - ./conf/logstash/logstash-springboot.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "4560:4560" #设置端口

```

- logstash 的配置文件 logstash-springboot.conf

```
#新建logstash/logstash-springboot.conf文件，新增以下内容
input {
  tcp {
    mode => "server"
    host => "0.0.0.0"
    port => 4560
    codec => json_lines
  }
}
output {
  elasticsearch {
    hosts => "es:9200"
    // es 中日志索引名称
    index => "logstash-%{+YYYY.MM.dd}"
  }
}
```

### 文件准备完毕

- 文件准备完毕后的目录结构应该是这样的

```text
- conf
    - logstash-springboot.conf
- docker-compose.yml
```

- 执行启动命令

```shell
docker-compose up -d
```

- 启动完毕后查看状态是否正常

```shell
docker ps

CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS          PORTS                                                           NAMES
6cff523389dc   logstash:7.7.0        "/usr/local/bin/dock…"   6 hours ago     Up 14 minutes   5044/tcp, 0.0.0.0:4560->4560/tcp, :::4560->4560/tcp, 9600/tcp   elk_logstash
eac2af4bfa55   kibana:7.7.0          "/usr/local/bin/dumb…"   6 hours ago     Up 6 hours      0.0.0.0:5601->5601/tcp, :::5601->5601/tcp                       elk_kibana
6fb7fd998ecf   elasticsearch:7.7.0   "/tini -- /usr/local…"   6 hours ago     Up 2 minutes    0.0.0.0:9200->9200/tcp, :::9200->9200/tcp, 9300/tcp             elk_elasticsearch
```

- 访问 5601 端口即可看到 kibana ui 界面
- ![image.png](http://tva1.sinaimg.cn/mw690/a760927bgy1gxx3r8wdpgj22yo1mm4qp.jpg)

## 配置服务

- maven

```xml
<!-- logback 推送日志文件到 logstash -->
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>6.6</version>
</dependency>
```

- logback-spring.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml"/>

    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>127.0.0.1:4560</destination>
        <!-- logstash ip和暴露的端口，logback就是通过这个地址把日志发送给logstash -->
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder"/>
    </appender>

    <root level="INFO">
        <appender-ref ref="LOGSTASH"/>
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

- 编写日志输出接口，访问接口输出日志即可在 kibana 中看到日志

```java
@GetMapping("/logs")
public String printLogs(){
        log.info(this.getClass().getSimpleName()+" info : "+LocalDateTime.now().getSecond());
        log.warn(this.getClass().getSimpleName()+" warn : "+LocalDateTime.now().getSecond());
        log.error(this.getClass().getSimpleName()+" error : "+LocalDateTime.now().getSecond());
        return"logs";
        }
```

![image.png](http://tva1.sinaimg.cn/mw690/a760927bgy1gxx3vog1vaj21wo0eyat4.jpg)

- 然后去到 kibana -> discover 目录配置索引模式
  ![image.png](http://tva1.sinaimg.cn/mw690/a760927bgy1gxx3wru4rlj22yo1mmh8s.jpg)
- 输入索引、点击下一步
  ![image.png](http://tva1.sinaimg.cn/mw690/a760927bgy1gxx3xn07dzj21uo0p8th8.jpg)
- 创建索引模式
  ![image.png](http://tva1.sinaimg.cn/mw690/a760927bgy1gxx3y3qnk9j21u60py47o.jpg)
- 等待创建完成
  ![image.png](http://tva1.sinaimg.cn/mw690/a760927bgy1gxx3yrts50j21tg0b8jug.jpg)
- 再次去到 kibana -> discover 即可查看日志
  ![image.png](http://tva1.sinaimg.cn/large/a760927bgy1gy3tgoxr6qj22xo1gsb29.jpg)
- 搜索
  ![image.png](http://tva1.sinaimg.cn/large/a760927bgy1gy3thga1yfj22xc1hg4qp.jpg)