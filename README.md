# 项目名称：大学校园闲置物品交易平台

## 1. 项目介绍

作为一个大学生，经常会有一些闲置的物品需要处理，物品仍有使用价值，直接扔掉有些可惜，只好寻找再次出售的途径；或许也想要买一些物品，但不需要全新的，如二手自行车等。购买出售的途径一般有两个：

1. 二手物品交易平台，如闲鱼等。但是，这种途径并不是十分非常适合大学生，本来就学业繁忙的我们需要抽出时间去寄送包裹，而且此类平台上骗子众多，买到假货后甚至无从申诉，权益可能受到损害。
2. 校内的各种闲置物品交换群（QQ，微信）：此类途径具备了一定的安全性，而且方便快捷，因为都是本校的学生线上联系后线下交易。但是仍然存在信息获取效率低下的问题，很难从几百条群消息中准确的找到自己想要的物品，自己发布的商品也可能被群消息淹没。除此之外，信息的时效性很难得到保障，看到发布的商品后，很可能那件商品已经出售，需要要麻烦卖家亲自删除消息或说明商品已卖出。

针对上述途径存在的问题，我们设计了“大学校园闲置物品交易平台”的微信小程序，使用学生验证（暂未完成）、各大学相互隔离、线下交易的方式确保**安全性**，提供线上发布、商品列表与商品详情详情展示、商品检索的功能以保障**较高的消息获取效率**，采用商品问答、商品状态自动更新的方式确保**信息的时效性**。在大学校园闲置物品交易平台中，大学生能够在**不涉及线上支付的情况下安全快捷地出售与购买二手物品**。

## 2. 各页面功能展示

### 2.1 商品列表与搜索

