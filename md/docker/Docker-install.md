# 【Docker 系列】Docker 基础及入门搭建

> Docker 是一个开放源代码软件，是一个开放平台，用于开发应用、交付（shipping）应用、运行应用。 Docker允许用户将基础设施（Infrastructure）中的应用单独分割出来，形成更小的颗粒（容器），从而提高交付软件的速度
> 
> Docker容器与虚拟机类似，但二者在原理上不同。容器是将操作系统层虚拟化，虚拟机则是虚拟化硬件，因此容器更具有便携性、高效地利用服务器。 容器更多的用于表示 软件的一个标准化单元。由于容器的标准化，因此它可以无视基础设施（Infrastructure）的差异，部署到任何一个地方。另外，Docker也为容器提供更强的业界的隔离兼容。
> 
> Docker 利用Linux核心中的资源分离机制，例如cgroups，以及Linux核心名字空间（namespaces），来创建独立的容器（containers）。这可以在单一Linux实体下运作，避免引导一个虚拟机造成的额外负担[3]。Linux核心对名字空间的支持完全隔离了工作环境中应用程序的视野，包括行程树、网络、用户ID与挂载文件系统，而核心的cgroup提供资源隔离，包括CPU、存储器、block I/O与网络。从0.9版本起，Dockers在使用抽象虚拟是经由libvirt的LXC与systemd - nspawn提供界面的基础上，开始包括libcontainer库做为以自己的方式开始直接使用由Linux核心提供的虚拟化的设施，
>
> 依据行业分析公司“451研究”：“Dockers是有能力打包应用程序及其虚拟容器，可以在任何Linux服务器上运行的依赖性工具，这有助于实现灵活性和便携性，应用程序在任何地方都可以运行，无论是公用云端服务器、私有云端服务器、单机等。”
> 
> 摘自维基百科

简而言之就是，Docker 是一个类似 Java 虚拟机的一个东西，但是原理不同，Docker 可以将应用构建成镜像，一处构建，到处运行。 

## Docker 安装
Docker 可以在 Linux、Mac、Windows 下进行安装，此处演示 Linux 系统下安装的过程(CentOS 版本)，Mac 以及 Windows 下的安装可以直接通过官网下载安装包的形式安装。

官网下载：[https://www.docker.com/get-started](https://www.docker.com/get-started)

### CentOS Docker 安装

如果已经安装了，先执行卸载命令
```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

#### 使用官方安装脚本自动安装
- 安装命令如下：
```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

#也可以使用国内 daocloud 一键安装命令：
curl -sSL https://get.daocloud.io/docker | sh
```
#### 手动安装
- 安装 Docker Engine-Community
  - 使用 Docker 仓库进行安装
在新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。之后，您可以从仓库安装和更新 Docker。

- 设置仓库
  - 安装所需的软件包。yum-utils 提供了 yum-config-manager ，并且 device mapper 存储驱动程序需要 device-mapper-persistent-data 和 lvm2。

```shell
sudo yum install -y yum-utils \
device-mapper-persistent-data \
lvm2
```
- 默认是 Docker 官方的镜像源，国内访问可能会比较慢，可以设置为国内的阿里源

```shell
sudo yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

- 安装最新版本的 Docker Engine-Community 和 Containerd：
```shell
sudo yum install docker-ce docker-ce-cli containerd.io
```

- 启动 Docker
```shell
sudo systemctl start docker
```

- 设置开机启动
```shell
sudo systemctl enable docker
```

- 关闭开机启动
```shell
sudo systemctl disable docker
```

#### 验证是否安装成功
```shell
# 直接 docker run 如果本地没有这个镜像，会先去镜像仓库去拉取
sudo docker run hello-world
```
- 输出： 
  - 看到正常打印 Hello from Docker! 就表示安装成功
```shell
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
b8dfde127a29: Pull complete 
Digest: sha256:89b647c604b2a436fc3aa56ab1ec515c26b085ac0c15b0d105bc475be15738fb
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

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

### 常用 Docker 命令

[Docker 常用命令大全](https://www.runoob.com/docker/docker-command-manual.html)

- docker pull
- docker push
- docker run
- docker rmi
- docker rm
- docker images
- docker start
- docker restart


