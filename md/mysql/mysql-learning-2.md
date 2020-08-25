# 前言
在互联网发展迅猛的今天，MySQL作为一款关系型数据库无疑是使用范围最广的数据库操作系统之一，而作为一名开发人员，或多或少都需要了解一些数据库知识。

后续会以 MySQL5.7 版本进行演示，截止目前，MySQL已经更新到 8.0 版本。

本文会作为一个系列更新下去，包括但不仅限于以下几个方面：
- [MySQL 基本架构及日志文件](https://yg-y.github.io/content.html?id=15)
- [MySQL 数据库日志文件之 Bin Log 及如何做到删库不跑路](https://yg-y.github.io/content.html?id=16)
- [MySQL 语言：DDL/DML/DQL/DCL]()
- [MySQL 事务]()
- [MySQL 两大常用储存引擎：MyISAM/InnoDB]()
- [MySQL 集群方案及搭建]()
- [MySQL 分库分表实战]()

# Binary Log（bin log）
二进制日志（Binary Log），是 MySQL 中非常重要的日志。主要用于记录数据库的变化情况，即 SQL 语句的 DDL 和 DML 语句，不包含数据记录查询操作。

如果你一不小心手抖删除了某些数据或者再严重点，整个库都被你删了，那么不用担心，有了 bin log 让你无需删库跑路。前提，数据库得开启 bin log

默认情况下，bin log 功能是关闭的。可以通过以下命令查看二进制日志是否开启，命令如下：
```
show variables like '%log_bin%';

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

```

## 如何开启Bin Log
找到 MySQL 的配置文件 my.cnf ,在 [mysqld] 下添加一下参数：
```
[mysqld]
server_id=1
# 有三种模式 STATEMENT/ROW/MIXED
binlog_format=ROW
# 日志文件前缀
log-bin=mysqlbinlog

```

添加成功后启动 MySQL ，再次输入命令查看 bin log 功能是否开启:

```
show variables like '%log_bin%';

+---------------------------------+----------------------------------+
| Variable_name                   | Value                            |
+---------------------------------+----------------------------------+
| log_bin                         | ON                               |  //已开启
| log_bin_basename                | /var/lib/mysql/mysqlbinlog       |
| log_bin_index                   | /var/lib/mysql/mysqlbinlog.index |
| log_bin_trust_function_creators | OFF                              |
| log_bin_use_v1_row_events       | OFF                              |
| sql_log_bin                     | ON                               |
+---------------------------------+----------------------------------+
6 rows in set (0.00 sec)
```

开启成功后我们可以创建一个数据库，然后添加一些记录查看 bin log 文件内容变化
```
// 创建数据库
create database young;

// 进入数据库
use young;

// 创建表，这里以用户表举例
create table `user` (
  `id` int primary key,
  `name` varchar(255)
) engine=InnoDB charset=utf8mb4;

// 新增数据
insert into user values(1,'zhangsan');
insert into user values(2,'lisi');

// 更新数据
update user set name='gebilaowang' where id = 2;

// 查看数据
select * from  user;

+----+-------------+
| id | name        |
+----+-------------+
|  1 | zhangsan    |
|  2 | gebilaowang |
+----+-------------+
2 rows in set (0.00 sec)

// 删除数据库
drop database young;

```

到这步把数据已经创建、操作和删除好了，接下来查看下 bin log 文件发生了什么变化
```
// 查看 binlog 文件 也可以通过 show binray logs; 查看
show master status;

+--------------------+----------+--------------+------------------+-------------------+
| File               | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+--------------------+----------+--------------+------------------+-------------------+
| mysqlbinlog.000001 |      154 |              |                  |                   |
+--------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)

// 查看 bin log 日志文件
show binlog events in 'mysqlbinlog.000001';

+--------------------+------+----------------+-----------+-------------+-------------------------------------------------+
| Log_name           | Pos  | Event_type     | Server_id | End_log_pos | Info                                            |
+--------------------+------+----------------+-----------+-------------+-------------------------------------------------+
| mysqlbinlog.000001 |    4 | Format_desc    |       121 |         123 | Server ver: 5.7.30-log, Binlog ver: 4           |
| mysqlbinlog.000001 |  123 | Previous_gtids |       121 |         154 |                                                 |
| mysqlbinlog.000001 |  314 | Anonymous_Gtid |       121 |         379 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'            |
| mysqlbinlog.000001 |  379 | Query          |       121 |         476 | create database young                           |
| mysqlbinlog.000001 |  476 | Anonymous_Gtid |       121 |         541 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'            |
| mysqlbinlog.000001 |  541 | Query          |       121 |         716 | use `young`; create table `user` (
  `id` int primary key,
  `name` varchar(255)
) engine=InnoDB charset=utf8mb4 |
| mysqlbinlog.000001 |  716 | Anonymous_Gtid |       121 |         781 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'            |
| mysqlbinlog.000001 |  781 | Query          |       121 |         854 | BEGIN                                           |
| mysqlbinlog.000001 |  854 | Table_map      |       121 |         905 | table_id: 113 (young.user)                      |
| mysqlbinlog.000001 |  905 | Write_rows     |       121 |         955 | table_id: 113 flags: STMT_END_F                 |
| mysqlbinlog.000001 |  955 | Xid            |       121 |         986 | COMMIT /* xid=340 */                            |
| mysqlbinlog.000001 |  986 | Anonymous_Gtid |       121 |        1051 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'            |
| mysqlbinlog.000001 | 1051 | Query          |       121 |        1124 | BEGIN                                           |
| mysqlbinlog.000001 | 1124 | Table_map      |       121 |        1175 | table_id: 113 (young.user)                      |
| mysqlbinlog.000001 | 1175 | Write_rows     |       121 |        1221 | table_id: 113 flags: STMT_END_F                 |
| mysqlbinlog.000001 | 1221 | Xid            |       121 |        1252 | COMMIT /* xid=341 */                            |
| mysqlbinlog.000001 | 1252 | Anonymous_Gtid |       121 |        1317 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'            |
| mysqlbinlog.000001 | 1317 | Query          |       121 |        1390 | BEGIN                                           |
| mysqlbinlog.000001 | 1390 | Table_map      |       121 |        1441 | table_id: 113 (young.user)                      |
| mysqlbinlog.000001 | 1441 | Update_rows    |       121 |        1506 | table_id: 113 flags: STMT_END_F                 |
| mysqlbinlog.000001 | 1506 | Xid            |       121 |        1537 | COMMIT /* xid=342 */                            |
| mysqlbinlog.000001 | 1537 | Anonymous_Gtid |       121 |        1602 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'            |
| mysqlbinlog.000001 | 1602 | Query          |       121 |        1697 | drop database young                             |
+--------------------+------+----------------+-----------+-------------+-------------------------------------------------+
25 rows in set (0.00 sec)
```

可以看到 pos 值为 379 对应的数据为 CREATE DATABASE `young` CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' 记录了创建数据库的操作

pos 值 为 1602 除记录了删除数据库的操作 drop database young ，而这里就是你万恶的源泉，你需要把数据恢复到删除数据库之前的操作，在恢复之前我们试下能不能查询到数据。

```
select * from user;
// 提示没有数据库
ERROR 1046 (3D000): No database selected

// 我们使用 show 语句查看下所有数据库，发现一开始创建的 young 数据库确实不存在了。
show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| user               |
+--------------------+
8 rows in set (0.00 sec)
```

接下来我们开始着手数据恢复操作，首先需要退出 mysql 命令窗口，来到 bin log -> mysqlbinlog.000001 日志文件存放的位置。

```
// 可以通过 linux 命令快速定位到文件位置
find / -name mysqlbinlog.000001
/var/lib/mysql/mysqlbinlog.000001
find: '/proc/1/map_files': Permission denied

// 切换路径
cd /var/lib/mysql/

// 执行以下命令 输入密码就可以完成恢复操作 下面有对此命令的解读
mysqlbinlog --start-position=379 --stop-position=1537 mysqlbinlog.000001 | mysql -uroot -p;

// 连接数据库，查看恢复情况
mysql -uroot -p

// 查看所有数据库
show databases;

+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| user               |
| young              |  // 可以看到 young 数据库已经恢复回来了
+--------------------+
9 rows in set (0.00 sec)

// 查看数据恢复情况
use young;
select * from user;

+----+-------------+
| id | name        |
+----+-------------+
|  1 | zhangsan    |
|  2 | gebilaowang |
+----+-------------+
2 rows in set (0.00 sec)

// 到此数据恢复完成
```

命令解读：
```
mysqlbinlog --start-position=数据恢复的起始点 --stop-position=数据恢复的结束点 mysqlbinlog.000001(数据库binlog日志的文件名) | mysql -uroot -p;(数据库连接)
```

参数解读：
- --start-position=379
    - 从哪里开始恢复，上面看到 379 位置是创建数据库，是所有操作的开始，所以我们要从 379 开始恢复
- --stop-position=1537
    - pos 值 为 1602 除记录了删除表的操作 drop database young，我们需要恢复到删除库之前的操作，那么从日志中 pos 的位置看是 1537，所以恢复到 1537 这个位置结束

另外还可以通过时间点进行恢复，从下文查看 binlog 转日志文件可以看到，所有操作都在今天，删库时间在下午5点左右，那么根据日志文件具体时间点可以查出，参数如下
-  --start-datetime="2020-08-24 17:35:29"  起始时间点
-  --stop-datetime="2020-08-24 17:37:00"   结束时间点

```
mysqlbinlog --start-datetime="2020-08-24 17:35:29" --stop-datetime="2020-08-24 17:37:00" mysqlbinlog.000001 | mysql -uroot -p;

```

若想通过时间点恢复，通过如下命令查看 binlog 文件，命令如下：

```
// 输出我们看的懂的日志文件 
mysqlbinlog mysqlbinlog.000001

// 截取部分输出内容
#200824 17:35:29 server id 121  end_log_pos 716 CRC32 0xe8933d54 	Query	thread_id=20	exec_time=0	error_code=0
use `young`/*!*/;
SET TIMESTAMP=1598261729/*!*/;
create table `user` (
  `id` int primary key,
  `name` varchar(255)
) engine=InnoDB charset=utf8mb4
/*!*/;
# at 716
#200824 17:35:34 server id 121  end_log_pos 781 CRC32 0xa5ee04cf 	Anonymous_GTID	last_committed=3	sequence_number=4	rbr_only=yes
/*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
# at 781
#200824 17:35:34 server id 121  end_log_pos 854 CRC32 0x62e8cfd7 	Query	thread_id=20	exec_time=0	error_code=0
SET TIMESTAMP=1598261734/*!*/;
BEGIN
/*!*/;
# at 854
#200824 17:35:34 server id 121  end_log_pos 905 CRC32 0x5eb41275 	Table_map: `young`.`user` mapped to number 113
# at 905
#200824 17:35:34 server id 121  end_log_pos 955 CRC32 0x504eb48c 	Write_rows: table id 113 flags: STMT_END_F
### INSERT INTO `young`.`user`
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='zhangsan' /* VARSTRING(1020) meta=1020 nullable=1 is_null=0 */
# at 1175
#200824 17:35:35 server id 121  end_log_pos 1221 CRC32 0xf544a4f9 	Write_rows: table id 113 flags: STMT_END_F
### INSERT INTO `young`.`user`
### SET
###   @1=2 /* INT meta=0 nullable=0 is_null=0 */
###   @2='lisi' /* VARSTRING(1020) meta=1020 nullable=1 is_null=0 */
# at 1221
#200824 17:35:35 server id 121  end_log_pos 1252 CRC32 0x6da9edcf 	Xid = 341
COMMIT/*!*/;
# at 1537
#200824 17:37:17 server id 121  end_log_pos 1602 CRC32 0x66df6fbd 	Anonymous_GTID	last_committed=6	sequence_number=7	rbr_only=no
SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
# at 1602
#200824 17:37:17 server id 121  end_log_pos 1697 CRC32 0x4c45a414 	Query	thread_id=20	exec_time=0	error_code=0
SET TIMESTAMP=1598261837/*!*/;
drop database young

```

通过观察转化的 log 文件看出，时间点在 200824 17:35:29 位置为创建数据库操作，时间点在 200824 17:37:17 进行了删除数据库操作。
