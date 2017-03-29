#Basic linux cmd

##ls 
查看某一个目录的完整属性，而不是显示目录里面的文件属性：
$ ls -dl <目录名>

Pasted from <https://www.shiyanlou.com/courses/1/labs/3/document>  

##添加用户sudo组
这里我用 shiyanlou 用户执行 sudo 命令将 lilei 添加到 sudo 用户组，让它也可以使用 sudo 命令获得 root 权限  
`sudo adduser lilei`   
`$ su - root`   
`$ groups lilei`  
`$ sudo usermod -G sudo lilei`  
`$ groups lilei`  
然后你再切换回 lilei 用户，现在就可以使用 sudo 获取 root 权限了。

##mkdir
使用 -p 参数，同时创建父目录（如果不存在该父目录），如下我们同时创建一个多级目录（这在有时候安装软件，配置安装路径时非常有用）：
`$ mkdir -p father/son/grandson`

##批量修改文件名
使用通配符批量创建 5 个文件   
`$ touch file{1..5}.txt`   
`# 批量将这 5 个后缀为 .txt 的文本文件重命名为以 .c 为后缀的文件`  
`$ rename 's/\.txt/\.c/' *.txt`   
`#批量将这 5 个文件，文件名改为大写`  
`$ rename 'y/a-z/A-Z/' *.c`  

##变量删除
可以使用unset命令删除一个环境变量：  
`$ unset temp`

##如何让环境变量立即生效
在上面我们在 Shell 中修改了一个配置脚本文件之后（比如 zsh 的配置文件 home 目录下的.zshrc），每次都要退出终端重新打开甚至重启主机之后其才能生效，很是麻烦，我们可以使用source命令来让其立即生效，如：  
`$ source .zshrc`
source命令还有一个别名就是.，注意与表示当前路径的那个点区分开，虽然形式一样，但作用和使用方式一样，上面的命令如果替换成.的方式就该是   
`$ . ./.zshrc`  
注意第一个点后面有一个空格，而且后面的文件必须指定完整的绝对或相对路径名，source 则不需要。

Pasted from <https://www.shiyanlou.com/courses/1/labs/60/document> 

##tar
只查看不解包文件-t参数：  
`$ tar -tf shiyanlou.tar`

保留文件属性和跟随链接（符号链接或软链接），有时候我们使用tar备份文件当你在其他主机还原时希望保留文件的属性(-p参数)和备份链接指向的源文件而不是链接本身(-h参数)：
`$ tar -cphf etc.tar /etc`

对于创建不同的压缩格式的文件，对于tar来说是相当简单的，需要的只是换一个参数，这里我们就以使用gzip工具创建`*.tar.gz`文件为例来说明。  
我们只需要在创建 tar 文件的基础上添加-z参数，使用gzip来压缩文件：  
`$ tar -czf shiyanlou.tar.gz ~`  
解压*.tar.gz文件：  
`$ tar -xzf shiyanlou.tar.gz`  


现在我们要使用其他的压缩工具创建或解压相应文件只需要更改一个参数即可：  
压缩文件格式	参数  
`*.tar.gz	-z`  
`*.tar.xz	-J`  
`*tar.bz2	-j`

##dd
我们先来试试用dd命令从标准输入读入用户输入到标准输出或者一个文件：  
1. 输出到文件  
`$ dd of=test bs=10 count=1  # 或者 dd if=/dev/stdin of=test bs=10 count=1`    
2. 输出到标准输出  
`$ dd if=/dev/stdin of=/dev/stdout bs=10 count=1`  
上述命令从标准输入设备读入用户输入（缺省值，所以可省略）然后输出到 test 文件，bs（block size）用于指定块大小（缺省单位为 Byte，也可为其指定如'K'，'M'，'G'等单位），count用于指定块数量。

type exit 
type service

#得到这样的结果说明是内建命令，正如上文所说内建命令都是在 bash 源码中的 builtins 的.def中
 xxx is a shell builtin 
