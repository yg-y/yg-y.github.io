
# 前言
在互联网发展迅猛的今天，MySQL作为一款关系型数据库无疑是使用范围最广的数据库操作系统之一，而作为一名开发人员，或多或少都需要了解一些数据库知识。

后续会以 MySQL5.7 版本进行演示，截止目前，MySQL已经更新到 8.0 版本。

本文会作为一个系列更新下去，包括但不仅限于以下几个方面：
- [MySQL 基本架构及日志文件](https://yg-y.github.io/content.html?id=15)
- [MySQL 数据库日志文件值 Undo Log 和 Redo Log]()
- [MySQL 语言：DDL/DML/DQL/DCL]()
- [MySQL 事务]()
- [MySQL 两大常用储存引擎：MyISAM/InnoDB]()
- [MySQL 集群方案及搭建]()
- [MySQL 分库分表实战]()


# MySQL 架构图
![MySQL架构图.jpg](http://ww1.sinaimg.cn/large/a760927bgy1ghxeql8601j213u0ys799.jpg)

如图所示，MySQL 大致可分为四层结构：
- 连接层
- 服务层
- 储存引擎层
- 储存层

第一层连接层主要负责建立连接，比如一些工具和语言我们统称为客户端，在客户端需要操作执行SQL首先需要连接到数据库才能进行操作。

第二层服务层，这层开始就属于 MySQL Server 内的结构了。
- 连接池：这里面引入了一些线程池的概念(线程重用)，但是里面还包含了一些身份认证安全的一些措施。连接池的作用可以让客户端可以不用频繁对数据库进行连接-断开-连接的操作，同时对性能的提升影响巨大，官方有对加入连接池和没加连接池的SQL性能做对比。
- 系统管理和控制工具：包括备份、还原、安全、集群等操作。
- SQL 接口：接收一些客户段发过来的 SQL 命令，同时也能对处理结果进行返回。
- 解析器：将接收过来的 SQL 进行解析，底层由 C 编写，解析成一颗解析树。大致可以看为将 SQL 进行词解析，解析完后对语法进行校验。
- 查询优化器：将解析好的 SQL交给查询优化器，生成执行计划，然后与储存引擎进行交互。需要注意的是， 这里MySQL 可以同时存在多个储存引擎，如 MyISAM 和 InnoDB 一起在一个库中表现，他会通过一个特定的接口和存储引擎进行交互，无需知道使用的什么存储引擎。

查询优化器策略
```
select id, name from table where gender = 1
选取 -> 投影 -> 联接 策略
1. select 先根据 where 语句进行选取，并不是查询出全部数据再过滤
2. select 查询根据 id，name 进行属性投影，并不是查询所有字段
3. 将两个查询条件联接起来最红生成查询结果
```
- 缓存：MySQL缓存有多种，主要用来提升效率，若查询能命中缓存，则无需去进行查表的操作。

第三层储存引擎层，主要负责 MySQL 数据存储于提取，可以与底层的文件系统进行交互，主要需要了解MyISAM与InnoDB，为什么是可插拔的呢，因为可以根据业务对储存引擎进行源码更改。

第四层储存层，主要存放数据文件及各类日志等。

# MySQL 日志文件

- redo log          (重做日志)
- undo log          (回滚日志)
- binary log        (二进制日志)
- error log         (错误日志)
- slow query log    (慢查询日志)
- general log (通用查询日志)
- relay log         (中继日志)


### redo log          (重做日志)
redo log 是 InnoDB 存储引擎层的日志，又称重做日志文件，用于记录事务操作的变化，记录的是数据修改之后的值，不管事务是否提交都会记录下来。在实例和介质失败（media failure）时，redo log 文件就能派上用场，如数据库掉电，InnoDB 存储引擎会使用 redo log 恢复到掉电前的时刻，以此来保证数据的完整性。

### undo log          (回滚日志)
undo用来回滚行记录到某个版本。undo log一般是逻辑日志，根据每行记录进行记录。

使用命令查看详情：
```
mysql> show variables like '%undo%';
+--------------------------+------------+
| Variable_name            | Value      |
+--------------------------+------------+
| innodb_max_undo_log_size | 1073741824 |
| innodb_undo_directory    | ./         |
| innodb_undo_log_truncate | OFF        |
| innodb_undo_logs         | 128        |
| innodb_undo_tablespaces  | 0          |
+--------------------------+------------+
5 rows in set (0.01 sec)

```
### binary log        (二进制日志)
记录 MySQL 数据库执行的更改操作，并记录语句发生时间，执行时长，但是不记录select，主要用于数据库恢复和主从复制，默认关闭

参数如下：

- log_bin: 用户指定日志文件的名称，实际的文件名称加附加000001这样的编号，文件默认存储在datadir中，除非指定绝对路径
- log_bin_index：指定索引文件的名称，默认与日志文件的名称相同，以.index为扩展名,记录已经产生的日志文件
- server-id：为当前服务器指定一个编号
- log_bin_basename：代表日志文件的完整路径，无需设置仅仅是查看。
- sql_log_bin：用于当前回话中关闭（0）或者打开（1）binary log

使用命令查看详情：
```
// 查看是否开启 bin log
mysql> show variables like '%log_bin%';
+---------------------------------+-------+
| Variable_name                   | Value |
+---------------------------------+-------+
| log_bin                         | OFF   |
| log_bin_basename                |       |
| log_bin_index                   |       |
| log_bin_trust_function_creators | OFF   |
| log_bin_use_v1_row_events       | OFF   |
| sql_log_bin                     | ON    |
+---------------------------------+-------+
6 rows in set (0.00 sec)

// bin log 相关参数
mysql> show variables like '%binlog%';
+--------------------------------------------+----------------------+
| Variable_name                              | Value                |
+--------------------------------------------+----------------------+
| binlog_cache_size                          | 32768                |
| binlog_checksum                            | CRC32                |
| binlog_direct_non_transactional_updates    | OFF                  |
| binlog_error_action                        | ABORT_SERVER         |
| binlog_format                              | ROW                  |
| binlog_group_commit_sync_delay             | 0                    |
| binlog_group_commit_sync_no_delay_count    | 0                    |
| binlog_gtid_simple_recovery                | ON                   |
| binlog_max_flush_queue_time                | 0                    |
| binlog_order_commits                       | ON                   |
| binlog_row_image                           | FULL                 |
| binlog_rows_query_log_events               | OFF                  |
| binlog_stmt_cache_size                     | 32768                |
| binlog_transaction_dependency_history_size | 25000                |
| binlog_transaction_dependency_tracking     | COMMIT_ORDER         |
| innodb_api_enable_binlog                   | OFF                  |
| innodb_locks_unsafe_for_binlog             | OFF                  |
| log_statements_unsafe_for_binlog           | ON                   |
| max_binlog_cache_size                      | 18446744073709547520 |
| max_binlog_size                            | 1073741824           |
| max_binlog_stmt_cache_size                 | 18446744073709547520 |
| sync_binlog                                | 1                    |
+--------------------------------------------+----------------------+
22 rows in set (0.00 sec)

// 查看 bin log 日志信息
show binary logs;

```
### error log         (错误日志)
用于记录数据库服务器的启动，关闭过程以及在启动，运行过程中发生的错误，默认开启

参数如下:
- log_error: 用于指定错误日志文件
- log_error_verbosity: 用于指定在日志文件中记录什么样的信息
```
可选参数：
1 : errors only(错误信息)
2 : errors and warnings(错误信息和告警信息)
3 : errors,warnings,and notes(错误信息、告警信息和通知信息，默认值)
```
- log_timestamps: 日志中时间的格式，可选值为UTC或者SYSTEM

使用命令查看详情：
```
mysql> show variables like '%log_error%';
+---------------------+--------------+
| Variable_name       | Value        |
+---------------------+--------------+
| binlog_error_action | ABORT_SERVER |
| log_error           | stderr       |
| log_error_verbosity | 3            |
+---------------------+--------------+
3 rows in set (0.03 sec)
```

### slow query log    (慢查询日志)
记录所有超时的sql，默认 10 s , 默认关闭

参数如下：
- slow_query_log：
```
1 : 开启
0 : 关闭
```
- slow_query_log_file：用于指定日志文件名称，默认为hostname-slow.log

使用命令查看详情：
```
// 查看是否开启漫步查询
mysql> show variables like '%slow_query%';
+---------------------+--------------------------------------+
| Variable_name       | Value                                |
+---------------------+--------------------------------------+
| slow_query_log      | OFF                                  |
| slow_query_log_file | /var/lib/mysql/24798592a5c5-slow.log |
+---------------------+--------------------------------------+
2 rows in set (0.00 sec)

// 查看慢查询超时时间
mysql> show variables like '%long_query_time%';
+-----------------+-----------+
| Variable_name   | Value     |
+-----------------+-----------+
| long_query_time | 10.000000 |
+-----------------+-----------+
1 row in set (0.00 sec)

// 自定义超时时间
set long_query_time=5;
```
### general log       (通用查询日志)
开启 general log 将所有到达MySQL Server的SQL语句记录下来。

一般不会开启开功能，因为log的量会非常庞大。但个别情况下可能会临时的开一会儿general log以供排障使用。

使用命令查看详情：
```
// 查看是否开启
mysql> show variables like '%general%';
+------------------+---------------------------------+
| Variable_name    | Value                           |
+------------------+---------------------------------+
| general_log      | OFF                             |
| general_log_file | /var/lib/mysql/24798592a5c5.log |
+------------------+---------------------------------+
2 rows in set (0.00 sec)

// 开启命令
set global general_log=on;

```
### relay log         (中继日志)
relay log 很多方面都跟 binary log 差不多，区别是：从服务器 I/O 线程将主服务器的二进制日志读取过来记录到从服务器本地文件，然后 SQL 线程会读取 relay-log 日志的内容并应用到从服务器。

参数如下：

使用命令查看详情：
```
mysql> show variables like '%relay%';
+---------------------------+---------------------------------------------+
| Variable_name             | Value                                       |
+---------------------------+---------------------------------------------+
| max_relay_log_size        | 0                                           |
| relay_log                 |                                             |
| relay_log_basename        | /var/lib/mysql/24798592a5c5-relay-bin       |
| relay_log_index           | /var/lib/mysql/24798592a5c5-relay-bin.index |
| relay_log_info_file       | relay-log.info                              |
| relay_log_info_repository | FILE                                        |
| relay_log_purge           | ON                                          |
| relay_log_recovery        | OFF                                         |
| relay_log_space_limit     | 0                                           |
| sync_relay_log            | 10000                                       |
| sync_relay_log_info       | 10000                                       |
+---------------------------+---------------------------------------------+
11 rows in set (0.00 sec)
```