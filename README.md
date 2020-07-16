# github pages 个人博客模板

[体验地址(点我访问)](https://yg-y.github.io)
> PC版预览效果
- 首页
![image.png](http://ww1.sinaimg.cn/large/a760927bgy1ggsjmqxkyhj22yq1gix6p.jpg)
- 文章页
![image.png](http://ww1.sinaimg.cn/large/a760927bgy1ggsjrfx2o4j22tg1f8ndx.jpg)
- 文章页详情
![image.png](http://ww1.sinaimg.cn/large/a760927bgy1ggsjsj10x9j22ta1gyh0e.jpg)

> 手机版预览效果/H5
- 首页
![image.png](http://ww1.sinaimg.cn/large/a760927bgy1ggsk1jmvwyj20uw1hk1kx.jpg)
- 文章页
![91594862764_.pic_hd.jpg](http://ww1.sinaimg.cn/large/a760927bgy1ggsk3t49maj22sq4sw7wi.jpg)
- 文章页详情
![81594862763_.pic_hd.jpg](http://ww1.sinaimg.cn/large/a760927bgy1ggsk43namvj22sq4swx6q.jpg)

#### 2020-07-07 更新:
```
1. 优化编程页面文章列表展示方式
2. 新增作者栏信息展示
3. 优化PC/MOBIL PHONE自适应展示，列宽不够自动隐藏作者栏
4. 优化整体配色
```

#### 2020-07-02 更新:
```
1. 更换md显示插件，支持md、html格式，优化代码块背景色
2. 新增文章页返回上一页，返回主页固钉
```

#### 2020-07-01 更新:
```
1. 初步提交编程页面样式及布局
2. 初步提交文章布局
```

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