#得到这样的结果说明是外部命令，正如上文所说，外部命令在/usr/bin or /usr/sbin等等中
 xxx is /usr/sbin/xxx
 #若是得到alias的结果，说明该指令为命令别名所设定的名称；
 xxx is an alias for xx --xxx

Crontab
在本实验环境中 crontab 也是不被默认启动的，同时不能在后台由 upstart 来管理，所以需要我们来启动它（同样在本实验环境中需要手动启动，自己的本地 Ubuntu 的环境中也不需要手动启动）
sudo cron －f &


下面将开始 crontab 的使用了，我们通过下面一个命令来添加一个计划任务
crontab -e




在了解命令格式之后，我们通过这样的一个例子来完成一个任务的添加，在文档的最后一排加上这样一排命令,该任务是每分钟我们会在/home/shiyanlou目录下创建一个以当前的年月日时分秒为名字的空白文件
*/1 * * * * touch /home/shiyanlou/$(date +\%Y\%m\%d\%H\%M\%S)


当然我们也可以通过这样的一个指令来查看我们添加了哪些任务
crontab -l


当我们并不需要这个任务的时候我们可以使用这么一个命令去删除任务
crontab -r

这个 crontab -e 是针对使用者的 cron 來设计的，也就是每个用户在添加任务，就会在 /var/spool/cron/crontabs 中添加一个该用户自己的任务文档，这样可以做到隔离，独立，不会混乱。

如果是系統的例行性任務時，该怎么办呢？是否还是需要以 crontab -e 來管理你的例行性工作排程呢？当然不需要，你只要编辑 /etc/crontab 這個档案就可以啦！有一點需要特別注意喔！那就是 crontab -e 這個 crontab 其实是 /usr/bin/crontab 这个执行的，只是你可以 root 的身份編輯一下这个文档！
基本上， cron 这个服务的最低侦测限制是分钟，所以 cron 会每分钟去读取一次 /etc/crontab 与 /var/spool/cron/crontabs 里面的资料內容 』，因此，只要你编辑完 /etc/crontab 这个文档，并且將他存储之后，那么 cron 的设定就自动的执行了！
/etc/cron.daily，目录下的脚本会每天让执行一次，在每天的6点25分时运行；
/etc/cron.hourly，目录下的脚本会每个小时让执行一次，在每小时的17分钟时运行；
/etc/cron.mouthly，目录下的脚本会每月让执行一次，在每月1号的6点52分时运行；
/etc/cron.weekly，目录下的脚本会每周让执行一次，在每周第七天的6点47分时运行；

cut

$ cut /etc/passwd -d ':' -f 1,6

Pasted from <
打印/etc/passwd文件中每一行的前N个字符：
# 前五个（包含第五个）
$ cut /etc/passwd -c -5
# 前五个之后的（包含第五个）
$ cut /etc/passwd -c 5-
# 第五个
$ cut /etc/passwd -c 5
# 2到5之间的（包含第五个）
$ cut /etc/passwd -c 2-5


grep
还是先体验一下，我们搜索/home/shiyanlou目录下所有包含"shiyanlou"的所有文本文件，并显示出现在文本中的行号：
$ grep -rnI "shiyanlou" ~

grep -r 递归查找   -n打印行号  -I去除二进制文件
当然也可以在匹配字段中使用正则表达式，下面简单的演示：
# 查看环境变量中以"yanlou"结尾的字符串
$ export | grep ".*yanlou$"

其中$就表示一行的末尾。

wc

wc 命令用于统计并输出一个文件中行、单词和字节的数目，比如输出/etc/passwd文件的统计信息：
$ wc /etc/passwd
分别只输出行数、单词数、字节数、字符数和输入文本中最长一行的字节数：
# 行数
$ wc -l /etc/passwd
# 单词数
$ wc -w /etc/passwd
# 字节数
$ wc -c /etc/passwd
# 字符数
$ wc -m /etc/passwd
# 最长行字节数
$ wc -L /etc/passwd

sort排序

