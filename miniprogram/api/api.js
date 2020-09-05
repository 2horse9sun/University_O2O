const {RespSuccess, RespError} = require('../utils/resp')
let res = {}
// 云函数和云调用的统一接口，类似于发送http的GET和POST请求
// 都是异步方法，在小程序端调用时需使用async-await关键字
const api = {
  // 从云数据库中获取用户信息
  getUserInfoFromDB(){
    return wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'getUserInfoFromDB',
      }
    })
  },

  // 获取此用户信息和大学信息
  async getMyInfoAndMyUniversityInfo(){
      res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          $url: 'getMyInfoAndMyUniversityInfo',
        }
      })
      if(res.result.errno == -1){
        console.log("调用云数据库获取我的信息和我的大学信息错误！")
        return new RespError("调用云数据库获取我的信息和我的大学信息错误！")
      }
      res = res.result
      if(res.list.length == 0){
        console.log("用户信息不在云数据库中！")
        return new RespError("用户信息不在云数据库中！")
      }
      res.list[0].universityInfo = res.list[0].universityInfo[0]
      res.list = res.list[0]
      const myInfoAndMyUniversityInfo = res.list
      return new RespSuccess(myInfoAndMyUniversityInfo)
  },

  async getUserInfoFromDbByUserId(params){
    res = await wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'getUserInfoFromDbByUserId',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取用户信息失败！")
      return new RespError("获取用户信息失败！")
    }
    const userInfo = res.result.data[0]
    console.log({"获取用户信息成功！": userInfo})
    return new RespSuccess(userInfo)

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
  async setMyInfo(params){
    res = await wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'setMyInfo',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("上传用户信息失败！")
      return new RespError("上传用户信息失败！")
    }else{
      console.log("上传用户信息成功！")
      return new RespSuccess()
    }
  },

  async updateMyInfo(params){
    res = await wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'updateMyInfo',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("更新数据库失败！")
      return new RespError("更新数据库失败！")
    }else{
      console.log({"更新数据库成功！": params})
      return new RespSuccess()
    }
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

  // 从云数据库中获取大学信息
  async getUniversityInfo(){
    res = await wx.cloud.callFunction({
      name: 'university',
      data: {
        $url: 'getUniversityInfo',
      }
    })
    if(res.result.errno == -1){
      console.log("获取大学信息失败！")
      return new RespError("获取大学信息失败！")
    }
    const universityInfo = res.result.data
    console.log({"获取大学信息成功！": universityInfo})
    return new RespSuccess(universityInfo)
  },

  // 从云数据库中获取大学信息
  getUniversityInfoByUid(params){
    return wx.cloud.callFunction({
      name: 'university',
      data: {
        $url: 'getUniversityInfoByUid',
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
  async getCommodityCategory(){

    res = await wx.cloud.callFunction({
      name: 'category',
      data: {
        $url: 'getCommodityCategory',
      }
    })
    if(res.result.errno == -1){
      console.log("获取商品分类信息失败！")
      return new RespError("获取商品分类信息失败！")
    }
    const commodityCategory = res.result.data
    console.log({"获取商品分类信息成功":commodityCategory})
    return new RespSuccess(commodityCategory)
    
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
  async getCommodityListByUidAndCid(params){
    res = await wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'getCommodityListByUidAndCid',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取商品列表失败！")
      return new RespError("获取商品列表失败！")
    }
    const commodityList = res.result.data
    console.log({"获取商品列表成功":commodityList})
    return new RespSuccess(commodityList)

  },

  async getCommodityDetail(params){
    res = await wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'getCommodityDetail',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取商品详情失败！")
      return new RespError("获取商品详情失败！")
    }
    if(res.result.data.length == 0){
      console.log("商品不存在！")
      return new RespError("商品不存在！")
    }
    const commodityDetail = res.result.data[0]
    console.log({"获取商品详情成功":commodityDetail})
    return new RespSuccess(commodityDetail)

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
  async setCommodityDetail(params){
    res = await wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'setCommodityDetail',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("上传商品信息失败！")
      return new RespError("上传商品信息失败！")
    }else{
      console.log("上传商品信息成功！")
      return new RespSuccess()
    }
  },


  // 删除商品(soft-del)
  // 需要获取与商品相关的问题，回答，交易的主键，以及图片的fileIDs
  async delCommodity(params){
    const {commodity_id} = params
    const cid = commodity_id

    // 获取图片
    res = await this.getCommodityDetail({id: commodity_id})
    if(res.errno == -1){
      return
    }
    const fileIDs = res.data.img_url.concat(res.data.thumbnail_url)
    console.log(fileIDs)

    // 获取问题
    res = await wx.cloud.callFunction({
      name: 'commodity_question',
      data: {
        $url: 'getCommodityQuestionByCidAll',
       params
      }
    })
    if(res.result.errno == -1){
      return
    }
    const commodityQuestion = res.result.data
    const qids = commodityQuestion.map(function(item){
      return item._id
    })
    console.log(qids)

    // 获取回答
    res = await wx.cloud.callFunction({
      name: 'commodity_answer',
      data: {
        $url: 'getCommodityAnswerByCidAll',
        params
      }
    })
    if(res.result.errno == -1){
      return
    }
    const commodityAnswer = res.result.data
    const aids = commodityAnswer.map(function(item){
      return item._id
    })
    console.log(aids)

    // 获取交易
    res = await wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'getTransactionByCidAll',
        params
      }
    })
    if(res.result.errno == -1){
      return
    }
    const commodityTransaction = res.result.data
    const tids = commodityTransaction.map(function(item){
      return item._id
    })
    console.log(tids)
    params = {
      cid,
      qids,
      aids,
      tids,
      fileIDs
    }
    console.log(params)

    res = await wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'delCommodity',
        params
      }
    })

    if(res.result.errno == -1){
      console.log("删除商品失败！")
      return new RespError("删除商品失败！")
    }else if(res.result.errno == -2){
      console.log("商品还有未完成的交易")
      return new RespError("商品还有未完成的交易")
    }
    console.log("删除商品成功！")
    return new RespSuccess()
    
  },

  // 上传图片并返回fileID
  // 上传完成后，会返回数组fileIDs，数组第1个元素为缩略图的fileID， 剩余元素为详情图的fileID
  // 需要把fileID存储到数据库中
  async uploadImgAndGetFileID(params){
    const {thumbnail, commodityImg} = params
    console.log({thumbnail, commodityImg})
    let fileIDs = []
    let path = thumbnail[0]
    let suffix = /\.\w+$/.exec(path)[0]
    res = await this.uploadImg(path, suffix)
    if(res.errno == -1){
      console.log("上传缩略图到云存储失败！")
      return new RespError("上传缩略图到云存储失败！")
    }else{
      fileIDs = fileIDs.concat(res.data.fileID)
      for (let i = 0, len = commodityImg.length; i < len; i++) {
        path = commodityImg[i]
        suffix = /\.\w+$/.exec(path)[0]
        res = await this.uploadImg(path, suffix)
        if(res.errno == -1){
          console.log("上传详情图到云存储失败！")
          return new RespError("上传详情图到云存储失败！")
        }else{
          fileIDs = fileIDs.concat(res.data.fileID)
        }
        
      }
      console.log({"图片fileID":fileIDs})
      return new RespSuccess(fileIDs)
    }
    

  },

  // 上传图片，不直接调用
  async uploadImg(path, suffix){
    try{
      res = await wx.cloud.uploadFile({
        cloudPath: 'commodity/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
        filePath: path
      })
      return new RespSuccess(res)
    }catch(e){
      return new RespError("上传图片到云存储失败！")
    }
    
  },

  

  // 获取对商品的提问
  // params = {
  //   commodity_id string NOT NULL // 商品的_id
  //   start number NOT NULL
  //   count number NOT NULL
  // }
  async getCommodityQuestionAndUserInfo(params){
    res = await wx.cloud.callFunction({
      name: 'commodity_question',
      data: {
        $url: 'getCommodityQuestionAndUserInfo',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取商品问题失败！")
      return new RespError("获取商品问题失败！")
    }
    const commodityQuestionAndUserInfo = res.result.list
    console.log({"获取商品问题成功":commodityQuestionAndUserInfo})
    return new RespSuccess(commodityQuestionAndUserInfo)
  },

  async getCommodityQuestionAndUserInfoByQid(params){
    res = await wx.cloud.callFunction({
      name: 'commodity_question',
      data: {
        $url: 'getCommodityQuestionAndUserInfoByQid',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取指定商品问题失败！")
      return new RespError("获取指定商品问题失败！")
    }
    const commodityQuestionAndUserInfoByQid = res.result.list[0]
    console.log({"获取商品问题成功":commodityQuestionAndUserInfoByQid})
    return new RespSuccess(commodityQuestionAndUserInfoByQid)
  },

  async getCommodityQuestionCount(params){
    res = await wx.cloud.callFunction({
      name: 'commodity_question',
      data: {
        $url: 'getCommodityQuestionCount',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取商品问题数量失败！")
      return new RespError("获取商品问题数量失败！")
    }
    const commodityQuestionCount = res.result.total
    console.log({"获取商品问题数量成功":commodityQuestionCount})
    return new RespSuccess(commodityQuestionCount)
  },

  // 上传对商品的提问
  // params = {
  //   commodity_id string NOT NULL // 商品的_id
  //   content string NOT NULL // 提问内容
  // }
  async setCommodityQuestion(params){
    res = await wx.cloud.callFunction({
      name: 'commodity_question',
      data: {
        $url: 'setCommodityQuestion',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("上传商品问题失败！")
      return new RespError("上传商品问题失败！")
    }
    console.log("上传商品问题成功！")
    return new RespSuccess()
  },

  // 获取对问题的回答
  // params = {
  //   question_id string NOT NULL // 问题的_id
  //   start number NOT NULL
  //   count number NOT NULL
  // }
  async getCommodityAnswerAndUserInfo(params){
    res = await wx.cloud.callFunction({
      name: 'commodity_answer',
      data: {
        $url: 'getCommodityAnswerAndUserInfo',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取问题的回答失败！")
      return new RespError("获取问题的回答失败！")
    }
    const commodityAnswerAndUserInfo = res.result.list
    console.log({"获取问题的回答成功":commodityAnswerAndUserInfo})
    return new RespSuccess(commodityAnswerAndUserInfo)
  },

  

  async getCommodityAnswerCount(params){
    res = await wx.cloud.callFunction({
      name: 'commodity_answer',
      data: {
        $url: 'getCommodityAnswerCount',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取问题回答数量失败！")
      return new RespError("获取问题回答数量失败！")
    }
    const commodityAnswerCount = res.result.total
    console.log({"获取问题回答数量成功！":commodityAnswerCount})
    return new RespSuccess(commodityAnswerCount)
  },

  // 上传对问题的回答
  // params = {
  //   question_id string NOT NULL // 问题的_id
  //   content string NOT NULL // 回答内容
  // }
  async setCommodityAnswer(params){
    res = await wx.cloud.callFunction({
      name: 'commodity_answer',
      data: {
        $url: 'setCommodityAnswer',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("上传问题回答失败！")
      return new RespError("上问题回答失败！")
    }
    console.log("上传问题回答成功！")
    return new RespSuccess()
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
  async setTransaction(params){
    res = await wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'setTransaction',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("生成交易失败！")
      return new RespError("生成交易失败！")
    }else if(res.result.errno == -2){
      console.log("商品正在交易中或者库存不足！")
      return new RespError("商品正在交易中或者库存不足！")
    }
    console.log("上传问题回答成功！")
    const transactionNumber = res.result.transactionNumber
    console.log({"交易号":transactionNumber})
    return new RespSuccess({transactionNumber})
  },

  async getTransactionByTransactionNumber(params){
    res = await wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'getTransactionByTransactionNumber',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("查询交易失败！")
      return new RespError("查询交易失败！")
    }
    console.log("查询交易成功！")
    const transactionDetail = res.result.data[0]
    console.log({"交易详情":transactionDetail})
    return new RespSuccess(transactionDetail)
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

  async cancelTransaction(params){
    res = await wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'cancelTransaction',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("取消交易失败！")
      return new RespError("取消交易失败！")
    }else if(res.result.errno == -2){
      console.log("交易已经被取消或已经完成")
      return new RespError("交易已经被取消或已经完成")
    }
    console.log("取消交易成功！")
    return new RespSuccess()
  },

  async confirmFinishTransaction(params){
    res = await wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'confirmFinishTransaction',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("确认交易完成失败！")
      return new RespError("确认交易完成失败！")
    }else if(res.result.errno == -2){
      console.log("交易已经被取消或已经完成")
      return new RespError("交易已经被取消或已经完成")
    }
    console.log("确认交易完成成功！")
    return new RespSuccess()
  },

  // 删除交易(soft-del)
  // params = {
  //   id string NOT NULL // 交易_id
  // }
  // delTransaction(params){
  //   return wx.cloud.callFunction({
  //     name: 'transaction',
  //     data: {
  //       $url: 'delTransaction',
  //       params
  //     }
  //   })
  // },

}

module.exports = api