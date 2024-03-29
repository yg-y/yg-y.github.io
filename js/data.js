function getContent() {
    let data = [
        {
            id: 1,
            name: '【Docker 系列】SkyWalking APM 基于 Docker 的搭建方案',
            titleName: 'Skywalking 是一个可观测性分析平台和应用性能管理系统。提供分布式跟踪，服务网格遥测分析，度量聚合和可视化一体化解决方案。',
            fileUrl: './md/skywalking.md',
            tag: '监控',
            creatTime: '2020-06-30',
            auth: '小羊'
        }, {
            id: 2,
            name: '【Docker 系列】Docker 搭建 MySQL 主从同步',
            titleName: '基于Docker的MySQL主从同步搭建',
            fileUrl: './md/docker-mysql-master-slave.md',
            tag: '数据库',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 3,
            name: '【Docker 系列】Docker 搭建 RabbitMQ 消息队列',
            titleName: '基于Docker的RabbitMQ消息队列搭建，及简单的生产者消费者示例',
            fileUrl: './md/rabbit-mq.md',
            tag: '消息队列',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 4,
            name: 'Linux常用命令',
            titleName: '记录一些Linux常用的命令',
            fileUrl: './md/linux.md',
            tag: 'Linux',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 5,
            name: '大话设计模式学习笔记',
            titleName: '大话系列读书笔记 - 大话设计模式',
            tag: '设计模式',
            fileUrl: './md/java-design.md',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 6,
            name: 'Redis设计与实现',
            titleName: 'Redis设计与实现 阅读输出笔记',
            fileUrl: './md/redis.md',
            tag: 'Redis',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 7,
            name: '【Docker 系列】Docker 安装 Nginx',
            titleName: 'Docker 安装 Nginx',
            fileUrl: './md/docker-nginx.md',
            tag: 'Docker',
            creatTime: '2020-06-29',
            auth: '小羊'
        }, {
            id: 8,
            name: '使用EasyPoi根据权限动态导出列——反射实现',
            titleName: '使用EasyPoi根据权限动态导出列——反射实现',
            fileUrl: './md/excel-permission.md',
            tag: 'JAVA',
            creatTime: '2020-06-29',
            auth: '小羊'
        }, {
            id: 9,
            name: 'mdnice 排版工具',
            titleName: 'md2all',
            fileUrl: './md/md2all.html',
            tag: '排版',
            creatTime: '2020-07-02',
            auth: '小羊'
        }, {
            id: 9100,
            name: '杨广-JAVA 开发工程-简历',
            titleName: '杨广-JAVA 开发工程-简历',
            fileUrl: './md/简历.md',
            tag: '简历',
            creatTime: '2020-09-14',
            auth: '小羊'
        }, {
            id: 10,
            name: '深入理解JAVA虚拟机阅读输出',
            titleName: 'java虚拟机在执行java程序的过程中会把它所管理的内存划分为若干个不同的数据区域。这些区域有各自的用途，以及创建销毁的时间，有的区域随着虚拟机进程的启动而一直存在，有些区域则是依赖用户线程的启动和结束而建立和销毁。\n',
            fileUrl: './md/jvm/jvm.md',
            tag: 'JVM',
            creatTime: '2020-07-07',
            auth: '小羊'
        }, {
            id: 11,
            name: 'MySQL InnoDB 技术内部阅读输出',
            titleName: 'InnoDB存储引擎\n' +
                '\n' +
                'InnoDB是事务安全的MySQL存储引擎\n' +
                '\n' +
                '从MySQL 5.5版本开始是默认的表存储引擎（之前的版本InnoDB存储引擎仅在Windows下为默认的存储引擎）\n' +
                '\n' +
                '该存储引擎是第一个完整支持ACID事务的MySQL存储引擎（BDB是第一个支持事务的MySQL存储引擎，现在已经停止开发），\n' +
                '其特点是行锁设计、支持MVCC、支持外键、提供一致性非锁定读，同时被设计用来最有效地利用以及使用内存和CPU',
            fileUrl: './md/mysql/mysql-innodb.md',
            tag: '数据库',
            creatTime: '2020-07-07',
            auth: '小羊'
        }, {
            id: 12,
            name: '(1658)Agency: API_Adeals 广告主黑白名单获取教程',
            titleName: '以下是获取 token 的链接，将一下链接放到 postman 使用 post 请求发送即可获取到 token，举例 ios cpi token 获取，详细操作如图1.0所示：',
            fileUrl: './md/work/1658.md',
            tag: '工作',
            creatTime: '2020-07-10',
            auth: '小羊'
        }, {
            id: 14,
            name: 'HashMap 底层原理及 JDK 1.8 对于它的优化',
            titleName: '基于哈希表的Map接口的。 此实现提供所有可选的映射操作，并且允许null值和null键。 \n' +
                '（HashMap类大致相当于哈希表 ，但它是不同步的，并允许空值。）此类不保证作为对Map的顺序; \n' +
                '\n' +
                'HashMap中的一个实例具有影响其性能的两个参数： 初始容量和负载因子 。\n' +
                '\n' +
                '容量是在哈希表中桶的数量，和初始容量是简单地在创建哈希表中的时间的能力。\n' +
                '\n' +
                '作为一般规则，默认加载因子（0.75）在时间和空间成本之间的良好平衡。\n' +
                '\n' +
                '如果初始容量大于负载系数分项的最大数量，则永远不会发生rehash操作。',
            fileUrl: './md/java/hashmap.md',
            tag: 'JAVA',
            creatTime: '2020-07-23',
            auth: '小羊'
        }, {
            id: 15,
            name: '【重学MySQL计划】之MySQL基本架构及日志文件',
            titleName: '连接池：这里面引入了一些线程池的概念(线程重用)，但是里面还包含了一些身份认证安全的一些措施。连接池的作用可以让客户端可以不用频繁对数据库进行连接-断开-连接的操作，同时对性能的提升影响巨大，官方有对加入连接池和没加连接池的SQL性能做对比。系统管理和控制工具：包括备份、还原、安全、集群等操作',
            fileUrl: './md/mysql/mysql-learning-1.md',
            tag: 'MySQL',
            creatTime: '2020-08-21',
            auth: '小羊'
        }, {
            id: 16,
            name: '【重学MySQL计划】数据库日志文件之 Bin Log 数据恢复让你做到删库不跑路',
            titleName: 'Binary Log（bin log）\n' +
                '\n' +
                '二进制日志（Binary Log），是 MySQL 中非常重要的日志。主要用于记录数据库的变化情况，即 SQL 语句的 DDL 和 DML 语句，不包含数据记录查询操作。\n' +
                '\n' +
                '如果你一不小心手抖删除了某些数据或者再严重点，整个库都被你删了，那么不用担心，有了 bin log 让你无需删库跑路。前提，数据库得开启bin log\n' +
                '\n' +
                '默认情况下，bin log 功能是关闭的。可以通过以下命令查看二进制日志是否开启，命令如下：',
            fileUrl: './md/mysql/mysql-learning-2.md',
            tag: 'MySQL',
            creatTime: '2020-08-24',
            auth: '小羊'
        }, {
            id: 17,
            name: '【分布式系列】基于 Alibaba-Seata 的分布式事务实战',
            titleName: '什么是事务 简单讲事务是数据库管理系统执行过程中的一个逻辑单元，它能保证要么一组数据库操作全部执行成功，要么全部失败，而做到这些的原理就是事务的ACID四大特性。',
            fileUrl: './md/java/Alibaba-Seata.md',
            tag: 'MySQL',
            creatTime: '2020-12-30',
            auth: '小羊'
        }, {
            id: 18,
            name: '【Docker 系列】Docker 基础及入门搭建',
            titleName: 'Docker 是一个开放源代码软件，是一个开放平台，用于开发应用、交付（shipping）应用、运行应用。 Docker允许用户将基础设施（Infrastructure）中的应用单独分割出来，形成更小的颗粒（容器），从而提高交付软件的速度',
            fileUrl: './md/docker/Docker-install.md',
            tag: 'Docker',
            creatTime: '2021-03-08',
            auth: '小羊'
        }, {
            id: 19,
            name: '【Docker 系列】Docker-Compose 基础及入门搭建',
            titleName: 'Compose可译为组合物。[11]Compose 是用于定义和运行 多个容器Docker应用程序 的工具。通过Compose，你可以使用YAML文件来配置应用程序需要的所有服务，然后通过使用一个命令，就可以创建并启动所有服务。[12][13]Compose对应的命令为docker-compose',
            fileUrl: './md/docker/Docker-Compose-install.md',
            tag: 'Docker',
            creatTime: '2021-03-09',
            auth: '小羊'
        }, {
            id: 20,
            name: '【重学MySQL计划】数据库日志文件之 Undo Log 让你了解 MySQL 事务',
            titleName: 'Compose可译为组合物。[11]Compose 是用于定义和运行 多个容器Docker应用程序 的工具。通过Compose，你可以使用YAML文件来配置应用程序需要的所有服务，然后通过使用一个命令，就可以创建并启动所有服务。[12][13]Compose对应的命令为docker-compose',
            fileUrl: './md/mysql/mysql-undolog.md',
            tag: 'MySQL',
            creatTime: '2021-03-10',
            auth: '小羊'
        }, {
            id: 21,
            name: '基于 HotSpot 的 JAVA 虚拟机参数概览',
            titleName: '记录在 JVM 启动参数设置时需要调整的一些参数，使其符合各类服务的运行环境，此文章以 JDK1.8 HotSpot 虚拟机为例 展示对应的虚拟器参数，不同版本的 JDK 及不同版本的虚拟器，参数或多或少会有区别，请以官方文档为准。',
            fileUrl: './md/jvm/jvm-param.md',
            tag: 'JVM',
            creatTime: '2021-03-16',
            auth: '小羊'
        }, {
            id: 22,
            name: 'SpringBoot Interceptor 拦截器获取 POST 请求 @RequestBody 参数时的问题',
            titleName: 'SpringBoot Interceptor 拦截器获取 POST 请求 @RequestBody 参数时，通过 HttpServletRequest.getInputStream() 获取参数时，抛出 I/O error while reading input message; nested exception is java.io.IOException: Stream closed 的问题解决方案',
            fileUrl: './md/java/SpringBootInterceptor.md',
            tag: 'JAVA',
            creatTime: '2021-04-13',
            auth: '小羊'
        }, {
            id: 23,
            name: 'Spring 整合 Motan RPC 框架，内附源码',
            titleName: 'Motan是一套基于java开发的RPC框架，除了常规的点对点调用外，Motan还提供服务治理功能，包括服务节点的自动发现、摘除、高可用和负载均衡等。Motan具有良好的扩展性，主要模块都提供了多种不同的实现，例如支持多种注册中心，支持多种rpc协议等。',
            fileUrl: './md/java/java-motan-example.md',
            tag: 'Motan',
            creatTime: '2021-04-15',
            auth: '小羊'
        }, {
            id: 24,
            name: 'SpringBoot 整合 ElasticSearch，内附源码',
            titleName: 'Elasticsearch 是一个分布式、RESTful 风格的搜索和数据分析引擎，能够解决不断涌现出的各种用例。 作为 Elastic Stack 的核心，它集中存储您的数据，帮助您发现意料之中以及意料之外的情况。',
            fileUrl: './md/java/springboot-es-example.md',
            tag: 'ElasticSearch',
            creatTime: '2021-04-20',
            auth: '小羊'
        }, {
            id: 25,
            name: 'XXL-JOB 定时任务搭建及入门教程，内附源码',
            titleName: 'XXL-JOB是一个分布式任务调度平台，其核心设计目标是开发迅速、学习简单、轻量级、易扩展。现已开放源代码并接入多家公司线上产品线，开箱即用。',
            fileUrl: './md/java/springboot-xxl-job-example.md',
            tag: 'XXL-JOB',
            creatTime: '2021-04-21',
            auth: '小羊'
        }, {
            id: 26,
            name: 'Docker 部署 ELK (ElasticSearch/Logstash/Kibana) 日志收集分析系统',
            titleName: 'ELK（Elasticsearch，Logstash，Kibana），用来收集日志还有进行日志分析，最后通过可视化UI进行展示。在大量日志产生的项目场景中，ELK是收集、分析日志的利器！',
            fileUrl: './md/logs/elk-guide.md',
            tag: 'ELK',
            creatTime: '2021-12-31',
            auth: '小羊'
        },{
            id: 27,
            name: '【K8S】使用 kubeadm 对 Kubernetes 进行集群安装',
            titleName: 'Kubernetes 集群安装',
            fileUrl: './md/k8s/k8s-cluster.md',
            tag: 'k8s',
            creatTime: '2022-03-28',
            auth: '小羊'
        }, {
            id: 28,
            name: '【K8S】使用 KubeKey 安装 Kubernetes 集群及 Kubesphere',
            titleName: '使用 KubeKey 安装 Kubernetes 集群及 Kubesphere',
            fileUrl: './md/k8s/k8s-kube-key.md',
            tag: 'k8s',
            creatTime: '2022-03-31',
            auth: '小羊'
        },{
            id: 29,
            name: 'Jenkins 自动部署项目到 Kubernetes',
            titleName: '使用 Jenkins 自动部署项目到 Kubernetes',
            fileUrl: './md/cicd/jenkins.md',
            tag: 'cicd',
            creatTime: '2023-09-11',
            auth: '小羊'
        },
    ]
    return data
}