默认为字典排序：
$ cat /etc/passswd | sort
反转排序：
$ cat /etc/passwd | sort -r
按特定字段排序：
$ cat /etc/passwd | sort -t':' -k 3
上面的-t参数用于指定字段的分隔符，这里是以":"作为分隔符；-k 字段号用于指定对哪一个字段进行排序。这里/etc/passwd文件的第三个字段为数字，默认情况下是一字典序排序的，如果要按照数字排序就要加上-n参数：
$ cat /etc/passwd | sort -t':' -k 3 -n

nl命令

可以查看文本文件，带行号，类似cat

uniq 去重命令
我们可以使用history命令查看最近执行过的命令（实际为读取${SHELL}_history文件,如我们环境中的~/.zsh_history文件），不过你可能只想查看使用了那个命令而不需要知道具体干了什么，那么你可能就会要想去掉命令后面的参数然后去掉重复的命令：
$ history | cut -c 8- | cut -d ' ' -f 1 | uniq
然后经过层层过滤，你会发现确是只输出了执行的命令那一列，不过去重效果好像不明显，仔细看你会发现它趋势去重了，只是不那么明显，之所以不明显是因为uniq命令只能去连续重复的行，不是全文去重，所以要达到预期效果，我们先排序：
$ history | cut -c 8- | cut -d ' ' -f 1 | sort | uniq
# 或者$ history | cut -c 8- | cut -d ' ' -f 1 | sort -u

 tr  
常用的选项有：
选项	说明
-d	删除和set1匹配的字符，注意不是全词匹配也不是按字符顺序匹配
-s	去除set1指定的在输入文本中连续并重复的字符
操作举例：
# 删除 "hello shiyanlou" 中所有的'o','l','h'
$ echo 'hello shiyanlou' | tr -d 'olh'
# 将"hello" 中的ll,去重为一个l
$ echo 'hello' | tr -s 'l'
# 将输入文本，全部转换为大写或小写输出
$ cat /etc/passwd | tr '[:lower:]' '[:upper:]'
# 上面的'[:lower:]' '[:upper:]'你也可以简单的写作'[a-z]' '[A-Z]',当然反过来将大写变小写也是可以的

tr好奇怪， 用管道的方式可以转化大小写 直接用怎么不行呢？tr -c ?后面接啥
删除Windows文件“造成”的'^M'字符
 
# cat file | tr -d "\r" > new_file
或者
# cat file | tr -s "\r" "\n" > new_file

col 命令

常用的选项有：
选项	说明
-x	将Tab转换为空格
-h	将空格转换为Tab（默认选项）
操作举例：
# 查看 /etc/protocols 中的不可见字符，可以看到很多 ^I ，这其实就是 Tab 转义成可见字符的符号
$ cat -A /etc/protocols
# 使用 col -x 将 /etc/protocols 中的 Tab 转换为空格,然后再使用 cat 查看，你发现 ^I 不见了
$ cat /etc/protocols | col -x | cat -A


dos2unix
unix2dos
1、在《文件打包与解压缩》一节实验中提到 Windows/dos 与 Linux/UNIX 文本文件一些特殊字符不一致，如断行符 Windows 为 CR+LF(\r\n)，Linux/UNIX 为 LF(\n)。使用cat -A 文本 可以看到文本中包含的不可见特殊字符。Linux 的\n表现出来就是一个$，而 Windows/dos 的表现为^M$，可以直接使用dos2unix和unix2dos工具在两种格式之间进行转换，使用file命令可以查看文件的具体类型。不过现在希望你在不使用上述两个转换工具的情况下，使用前面学过的命令手动完成 dos 文本格式到 UNIX 文本格式的转换。

重定向
文件描述符	设备文件	说明
0	/dev/stdin	标准输入
1	/dev/stdout	标准输出
2	/dev/stderr	标准错误

