# mysql 主从同步配置

- master 主数据库
```text
    Dockerfile  mysql镜像
    my.cnf      mysql配置文件
```

- slave 从数据库
```text
    Dockerfile  mysql镜像
    my.cnf      mysql配置文件
```

- docker-compose-mysql.yml docker-compose配置文件
```text
//启动master及slave两个mysql实例
docker-compose -f docker-compose-mysql.yml up -d

//进入mysql master 容器
docker exec -it xxxxxxxx /bin/bash

//进入mysql控制台
mysql -u root -p

//显示master主数据库信息
show master status

//记录 File Position两列，例如：
File                        |   Position
replicas-mysql-bin.000003   |   753

```
```text
//切换到mysql slave容器,进入mysql控制台，步骤如上↑
//停止slave
stop slave

//连接主库 master
CHANGE MASTER TO 
 MASTER_HOST='主库ip地址', 
 MASTER_USER='root', 
 MASTER_PASSWORD='主库密码', 
 MASTER_LOG_FILE='主库File，如：replicas-mysql-bin.000003', 
 MASTER_LOG_POS=主库Position，如：753;
 
//启动slave
start slave

//查看从库状态，若File,Position与主库对应上，则主从同步配置完成
show slave status

//主库执行创建表，会同步到从库
```


## master (主库配置)

#### Dockerfile 文件
```
FROM mysql:5.7.17
MAINTAINER young
ADD ./master/my.cnf /etc/mysql/my.cnf
```
#### my.cnf 文件
```
[mysqld]
## 设置server_id，一般设置为IP，注意要唯一
server_id=100
## 复制过滤：也就是指定哪个数据库不用同步（mysql库一般不同步）
binlog-ignore-db=mysql
## 开启二进制日志功能，可以随便取，最好有含义（关键就是这里了）
log-bin=replicas-mysql-bin
## 为每个session分配的内存，在事务过程中用来存储二进制日志的缓存
binlog_cache_size=1M
## 主从复制的格式（mixed,statement,row，默认格式是statement）
binlog_format=mixed
## 二进制日志自动删除/过期的天数。默认值为0，表示不自动删除。
expire_logs_days=7
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062
```

## slave (从库配置)

#### Dockerfile 文件
```
FROM mysql:5.7.17
MAINTAINER young
ADD ./slave/my.cnf /etc/mysql/my.cnf
```

#### my.cnf 文件
```
[mysqld]
## 设置server_id，一般设置为IP，注意要唯一
server_id=101
## 复制过滤：也就是指定哪个数据库不用同步（mysql库一般不同步）
binlog-ignore-db=mysql
## 开启二进制日志功能，以备Slave作为其它Slave的Master时使用
log-bin=replicas-mysql-slave1-bin
## 为每个session 分配的内存，在事务过程中用来存储二进制日志的缓存
binlog_cache_size=1M
## 主从复制的格式（mixed,statement,row，默认格式是statement）
binlog_format=mixed
## 二进制日志自动删除/过期的天数。默认值为0，表示不自动删除。
expire_logs_days=7
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。
## 如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062
## relay_log配置中继日志
relay_log=replicas-mysql-relay-bin
## log_slave_updates表示slave将复制事件写进自己的二进制日志
log_slave_updates=1
## 防止改变数据(除了特殊的线程)
read_only=1

```

#### docker-compose.yml 文件
```
version: '2'
services:
  mysql-master:
    build:
      context: ./
      dockerfile: master/Dockerfile
    environment:
      - "MYSQL_ROOT_PASSWORD=123456"
      - "MYSQL_DATABASE=replicas_db"
    links:
      - mysql-slave
    ports:
      - "3306:3306"
    restart: always
    hostname: mysql-master
  mysql-slave:
    build:
      context: ./
      dockerfile: slave/Dockerfile
    environment:
      - "MYSQL_ROOT_PASSWORD=123456"
      - "MYSQL_DATABASE=replicas_db"
    ports:
      - "3307:3306"
    restart: always
    hostname: mysql-slave

```