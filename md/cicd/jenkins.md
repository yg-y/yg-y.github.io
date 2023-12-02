# 使用 Jenkins 配合 Kuboard CICD 自动部署项目到 Kubernetes

会使用到的 Kubernetes 集群管理页面 \
相关 Kuboard 安装教程请参考官网，此处不做赘述 \
Kuboard: https://kuboard.cn/

# 使用 Docker 安装 Jenkins
- 使用 root 用户启动 Jenkins 容器，方便后续出问题可以进入容器进行调试
- 挂载 jenkins_home 目录
- 挂载 jdk、maven 到容器内
- 挂载 docker，让容器可以使用宿主机 docker 命令，方便镜像构建推送等工作
```shell
docker run --name jenkins-blueocean --restart=on-failure --detach \
  --network jenkins \
  --publish 8089:8080 --publish 50000:50000 \
  --user=root \
  --volume /mnt/:/var/jenkins_home \
  --volume /workspace/jdk1.8:/usr/bin/jdk1.8 \
  --volume /workspace/maven3.6.3:/usr/bin/maven3.6.3 \
  --volume /workspace/mvnd:/usr/bin/mvnd \
  --volume /usr/bin/docker:/usr/bin/docker \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume /root/.docker/config.jsoet:/root/.docker/config.jsoet \
 jenkins/jenkins:lts
```

# 配置 Jenkins
## 解锁 Jenkins

安装完成后访问 http://127.0.0.1:8080

初次访问需要使用密码解锁，可以直接通过`docker logs -f jenkins/jenkins` 访问容器日志查看，也可以通过 `cat /var/jenkins_home/initialAdminPassword` 查看

![jenkins](https://www.jenkins.io/doc/book/resources/tutorials/setup-jenkins-01-unlock-jenkins-page.jpg)

解锁直接安装推荐插件即可，如果网络不好多尝试几次，或者去 Jenkins 官网直接下载插件，本地上传安装。

官网插件地址：https://plugins.jenkins.io/

## 配置环境变量

进入系统管理 -> 系统配置 -> 下滑找到环境变量

- 配置 jdk
![jdk](https://blogyg.oss-cn-beijing.aliyuncs.com/Snipaste_2023-09-11_11-43-00.png)
- 配置 maven
![maven](https://blogyg.oss-cn-beijing.aliyuncs.com/Snipaste_2023-09-11_11-44-26.png)
- 配置 PATH
![path](https://blogyg.oss-cn-beijing.aliyuncs.com/Snipaste_2023-09-11_11-45-20.png)

点击应用并保存

进入系统管理 -> 全局配置 -> 下滑找到 jdk、maven 配置
![jdk](https://blogyg.oss-cn-beijing.aliyuncs.com/Snipaste_2023-09-11_11-49-20.png)

点击取消 maven 自动安装，选择本地 maven 文件目录
![maven](https://blogyg.oss-cn-beijing.aliyuncs.com/Snipaste_2023-09-11_11-51-14.png)

# 新建任务

## 新建流水线任务

完善 Jenkinsfile ，需将以下文件替换成自己的内容，如果对流水线语法不熟悉的，在流水线下方有流水线语法指引 
```shell
pipeline {
    agent any
    environment {
        PATH = "PATH+EXTRA=/usr/sbin:/usr/bin:/sbin:/bin:/usr/bin/jdk1.8/bin:/usr/bin/maven3.6.3/bin"
        obj_path = "/var/jenkins_home/workspace/you job name"
    }
    stages {
        # 拉取代码 
        stage('pull code') {
            steps {
                git branch: 'master', credentialsId: '73392b20-7e59-4595-8530-a8fa848d6b0a', url: 'http://your github'
            }
        }
        # maven 构建代码
        stage('build code') {
            steps {
                # 进入项目 pom 文件目录, 使用绝对路径 mvn 构建 jar 包
                # 根据各自项目情况，也可以通过 maven 直接打包构建成 docker 镜像
                sh '''cd ${obj_path}/oms/
                /usr/bin/maven3.6.3/bin/mvn clean package -Dmaven.test.skip=true'''
            }
        }
        # 构建镜像，
        stage('build images') {
            steps {
                # 指定 docker 登陆命令，提前将镜像仓库密码写入 docker_password 中，使用以下命令一行脚本登陆 dockerhub
                # 此处使用 aliyun registry
                sh '''cat /var/jenkins_home/docker_password | docker login --username=your-username --password-stdin registry.cn-hangzhou.aliyuncs.com'''
                # 构建之前判断是否存在老的镜像，有的话执行删除操作，del-images.sh 脚本在下面
                sh '''/var/jenkins_home/del-images.sh registry.cn-hangzhou.aliyuncs.com/images-name'''
                # 执行 docker build 构建镜像，docker build 后面的 . 代表 Dockerfile 的位置，此处需要换成自己项目 Dockerfile 的绝对路径
                sh '''docker build -t registry.cn-hangzhou.aliyuncs.com/images-name:1.0.0 .'''
                # 构建完成执行 docker push 操作
                sh '''docker push registry.cn-hangzhou.aliyuncs.com/images-name:1.0.0'''
            }
        }    
        # 调用 Kuboard CICD 接口，完成部署操作
        # 此操作需要提前在 Kuboard 的中对项目进行部署操作
        # 也可以直接选择 kubectl 的方式进行部署，需要在 Jenkins 中下载 SSH 相关插件，连接 k8s control-plane 节点所在机器执行对应脚本
        stage('start project') {
            steps {
                sh '''curl -X PUT \\
                    -H "Content-Type: application/yaml" \\
                    -H "Cookie: KuboardUsername=admin; KuboardAccessKey=your KuboardAccessKey" \\
                    -d \'{"kind":"deployments","namespace":"default","name":"your pod name"}\' \\
                    "http://ip:port/kuboard-api/cluster/cluster/kind/CICDApi/admin/resource/restartWorkload"'''
            }
        }
    }
}

```
## 镜像删除命令
```shell
project=$1
images_id=`docker images | grep ${project} | awk '{print $3}'`
echo $images_id
if [ "$images_id" != "" ] ; then
  docker rmi -f $images_id
fi
```

配置完成后点击应用并保存，进入任务点击立即构建等待流水线完成作业 \
如果哪一步错误可以直接点击查看 logs 看下是提示什么问题。 \
如果没有问题则正常完成流程执行。

![pipeline](https://blogyg.oss-cn-beijing.aliyuncs.com/Snipaste_2023-09-11_12-13-19.png)

# 常见问题总结

## 一、maven setting.xml 文件无权限
```shell
jenkins@jenkins-7f9c9dbbf6-t8v79:~/workspace/newoms-test/yks-oms$ /var/jenkins_home/maven3.6.3/bin/mvn clean
[ERROR] Error executing Maven.
[ERROR] 1 problem was encountered while building the effective settings
[FATAL] Non-readable settings /var/jenkins_home/maven3.6.3/conf/settings.xml: /var/jenkins_home/maven3.6.3/conf/settings.xml (Permission denied) @ /var/jenkins_home/maven3.6.3/conf/settings.xml
```
解决方案：去到宿主机挂载目录执行
```shell
# 赋予执行读写权限
chmod 777 /mnt/maven3.6.3/conf/setting.xml
```

## 二、Docker 没有权限
解决方案：对 docker 进行所有用户执行权限
```shell
# 去到宿主机挂载目录执行
chmod 777 /var/run/docker.sock
```