新建文件 EOF结束：
$ cat > Documents/test.c <<EOF 
#include <stdio.h>
 int main() 
{
   printf("hello world\n");
   return 0; 
} 
EOF
那有的时候我们就是要可以隐藏某些错误或者警告，那又该怎么做呢。这就需要用到我们前面讲的文件描述符了：
# 将标准错误重定向到标准输出，再将标准输出重定向到文件，注意要将重定向到文件写到前面
$ cat Documents/test.c hello.c >somefile  2>&1
# 或者只用bash提供的特殊的重定向符号"&"将标准错误和标准输出同时重定向到文件
$ cat Documents/test.c hello.c &>somefilehell
注意你应该在输出重定向文件描述符前加上&,否则shell会当做重定向到一个文件名为1的文件中

使用tee命令同时重定向到多个文件
经常你可能还有这样的需求，除了将需要将输出重定向到文件之外也需要将信息打印在终端，那么你可以使用tee命令来实现：
$ echo 'hello shiyanlou' | tee hello

tee 对文件叠加：
tee -a

永久重定向
你应该可以看出我们前面的重定向操作都只是临时性的，即只对当前命令有效，那如何做到“永久”有效呢，比如在一个脚本中，你需要某一部分的命令的输出全部进行重定向，难道要让你在每个命令上面加上临时重定向的操作嘛，当然不需要，我们可以使用exec命令实现“永久”重定向。exec命令的作用是使用指定的命令替换当前的 Shell，及使用一个进程替换当前进程，或者指定新的重定向：
# 先开启一个子 Shell
$ zsh
# 使用exec替换当前进程的重定向，将标准输出重定向到一个文件
$ exec 1>somefile
# 后面你执行的命令的输出都将被重定向到文件中,直到你退出当前子shell，或取消exec的重定向（后面将告诉你怎么做）
$ ls
$ exit
$ cat somefile
我们可以利用设个/dev/null屏蔽命令的输出：
$ cat Documents/test.c nefile 1>/dev/null 2>&1


xargs
cut -d':' -f1 < /etc/passwd |head -n 3 | xargs finger

&
进程放后台运行。

我们还可以通过 ctrl + z 使我们的当前工作停止并丢到后台中去


Jobs
查看后台运行的进程

其中第一列显示的为被放置后台的工作的编号，而第二列的 ＋ 表示最近被放置后台的工作，同时也表示预设的工作，也就是若是有什么针对后台的工作的操作，首先对预设的工作，- 表示倒数第二被放置后台的工作，倒数第三个以后都不会有这样的符号修饰，第三列表示它们的状态，而最后一列表示该进程执行的命令


后台转前台：
#后面不加参数提取预设工作，加参数提取指定工作的编号
fg [%jobnumber]

fg %1

 使后台进程在后台运行：
bg
#与fg类似，加参则指定，不加参则取预设 bg [%jobnumber]


kill
其中常用的有这些信号值
信号值	作用
-1	重新读取参数运行，类似与restart
-2	如同 ctrl+c 的操作退出
-9	强制终止该任务
-15	正常的方式终止该任务


top
我们看到 top 显示的第一排
内容	解释
top	表示当前程序的名称
11:05:18	表示当前的系统的时间
up 8 days,17:12	表示该机器已经启动了多长时间
1 user	表示当前系统中只有一个用户
load average: 0.29,0.20,0.25	分别对应1、5、15分钟内cpu的平均负载

我们该如何看待这个load average 数据呢？
假设我们的系统是单CPU单内核的，把它比喻成是一条单向的桥，把CPU任务比作汽车。
	• load = 0 的时候意味着这个桥上并没有车，cpu 没有任何任务；
	• load < 1 的时候意味着桥上的车并不多，一切都还是很流畅的，cpu 的任务并不多，资源还很充足；
	• load = 1 的时候就意味着桥已经被车给沾满了，没有一点空隙，cpu 的已经在全力工作了，所有的资源都被用完了，当然还好，这还在能力范围之内，只是有点慢而已；
	• load > 1 的时候就意味着不仅仅是桥上已经被车占满了，就连桥外都被占满了，cpu 已经在全力的工作了，系统资源的用完了，但是还是有大量的进程在请求，在等待。若是这个值大于２，大于３，超过 CPU 工作能力的 2，３。而若是这个值 > 5 说明系统已经在超负荷运作了。
	
