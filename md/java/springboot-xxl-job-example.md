# XXL-JOB 定时任务调度示例

> XXL-JOB是一个分布式任务调度平台，其核心设计目标是开发迅速、学习简单、轻量级、易扩展。现已开放源代码并接入多家公司线上产品线，开箱即用。

[官方文档](https://www.xuxueli.com/xxl-job/#1.1%20%E6%A6%82%E8%BF%B0)

### 模块

- xxljob-common
```text
公共模块，引入即可
```

- xxljob-api
```text
程序入口，定时任务执行器
```

### xxl-job-admin 部署方式

#### 原生方式
- 创建 xxl-job 对应需要的数据库文件
    - sql脚本位置：/doc/db/tables_xxl_job.sql
- git clone 下 xxl-job 最新代码，然后下载完依赖修改对应 admin 配置文件
    - git地址：https://github.com/xuxueli/xxl-job.git
    - 命令：git clone https://github.com/xuxueli/xxl-job.git
- 去到 xxl-job 项目下，更改 xxl-job-admin 的配置文件，将数据库链接地址及在账号密码改成自己的
- 启动访问 8080 端口即可（如果改了端口，访问你自己修改后的端口）

#### docker 方式

```shell
docker run -p 8080:8080 -v /tmp:/data/applogs --name xxl-job-admin  -d xuxueli/xxl-job-admin:{指定版本}
/**
* 如需自定义 mysql 等配置，可通过 "-e PARAMS" 指定，参数格式 PARAMS="--key=value  --key2=value2" ；
* 配置项参考文件：/xxl-job/xxl-job-admin/src/main/resources/application.properties
* 如需自定义 JVM内存参数 等配置，可通过 "-e JAVA_OPTS" 指定，参数格式 JAVA_OPTS="-Xmx512m" ；
*/
docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai" -p 8080:8080 -v /tmp:/data/applogs --name xxl-job-admin  -d xuxueli/xxl-job-admin:{指定版本}
```

### 部署完成后访问
http://127.0.0.1:xxxx:/xxl-job-admin

默认账号：admin
默认密码：123456

通过md5加密存在xxl_job数据库的user表中。

### 源码地址
[https://github.com/yg-y/xxljob-example](https://github.com/yg-y/xxljob-example)

![Snipaste_2021-04-19_11-58-00.jpg](http://ww1.sinaimg.cn/mw690/a760927bgy1gpox23p6e7j21hc0rzn02.jpg)
![Snipaste_2021-04-19_11-57-52.jpg](http://ww1.sinaimg.cn/mw690/a760927bgy1gpox23qhq3j21h50s4n2k.jpg)
![Snipaste_2021-04-19_11-57-34.jpg](http://ww1.sinaimg.cn/mw690/a760927bgy1gpox23nmyaj21hb0s2n09.jpg)
![Snipaste_2021-04-19_11-57-21.jpg](http://ww1.sinaimg.cn/mw690/a760927bgy1gpox23nv09j21h10s1n18.jpg)