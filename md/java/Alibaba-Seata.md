# 【分布式系列】基于 Alibaba-Seata 的分布式事务实战

## 什么是事务

> 简单讲事务是数据库管理系统执行过程中的一个逻辑单元，它能保证要么一组数据库操作全部执行成功，要么全部失败，而做到这些的原理就是事务的ACID四大特性。

### ACID

- 原子性（Atomicity）
    - 原子性是指事务是一个不可分割的工作单位(如原子核与电子的整体关系)，事务中的操作要么全部成功，要么全部失败。比如在同一个事务中的SQL语句，要么全部执行成功，要么全部执行失败。
- 一致性（Consistency）
    - 事务必须使数据库从一个正确状态变换到另外一个正确状态。
    - 如转账，我有200，你有200，我向你转了100，转账成功的话你就是300，我是100；失败的话就回滚我还是200，你还是200，不能出现我100，你200的情况
- 隔离性（Isolation）
    - 事务的隔离性是多个用户并发访问数据库时，数据库为每一个用户开启的事务，不能被其他事务的操作数据所干扰，多个并发事务之间要相互隔离。
- 持久性（Durability）
    - 持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来即使数据库发生故障也不应该对其有任何影响。

### 隔离级别

|隔离级别|脏读|不可重复读|幻读|
|---|---|---|---|
|读未提交（READ UNCOMMITTED ）|y|y|y|
|读已提交（READ COMMITTED）|n|y|y|
|可重复读（REPEATABLE READ）|n|n|y|
|可串行化（SERIALIZABLE）|n|n|n|

### 名词解释

- 脏读：在事物还没有提交前，修改的数据可以被其他事物所看到
    - 查询到其他事物修改但未提交到数据
- 不可重复读：在一个事物中使用相同的条件查询一条数据，前后两次查询所得到的数据不同，这是因为同时其他事物对这条数据进行了修改（已提交事物），第二次查询返回了其他事物修改的数据。
    - 是同一条记录（一条数据）的内容被其他事物修改了，关注的是update、delete操作一条数据的操作.
- 幻读：在一个事物A中使用相同的条件查询了多条数据，同时其他事物添加或删除了符合事物A中查询条件的数据，这时候当事物A再次查询时候会发现数据多了或者少了，与前一次查询的结果不相同。
    - 是查询某个范围（多条数据）的数据行变多或变少了，在于insert、delete的操作。

---  

- 读未提交：在一个事物没有提交的情况下，其他事物可以看到该事物中对数据的修改。
- 读已提交：在一个事物提交前，其他事物看不到该事物对数据的修改，有时也叫不可重复读，因为两次相同条件的查询，可能会得到不同的结果。
- 可重复读：在同一个事物中按照相同的条件多次查询的结果都是相同。Innodb存储引擎通过多版本并发控制解决了幻读的问题。
- 可串行化：将事物放到一个队列中按照顺序一个一个的执行，可以闭上三个异常问题，但是牺牲了并发的高性能。

## 单机事务

- 在传统单体应用架构中，我们的业务数据通常都是存储在一个数据库中的，应用中的各个模块对数据库直接进行操作。在这种场景中，事务是由数据库提供的基于ACID特性来保证的。

## 微服务的分布式下事务问题

- 微服务状态下，一个单体应用被拆分成多个服务，如商城系统被拆分成商品、订单、库存等多个服务，每个服务对应的数据库不同，每个服务的事务只能保证本地事务的ACID。如果订单服务下单成功了，库存服务扣量失败，而每个服务只会管理自己的事务，库存回滚不会导致订单回滚，从而导致数据不一致等问题。

## 分布式事务有哪些

### 2PC 二阶段提交