这是单个 CPU 单核的情况，而实际生活中我们需要将得到的这个值除以我们的核数来看。我们可以通过一下的命令来查看 CPU 的个数与核心数
查看cpu 核数
#查看物理CPU的个数
#cat /proc/cpuinfo |grep "physical id"|sort |uniq|wc -l
#每个cpu的核心数
cat /proc/cpuinfo |grep "physical id"|grep "0"|wc -l


通过上面的指数我们可以得知 load 的临界值为 1 ，但是在实际生活中，比较有经验的运维或者系统管理员会将临界值定为0.7。这里的指数都是除以核心数以后的值，不要混淆了
	• 若是 load < 0.7 并不会去关注他；
	• 若是 0.7< load < 1 的时候我们就需要稍微关注一下了，虽然还可以应付但是这个值已经离临界不远了；
	• 若是 load = 1 的时候我们就需要警惕了，因为这个时候已经没有更多的资源的了，已经在全力以赴了；
	• 若是 load > 5 的时候系统已经快不行了，这个时候你需要加班解决问题了
通常我们都会先看 15 分钟的值来看这个大体的趋势，然后再看 5 分钟的值对比来看是否有下降的趋势。
我们回归正题，来看 top 的第二行数据，基本上第二行是进程的一个情况统计
内容	解释
Tasks: 26 total	进程总数
1 running	1个正在运行的进程数
25 sleeping	25个睡眠的进程数
0 stopped	没有停止的进程数
0 zombie	没有僵尸进程数

来看 top 的第三行数据，这一行基本上是 CPU 的一个使用情况的统计了
内容	解释
Cpu(s): 1.0%us	用户空间占用CPU百分比
1.0% sy	内核空间占用CPU百分比
0.0%ni	用户进程空间内改变过优先级的进程占用CPU百分比
97.9%id	空闲CPU百分比
0.0%wa	等待输入输出的CPU时间百分比
0.1%hi	硬中断(Hardware IRQ)占用CPU的百分比
0.0%si	软中断(Software IRQ)占用CPU的百分比
0.0%st	(Steal time) 是当 hypervisor 服务另一个虚拟处理器的时候，虚拟 CPU 等待实际 CPU 的时间的百分比
CPU 利用率，是对一个时间段内 CPU 使用状况的统计，通过这个指标可以看出在某一个时间段内 CPU 被占用的情况，Load Average 是 CPU 的 Load，它所包含的信息不是 CPU 的使用率状况，而是在一段时间内 CPU 正在处理以及等待 CPU 处理的进程数情况统计信息，这两个指标并不一样。
来看 top 的第四行数据，这一行基本上是内存的一个使用情况的统计了
内容	解释
8176740 total	物理内存总量
8032104 used	使用的物理内存总量
144636 free	空闲内存总量
313088 buffers	用作内核缓存的内存量
注意
系统的中可用的物理内存最大值并不是 free 这个单一的值，而是 free + buffers + swap 中的 cached 的和
来看 top 的第五行数据，这一行基本上是交换区的一个使用情况的统计了
内容	解释
total	交换区总量
used	使用的交换区总量
free	空闲交换区总量
cached	缓冲的交换区总量,内存中的内容被换出到交换区，而后又被换入到内存，但使用过的交换区尚未被覆盖
在下面就是进程的一个情况了
列名	解释
PID	进程id
USER	该进程的所属用户
PR	该进程执行的优先级priority 值
NI	该进程的 nice 值
VIRT	该进程任务所使用的虚拟内存的总数
RES	该进程所使用的物理内存数，也称之为驻留内存数
SHR	该进程共享内存的大小
S	该进程进程的状态: S=sleep R=running Z=zombie
%CPU	该进程CPU的利用率
%MEM	该进程内存的利用率
TIME+	该进程活跃的总时间
COMMAND	该进程运行的名字
注意
NICE 值叫做静态优先级，是用户空间的一个优先级值，其取值范围是-20至19。这个值越小，表示进程”优先级”越高，而值越大“优先级”越低。nice值中的 -20 到 19，中 -20 优先级最高， 0 是默认的值，而 19 优先级最低
PR 值表示 Priority 值叫动态优先级，是进程在内核中实际的优先级值，进程优先级的取值范围是通过一个宏定义的，这个宏的名称是MAX_PRIO，它的值为140。Linux实际上实现了140个优先级范围，取值范围是从0-139，这个值越小，优先级越高。而这其中的 0 - 99 是实时的值，而 100 - 139 是给用户的。
其中 PR 中的 100 to 139 值部分有这么一个对应 PR = 20 + (-20 to +19)，这里的 -20 to +19 便是nice值，所以说两个虽然都是优先级，而且有千丝万缕的关系，但是他们的值，他们的作用范围并不相同
VIRT 任务所使用的虚拟内存的总数，其中包含所有的代码，数据，共享库和被换出 swap空间的页面等所占据空间的总数
在上文我们曾经说过 top 是一个前台程序，所以是一个可以交互的
常用交互命令	解释
q	退出程序
I	切换显示平均负载和启动时间的信息
P	根据CPU使用百分比大小进行排序
M	根据驻留内存大小进行排序
i	忽略闲置和僵死的进程，这是一个开关式命令
k	终止一个进程，系统提示输入 PID 及发送的信号值。一般终止进程用15信号，不能正常结束则使用9信号。安全模式下该命令被屏蔽。
好好的利用 top 能够很有效的帮助我们观察到系统的瓶颈所在，或者是系统的问题所在
ps

