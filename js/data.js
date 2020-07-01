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
            name: 'Linux常用命令',
            titleName: '记录一些Linux常用的命令',
            fileUrl: './md/linux.md',
            tag: 'Linux',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 3,
            name: '大话设计模式学习笔记',
            titleName: '大话系列读书笔记 - 大话设计模式',
            tag: '设计模式',
            fileUrl: './md/java-design.md',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 4,
            name: 'Redis设计与实现',
            titleName: 'Redis设计与实现 阅读输出笔记',
            fileUrl: './md/redis.md',
            tag: 'Redis',
            creatTime: '2020-07-01',
            auth: '小羊'
        }, {
            id: 5,
            name: 'Docker 安装 Nginx',
            titleName: 'Docker 安装 Nginx',
            fileUrl: './md/docker-nginx.md',
            tag: 'Docker',
            creatTime: '2020-06-29',
            auth: '小羊'
        }, {
            id: 6,
            name: '使用EasyPoi根据权限动态导出列——反射实现',
            titleName: '使用EasyPoi根据权限动态导出列——反射实现',
            fileUrl: './md/excel-permission.md',
            tag: 'JAVA',
            creatTime: '2020-06-29',
            auth: '小羊'
        },
    ]
    return data
}