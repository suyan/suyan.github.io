---
layout: post
title: Installing Cassandra Jmeter and its configuration for mac
category: Technologies
tags: Cassandra Jmeter
description: Installing Cassandra Jmeter and its configuration for mac
---

### Installing Cassandra Jmeter on mac

This page is trying to record the steps to correctly install Jmeter for Cassandra.

### Download Jmeter using homebrew
  Open terminal, then use below command (Assume you have homebrew installed on your machine):

    brew install jmeter

### Download [Jmeter for Cassandra](https://github.com/slowenthal/jmeter-cassandra) plugin

  Then unzip file, copy all the jar files to lib of your jmeter. e.g. /usr/local/Cellar/jmeter/2.13/libexec/lib

### Start Jmeter
  Command:

    jmeter

  If you want to increase certain memory for your jmeter, e.g. 4G.

  Command:

    JVM_ARGS="-Xms4096m -Xmx4096m" jmeter

### Verify installation
  Right Click Test plan -> Add -> Config Element -> Cassandra Connection

  If you can see the Cassandra Connection shows up, then your Jmeter has been correctly installed! Enjoy!