ps aux
ps axjf


TPGID栏写着-1的都是没有控制终端的进程，也就是守护进程
STAT表示进程的状态，而进程的状态有很多，如下表所示
状态	解释
R	Running.运行中
S	Interruptible Sleep.等待调用
D	Uninterruptible Sleep.不可终端睡眠
T	Stoped.暂停或者跟踪状态
X	Dead.即将被撤销
Z	Zombie.僵尸进程
W	Paging.内存交换
N	优先级低的进程
<	优先级高的进程
s	进程的领导者
L	锁定状态
l	多线程状态
+	前台进程


pstree
通过 pstree 可以很直接的看到相同的进程数量，最主要的还是我们可以看到所有进程的之间的相关性。




pstree -up #参数选择： #-A ：各程序树之间以 ASCII 字元來連接； #-p ：同时列出每个 process 的 PID； #-u ：同时列出每个 process 的所屬账户名称。



nice, renice
而优先级的值就是上文所提到的 PR 与 nice 来控制与体现了
而 nice 的值我们是可以通过 nice 命令来修改的，而需要注意的是 nice 值可以调整的范围是 -20 ~ 19，其中 root 有着至高无上的权力，既可以调整自己的进程也可以调整其他用户的程序，并且是所有的值都可以用，而普通用户只可以调制属于自己的进程，并且其使用的范围只能是 0 ~ 19，因为系统为了避免一般用户抢占系统资源而设置的一个限制
#这个实验在环境中无法做，因为权限不够，可以自己在本地尝试
#打开一个程序放在后台，或者用图形界面打开
nice -n -5 vim &
#用 ps 查看其优先级
ps -afxo user,ppid,pid,stat,pri,ni,time,command | grep vim
我们还可以用 renice 来修改已经存在的进程的优先级，同样因为权限的原因在实验环境中无法尝试
renice -5 pid

Pasted from <https://www.shiyanlou.com/courses/1/labs/1944/document> 


lastlog
打印/var/log/lastlog的信息


rsyslog
而 rsyslog 的配置文件有两个，一个是 /etc/rsyslog.conf 一个是 /etc/rsyslog.d/50-default.conf(not exist on centos7)
 rsyslog 结构框架:

