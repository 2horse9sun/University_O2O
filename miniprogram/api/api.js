// 云函数和云调用的统一接口，类似于发送http的GET和POST请求
// 都是异步方法，在小程序端调用时需使用async-await关键字
const api = {
  // 从云数据库中获取用户信息
  getUserInfoFromDB(){
    return wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'getUserInfo',
      }
    })
  },
  
  // 上传用户信息
  // params = {
  //   uid number NOT NULL// 大学的编号
  //   name string NOT NULL// 昵称
  //   sex int NOT NULL// 性别：0为女生，1为男生，2为保密
  //   date_of_birth string NOT NULL// 出生日期，格式：yyyy-MM-dd
  //   avatar_url string NOT NULL// 用户微信头像地址，可从wx.getSetting()获取
  //   contact_info_qq string// QQ联系方式
  //   contact_info_wx string// WX联系方式
  // }
  setUserInfo(params){
    return wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'setUserInfo',
        params
      }
    })
  },

  // 更新用户信息
  // params中的键值是上传用户信息时params的子集
  updateUserInfo(params){
    return wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'updateUserInfo',
        params
      }
    })
  },

  // 验证学生身份
  // TODO: 如何验证学生身份？
  studentIdAuth(){
    return wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'studentIdAuth',
      }
    })
  },

  // 获取商品分类信息
  // 若所得分类的parent_id为空，则说明此分类为root
  // 若parent_id不为空，说明此分类为子分类，它上一级分类的_id就是parent_id
  getCommodityCategory(){
    return wx.cloud.callFunction({
      name: 'category',
      data: {
        $url: 'getCommodityCategory',
      }
    })
  },

  // 获取轮播图路径
  getSwiperImg(){
    return wx.cloud.callFunction({
      name: 'swiper',
      data: {
        $url: 'getSwiperImg',
      }
    })
  },

  // 获取商品列表，使用分页查询
  // params = {
  //   keyword string// 关键字搜索， 若关键字为空，则为默认搜索
  //   start number NOT NULL// 从第start条数据开始获取，用于分页查询
  //   count number NOT NULL// 获取数据的条数
  //   is_mine boolean NOT NULL// 是否只搜索自己发布的商品
  // }
  getCommodityList(params){
    return wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'getCommodityList',
        params
      }
    })
  },

  // 获取商品详细信息
  // params = {
  //   id string NOT NULL // 商品的_id
  // }
  getCommodityDetail(params){
    return wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'getCommodityDetail',
        params
      }
    })
  },

  // 上传商品详细信息
  // params = {
  //   thumbnail_url array NOT NULL// 商品缩略图的fileID
  //   img_url array NOT NULL // 商品详情图片的fileID
  //   category_id string NOT NULL // 商品分类的_id
  //   content string NOT NULL // 商品的详情介绍，应当放在text标签内才能显示换行
  //   title string NOT NULL // 商品的标题
  //   number number NOT NULL // 商品数量
  //   origin_url string // 初次购买商品的链接
  //   price_origin number // 初次购买商品的价格
  //   price_now number NOT NULL // 现价
  // }
  setCommodityDetail(params){
    return wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'setCommodityDetail',
        params
      }
    })
  },

  // 删除商品(soft-del)
  // params = {
  //   id string NOT NULL // 删除商品的_id
  // }
  delCommodity(params){
    return wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'delCommodity',
        params
      }
    })
  },

  // 上传图片并返回fileID
  // params = {
  //   thumbnailInfo array NOT NULL // 使用lin-ui组件库的image-picker，选中缩略图的信息
  //   commodityImgInfo array NOT NULL // 使用lin-ui组件库的image-picker，选中详情图的信息
  // }
  // 上传完成后，会返回数组fileIDs，数组第1个元素为缩略图的fileID， 剩余元素为详情图的fileID
  // 需要把fileID存储到数据库中
  async uploadImgAndGetFileID(params){
    const {thumbnailInfo, commodityImgInfo} = params
    console.log({thumbnailInfo, commodityImgInfo})
    let fileIDs = []
    let path = thumbnailInfo[0].url
    let suffix = /\.\w+$/.exec(path)[0]
    let resUploadImg = await this.uploadImg(path, suffix)
    fileIDs = fileIDs.concat(resUploadImg.fileID)
    for (let i = 0, len = commodityImgInfo.length; i < len; i++) {
      path = commodityImgInfo[i].url
      suffix = /\.\w+$/.exec(path)[0]
      resUploadImg = await this.uploadImg(path, suffix)
      fileIDs = fileIDs.concat(resUploadImg.fileID)
    }

    return fileIDs

  },

  // 上传图片，不直接调用
  uploadImg(path, suffix){
    return wx.cloud.uploadFile({
      cloudPath: 'commodity/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
      filePath: path
    })
  },

  

  // 获取对商品的提问
  // params = {
  //   commodity_id string NOT NULL // 商品的_id
  //   start number NOT NULL
  //   count number NOT NULL
  // }
  getCommodityQuestion(params){
    return wx.cloud.callFunction({
      name: 'commodity_question',
      data: {
        $url: 'getCommodityQuestion',
        params
      }
    })
  },

  // 上传对商品的提问
  // params = {
  //   commodity_id string NOT NULL // 商品的_id
  //   content string NOT NULL // 提问内容
  // }
  setCommodityQuestion(params){
    return wx.cloud.callFunction({
      name: 'commodity_question',
      data: {
        $url: 'setCommodityQuestion',
        params
      }
    })
  },

  // 获取对问题的回答
  // params = {
  //   question_id string NOT NULL // 问题的_id
  //   start number NOT NULL
  //   count number NOT NULL
  // }
  getCommodityAnswer(params){
    return wx.cloud.callFunction({
      name: 'commodity_answer',
      data: {
        $url: 'getCommodityAnswer',
        params
      }
    })
  },

  // 上传对问题的回答
  // params = {
  //   question_id string NOT NULL // 问题的_id
  //   content string NOT NULL // 回答内容
  // }
  setCommodityAnswer(params){
    return wx.cloud.callFunction({
      name: 'commodity_answer',
      data: {
        $url: 'setCommodityAnswer',
        params
      }
    })
  },

  // 上传交易信息
  // const params = {
  //   commodity_id string NOT NULL // 购买的商品_id
  //   number number NOT NULL // 购买数量
  //   price_origin number NOT NULL // 折扣或减价前的价格
  //   price_now number NOT NULL // 折扣或减价后的价格
  //   total_price number NOT NULL // 实际价格，加上手续费
  //   transaction_no string NOT NULL // 按某种规则生成交易编号
  // }
  setTransaction(params){
    return wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'setTransaction',
        params
      }
    })
  },

  // 获取关于自己的交易列表
  // params = {
  //   start number NOT NULL
  //   count number NOT NULL
  // }
  getTransactionList(params){
    return wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'getTransactionList',
        params
      }
    })
  },

  // 删除交易(soft-del)
  // params = {
  //   id string NOT NULL // 交易_id
  // }
  delTransaction(params){
    return wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'delTransaction',
        params
      }
    })
  },

}

module.exports = api