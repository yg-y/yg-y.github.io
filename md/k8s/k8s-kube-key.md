# 使用 KubeKey 安装 Kubernetes 集群及 Kubesphere

# 准备工作

- 机器

   <table>
     <tr>
       <th>节点</th>
       <th>系统版本</th>
       <th>Docker</th>
       <th>Kubernetes</th>
     </tr>
     <tr>
       <td>k8s-master</td>
       <td>CentOS 7.6</td>
       <td>20.10.5</td>
       <td>v1.23.0</td>
     </tr>
     <tr>
       <td>k8s-node01</td>
       <td>CentOS 7.6</td>
       <td>20.10.5</td>
       <td>v1.23.0</td>
     </tr>
     <tr>
       <td>k8s-node02</td>
       <td>CentOS 7.6</td>
       <td>20.10.5</td>
       <td>v1.23.0</td>
     </tr>
     <tr>
       <td>k8s-node03</td>
       <td>CentOS 7.6</td>
       <td>20.10.5</td>
       <td>v1.23.0</td>
     </tr>
   </table>

- 开启对应端口

  我这里为了方便就开启了所有 TCP 端口 `(1-65535)`


- 依赖项下载

  KubeKey 可以一同安装 Kubernetes 和 KubeSphere。根据要安装的 Kubernetes 版本，需要安装的依赖项可能会不同。您可以参考下表，查看是否需要提前在节点上安装相关依赖项。

  <table><thead><tr><th>依赖项</th><th>Kubernetes 版本 ≥ 1.18</th><th>Kubernetes 版本 &lt; 1.18</th></tr></thead><tbody><tr><td><code>socat</code></td><td>必须</td><td>可选，但建议安装</td></tr><tr><td><code>conntrack</code></td><td>必须</td><td>可选，但建议安装</td></tr><tr><td><code>ebtables</code></td><td>可选，但建议安装</td><td>可选，但建议安装</td></tr><tr><td><code>ipset</code></td><td>可选，但建议安装</td><td>可选，但建议安装</td></tr></tbody></table>

  此处安装 socat、conntrack
  
  ```shell
    yum install -y socat && yum install -y conntrack
  ```

# 下载  KubeKey

- 安装命令

  ```shell
    export KKZONE=cn && \
    curl -sfL https://get-kk.kubesphere.io | VERSION=v2.0.0 sh - && \
    export KKZONE=cn && \
    chmod +x kk
  ```

# 使用 KubeKey 创建集群配置文件
- 此处 kubernetes 版本为 v1.23.0 , kubesphere 版本为 v3.2.0 (如果其他版本则更改为其他版本即可)
  
  ```shell
    ./kk create config --with-kubernetes v1.23.0 --with-kubesphere v3.2.0 -f config-k8s.yaml
  ```
  创建完成后会在当前目录生存 `config-k8s.yaml` 配置文件


- 编辑配置文件
  
  其余配置默认即可，详细配置文件说明：https://kubesphere.io/zh/docs/installing-on-linux/introduction/vars/
  
  ```yaml
  apiVersion: kubekey.kubesphere.io/v1alpha2
  kind: Cluster
  metadata:
    name: sample
  spec:
    hosts:
    # 确保以下机器 ssh 可用互联   
    - {name: k8s-master, address: 10.0.8.3, internalAddress: 10.0.8.3, user: root, password: "password"}
    - {name: k8s-node01, address: 10.0.12.13, internalAddress: 10.0.12.13, user: root, password: "password"}
    - {name: k8s-node02, address: 10.0.12.15, internalAddress: 10.0.12.15, user: root, password: "password"}
    - {name: k8s-node03, address: 10.0.12.17, internalAddress: 10.0.12.17, user: root, password: "password"}
    roleGroups:
      etcd:
      - k8s-master
      master:
      - k8s-master
      control-plane: 
      - k8s-master
      worker:
      - k8s-node01
      - k8s-node02
      - k8s-node03
  ```
# 使用配置文件创建集群

- 创建集群
  
  ```shell
    ./kk create cluster -f config-k8s.yaml
  ```

- 等待命令执行完成
  出现以下结果代表集群安装完毕

  ```text
   Please wait for the installation to complete: >>--->
    #####################################################
    
    Welcome to KubeSphere!
    
    #####################################################
    
    Console: http://10.0.8.3:30880
    Account: admin
    Password: P@88w0rd  
    
    NOTES：
    
      a. After you log into the console, please check the
    monitoring status of service components in
    "Cluster Management". If any service is not
    ready, please wait patiently until all components
    are up and running. 
        ⅰ. Please change the default password after login.
    
    #####################################################
    https://kubesphere.io             2022-03-31 11:10:00
    #####################################################
    
    Welcome to KubeSphere!
    
    #####################################################
    
    Console: http://10.0.8.3:30880
    Account: admin
    Password: P@88w0rd  
    
    NOTES：
    
      a. After you log into the console, please check the
    monitoring status of service components in
    "Cluster Management". If any service is not
    ready, please wait patiently until all components
    are up and running. 
        ⅰ. Please change the default password after login.
    
    #####################################################
    https://kubesphere.io             2022-03-31 11:10:00
    #####################################################
    11:10:03 CST success: [k8s-master]
    11:10:03 CST success: [k8s-master]
    11:10:03 CST Pipeline[CreateClusterPipeline] execute successful
    Installation is complete.
    
    Please check the result using the command:
    
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -ff

  ```

