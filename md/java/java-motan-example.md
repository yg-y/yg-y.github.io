# motan-example

[motan 官方文档](https://github.com/weibocom/motan/wiki/zh_userguide)

> Motan是一套基于java开发的RPC框架，除了常规的点对点调用外，Motan还提供服务治理功能，包括服务节点的自动发现、摘除、高可用和负载均衡等。Motan具有良好的扩展性，主要模块都提供了多种不同的实现，例如支持多种注册中心，支持多种rpc协议等。

## 模块说明

- motan-common

> motan 公共模块，包含 motan 所需依赖 jar 包，引入即可

- motan-spring-server

> motan 服务提供模块

```xml
<!-- motan_server.xml -->

<!-- service implemention bean -->
<!-- 将服务注册到 spring 容器中，也可以通过 代码方式注入 @Bean -->
<bean id="serviceImpl" class="com.young.motan.service.impl.FooServiceImpl"/>

        <!-- exporting service by Motan -->
        <!-- 对外暴露到服务 -->
<motan:service interface="com.young.motan.service.FooService" ref="serviceImpl" export="8002"/>
```

- motan-spring-client

> motan 服务客户端，调用方

```xml
<!--motan_client.xml-->

<!-- reference to the remote service -->
<!-- 引用远程服务，代码中直接 注入或者 通过 ApplicationContext.getBean() 的方式获取对象进行调用 -->
<motan:referer id="remoteService" interface="com.young.motan.service.FooService" directUrl="localhost:8002"/>
```

## 调用说明

- 依次启动 motan-spring-server、 motan-spring-client
- 查看 motan-spring-client 调用 service.hello("motan") 输出内容，如果符合预期则搭建成功

## 源码地址

[https://github.com/yg-y/motan-example](https://github.com/yg-y/motan-example)