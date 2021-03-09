# 【Docker 系列】Docker-Compose 基础及入门搭建

> Docker-Compose 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。 Docker-Compose 将所管理的容器分为三层，分别是工程（project），服务（service）以及容器（container）。Docker-Compose 运行目录下的所有文件（docker-compose.yml，extends 文件或环境变量文件等）组成一个工程，若无特殊指定工程名即为当前目录名。一个工程当中可包含多个服务，每个服务中定义了容器运行的镜像，参数，依赖。一个服务当中可包括多个容器实例，Docker-Compose 并没有解决负载均衡的问题，因此需要借助其它工具实现服务发现及负载均衡。 Docker-Compose 的工程配置文件默认为 docker-compose.yml，可通过环境变量 COMPOSE_FILE 或 -f 参数自定义配置文件，其定义了多个有依赖关系的服务及每个服务运行的容器。 使用一个 Dockerfile 模板文件，可以让用户很方便的定义一个单独的应用容器。在工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。 Compose 允许用户通过一个单独的 docker-compose.yml 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。 Docker-Compose 项目由 Python 编写，调用 Docker 服务提供的API来对容器进行管理。因此，只要所操作的平台支持 Docker API，就可以在其上利用 Compose 来进行编排管理。

## Docker-Compose CentOS 安装教程

- 通过 pip 的方式安装
- 首先先安装并更新 pip

```shell
yum -y install epel-release
yum -y install python-pip
pip install --upgrade pip
```

- 通过 pip 安装 docker-compose

```shell
pip install docker-compose 
```

- 安装完成后可查看 docker-compose 版本

```shell
docker-compose version
```

```shell
young@young ~ % docker-compose version

docker-compose version 1.27.4, build 40524192
docker-py version: 4.3.1
CPython version: 3.7.7
OpenSSL version: OpenSSL 1.1.1g  21 Apr 2020
```

- 若想直接一行命令安装 docker 和 docker-compose ，则直接复制以下命令

```shell
yum install -y yum-utils device-mapper-persistent-data lvm2 \
&& yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo \
&& yum install  -y docker-ce docker-ce-cli containerd.io \
&& systemctl start docker \
&& yum -y install epel-release \
&& yum -y install python-pip \
&& pip install --upgrade pip \
&& pip install docker-compose
```

## docker-compose 启动示例

- 用 docker-compose 安装 mysql 数据库为例，首先需要创建 docker-compose.yml 文件，格式如下：

```yaml
version: '2'
services:
  mysql:
    # 需要启动的镜像版本
    image: mysql:5.7
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --init-connect='SET NAMES utf8mb4;' --innodb-flush-log-at-trx-commit=0
    restart: always
    ports:
      - 3306:3306
    # 将容器中目录挂载到宿主机
    volumes:
      - /data/docker/mysql/lib:/var/lib/mysql
    environment:
      # 指定时区
      - TZ=Asia/Shanghai
      # 指定 mysql 密码
      - MYSQL_ROOT_PASSWORD=123456
```

- 启动命令

```yaml
# 去到 yml 的目录下执行以下命令
docker-compose up
```

### 常用 docker-compose 命令

- docker-compose pull
- docker-compose push
- docker-compose up
- docker-compose down
- docker-compose start
- docker-compose restart