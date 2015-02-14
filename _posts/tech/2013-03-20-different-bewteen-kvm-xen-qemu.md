---
layout: post
title: 虚拟化与云计算中KVM,Xen,Qemu的区别和联系
category: 技术
tags: Virtualization
description: 在做云计算和虚拟化时，经常要涉及到KVM,Xen,Qemu等，这些到底是什么区别？以前不太了解，最近找了个时间详细总结了一下
---
## 虚拟化类型

### 全虚拟化（Full Virtualization)
全虚拟化也成为原始虚拟化技术，该模型使用虚拟机协调guest操作系统和原始硬件，VMM在guest操作系统和裸硬件之间用于工作协调，一些受保护指令必须由Hypervisor（虚拟机管理程序）来捕获处理。

<center>
    <img src="http://7u2ho6.com1.z0.glb.clouddn.com/tech-full-virtualization.gif" alt="全虚拟化模型">
    <br>图1 全虚拟化模型
</center>

全虚拟化的运行速度要快于硬件模拟，但是性能方面不如裸机，因为Hypervisor需要占用一些资源

### 半虚拟化（Para Virtualization）
半虚拟化是另一种类似于全虚拟化的技术，它使用Hypervisor分享存取底层的硬件，但是它的guest操作系统集成了虚拟化方面的代码。该方法无需重新编译或引起陷阱，因为操作系统自身能够与虚拟进程进行很好的协作。

<center>
    <img src="http://7u2ho6.com1.z0.glb.clouddn.com/tech-para-virtualization.gif" alt="半虚拟化模型">
    <br>图2 半虚拟化模型
</center>

半虚拟化需要guest操作系统做一些修改，使guest操作系统意识到自己是处于虚拟化环境的，但是半虚拟化提供了与原操作系统相近的性能。

## 虚拟化技术

### KVM(Kernel-based Virtual Machine)基于内核的虚拟机
KVM是集成到Linux内核的Hypervisor，是X86架构且硬件支持虚拟化技术（Intel VT或AMD-V）的Linux的全虚拟化解决方案。它是Linux的一个很小的模块，利用Linux做大量的事，如任务调度、内存管理与硬件设备交互等。

<center>
    <img src="http://7u2ho6.com1.z0.glb.clouddn.com/tech-kvm-architecture.jpg" alt="KVM虚拟化平台架构">
    <br>图3 KVM虚拟化平台架构
</center>

### Xen
Xen是第一类运行再裸机上的虚拟化管理程序(Hypervisor)。它支持全虚拟化和半虚拟化,Xen支持hypervisor和虚拟机互相通讯，而且提供在所有Linux版本上的免费产品，包括Red Hat Enterprise Linux和SUSE Linux Enterprise Server。Xen最重要的优势在于半虚拟化，此外未经修改的操作系统也可以直接在xen上运行(如Windows)，能让虚拟机有效运行而不需要仿真，因此虚拟机能感知到hypervisor，而不需要模拟虚拟硬件，从而能实现高性能。

<center>
    <img src="http://7u2ho6.com1.z0.glb.clouddn.com/tech-xen-architecture.jpg" alt="Xen虚拟化平台架构">
    <br>图4 Xen虚拟化平台架构
</center>

### QEMU
QEMU是一套由Fabrice Bellard所编写的模拟处理器的自由软件。它与Bochs，PearPC近似，但其具有某些后两者所不具备的特性，如高速度及跨平台的特性。经由kqemu这个开源的加速器，QEMU能模拟至接近真实电脑的速度。


### KVM和QEMU的关系
准确来说，KVM是Linux kernel的一个模块。可以用命令modprobe去加载KVM模块。加载了模块后，才能进一步通过其他工具创建虚拟机。但仅有KVM模块是 远远不够的，因为用户无法直接控制内核模块去作事情,你还必须有一个运行在用户空间的工具才行。这个用户空间的工具，kvm开发者选择了已经成型的开源虚拟化软件 QEMU。说起来QEMU也是一个虚拟化软件。它的特点是可虚拟不同的CPU。比如说在x86的CPU上可虚拟一个Power的CPU，并可利用它编译出可运行在Power上的程序。KVM使用了QEMU的一部分，并稍加改造，就成了可控制KVM的用户空间工具了。所以你会看到，官方提供的KVM下载有两大部分(qemu和kvm)三个文件(KVM模块、QEMU工具以及二者的合集)。也就是说，你可以只升级KVM模块，也可以只升级QEMU工具。这就是KVM和QEMU 的关系。

<center>
    <img src="http://7u2ho6.com1.z0.glb.clouddn.com/tech-kvm-and-qemu.png" alt="Xen虚拟化平台架构">
    <br>图5 KVM和QEMU关系
</center>