![commodity_list](https://github.com/2horse9sun/images/raw/master/University-O2O-img/commodity_list.png)

首页为商品列表展示界面。

首页上方显示用户所在大学与搜索框，搜索框下方为大屏轮播图（暂未完成），可用来展示商品或广告。

轮播图下方为商品分类栏，包含了大多数常用分类，用户可以浏览自己感兴趣的分类。

主体部分为商品列表展示卡片，展示商品图片、标题、简介、状态、价格及数量。列表展示采用分页加载，每次加载10条商品信息，下滑到底部后，会自动加载下面10条商品信息，直到加载完所有商品。

搜索后的商品展示与首页的展示方式类似，采用模糊搜索，查询匹配到的商品的标题。

### 2.2 商品详情页与商品问答

![commodity_detail](https://github.com/2horse9sun/images/raw/master/University-O2O-img/commodity_detail.png)

点击商品卡片后，进入商品详情界面。

界面上方为商品详情图片的轮播图，点击图片可以查看具体的图片，左右滑动查看列表中所有图片。

详情图下方为商品详情信息，包括标题、状态、价格、简介、数量、备注及原始购买链接。

详情信息下方为商品的问答区，可以在此询问卖家关于商品的问题，卖家可以在此回复用户。

![questionAndAnswer](https://github.com/2horse9sun/images/raw/master/University-O2O-img/questionAndAnswer.png)

点击提问/回复后可以发表提问/回复内容，并在问答区展示。

商品问题仍然采用分页加载模式。当问题的回复超过2条时，回复卡片将自动折叠，点击查看全部回答可以跳转至问题详情界面，采用分页加载的模式展示所有回复。

### 2.3 商品发布

![commodity_release](https://github.com/2horse9sun/images/raw/master/University-O2O-img/commodity_release.png)

点击底部Tab Bar的加号可以进入商品发布界面，上传前会进行表单验证，防止非法的数据存入数据库。上传时会让用户选择是否接受新交易推送，无论是否同意均不影响商品上传。上传成功后会自动跳转到商品列表界面，用户可以看到自己刚发布的商品。

### 2.4 发起交易与交易操作

![transaction_detail](https://github.com/2horse9sun/images/raw/master/University-O2O-img/transaction_detail.png)

点击商品详情界面的发起交易后，若商品能够被购买，则进入确认交易界面。用户可以选择商品数量（不超过库存），查看总价格，最后点击确认交易。

若商品能够被购买，则更新商品库存，有必要的话更新商品状态，生成交易详情，跳转至交易详情界面。

至此，线上的活动暂告一段落，点击查看对方联系方式，通过对方的联系方式自行进行线下交易，结束后，当双方都点击确认交易完成后，交易结束。若任一方想要中止交易，直接点击取消交易即可。进行中的交易若无人点击确认完成，将在7天后状态自动变为已完成。

### 2.5 用户信息管理

![user_info](https://github.com/2horse9sun/images/raw/master/University-O2O-img/user_info.png)

点击底部Tab Bar我的，可以进入管理界面。

点击头像/昵称/学校或在我的信息中，可以编辑个人信息，修改昵称、微信QQ联系方式与大学。

### 2.6 交易与商品管理

![transactionAndCommodityManage](https://github.com/2horse9sun/images/raw/master/University-O2O-img/transactionAndCommodityManage.png)

在“我的交易”与“我发布的商品”中，可以查看交易详情，进行交易操作，或者查看发布的商品，选择删除商品。加载方式均为分页加载。

### 2.7 新交易推送

![subscribeMsg](https://github.com/2horse9sun/images/raw/master/University-O2O-img/subscribeMsg.png)

为了提醒卖家有人购买其发布的商品，小程序加入消息推送功能。在发布商品时，会让用户选择允许接受新交易通知。点击允许后，若有人对卖家发布的商品成功发起交易，卖家便会收到消息推送，点击推送内容可直接查看交易详情，进行交易操作。

由于微信小程序对于用户隐私的保护，个人小程序的消息订阅仅是一次性的。若想再次收到交易推送，则需要在“我的”界面中点击“接受新交易推送一次”。

### 2.8 其他

其他界面包括index页、用户注册页、小程序介绍页等等，均为辅助功能，在此不再赘述。

## 3. 项目架构

下面时此项目的详细架构，对此项目感兴趣的小伙伴可以仔细阅读，如有不妥，敬请指正。

### 3.1 总体架构

![overall-design](https://github.com/2horse9sun/images/raw/master/University-O2O-img/overall-design.png)

本项目以云开发为核心，主要包括：云函数，云数据库，云存储，云调用和HTTP API（暂未完成）五个部分。除了云开发外，还有小程序端，后台管理系统（CMS），第三方服务器等部分。

云函数：

1. 接收小程序端发来的请求
2. 接收CMS通过HTTP API发来的请求（暂未完成）
3. 访问云数据库和云存储获取数据，然后发送回复
4. 使用云调用，如消息推送
5. 向第三方服务器发送请求，如用于学生验证的学校服务器（暂未完成）

云数据库：

1. 被云函数访问
2. 通过HTTP API被访问（暂未完成）

云存储：

1. 被云函数访问
2. 通过HTTP API被访问（暂未完成）

云调用：

1. 通过云函数被调用
2. 访问腾讯云服务，如消息推送

HTTP API（暂未完成）：

1. 被后台管理系统调用
2. 调用云函数，访问云数据库，云存储

小程序端：

1. 只访问云函数获取服务

后台管理系统（暂未完成）：

1. 只访问HTTP API获取服务

下面将对上述架构的每一部分进行详述。

### 3.2 云数据库表结构

![ER-modeling](https://github.com/2horse9sun/images/raw/master/University-O2O-img/ER-modeling.png)

由于项目较大，涉及到的实体较多，故先画出该项目的ER Model（为了便于展示，略去了attribute）。实体共有8个：用户，大学，商品，商品分类，商品问题，问题回复，交易，轮播图（暂未完成）。上述实体的关系如图片所示。

根据模型图，可以在云数据库中建立8张数据表，对于特定的键建立索引。本项目，除了图片以外，删除方式都是软删除，故添加`is_deleted`字段。

![cloudDB-design](https://github.com/2horse9sun/images/raw/master/University-O2O-img/cloudDB-design.png)

### 3.3 小程序端架构

![miniprogram-design](https://github.com/2horse9sun/images/raw/master/University-O2O-img/miniprogram-design.png)

小程序端共分为以下几个部分：用户模块、商品模块、交易模块、工具类、学生验证（暂未完成）、云函数统一接口、缓存管理、组件库和CSS库。

用户模块：包括用户注册、学生身份验证和用户信息管理。

商品模块：包括商品列表、商品搜索、商品详情、发布商品、商品提问、提问回复和商品管理。

交易模块：包括发起交易、交易操作和交易管理。

工具类：返回内容格式化、时间展示格式化、表单验证。

学生验证（暂未完成）：对于特点操作，访问云函数之前先验证学生身份。

云函数统一接口：将云函数返回的数据加工成合适的格式，直接供页面逻辑层使用。

缓存管理：将商品列表，用户信息，商品分类等数据缓存在本地，提高小程序性能，合适的时候清除缓存，重新访问云函数统一接口。

组件库：为了加快开发速度，专注云开发功能，本项目使用[vant-weapp组件库](https://github.com/youzan/vant-weapp)。

CSS库：为了小程序的样式更加美观，本项目使用[Color-UI库](https://github.com/weilanwl/ColorUI)。

### 3.4 云函数结构

![cloudFunc-design](https://github.com/2horse9sun/images/raw/master/University-O2O-img/cloudFunc-design.png)

本项目一共创建了10个云函数，大多与云数据库中的数据表一一对应。由于业务功能较多，所以使用`tcb-router`进行路由转发，增加服务的数量。每个云函数中的方法不再赘述，见其名就可知其意，都是基本的CURD操作。

需要说明的是：

1. `subscribeMsg`函数：使用云调用，向用户推送消息（新交易提醒）。

2. `del_trigger`函数：定时触发器，每天定时删除一定时间之前的商品、问答、交易等。
3. `transaction`函数中的发起交易、取消交易、确认交易完成，以及`commodity`函数中的删除商品，这几个操作均涉及到多个数据表的改动，为了保障ACID(atomic, consistency, isolation, durable)，都应采用数据库事务去完成数据库的操作。

### 3.5 云存储结构

![cloudStorage-design](https://github.com/2horse9sun/images/raw/master/University-O2O-img/cloudStorage-design.png)

云存储中主要存放商品的缩略图和详情图的`fileIDs`、小程序背景图片及轮播图（暂未完成）。

### 3.6 云调用

![cloudCall-design](https://github.com/2horse9sun/images/raw/master/University-O2O-img/cloudCall-design.png)

本项目的云调用主要是实现消息推送的功能，先在小程序端获取卖家的授权，然后由买家触发推送消息的云函数。

### 3.7 HTTP API，后台管理及第三方服务器（暂未完成）

由于参加比赛时间较晚，再加上临近开学，时间仓促，故无法完成该平台后台管理系统的搭建。待时间允许，将考虑建立后台管理系统，方便快捷地管理商品、用户、交易、轮播图的数据，通过HTTP API访问云函数，复用写好的方法，或者直接访问云数据库和云存储。

关于第三方服务器的学生验证功能，暂时还无法实现。

## 4. 体验二维码

由于该项目涉及到信息发布内容且是个人开发，故无法上线，只有体验版。

希望日后能争取上线投入使用吧。

## 5. 部署教程

### 5.1 在开发者工具中新建项目

打开微信开发者工具，添加小程序项目，选择合适的文件夹，使用自己的APP ID，勾选云开发服务，新建项目。

### 5.2 下载代码

进入到项目目录中删除所有文件，使用如下命令将代码下载到本地：

```bash
git clone https://github.com/2horse9sun/University_O2O.git
```
把University_O2O文件夹中文件剪切到小程序项目根目录，删除University_O2O空文件夹
### 5.3 初始化云环境并修改参数

点击开发者工具的云开发，启用云服务。新建自己的云环境，复制云环境ID，**然后把`app.js`和所有`cloudfunctions`文件夹**下所有云函数的`index.js`中的：

```javascript
cloud.init({
  env: "dreamland2-a708ef" // !!!!!!替换成自己的云环境ID !!!!!  是ID，不是云环境名称
})
```

的`env`的值替换成自己的云环境ID。**此处很容易漏掉`app.js`中的云环境ID配置！**

右击`cloudfunctions`，选择当前云环境。

分别右击`category, commodity, commodity_question, commodity_answer, swiper, transaction, university, user`云函数，选择在终端打开，输入如下命令安装依赖：

```bash
npm install --save tcb-router
```

### 5.4 云数据库初始化

打开 云开发->数据库->集合名称 建立8张数据表：`category, commodity, commodity_question, commodity_answer, swiper, transaction, university, user`

导入`resources`文件夹下相应`json`文件到指定数据库。

### 5.5 上传云存储

在 云开发控制台->存储 中新建`bg-image`文件夹，将`resources`文件夹下的图片上传至云存储中。

复制`index-bg.jpg`的下载地址，替换下面文件的`url`中的值

路径：`miniprogram/pages/index/index.wxss`

```CSS
page{
  background-image: url(https://6472-dreamland2-a708ef-1259161827.tcb.qcloud.la/bg-image/index-bg.jpg?sign=5a34df13fbf53f7faba83afa148618a4&t=1599392559);
  background-repeat:no-repeat;
  background-size:100% 100%;
  -moz-background-size:100% 100%;
}

```

复制`wave.gif`的下载地址，替换下面文件第二个`image src`的值

路径：`miniprogram/pages/home/home.wxml`

```html
<view class="UCenter-bg">
    <image src="{{userAvatarUrl}}" class="png round" mode="widthFix" bindtap="onEnterHomeUserInfo"></image>
    <view class="text-xl margin-top" bindtap="onEnterHomeUserInfo">{{userName}}
    </view>
    <view class="margin-top-sm" bindtap="onEnterHomeUserInfo">
        <text>{{universityName}}</text>
    </view>
    <image src="cloud://dreamland2-a708ef.6472-dreamland2-a708ef-1259161827/bg-image/wave.gif" mode="scaleToFill" class="gif-wave"></image>
</view>
```

复制`home-bg.jpg`的下载地址，替换下面文件的`url`中的值

路径：`miniprogram/pages/home/home.wxss`

```javascript
.UCenter-bg {
  background-image: url(https://6472-dreamland2-a708ef-1259161827.tcb.qcloud.la/bg-image/home-bg.jpg?sign=22e94e92ece78774590d786e3bdaf35f&t=1599313333);
  background-size: cover;
............
}
```

### 5.6 部署云函数

在`cloudfunctions`下右击每个云函数，点击 上传并部署：云端安装依赖。

### 5.7 运行项目

点击编译，运行项目。

## 6. 开源许可证

GPL许可证

