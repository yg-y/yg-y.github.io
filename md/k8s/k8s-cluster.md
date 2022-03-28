# 【k8s】kubernetes 集群安装

# install.sh
> 所有机器执行此脚本
> 
> 执行命令: install.sh ip hostname 
> 
> 如 master: install.sh 1.1.1.1 k8s-master
> 
> 如 node: install.sh 1.1.1.1 k8s-node01
```shell
# install.sh ip hostname 

# 每个节点分别设置对应主机名
hostnamectl set-hostname &1

# 配置 hosts
echo "&0 &1" >> /etc/hosts

# 所有节点关闭 SELinux
setenforce 0
sed -i --follow-symlinks 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux

# 添加 k8s 安装源
cat <<EOF > kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
mv kubernetes.repo /etc/yum.repos.d/

# 添加 Docker 安装源
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

yum install -y kubelet kubeadm kubectl docker-ce

systemctl enable kubelet
systemctl start kubelet
systemctl enable docker
systemctl start docker


# kubernetes 官方推荐 docker 等使用 systemd 作为 cgroupdriver，否则 kubelet 启动不了
cat <<EOF > daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "registry-mirrors": ["https://ud6340vz.mirror.aliyuncs.com"]
}
EOF
mv daemon.json /etc/docker/

# 重启生效
systemctl daemon-reload
systemctl restart docker

```

执行完成之后，去到作为 master 的那台机器初始化集群

# master 节点
```shell
# 初始化集群控制台 Control plane
# 失败了可以用 kubeadm reset 重置
kubeadm init --image-repository=registry.aliyuncs.com/google_containers
```
- 执行
```shell
[root@k8s-master k8s]# kubeadm init --image-repository=registry.aliyuncs.com/google_containers
```

- 结果
```shell
[init] Using Kubernetes version: v1.23.5
[preflight] Running pre-flight checks
        [WARNING FileExisting-tc]: tc not found in system path
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.0.8.3]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [k8s-master localhost] and IPs [10.0.8.3 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [k8s-master localhost] and IPs [10.0.8.3 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 6.502399 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.23" in namespace kube-system with the configuration for the kubelets in the cluster
NOTE: The "kubelet-config-1.23" naming of the kubelet ConfigMap is deprecated. Once the UnversionedKubeletConfigMap feature gate graduates to Beta the default name will become just "kubelet-config". Kubeadm upgrade will handle this transition transparently.
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node k8s-master as control-plane by adding the labels: [node-role.kubernetes.io/master(deprecated) node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node k8s-master as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: e2yw4h.dalxmwfgwbjeinjg
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.0.8.3:6443 --token e2yw4h.dalxmwfgwbjeinjg \
        --discovery-token-ca-cert-hash sha256:ff71ff785973077d39cba50efab6acb726ef52f8c878a33ed6ad73498805f557 
```

- 再执行返回结果中的
```shell
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

# 子节点
- 记住 kukeadm join 命令，让子节点加入 master，24小时有效
```shell
# 子节点执行
kubeadm join 10.0.8.3:6443 --token e2yw4h.dalxmwfgwbjeinjg \
        --discovery-token-ca-cert-hash sha256:ff71ff785973077d39cba50efab6acb726ef52f8c878a33ed6ad73498805f557 
        
# 失效了则重新获取令牌
kubeadm token create --print-join-command

