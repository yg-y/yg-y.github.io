# github pages 个人博客模板

`index.html 博客入口`

`/md markdown 文件目录`

`/photo 图片文件目录`

`/css 全局css样式目录`

`/js 全局js目录`

```
/js/data.js

// 此方法定义编程入口文章列表
getContent()

// 对象说明
{
    // 唯一id
    id: 1,
    // 文章名称
    name: 'SkyWalking APM 搭建笔记',
    // 文章下方说明
    titleName: 'Skywalking 是一个可观测性分析平台和应用性能管理系统。提供分布式跟踪，服务网格遥测分析，度量聚合和可视化一体化解决方案。',
    // 文章 markdown 链接地址
    fileUrl: './md/skywalking.md',
    // 标签分类
    tag: '监控',
    // 文章时间
    creatTime: '2020-06-30',
    // 作者
    auth: '小羊'
}
```