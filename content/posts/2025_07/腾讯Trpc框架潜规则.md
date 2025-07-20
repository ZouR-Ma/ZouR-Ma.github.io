# 腾讯Trpc框架潜规则

date: 2025-07-01
tags: [后端, Trpc, 腾讯, Go]

最近工作中用到了腾讯的trpc框架，发现网上教程相对较少，而且Trpc的官方文档相对简单，所以变有了下面的内容用于，记录一些常见并默认的点（俗称：潜规则）。
以下文档均根据Trpc-go框架进行讨论，如有错误，请指正，保持开放心态。持续更新...

如果你第一次接触Trpc，请你根据官网文档实践一遍，再看本文章可能收获更大。

## 关于配置
根据文档[Trpc-go框架配置文档](https://github.com/trpc-group/trpc-go/blob/main/docs/user_guide/framework_conf.zh_CN.md)，我们可以总结出，一级配置有四类，即global，server，client，plugins。

### server&client
- server作为一级配置，其network，protocol字段可以选填，但是当你存在service的二级配置时，你需要注意，二级的service不填network，protocol字段，使用的是一级service的配置，如果二级配置service和一级配置server都不填，那么框架就会报错。但是如果你二级配置service填写了相应字段则优先使用二级配置service内的字段。**相同的规则也可以应用在一级配置client上。**

- filter作为server和client都有的二级字段，有个相当不成文的规定，就是你填入的拦截器配置顺序，就是你实际执行是的顺序，记住是**执行时的顺序**，而加载时的顺序由插件本身依赖顺序初始化，见[插件初始化文档](https://github.com/trpc-group/trpc-go/blob/main/plugin/README.zh_CN.md)