```
- 结果
```shell
[root@k8s-node03 k8s]# kubeadm join 10.0.8.3:6443 --token e2yw4h.dalxmwfgwbjeinjg \
>         --discovery-token-ca-cert-hash sha256:ff71ff785973077d39cba50efab6acb726ef52f8c878a33ed6ad73498805f557
[preflight] Running pre-flight checks
        [WARNING FileExisting-tc]: tc not found in system path
        [WARNING Hostname]: hostname "k8s-node03" could not be reached
        [WARNING Hostname]: hostname "k8s-node03": lookup k8s-node03 on 183.60.83.19:53: no such host
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
W0328 14:55:37.803441 1003537 utils.go:69] The recommended value for "resolvConf" in "KubeletConfiguration" is: /run/systemd/resolve/resolv.conf; the provided value is: /run/systemd/resolve/resolv.conf
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```
出现 `Run 'kubectl get nodes' on the control-plane to see this node join the cluster.` 则加入成功，去到 master 执行 `kubectl get nodes`
```shell
[root@k8s-master k8s]# kubectl get nodes
NAME         STATUS     ROLES                  AGE     VERSION
k8s-master   NotReady   control-plane,master   16m     v1.23.5
k8s-node01   NotReady   <none>                 7m46s   v1.23.5
k8s-node02   NotReady   <none>                 4m12s   v1.23.5
k8s-node03   NotReady   <none>                 10s     v1.23.5
```

# 注意
> 执行完后发现集群处于 NotReady 状态，则查看是否有 Pod 没成功启动
```shell
[root@k8s-master k8s]# kubectl get pods -A 
NAMESPACE     NAME                                 READY   STATUS    RESTARTS   AGE
kube-system   coredns-6d8c4cb4d-6vmsb              0/1     Pending   0          29m
kube-system   coredns-6d8c4cb4d-c9gs5              0/1     Pending   0          29m
kube-system   etcd-k8s-master                      1/1     Running   0          29m
kube-system   kube-apiserver-k8s-master            1/1     Running   0          29m
kube-system   kube-controller-manager-k8s-master   1/1     Running   0          29m
kube-system   kube-proxy-hzhs4                     1/1     Running   0          12m
kube-system   kube-proxy-p9vd9                     1/1     Running   0          20m
kube-system   kube-proxy-qgm9s                     1/1     Running   0          29m
kube-system   kube-proxy-vz9sc                     1/1     Running   0          16m
kube-system   kube-scheduler-k8s-master            1/1     Running   0          29m
```

此处 coredns 启动失败，查阅官网发现，需要选择安装一下 pod 的网络插件

![image.png](http://tva1.sinaimg.cn/large/a760927bgy1h0pmqcet0jj20rj045tab.jpg)

插件地址：https://kubernetes.io/zh/docs/concepts/cluster-administration/addons/

![image.png](http://tva1.sinaimg.cn/large/a760927bgy1h0pmrrupdgj20tm0kbgsa.jpg)

此处选择 Calico ，进去官网查看安装方式

Calico 官网：https://docs.projectcalico.org/v3.11/getting-started/kubernetes/installation/calico

![image.png](http://tva1.sinaimg.cn/large/a760927bgy1h0pmtg3yg7j20p00b4jue.jpg)

```shell
curl https://docs.projectcalico.org/v3.11/manifests/calico.yaml -O
# 此处我们没有更改 pod-network-cidr 地址，所以默认为 192.168.0.0/16
# 直接执行
kubectl apply -f calico.yaml
```
然后等待 pod 启动完成
```shell
[root@k8s-master k8s]# kubectl get pods -A 
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-56fcbf9d6b-vzv88   1/1     Running   0          5m11s
kube-system   coredns-6d8c4cb4d-6vmsb                    1/1     Running   0          37m
kube-system   coredns-6d8c4cb4d-c9gs5                    1/1     Running   0          37m
kube-system   etcd-k8s-master                            1/1     Running   0          38m
kube-system   kube-apiserver-k8s-master                  1/1     Running   0          38m
kube-system   kube-controller-manager-k8s-master         1/1     Running   0          38m
kube-system   kube-proxy-hzhs4                           1/1     Running   0          21m
kube-system   kube-proxy-p9vd9                           1/1     Running   0          29m
kube-system   kube-proxy-qgm9s                           1/1     Running   0          37m
kube-system   kube-proxy-vz9sc                           1/1     Running   0          25m
kube-system   kube-scheduler-k8s-master                  1/1     Running   0          38m
```
此时查看集群状态为 Ready
```shell
[root@k8s-master k8s]# kubectl get nodes
NAME         STATUS   ROLES                  AGE   VERSION
k8s-master   Ready    control-plane,master   36m   v1.23.5
k8s-node01   Ready    <none>                 27m   v1.23.5
k8s-node02   Ready    <none>                 24m   v1.23.5
k8s-node03   Ready    <none>                 20m   v1.23.5
```

# uninstall.sh
```shell
# uninstall.sh

kubeadm reset -f
modprobe -r ipip
lsmod
rm -rf ~/.kube/
rm -rf /etc/kubernetes/
rm -rf /etc/systemd/system/kubelet.service.d
rm -rf /etc/systemd/system/kubelet.service
rm -rf /usr/bin/kube*
rm -rf /etc/cni
rm -rf /opt/cni
rm -rf /var/lib/etcd
rm -rf /var/etcd
yum clean all
yum remove kube*
```