通过这个简单的流程图我们可以知道 rsyslog 主要是由 Input、Output、Parser 这样三个模块构成的，并且了解到数据的简单走向，首先通过 Input module 来收集消息，然后将得到的消息传给 Parser module，通过分析模块的层层处理，将真正需要的消息传给 Output module，然后便输出至日志文件中
上文提到过 rsyslog 号称可以提供超过每秒一百万条消息给目标文件，怎么只是这样简单的结构。我们可以通过下图来做更深入的了解


第一个模块便是 Input，该模块的主要功能就是从各种各样的来源出收集 messages，通过一下这些接口实现
接口名	作用
im3195	RFC3195 Input Module
imfile	Text File Input Module
imgssapi	GSSAPI Syslog Input Module
imjournal	Systemd Journal Input Module
imklog	Kernel Log Input Module
imkmsg	/dev/kmsg Log Input Module
impstats	Generate Periodic Statistics of Internal Counters
imptcp	Plain TCP Syslog
imrelp	RELP Input Module
imsolaris	Solaris Input Module
imtcp	TCP Syslog Input Module
imudp	UDP Syslog Input Module
imuxsock	Unix Socket Input
而这些模块接口的使用需要通过 $ModLoad 指令来加载，那么返回上文的图中，配置生效的头两行可以看懂了，默认加载了 imklog、imuxsock 这两个模块


 
在配置中 rsyslog 支持三种配置语法格式：
	• sysklogd
	• legacy rsyslog
	• RainerScript
sysklogd 是老的简单格式，一些新的语法特性不支持。而 legacy rsyslog 是以 dollar 符($)开头的语法，在v6及以上的版本还在支持，就如上文所说的 $ModLoad 还有一些插件和特性可能只在此语法下支持。而以 $ 开头的指令是全局指令，全局指令是 rsyslogd 守护进程的配置指令，每行只能有一个指令。 RainnerScript 是最新的语法。在官网上 rsyslog 大多推荐这个语法格式来配置
老的语法格式（sysklogd & legacy rsyslog）是以行为单位。新的语法格式（RainnerScript）可以分割多行。
注释有两种语法:
	• 井号符 #
	• C-style /* .. */
执行顺序: 指令在 rsyslog.conf 文件中是从上到下的顺序执行的。
模板是 rsyslog 一个重要的属性，
它可以控制日志的格式，支持类似 template() 语句的基于 string 或 plugin 的模板，便是通过它来自定义我们的日志格式
legacy 格式使用 $template 的语法，不过这个在以后要移除，所以最好使用新格式 template():，以免未来突然不工作了也不知道为什么
模板定义的形式有四种，适用于不同的输出模块，一般简单的格式，可以使用 string 的形式，复杂的格式，建议使用 list 的形式，使用 list 的形式，可以使用一些额外的属性字段（property statement）
rsyslog 通过 Facility 的概念来定义日志消息的来源，以便对日志进行分类，Facility 的种类有：
类别	解释
kern	内核消息
user	用户信息
mail	邮件系统消息
daemon	系统服务消息
auth	认证系统
authpriv	权限系统
syslog	日志系统自身消息
cron	计划安排
news	新闻信息
local0~7	由自定义程序使用
而另外一部分 priority 也称之为 serverity level，除了日志的来源以外，对统一源产生日志消息还需要进行优先级的划分，而优先级的类别有一下几种：
类别	解释
emergency	系统已经无法使用了
alert	必须立即处理的问题
critical	很严重了
error	错误
warning	警告信息
notice	系统正常，但是比较重要
informational	正常
debug	debug的调试信息
panic	很严重但是已淘汰不常用
none	没有优先级，不记录任何日志消息

