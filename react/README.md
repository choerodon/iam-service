# @choerodon/iam

IAM 是 Choerodon 的核心前端服务之一。该服务主要负责 Choerodon 平台中的基础功能，包括用户，角色，权限，组织，项目，密码策略，客户端，菜单，并支持通过ldap导入第三方用户。

基础模块包含3个层级，具体如下：

## 项目层：

* 项目设置
    * 项目角色分配
    * 项目信息

## 组织层：

* 组织设置
    * 项目管理
    * 用户管理
    * 组织角色分配
    * 客户端    
    * LDAP    
    * 密码策略
    * 组织信息
* 应用管理
    * 应用

## 全局层：

* 平台设置
    * 组织管理
    * 角色标签
    * 角色管理
    * 平台角色分配
    * ROOT 用户设置
    * 菜单配置
    * 仪表盘配置
    * 项目类型
    * 系统配置
* 个人中心
    * 个人信息
    * 修改密码
    * 权限信息
    * 授权信息
    
   
## 目录结构

`assets` 存放`css` 文件和`images`
`common` 存放通用配置
`components` 存放公共组件
`containers` 存放前端页面
`dashboard` 存放仪表盘
`guide` 存放新手指引
`locale` 存放多语言文件
`stores` 存放前端页面需要的store

## 依赖

* Node environment (6.9.0+)
* Git environment
* [@choerodon/boot](https://github.com/choerodon/choerodon-front-boot)
* [@choerodon/master](https://github.com/choerodon/choerodon-front-master)

## 运行

``` bash
npm install
npm start
```

启动后，打开 http://localhost:9090

## 相关技术文档

* [React](https://reactjs.org)
* [Mobx](https://github.com/mobxjs/mobx)
* [webpack](https://webpack.docschina.org)
* [gulp](https://gulpjs.com)
