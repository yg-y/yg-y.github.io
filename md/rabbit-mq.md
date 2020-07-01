# Rabbit MQ 搭建及简单教程

[Rabbit MQ 快速入门官网链接](https://www.rabbitmq.com/getstarted.html)

> 本教程中 Rabbit MQ 使用 docker-compose 安装

docker-compose.yml 文件

```

version: '2'
services:
  rabbitmq:
    image: rabbitmq:latest
    environment:
      - RABBITMQ_DEFAULT_VHOST=/
      # 管理界面的账号密码
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=123456
    restart: always
    ports:
      - 15672:15672
      - 4369:4369
      - 5672:5672
      - 25672:25672

```

- 启动成功后，会出现 RabbitMQ Management 无法访问的情况，解决方法如下：

```
  访问此rabbitmq主页时会出现无法访问，这是因为没有开启插件
  开启插件：首先使用命令进入容器  docker exec -it rabbit /bin/bash
  开启插件命令：rabbitmq-plugins enable rabbitmq_management
```

- 访问 http://127.0.0.1:15672 , 可以对消息进行一系列管理等

![rabbitmq-management.png](https://i.loli.net/2020/07/01/NS2OY3DVTtFovaR.png)


# 客户端连接及消息发送和接受
## 使用简单的工作模式，其他工作模式，比如：
> 工作队列，多个消费者订阅一个生产者
> 发布订阅模式等等请移步官网

![rabbitmq-mode1.png](https://i.loli.net/2020/07/01/nCK8G9McxupwmWf.png)
![rabbitmq-mode2.png](https://i.loli.net/2020/07/01/piWUd5tIVgRz4DA.png)

- 使用JAVA语言，其他语言请移步官网
- 添加maven依赖
```text

<!-- https://mvnrepository.com/artifact/com.rabbitmq/amqp-client -->
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.9.0</version>
</dependency>

```

- 创建生产者
```text
public class ProductMessage {

    // 设置队列名称
    private final static String QUEUE_NAME = "hello";


    public static void main(String[] args) throws IOException, TimeoutException {
        // 创建链接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("127.0.0.1");
        factory.setPort(5672);
        factory.setUsername("admin");
        factory.setPassword("123456");

        Connection connection = null;
        Channel channel = null;

        // 新建连接及创建通道
        connection = factory.newConnection();
        channel = connection.createChannel();

        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        String message = "Hello World";

        channel.basicPublish("", QUEUE_NAME, null, message.getBytes());

        System.err.println("message send success : " + message);

    }
}

```

- 创建消费者
```text

public class ConsumerMessage {

    private final static String QUEUE_NAME = "hello";

    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("127.0.0.1");
        factory.setPort(5672);
        factory.setUsername("admin");
        factory.setPassword("123456");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [x] Received '" + message + "'");
        };
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> {
        });
    }
}

```