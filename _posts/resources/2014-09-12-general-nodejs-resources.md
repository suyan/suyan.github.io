---
layout: post
title: NodeJs 常用资源
category: 资源
tags: NodeJs
keywords: NodeJs
description: 
---

# 安装

## 安装nvm

    #为了方便管理这里推荐使用nvm来安装nodejs。
    git clone <a href="https://github.com/creationix/nvm.git" target="_blank" rel="nofollow">https://github.com/creationix/nvm.git</a> ~/.nvm

### 启用nvm

    $ source ~/.nvm/nvm.sh

### 安装最新nodejs，当前是0.11.13

    $ nvm install v0.11.13
    $ nvm use v0.11.13
    #把 $HOME/.nvm/current 目录添加到环境变量 PATH 中去

### 正常使用

    $ node --version
    v0.11.13

### 安装jshint用于js错误检查

    npm install jshint -g

### 保存下面的代码到~/.jshintrc

    {
      <span class="hljs-string">"asi"</span>      : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"boss"</span>     : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"eqeqeq"</span>   : <span class="hljs-literal">false</span>,
      <span class="hljs-string">"eqnull"</span>   : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"es3"</span>      : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"expr"</span>     : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"latedef"</span>  : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"laxbreak"</span> : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"nonbsp"</span>   : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"strict"</span>   : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"undef"</span>    : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"unused"</span>   : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"browser"</span>  : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"devel"</span>    : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"jquery"</span>   : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"node"</span>     : <span class="hljs-literal">true</span>,
      <span class="hljs-string">"indent"</span>   : <span class="hljs-number">2</span>,
      <span class="hljs-string">"predef"</span>   : [<span class="hljs-string">"avalon"</span>]
    }

### 安装jscs用于js代码风格检查

    npm install jscs -g

### 保存下面的代码到~/.jscsrc

    {
      "disallowEmptyBlocks": true,
      "disallowKeywords": ["with"],
      "disallowKeywordsOnNewLine": ["else"],
      "disallowMixedSpacesAndTabs": true,
      "disallowMultipleLineStrings": true,
      "disallowNewlineBeforeBlockStatements": true,
      "disallowQuotedKeysInObjects": "allButReserved",
      "disallowSpaceAfterPrefixUnaryOperators": ["++", "--", "+", "-", "~", "!"],
      "disallowSpaceAfterObjectKeys": true,
      "disallowSpaceBeforeBinaryOperators": [","],
      "disallowSpaceBeforePostfixUnaryOperators": ["++", "--"],
      "disallowSpacesInNamedFunctionExpression": { "beforeOpeningRoundBrace": true },
      "disallowSpacesInsideArrayBrackets": true,
      "disallowSpacesInsideParentheses": true,
      "disallowSpacesInsideObjectBrackets": "all",
      "disallowSpacesInsideArrayBrackets": "all",
      "disallowTrailingComma": true,
      "disallowTrailingWhitespace": true,
      "disallowYodaConditions": true,
      "requireCapitalizedConstructors": true,
      "requireCommaBeforeLineBreak": true,
      "requireDotNotation": true,
      "requireLineFeedAtFileEnd": true,
      "requireParenthesesAroundIIFE": true,
      "requireSpaceAfterBinaryOperators": ["+", "-", "/", "*", "=", "==", "===", "!=", "!==", "&gt;", "&lt;", "&gt;=", "&lt;="],
      "requireSpaceAfterKeywords": ["if", "else", "for", "while", "do", "switch", "return", "try", "catch"],
      "requireSpaceBeforeBinaryOperators": ["+", "-", "/", "*", "=", "==", "===", "!=", "!==", "&gt;", "&lt;", "&gt;=", "&lt;="],
      "requireSpacesInAnonymousFunctionExpression": { "beforeOpeningCurlyBrace": true, "beforeOpeningRoundBrace": true },
      "requireSpacesInConditionalExpression": true,
      "requireSpacesInFunctionDeclaration": { "beforeOpeningCurlyBrace": true },
      "requireSpacesInFunctionExpression": { "beforeOpeningCurlyBrace": true },
      "requireSpacesInNamedFunctionExpression": { "beforeOpeningCurlyBrace": true },
      "requireSpacesInsideObjectBrackets": "allButNested",
      "safeContextKeyword": ["self"],
      "validateIndentation": 2,
      "validateLineBreaks": "LF",
      "validateQuoteMarks": "'"
    }

#  使用
## 创建一个 demo.js

    var a = 1;
    b=2;
    if(true){
    };
    fun1()

### 检查结果：

    $ jshint demo.js
    demo.js: line 4, col 2, Unnecessary semicolon.
    demo.js: line 2, col 1, 'b' is not defined.
    demo.js: line 5, col 1, 'fun1' is not defined.
    demo.js: line 1, col 5, 'a' is defined but never used.
     
    $ jscs demo.js                               [7/61]
    Operator = should not stick to following expression at demo.js :
         1 |var a = 1;
         2 |b=2;
    ---------^
         3 |if(true){
         4 |};
    Operator = should not stick to following expression at demo.js :
         1 |var a = 1;
         2 |b=2;
    ---------^
         3 |if(true){
         4 |};
    Should be one space instead of 0, after "if" keyword at demo.js :
         1 |var a = 1;
         2 |b=2;
         3 |if(true){
    ----------^
         4 |};
         5 |fun1()
    Empty block found at demo.js :
         2 |b=2;
         3 |if(true){
         4 |};
    ---------^
         5 |fun1()
         6 |
    4 code style errors found. 