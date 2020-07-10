function getTags() {
    let data = [
        {
            id: 1,
            name: '后端'
        },
        {
            id: 2,
            name: '前端'
        },
        {
            id: 3,
            name: '数据库'
        },
        {
            id: 3,
            name: '数据库'
        },
        {
            id: 3,
            name: '数据库'
        },
        {
            id: 3,
            name: '数据库'
        }
    ]
    return data;
}

function getContent() {
    let data = [
        {
            id: 1,
            name: 'SkyWalking APM 搭建笔记',
            titleName: 'Skywalking 是一个可观测性分析平台和应用性能管理系统。提供分布式跟踪，服务网格遥测分析，度量聚合和可视化一体化解决方案。',
            fileUrl: './md/skywalking.md',
            tag: '监控',
            creatTime: '2020-06-30',
            auth: '小羊'
        }, {
            id: 2,
            name: 'Docker搭建MySQL主从同步',
            titleName: '基于Docker的MySQL主从同步搭建',
            fileUrl: './md/docker-mysql-master-slave.md',
            tag: '数据库',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 3,
            name: 'Docker搭建RabbitMQ消息队列',
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
            name: 'Docker 安装 Nginx',
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
        },
    ]
    return data
}

function getAuthInfo() {

    let auth = {
        auth: '桑之落矣',
        description: '曾经沧海难为水，除却巫山不是云。取次花丛懒回顾，半缘修道半缘君。',
    }

    return auth
}