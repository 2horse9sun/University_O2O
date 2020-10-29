// 云函数调用统一接口，可考虑分成多文件？

const {RespSuccess, RespError} = require('../utils/resp')
let res = {}

const api = {
  // 获取此用户信息和大学信息，无需参数
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

  // 通过用户的openid从数据库中读取用户信息
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
  
  // 上传自己的信息，参数见调用处
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
      return new RespError("上传失败！")
    }else if(res.result.errno == 87014){
      console.log("上传信息包含敏感内容！")
      return new RespError("包含敏感内容！")
    }else{
      console.log("上传用户信息成功！")
      return new RespSuccess()
    }
  },

  // 更新自己的信息，参数是所有字段的子集
  async updateMyInfo(params){
    res = await wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'updateMyInfo',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("上传用户信息失败！")
      return new RespError("上传失败！")
    }else if(res.result.errno == 87014){
      console.log("上传信息包含敏感内容！")
      return new RespError("包含敏感内容！")
    }else if(res.result.errno == -2){
      console.log("有未删除的商品或进行中的交易！")
      return new RespError("有未删除的商品或进行中的交易！")
    }else{
      console.log("上传用户信息成功！")
      return new RespSuccess()
    }
  },


  // 从云数据库中获取所有大学信息
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

  // 通过大学的uid获取大学信息
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
  // studentIdAuth(){
  //   return wx.cloud.callFunction({
  //     name: 'user',
  //     data: {
  //       $url: 'studentIdAuth',
  //     }
  //   })
  // },

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


  // 获取商品列表，使用分页查询，参数见调用处
  // cid = -1 说明是全部分类
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

  // 获取商品详情信息，参数见调用处
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



  // 上传商品详细信息，参数见调用处
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
    }else if(res.result.errno == 87014){
      console.log("上传信息包含敏感内容！")
      return new RespError("包含敏感内容！")
    }else{
      console.log("上传商品信息成功！")
      return new RespSuccess()
    }
  },


  // 删除商品(soft-del)
  // 需要获取与商品相关的问题，回答，交易的主键，以及图片的fileIDs
  // 此处可以优化吗？？？暂时想不到
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

    // 安全校验
    let res = wx.getFileSystemManager().readFileSync(path)
    let buffer = res.data
    res = await wx.cloud.callFunction({
      name: 'commodity',
      data: {
        $url: 'imgSecCheck',
        params: {
          suffix,
          buffer
        }
      }
    })
    if(res.result.errno == 87014){
      console.log("上传信息包含敏感内容！")
      return new RespError("包含敏感内容！")
    }


    res = await this.uploadImg(path, suffix)
    if(res.errno == -1){
      console.log("上传缩略图到云存储失败！")
      return new RespError("上传缩略图到云存储失败！")
    }else{
      fileIDs = fileIDs.concat(res.data.fileID)
      for (let i = 0, len = commodityImg.length; i < len; i++) {
        path = commodityImg[i]
        suffix = /\.\w+$/.exec(path)[0]

        // 安全校验
        res = wx.getFileSystemManager().readFileSync(path)
        buffer = res.data
        res = await wx.cloud.callFunction({
          name: 'commodity',
          data: {
            $url: 'imgSecCheck',
            params: {
              suffix,
              buffer
            }
          }
        })
        if(res.result.errno == 87014){
          console.log("上传信息包含敏感内容！")
          return new RespError("包含敏感内容！")
        }

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

  // 上传图片
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

  // 删除图片
  async delImg(params){
    try{
      res = await wx.cloud.deleteFile({
        fileList: params.fileIDs,
      })
      return new RespSuccess(res)
    }catch(e){
      return new RespError("删除图片失败！")
    }
  },

  

  // 获取对商品的部分提问及相应的用户信息，参数见调用处
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

  // 通过问题的_id获取问题及相应用户信息，参数见调用处
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

  // 上传对商品的提问，参数见调用处
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
    }else if(res.result.errno == 87014){
      console.log("上传信息包含敏感内容！")
      return new RespError("包含敏感内容！")
    }else{
      console.log("上传商品问题成功！")
      return new RespSuccess()
    }
    
  },

  // 获取对问题的部分回答，参数见调用处
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

  // 上传对问题的回答，参数见调用处
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
    }else if(res.result.errno == 87014){
      console.log("上传信息包含敏感内容！")
      return new RespError("包含敏感内容！")
    }else{
      console.log("上传问题回答成功！")
      return new RespSuccess()
    }
    
  },

  // 上传交易信息，参数见调用处
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
    }else if(res.result.errno == -3){
      console.log("重复下单！")
      return new RespError("不能重复下单！")
    }
    console.log("上传问题回答成功！")
    const transactionNumber = res.result.transactionNumber
    console.log({"交易号":transactionNumber})
    return new RespSuccess({transactionNumber})
  },

  // 通过transaction_no获取交易详情，参数见调用处
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
    if(res.result.errno == -2){
      console.log("交易已被删除或不存在！")
      return new RespError("交易已被删除或不存在！")
    }
    console.log("查询交易成功！")
    const transactionDetail = res.result.data[0]
    console.log({"交易详情":transactionDetail})
    return new RespSuccess(transactionDetail)
  },

  // 获取关于自己的出售交易列表，参数见调用处
  async getMySellTransactionList(params){
    res = await wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'getMySellTransactionList',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取出售交易列表失败！")
      return new RespError("获取出售交易列表失败！")
    }
    console.log("获取出售交易列表成功！")
    const sellTransactionList = res.result.data
    console.log({"出售交易列表":sellTransactionList})
    return new RespSuccess(sellTransactionList)
  },

  // 获取关于自己的购买交易列表，参数见调用处
  async getMyBuyTransactionList(params){
    res = await wx.cloud.callFunction({
      name: 'transaction',
      data: {
        $url: 'getMyBuyTransactionList',
        params
      }
    })
    if(res.result.errno == -1){
      console.log("获取购买交易列表失败！")
      return new RespError("获取购买交易列表失败！")
    }
    console.log("获取购买交易列表成功！")
    const buyTransactionList = res.result.data
    console.log({"购买交易列表":buyTransactionList})
    return new RespSuccess(buyTransactionList)
  },

  // 取消交易，参数见调用处
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

  // 确认交易完成，参数见调用处
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


  // 消息推送，参数见调用处
  async sendNewTransactionMsg(params){
    res = await wx.cloud.callFunction({
      name: 'subscribeMsg',
      data: {
        $url: 'sendNewTransactionMsg',
        params
      }
    })
    console.log(res)
    if(res.result.errno == -1){
      console.log("发送推送消息失败！")
      return new RespError("发送推送消息失败！")
    }
    console.log("发送推送消息成功！")
    return new RespSuccess()
  }

}

module.exports = api