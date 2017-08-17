# 声明

『知乎』是 知乎. Inc 的注册商标。本软件与其代码非由知乎创作或维护。软件中所包含的信息与内容皆违反版权与知乎用户协议。本项目所有文字图片等稿件内容均由知乎提供，获取与共享之行为或有侵犯知乎权益的嫌疑。若被告知需停止共享与使用，本人会及时删除整个项目。请您了解相关情况，并遵守知乎协议。

# 前言

出于对知乎日报的喜爱，做了一个vue版本的高仿知乎日报。

## 技术栈

vue2.x + vuex + vue-router + axios + ES6 + sass + localStorage

## 知乎日报API 数据接口

参考: [http://blog.csdn.net/fanpeihua123/article/details/51210499](http://blog.csdn.net/fanpeihua123/article/details/51210499)

## meta标签大全

参考：[http://blog.csdn.net/kongjiea/article/details/17092413](http://blog.csdn.net/kongjiea/article/details/17092413)

## 项目运行

```
git clone https://github.com/zhijiang3/vue-zhihu-daily.git

cd vue2-zhihu-daily

# 安装依赖文件
npm install

# 启动项目
npm run dev
```

# 遇到的问题汇总

1. 代理服务器后，请求到的图片不显示的问题；解决办法：在 &lt;head&gt; 中添加 &lt;meta name="referrer" content="never"&gt;

2. 动画效果很卡；解决办法：利用 will-change 或 transform 属性的一些3d方法，调起硬件加速，如：transform: translate3d(0, 0, 0); will-change: transform;

3. 因为针对轮播和刷新添加touch事件，轮播和下拉刷新冲突了，在下拉刷新时，轮播会暂停；这里没解决，建议touch事件加在document上，利用e.target判断是否是需要的节点

# 目标功能
- [x] 内容最底部的合集 —— √
- [x] 日间/夜间模式 —— √
- [x] 无图模式(内容不加载图片) —— √
- [x] 滚动到底部自动加载数据 —— √
- [x] 首页顶部的标题跟随栏目标题 —— √
- [ ] 离线下载 —— √，图片部分能加载，一部分需要联网（不消耗流量）才能查看
- [x] 双击主页标题可回到顶部 —— √
- [x] 轮播图效果 —— √ 和下拉刷新有冲突，在下拉刷新时，轮播会暂停
- [x] 下拉刷新 —— √ 和banner有冲突，在下拉刷新时，轮播会暂停
- [x] 点击评论里省略的回复可以展开或收回 —— √
- [x] 收藏文章功能(不用登陆，存储在localStorage) —— √
- [ ] 分享 —— 待定
- [ ] 内容点击图片放大 —— 待定
- [ ] 子栏目过渡动画 —— 待定

# 未实现功能

## 由于以下功能没有提供 API 所以没法做的

- [ ] 登陆
- [ ] 消息功能
- [ ] 点赞/评论点赞
- [ ] 回复和评论功能

# 部分截图

### 栏目1

![](图片地址1)

#项目布局

```
├─build                 webpack配置文件
├─config                项目配置
├─src                   源码目录
│  ├─api                api接口
│  │  └─news.js         新闻的api接口
│  ├─common             公共组件
│  │  ├─fonts           字体
│  │  ├─js              脚本
│  │  └─scss            样式
│  ├─components         组件文件夹
│  │  ├─banner          轮播图组件
│  │  ├─column          栏目组件
│  │  ├─commentitem     单个评论组件
│  │  ├─item            单个列表组件
│  │  ├─menulist        菜单列表组件
│  │  ├─navigation      导航组件
│  │  ├─news            新闻组件
│  │  ├─refresh         刷新组件
│  │  └─sidebar         侧边栏组件
│  ├─router             路由文件夹
│  │  └─index.js        配置路由
│  ├─store              vuex状态管理
│  │  └─index.js        创建store
│  ├─views              视图文件夹
│  │  ├─collection      查看收藏的内容视图
│  │  ├─comment         评论视图
│  │  ├─detail          详情页视图
│  │  ├─index           主页视图
│  │  ├─option          设置选项视图
│  │  └─section         栏目(合集)视图
│  ├─App.vue            挂载入口
│  └─main.js            vue实例生成与挂载
├─static                静态资源
├─index.html            网页入口
```
