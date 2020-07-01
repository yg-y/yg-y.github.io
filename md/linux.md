# Linux常用命令

### 创建文件夹
```
mkdir xxx
```
### 创建文件
```
touch xxx
```

### 查看文件
```
ls -ll
ls -lh
df -h
Df命令是linux系统以磁盘分区为单位查看文件系统，可以加上参数查看磁盘剩余空间信息，
命令格式： df -hl
```

### 查看linux端口
```
//查看所有tcp端口
netstat -ntlp
#列出所有端口使用情况
$netstat -a
#显示当前UDP连接状况
$netstat -nu
#显示UDP端口号的使用情况
$netstat -apu
#显示网卡列表
$netstat -i
#显示网络统计信息
$netstat -s
#显示监听的套接口
$netstat -l
#显示所有已建立的有效连接
$netstat -n
#显示关于路由表的信息
$netstat -r
#列出所有 tcp 端口
$netstat -at
#找出程序运行的端口
$netstat -ap | grep ssh
#在 netstat 输出中显示 PID 和进程名称
$netstat -pt
```

### 查看linux进程
```
//查看所有进程
ps -a
//查看进程的环境变量和程序间的关系
ps -ef
```

### 查看当前文件夹路径
```
pwd
```

### 查看文件
```
//查看全部文件
cat xxx

//流式读取
//more&less最重要的一点就是流式读取，支持翻页，
//像cat命令是全部读取输出到标准输出，如果文件太大会把屏幕刷满的，根本没办法看。

less xxx

more参数格式

more [-dlfpcsu ] [-num ] [+/ pattern] [+ linenum] [file ... ]

more命令参数

+n   从笫n行开始显示

-n    定义屏幕大小为n行

+/pattern 在每个档案显示前搜寻该字串（pattern），然后从该字串前两行之后开始显示

-c    从顶部清屏，然后显示

-d    提示“Press space to continue，’q’ to quit（按空格键继续，按q键退出）”，禁用响铃功能

-l    忽略Ctrl+l（换页）字符

-p    通过清除窗口而不是滚屏来对文件进行换页，与-c选项相似

-s    把连续的多个空行显示为一行

-u    把文件内容中的下画线去掉

less 与 more 类似，但使用 less 可以随意浏览文件，而 more 仅能向前移动，却不能向后移动，而且 less 在查看之前不会加载整个文件
```

### 删除文件
```
rm

rm命令参数

-f, --force  忽略不存在的文件，从不给出提示。

-i, --interactive 进行交互式删除

-r, -R, --recursive  指示rm将参数中列出的全部目录和子目录均递归地删除。

-d, --dir 删除空目录
```

### 移动文件或者重名名文件
```
//移动文件
mv nginx.conf /home/nginx

//重命名
mv nginx.conf my.conf
```

### 复制文件
```
cp xxx xxx
```

### 打印变量
```
echo
```

### 显示日期
```
date
```

### 杀死进程
```
kill

HUP    1    终端断线
INT     2    中断（同 Ctrl + C）
QUIT    3    退出（同 Ctrl + \）
TERM   15    终止
KILL    9    强制终止
CONT   18    继续（与STOP相反， fg/bg命令）
STOP    19    暂停（同 Ctrl + Z）

//强制终止某个进程
kill -9 xxx
```

### 查找文件
```
find / xxx

/ 为查找的目录
xxx 为查找的文件或目录
```

### 压缩解压缩
```
#打包  tar -cvf 包名  文件名
$tar -cvf test.tar test.txt
#解包  tar -xvf 包名
$tar -xvf test.tar
#压缩  tar -czvf 包名 文件名
$tar -czvf test.tgz test.txt
#解压  tar -xzvf 包名
$tar -xzvf test.tgz
```

### 下载文件
```
wget

#下载某个文件，wget 文件的地址
$wget https://blog.csdn.net/qq_38646470
```