auth,authpriv.*       /var/log/auth.log
这里的意思是 auth 与 authpriv 的所有优先级的信息全都输出于 /var/log/auth.log 日志中
而其中有类似于这样的配置信息意思有细微的差别
kern.*      -/var/log/kern.log
- 代表异步写入，也就是日志写入时不需要等待系统缓存的同步，也就是日志还在内存中缓存也可以继续写入无需等待完全写入硬盘后再写入。通常用于写入数据比较大时使用。
logger
与日志相关的还有一个还有常用的命令 logger,logger 是一个 shell 命令接口，可以通过该接口使用 Syslog 的系统日志模块，还可以从命令行直接向系统日志文件写入信息。
#首先将syslog启动起来
sudo service rsyslog start
#向 syslog 写入数据
ping 127.0.0.1 | logger -it logger_test -p local3.notice &
#查看是否有数据写入
tail -f /var/log/syslog     (in centos 7, log has been wrote in /var/log/messages)

logrotate
logrotate 程序是一个日志文件管理工具。用来把旧的日志文件删除，并创建新的日志文件。我们可以根据日志文件的大小，也可以根据其天数来切割日志，来管理日志。这个过程又叫做“转储”
大多数Linux发行版使用 logrotate 或 newsyslog 对日志进行管理。logrotate 程序不但可以压缩日志文件，减少存储空间，还可以将日志发送到指定 E-mail，方便管理员及时查看日志。
显而易见，logrotate 是基于 CRON 来运行的，其脚本是 /etc/cron.daily/logrotate；同时我们可以在 /etc/logrotate 中找到其配置文件
cat /etc/logrotate

这其中的具体意思是什么呢？
# see "man logrotate" for details  //可以查看帮助文档
# rotate log files weekly
weekly                             //设置每周转储一次(daily、weekly、monthly当然可以使用这些参数每天、星期，月 )
# keep 4 weeks worth of backlogs
rotate 4                           //最多转储4次
# create new (empty) log files after rotating old ones
create                             //当转储后文件不存在时创建它
# uncomment this if you want your log files compressed
compress                          //通过gzip压缩方式转储（nocompress可以不压缩）
# RPM packages drop log rotation information into this directory
include /etc/logrotate.d           //其他日志文件的转储方式配置文件，包含在该目录下
# no packages own wtmp -- we'll rotate them here
/var/log/wtmp {                    //设置/var/log/wtmp日志文件的转储参数
    monthly                        //每月转储
    create 0664 root utmp          //转储后文件不存在时创建它，文件所有者为root，所属组为utmp，对应的权限为0664
    rotate 1                       //最多转储一次
}
当然在 /etc/logrotate.d/ 中有各项应用的 logrotate 配置，还有更多的配置参数，大家可以使用 man 查看，如按文件大小转储，按当前时间格式命名等等参数配置。
iptables
NDBTGT1-0-0-2:/root-# iptables -A INPUT -p tcp --dport 8888 -j DROP
NDBTGT1-0-0-2:/root-#  iptables -L -n --line-number                
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination         
1    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:9999
2    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:9999
3    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:8888

Chain FORWARD (policy ACCEPT)
num  target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
num  target     prot opt source               destination         
NDBTGT1-0-0-2:/root-# iptables -D INPUT 3
NDBTGT1-0-0-2:/root-# iptables -L -n
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:9999
DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:9999



ksh与bash这两个shell的区别，shell定义

我们必须要透过『 Shell 』将我们输入的命令与 Kernel 沟通，好让 Kernel 可以控制硬件来正确无误的工作！




那么目前我们的 Linux (以 CentOS 5.x 为例) 有多少我们可以使用的 shells 呢？ 你可以检查一下 /etc/shells 这个文件，至少就有底下这几个可以用的 shells：
	• /bin/sh (已经被 /bin/bash 所取代)
	• /bin/bash (就是 Linux 默认的 shell)
	• /bin/ksh (Kornshell 由 AT&T Bell lab. 发展出来的，兼容于 bash)
	• /bin/tcsh (整合 C Shell ，提供更多的功能)
	• /bin/csh (已经被 /bin/tcsh 所取代)
	• /bin/zsh (基于 ksh 发展出来的，功能更强大的 shell)


而这个登陆取得的 shell 就记录在 /etc/passwd 这个文件内！这个文件的内容是啥？
[root@www ~]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin

Pasted from <http://cn.linux.vbird.org/linux_basic/0320bash_1.php> 






 







