- 2PC:（Two-phase commit protocol），中文叫二阶段提交。
    - 在计算机网络以及数据库领域内，二阶段提交（英语：Two-phase Commit）是指，为了使基于分布式系统架构下的所有节点在进行事务提交时保持一致性而设计的一种算法(Algorithm)。通常，二阶段提交也被称为是一种协议(
      Protocol)。在分布式系统中，每个节点虽然可以知晓自己的操作时成功或者失败，却无法知道其他节点的操作的成功或失败。当一个事务跨越多个节点时，为了保持事务的ACID特性，需要引入一个作为协调者的组件来统一掌控所有节点(
      称作参与者)的操作结果并最终指示这些节点是否要把操作结果进行真正的提交(比如将更新后的数据写入磁盘等等)。因此，二阶段提交的算法思路可以概括为：
      参与者将操作成败通知协调者，再由协调者根据所有参与者的反馈情报决定各参与者是否要提交操作还是中止操作。
    - 说人话就是在两个或两个以上的服务中间出现一个协调者，服务称做参与者，协调者询问参与者是否可以进行事务提交，双方都回答是就可以提交，如果有一方回答否则全部回退

- ![WeChat03749bbe2c0abaaefd869b2a2653f98e.png](http://ww1.sinaimg.cn/large/00342Bl1gy1gte6dtaj3rj60rs0juh1102.jpg)

#### 两个阶段

- 一阶段： 投票
    - 全部成功或者有一个或多个失败
- 二阶段：提交或回滚
    - 全部成功则提交事物，失败则回滚

#### 二阶段的问题

- 性能问题

```text
无论是在第一阶段的过程中,还是在第二阶段,所有的参与者资源和协调者资源都是被锁住的,只有当所有节点准备完毕,
事务协调者 才会通知进行全局提交, 参与者 进行本地事务提交后才会释放资源。
这样的过程会比较漫长，对性能影响比较大。
```

- 单点问题

```text
由于协调者的重要性，一旦 协调者 发生故障。参与者 会一直阻塞下去。
尤其在第二阶段，协调者 发生故障，那么所有的 参与者 还都处于锁定事务资源的状态中，而无法继续完成事务操作。
（虽然协调者挂掉，可以重新选举一个协调者，但是无法解决因为协调者宕机导致的参与者处于阻塞状态的问题）
```

### 3PC 三阶段提交协议

- 3PC: 中文叫三阶段提交。2PC的出现是为了解决 2PC 的一些问题，相比于 2PC 它在参与者中也引入了超时机制，并且新增了一个阶段使得参与者可以利用这一个阶段统一各自的状态。
    - 3PC 包含了三个阶段，分别是准备阶段、预提交阶段和提交阶段，对应的英文就是：CanCommit、PreCommit 和 DoCommit

![3pc.jpg](http://ww1.sinaimg.cn/large/a760927bgy1gtd6bprkm8j207m0o1mya.jpg)

### TCC

- TCC: TCC 指的是Try - Confirm - Cancel。又称补偿事务。其核心思想是："针对每个操作都要注册一个与其对应的确认和补偿（撤销操作）"。
    - Try 指的是预留，即资源的预留和锁定，注意是预留。
    - Confirm 指的是确认操作，这一步其实就是真正的执行了。
    - Cancel 指的是撤销操作，可以理解为把预留阶段的动作撤销了。

## 分布式事务实操 阿里巴巴开源分布式事务解决方案 —— Seata

- document：http://seata.io/zh-cn/docs/overview/what-is-seata.html
- install guide：http://seata.io/zh-cn/docs/ops/deploy-server.html

### 介绍

> Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，为用户打造一站式的分布式解决方案。

### 安装

- 按照 install guide 步骤安装即可，也可直接 git clone 下来，本地进行编译启动，启动服务为 `seata-serve`。
- github地址：https://github.com/seata/seata.git

# Alibaba Seata 分布式事务示例

> spring cloud + nacos + feign + seata demo
>

# 版本依赖关系

https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E

# jar  version

```
spring-cloud-alibaba-dependencies
2.2.6.RELEASE

spring-cloud-dependencies
Hoxton.SR9

nacos
1.3.0

seata
1.3.0
```

# 第一步

## 下载 seata-server

> 下载 jar 包对应服务端版本
>
> 下载链接：https://github.com/seata/seata/releases

### docker compose 方式

> http://seata.io/zh-cn/docs/ops/deploy-by-docker.html

```yaml
version: "3"
services:
  seata-server:
    image: seataio/seata-server
    hostname: seata-server
    ports:
      - "8091:8091"
    environment:
      - SEATA_PORT=8091
      - STORE_MODE=file
```

# 第二步

## 配置 seata-server config

- registry.conf

```text
registry {
  # 选择自己的注册方式，这里选的是 nacos 注册中心
  # file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
  type = "nacos"

  nacos {
    application = "seata-server"
    serverAddr = "nacos.blogyg.cn:9999"
    group = "DEFAULT_GROUP"
    namespace = ""
    cluster = "DEFAULT"
    username = "nacos"
    password = "nacos"
  }
  file {
      name = "file.conf"
  }
}

config {
  # 选择自己的配置方式，这里选的是 nacos 配置中心
  # file、nacos 、apollo、zk、consul、etcd3
  type = "nacos"

  file {
    name = "file.conf"
  }

  nacos {
    serverAddr = "nacos.blogyg.cn:9999"
    group = "DEFAULT_GROUP"
    namespace = ""
    username = "nacos"
    password = "nacos"
    cluster = "DEFAULT"
  }
}

```

### 将配置文件配置到 nacos 配置中心

> 根据实际情况删除配置，以及更改配置文件中的配置值

- config.txt

```text
service.vgroupMapping.my_test_tx_group=default
service.enableDegrade=false
service.disableGlobalTransaction=false
store.mode=db
store.db.datasource=druid
store.db.dbType=mysql
store.db.driverClassName=com.mysql.jdbc.Driver
store.db.url=jdbc:mysql://www.blogyg.cn:3306/seata?useUnicode=true&rewriteBatchedStatements=true
store.db.user=root
store.db.password=123456
store.db.minConn=5
store.db.maxConn=30
store.db.globalTable=global_table
store.db.branchTable=branch_table
store.db.queryLimit=100
store.db.lockTable=lock_table
store.db.maxWait=5000
```

### 执行 shell 脚本，将配置信息同步至 nacos

> 更改脚本中信息为你的 nacos 信息

- seata-nacos.sh

```shell
#!/bin/sh
# Copyright 1999-2019 Seata.io Group.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at、
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

while getopts ":h:p:g:t:u:w:" opt
do
  case $opt in
  h)
    host=$OPTARG
    ;;
  p)
    port=$OPTARG
    ;;
  g)
    group=$OPTARG
    ;;
  t)
    tenant=$OPTARG
    ;;
  u)
    username=$OPTARG
    ;;
  w)
    password=$OPTARG
    ;;
  ?)
    echo " USAGE OPTION: $0 [-h host] [-p port] [-g group] [-t tenant] [-u username] [-w password] "
    exit 1
    ;;
  esac
done

if [ -z ${host} ]; then
    host=nacos.blogyg.cn
fi
if [ -z ${port} ]; then
    port=9999
fi
if [ -z ${group} ]; then
    group="DEFAULT_GROUP"
fi
if [ -z ${tenant} ]; then
    tenant=""
fi
if [ -z ${username} ]; then
    username="nacos"
fi
if [ -z ${password} ]; then
    password="nacos"
fi

nacosAddr=$host:$port
contentType="content-type:application/json;charset=UTF-8"

echo "set nacosAddr=$nacosAddr"
echo "set group=$group"

urlencode() {
  length="${#1}"
  i=0
  while [ $length -gt $i ]; do
    char="${1:$i:1}"
    case $char in
    [a-zA-Z0-9.~_-]) printf $char ;;
    *) printf '%%%02X' "'$char" ;;
    esac
    i=`expr $i + 1`
  done
}

failCount=0
tempLog=$(mktemp -u)
function addConfig() {
  dataId=`urlencode $1`
  content=`urlencode $2`
  curl -X POST -H "${contentType}" "http://$nacosAddr/nacos/v1/cs/configs?dataId=$dataId&group=$group&content=$content&tenant=$tenant&username=$username&password=$password" >"${tempLog}" 2>/dev/null
  if [ -z $(cat "${tempLog}") ]; then
    echo " Please check the cluster status. "
    exit 1
  fi
  if [ "$(cat "${tempLog}")" == "true" ]; then
    echo "Set $1=$2 successfully "
  else
    echo "Set $1=$2 failure "
    failCount=`expr $failCount + 1`
  fi
}

count=0
for line in $(cat $(dirname "$PWD")/config.txt | sed s/[[:space:]]//g); do
    count=`expr $count + 1`
	key=${line%%=*}
    value=${line#*=}
	addConfig "${key}" "${value}"
done

echo "========================================================================="
echo " Complete initialization parameters,  total-count:$count ,  failure-count:$failCount "
echo "========================================================================="

if [ ${failCount} -eq 0 ]; then
	echo " Init nacos config finished, please start seata-server. "
else
	echo " init nacos config fail. "
fi
```
# 第三步
> 在项目启动配置中添加 seata 配置
## 客户端配置 client config

```yaml
seata:
  enabled: true
  #  此处一定要和 服务端 配置一致
  tx-service-group: my_test_tx_group
  application-id: seata-commodity
  config:
    type: nacos
    nacos:
      namespace: ""
      server-addr: "nacos.blogyg.cn:9999"
      group: "DEFAULT_GROUP"
      username: "nacos"
      password: "nacos"
      cluster: DEFAULT
  registry:
    type: nacos
    nacos:
      application: "seata-server"
      server-addr: "nacos.blogyg.cn:9999"
      group: "DEFAULT_GROUP"
      namespace: ""
      username: "nacos"
      password: "nacos"
      cluster: DEFAULT
```

- 数据源代理

> 此处展示使用 mybatis plus 方式交给 seata 代理，其他 orm 框架同理，只需要将 dataSourceProxy 交给 DataSourceTransactionManager 管理即可

```java
package com.young.seata.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import io.seata.rm.datasource.DataSourceProxy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

/**
 * alibaba seata 配置类
 */
@Slf4j
@Configuration
public class SeataAutoConfig {

    @Value("${spring.application.name}")
    String applicationName;

    /**
     * autowired datasource config
     */
    @Autowired
    private DataSourceProperties dataSourceProperties;

    /**
     * init durid datasource
     *
     * @Return: druidDataSource  datasource instance
     */
    @Primary
    @Bean("druidDataSource")
    public DruidDataSource druidDataSource() {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setUrl(dataSourceProperties.getUrl());
        druidDataSource.setUsername(dataSourceProperties.getUsername());
        druidDataSource.setPassword(dataSourceProperties.getPassword());
        druidDataSource.setDriverClassName(dataSourceProperties.getDriverClassName());
        druidDataSource.setInitialSize(0);
        druidDataSource.setMaxActive(180);
        druidDataSource.setMaxWait(60000);
        druidDataSource.setMinIdle(0);
        druidDataSource.setValidationQuery("Select 1 from DUAL");
        druidDataSource.setTestOnBorrow(false);
        druidDataSource.setTestOnReturn(false);
        druidDataSource.setTestWhileIdle(true);
        druidDataSource.setTimeBetweenEvictionRunsMillis(60000);
        druidDataSource.setMinEvictableIdleTimeMillis(25200000);
        druidDataSource.setRemoveAbandoned(true);
        druidDataSource.setRemoveAbandonedTimeout(1800);
        druidDataSource.setLogAbandoned(true);
        return druidDataSource;
    }

    /**
     * init datasource proxy
     *
     * @Param: druidDataSource  datasource bean instance
     * @Return: DataSourceProxy  datasource proxy
     */
    @Bean
    public DataSourceProxy dataSourceProxy(DruidDataSource druidDataSource) {
        return new DataSourceProxy(druidDataSource);
    }

    @Bean
    public DataSourceTransactionManager transactionManager(DataSourceProxy dataSourceProxy) {
        return new DataSourceTransactionManager(dataSourceProxy);
    }

    /**
     * mybatis plus 需要加上此配置，否则无法使用 mybatis plus
     *
     * @param dataSource
     * @return
     */
    @Bean
    @ConfigurationProperties(prefix = "mybatis")
    public MybatisSqlSessionFactoryBean sqlSessionFactoryBean(@Qualifier("druidDataSource") DataSource dataSource) {
        // 这里用 MybatisSqlSessionFactoryBean 代替了 SqlSessionFactoryBean，否则 MyBatisPlus 不会生效
        MybatisSqlSessionFactoryBean mybatisSqlSessionFactoryBean = new MybatisSqlSessionFactoryBean();
        mybatisSqlSessionFactoryBean.setDataSource(dataSource);
        return mybatisSqlSessionFactoryBean;
    }
}

```