# 查看集群状态

- 查看集群节点状态
  
   ```shell
      [root@k8s-master kuberkey]# kubectl get nodes && kubectl get pods -A
      NAME         STATUS   ROLES                  AGE     VERSION
      k8s-master   Ready    control-plane,master   3h13m   v1.23.0
      k8s-node01   Ready    worker                 3h12m   v1.23.0
      k8s-node02   Ready    worker                 3h12m   v1.23.0
      k8s-node03   Ready    worker                 3h12m   v1.23.0
      NAMESPACE                      NAME                                               READY   STATUS    RESTARTS       AGE
      kube-system                    calico-kube-controllers-785fcf8454-xwp4s           1/1     Running   0              3h13m
      kube-system                    calico-node-cbngg                                  1/1     Running   0              3h13m
      kube-system                    calico-node-dpb6v                                  1/1     Running   0              3h13m
      kube-system                    calico-node-rbdw5                                  1/1     Running   0              3h13m
      kube-system                    calico-node-xn8z4                                  1/1     Running   0              3h13m
      kube-system                    coredns-6f67cb886-2j6c4                            1/1     Running   0              3h13m
      kube-system                    coredns-6f67cb886-ghrpx                            1/1     Running   0              3h13m
      kube-system                    kube-apiserver-k8s-master                          1/1     Running   0              3h14m
      kube-system                    kube-controller-manager-k8s-master                 1/1     Running   0              3h14m
      kube-system                    kube-proxy-8vj5q                                   1/1     Running   0              3h13m
      kube-system                    kube-proxy-g2tg7                                   1/1     Running   0              3h13m
      kube-system                    kube-proxy-twksr                                   1/1     Running   0              3h13m
      kube-system                    kube-proxy-wx7fx                                   1/1     Running   0              3h13m
      kube-system                    kube-scheduler-k8s-master                          1/1     Running   0              3h14m
      kube-system                    nodelocaldns-2z7xr                                 1/1     Running   0              3h13m
      kube-system                    nodelocaldns-cxh6c                                 1/1     Running   0              3h13m
      kube-system                    nodelocaldns-gdwps                                 1/1     Running   0              3h13m
      kube-system                    nodelocaldns-mfnb8                                 1/1     Running   0              3h13m
      kube-system                    openebs-localpv-provisioner-7bbb56d7dc-6g656       1/1     Running   0              3h12m
      kube-system                    snapshot-controller-0                              1/1     Running   0              3h11m
      kubesphere-controls-system     default-http-backend-696d6bf54f-wgmdz              1/1     Running   0              3h10m
      kubesphere-controls-system     kubectl-admin-b49cf5585-2mqdx                      1/1     Running   0              3h8m
      kubesphere-monitoring-system   alertmanager-main-0                                2/2     Running   0              3h9m
      kubesphere-monitoring-system   alertmanager-main-1                                2/2     Running   0              3h8m
      kubesphere-monitoring-system   alertmanager-main-2                                2/2     Running   0              3h8m
      kubesphere-monitoring-system   kube-state-metrics-796b885647-hsshz                3/3     Running   0              3h9m
      kubesphere-monitoring-system   node-exporter-c64ps                                2/2     Running   0              3h9m
      kubesphere-monitoring-system   node-exporter-lqvjw                                2/2     Running   0              3h9m
      kubesphere-monitoring-system   node-exporter-vtfjv                                2/2     Running   0              3h9m
      kubesphere-monitoring-system   node-exporter-z6cqj                                2/2     Running   0              3h9m
      kubesphere-monitoring-system   notification-manager-deployment-7dd45b5b7d-5b74f   2/2     Running   0              3h8m
      kubesphere-monitoring-system   notification-manager-deployment-7dd45b5b7d-vjmbl   2/2     Running   0              3h8m
      kubesphere-monitoring-system   notification-manager-operator-8598775b-rkdt4       2/2     Running   0              3h8m
      kubesphere-monitoring-system   prometheus-k8s-0                                   2/2     Running   1 (3h8m ago)   3h9m
      kubesphere-monitoring-system   prometheus-k8s-1                                   2/2     Running   1 (3h8m ago)   3h9m
      kubesphere-monitoring-system   prometheus-operator-756fbd6cb-ktbh6                2/2     Running   0              3h9m
      kubesphere-system              ks-apiserver-69b5644587-hjpk7                      1/1     Running   0              3h8m
      kubesphere-system              ks-console-7c5fd5fd4d-qvpbb                        1/1     Running   0              3h10m
      kubesphere-system              ks-controller-manager-ff56ddb4f-k8gnt              1/1     Running   0              3h8m
   ```

全部正常启动，到此安装完成