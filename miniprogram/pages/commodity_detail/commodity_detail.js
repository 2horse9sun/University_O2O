// miniprogram/pages/commodity_detail/commodity_detail.js
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
const api = require('../../api/api')
const cache = require('../../cache/cache')
const fmt = require('../../utils/formatTime')
const MAX_QUESTION_LIMIT_SIZE = 10
const MAX_ANSWER_LIMIT_SIZE = 3
const MAX_ANSWER_SHOW_LIMIT_SIZE = 2
let res = {}
let params = {}
let opts = {}
let commodityDetail = {}
let commodity_id = ""
let question_id = ""
let start = 0
let enteredFrom = 1
let commodity_uid = 0
let user_uid = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    hasMore: true,
    swiperList:[],
    showAskPanel: false,
    questionContent: "",
    answerContent: "",
    commodityQuestion: [],
    commodityQuestionCount: 0,
    showAnswerPanel: false,
    showFailPanel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    wx.showLoading({
      title: '加载中',
    })
    const registered = app.globalData.registered

    opts = options
    start = 0

    // 获取我的信息和大学信息
    let myInfoAndMyUniversityInfo = {}
    if(registered){
      res = await cache.getMyInfoAndMyUniversityInfo()
      if(res.errno == -1){
        console.log("获取我的信息和大学信息失败！")
        return
      }
      myInfoAndMyUniversityInfo = res.data
    }else{
      myInfoAndMyUniversityInfo = {
        "openid": -1
      }
    }
    
    const myUserId = myInfoAndMyUniversityInfo.openid
    user_uid = myInfoAndMyUniversityInfo.uid
    
    // 获取商品详情信息
    commodity_id = options.id
    enteredFrom = options.enteredFrom
    params = {
      id: commodity_id
    }
    res = await api.getCommodityDetail(params)
    if(res.errno == -1){
      wx.hideLoading()
      console.log("商品详情获取失败！")
      Dialog.alert({
        title: '出错了！',
        message:res.message,
      }).then(() => {
        wx.navigateBack()
      })
      return
    }
    commodityDetail = res.data
    commodity_uid = commodityDetail.uid
    const {
      content,
      img_url,
      number,
      origin_url,
      price_now,
      price_origin,
      remark,
      status,
      title,
      user_id
    } = commodityDetail
    this.setData({
      swiperImgUrl: img_url,
      title,
      content,
      number,
      remark: remark?remark:"暂无",
      originUrl:origin_url?origin_url:"暂无",
      priceNow: price_now,
      priceOrigin: price_origin,
      status,
      user_id,
      myUserId
    })
    console.log(commodityDetail)

    // 获取商品提问的数量
    params = {
      commodity_id,
    }
    res = await api.getCommodityQuestionCount(params)
    if(res.errno == -1){
      console.log("获取商品问题数量失败！")
      return
    }
    const commodityQuestionCount = res.data
    this.setData({
      commodityQuestionCount
    })

    wx.hideLoading()

    // 获取商品提问
    start = 0
    params = {
      commodity_id,
      start: start,
      count: MAX_QUESTION_LIMIT_SIZE
    }
    res = await api.getCommodityQuestionAndUserInfo(params)
    if(res.errno == -1){
      console.log("获取商品问题失败！")
      return
    }
    let commodityQuestion = res.data
    start = commodityQuestion.length
    console.log(commodityQuestion)

    // 获取每个问题的回答，并加入到commodityQuestion中
    for(let i = 0;i < commodityQuestion.length;i++){
      // 问题日期格式化
      commodityQuestion[i].create_time = fmt(new Date(commodityQuestion[i].create_time))
      // 回答数量
      params = {
        question_id: commodityQuestion[i]._id,
      }
      res = await api.getCommodityAnswerCount(params)
      if(res.errno == -1){
        console.log("获取问题回答数量失败！")
        return
      }
      commodityQuestion[i]["commodityAnswerCount"] = res.data
      // 回答详情
      params = {
        question_id: commodityQuestion[i]._id,
        start: 0,
        count: MAX_ANSWER_LIMIT_SIZE
      }
      res = await api.getCommodityAnswerAndUserInfo(params)
      if(res.errno == -1){
        console.log("获取问题的回答失败！")
        return
      }
      let commodityAnswer = res.data
      commodityQuestion[i]["hasMoreAnswer"] = commodityAnswer.length > MAX_ANSWER_SHOW_LIMIT_SIZE ? true : false
      commodityQuestion[i]["commodityAnswer"] = commodityAnswer.splice(0, MAX_ANSWER_SHOW_LIMIT_SIZE)
    }

    this.setData({
      commodityQuestion
    })

  },

  async onShow(){
    wx.showLoading({
      title: '加载中',
    })
    const registered = app.globalData.registered

    start = 0

    // 获取我的信息和大学信息
    let myInfoAndMyUniversityInfo = {}
    if(registered){
      res = await cache.getMyInfoAndMyUniversityInfo()
      if(res.errno == -1){
        console.log("获取我的信息和大学信息失败！")
        return
      }
      myInfoAndMyUniversityInfo = res.data
    }else{
      myInfoAndMyUniversityInfo = {
        "openid": -1
      }
    }
    
    const myUserId = myInfoAndMyUniversityInfo.openid
    
    // 获取商品详情信息
    commodity_id = opts.id
    enteredFrom = opts.enteredFrom
    params = {
      id: commodity_id
    }
    res = await api.getCommodityDetail(params)
    if(res.errno == -1){
      wx.hideLoading()
      console.log("商品详情获取失败！")
      Dialog.alert({
        title: '出错了！',
        message:res.message,
      }).then(() => {
        wx.navigateBack()
      })
      return
    }
    commodityDetail = res.data
    const {
      content,
      img_url,
      number,
      origin_url,
      price_now,
      price_origin,
      remark,
      status,
      title,
      user_id
    } = commodityDetail
    this.setData({
      swiperImgUrl: img_url,
      title,
      content,
      number,
      remark: remark?remark:"暂无",
      originUrl:origin_url?origin_url:"暂无",
      priceNow: price_now,
      priceOrigin: price_origin,
      status,
      user_id,
      myUserId
    })
    console.log(commodityDetail)

    // 获取商品提问的数量
    params = {
      commodity_id,
    }
    res = await api.getCommodityQuestionCount(params)
    if(res.errno == -1){
      console.log("获取商品问题数量失败！")
      return
    }
    const commodityQuestionCount = res.data
    this.setData({
      commodityQuestionCount
    })

    wx.hideLoading()

    // 获取商品提问
    start = 0
    params = {
      commodity_id,
      start: start,
      count: MAX_QUESTION_LIMIT_SIZE
    }
    res = await api.getCommodityQuestionAndUserInfo(params)
    if(res.errno == -1){
      console.log("获取商品问题失败！")
      return
    }
    let commodityQuestion = res.data
    start = commodityQuestion.length
    console.log(commodityQuestion)

    // 获取每个问题的回答，并加入到commodityQuestion中
    for(let i = 0;i < commodityQuestion.length;i++){
      // 问题日期格式化
      commodityQuestion[i].create_time = fmt(new Date(commodityQuestion[i].create_time))
      // 回答数量
      params = {
        question_id: commodityQuestion[i]._id,
      }
      res = await api.getCommodityAnswerCount(params)
      if(res.errno == -1){
        console.log("获取问题回答数量失败！")
        return
      }
      commodityQuestion[i]["commodityAnswerCount"] = res.data
      // 回答详情
      params = {
        question_id: commodityQuestion[i]._id,
        start: 0,
        count: MAX_ANSWER_LIMIT_SIZE
      }
      res = await api.getCommodityAnswerAndUserInfo(params)
      if(res.errno == -1){
        console.log("获取问题的回答失败！")
        return
      }
      let commodityAnswer = res.data
      commodityQuestion[i]["hasMoreAnswer"] = commodityAnswer.length > MAX_ANSWER_SHOW_LIMIT_SIZE ? true : false
      commodityQuestion[i]["commodityAnswer"] = commodityAnswer.splice(0, MAX_ANSWER_SHOW_LIMIT_SIZE)
    }

    this.setData({
      commodityQuestion
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: '加载中',
    })
    const registered = app.globalData.registered

    start = 0

    // 获取我的信息和大学信息
    let myInfoAndMyUniversityInfo = {}
    if(registered){
      res = await cache.getMyInfoAndMyUniversityInfo()
      if(res.errno == -1){
        console.log("获取我的信息和大学信息失败！")
        return
      }
      myInfoAndMyUniversityInfo = res.data
    }else{
      myInfoAndMyUniversityInfo = {
        "openid": -1
      }
    }
    
    const myUserId = myInfoAndMyUniversityInfo.openid
    
    // 获取商品详情信息
    commodity_id = opts.id
    params = {
      id: commodity_id
    }
    res = await api.getCommodityDetail(params)
    if(res.errno == -1){
      wx.hideLoading()
      console.log("商品详情获取失败！")
      Dialog.alert({
        title: '出错了！',
        message:res.message,
      }).then(() => {
        wx.navigateBack()
      })
      return
    }
    commodityDetail = res.data
    const {
      content,
      img_url,
      number,
      origin_url,
      price_now,
      price_origin,
      remark,
      status,
      title,
      user_id
    } = commodityDetail
    this.setData({
      swiperImgUrl: img_url,
      title,
      content,
      number,
      remark: remark?remark:"暂无",
      originUrl:origin_url?origin_url:"暂无",
      priceNow: price_now,
      priceOrigin: price_origin,
      status,
      user_id,
      myUserId
    })
    console.log(commodityDetail)

    // 获取商品提问的数量
    params = {
      commodity_id,
    }
    res = await api.getCommodityQuestionCount(params)
    if(res.errno == -1){
      console.log("获取商品问题数量失败！")
      return
    }
    const commodityQuestionCount = res.data
    this.setData({
      commodityQuestionCount
    })

    wx.hideLoading()

    // 获取商品提问
    start = 0
    params = {
      commodity_id,
      start: start,
      count: MAX_QUESTION_LIMIT_SIZE
    }
    res = await api.getCommodityQuestionAndUserInfo(params)
    if(res.errno == -1){
      console.log("获取商品问题失败！")
      return
    }
    let commodityQuestion = res.data
    start = commodityQuestion.length
    console.log(commodityQuestion)

    // 获取每个问题的回答，并加入到commodityQuestion中
    for(let i = 0;i < commodityQuestion.length;i++){
      // 问题日期格式化
      commodityQuestion[i].create_time = fmt(new Date(commodityQuestion[i].create_time))
      // 回答数量
      params = {
        question_id: commodityQuestion[i]._id,
      }
      res = await api.getCommodityAnswerCount(params)
      if(res.errno == -1){
        console.log("获取问题回答数量失败！")
        return
      }
      commodityQuestion[i]["commodityAnswerCount"] = res.data
      // 回答详情
      params = {
        question_id: commodityQuestion[i]._id,
        start: 0,
        count: MAX_ANSWER_LIMIT_SIZE
      }
      res = await api.getCommodityAnswerAndUserInfo(params)
      if(res.errno == -1){
        console.log("获取问题的回答失败！")
        return
      }
      let commodityAnswer = res.data
      commodityQuestion[i]["hasMoreAnswer"] = commodityAnswer.length > MAX_ANSWER_SHOW_LIMIT_SIZE ? true : false
      commodityQuestion[i]["commodityAnswer"] = commodityAnswer.splice(0, MAX_ANSWER_SHOW_LIMIT_SIZE)
    }

    this.setData({
      commodityQuestion
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if(!this.data.hasMore){
      return
    }
    this.setData({
      isLoading: true
    })

    // 获取商品提问
    params = {
      commodity_id,
      start: start,
      count: MAX_QUESTION_LIMIT_SIZE
    }
    res = await api.getCommodityQuestionAndUserInfo(params)
    if(res.errno == -1){
      console.log("获取商品问题失败！")
      return
    }
    let newCommodityQuestion = res.data
    start += newCommodityQuestion.length
    console.log(newCommodityQuestion)
    if(newCommodityQuestion.length == 0){
      this.setData({
        isLoading: false,
        hasMore: false
      })
      return
    }

    // 获取每个问题的回答，并加入到commodityQuestion中
    for(let i = 0;i < newCommodityQuestion.length;i++){
      // 问题日期格式化
      newCommodityQuestion[i].create_time = fmt(new Date(newCommodityQuestion[i].create_time))

      // 回答数量
      params = {
        question_id: newCommodityQuestion[i]._id,
      }
      res = await api.getCommodityAnswerCount(params)
      if(res.errno == -1){
        console.log("获取问题回答数量失败！")
        return
      }
      newCommodityQuestion[i]["commodityAnswerCount"] = res.data
      // 回答详情
      params = {
        question_id: newCommodityQuestion[i]._id,
        start: 0,
        count: MAX_ANSWER_LIMIT_SIZE
      }
      res = await api.getCommodityAnswerAndUserInfo(params)
      if(res.errno == -1){
        console.log("获取问题的回答失败！")
        return
      }
      let newCommodityAnswer = res.data
      newCommodityQuestion[i]["hasMoreAnswer"] = newCommodityAnswer.length > MAX_ANSWER_SHOW_LIMIT_SIZE ? true : false
      newCommodityQuestion[i]["commodityAnswer"] = newCommodityAnswer.splice(0, MAX_ANSWER_SHOW_LIMIT_SIZE)
    }

    this.setData({
      commodityQuestion: this.data.commodityQuestion.concat(newCommodityQuestion)
    })


  },


  onShareAppMessage(event) {
    if (event.from === 'button') {
      // 来自页面内转发按钮
      console.log(event.target)
    }
    return {
      title: this.data.title,
      path: `/pages/commodity_detail/commodity_detail?id=${commodity_id}&enteredFrom=2`,
      imgUrl: this.data.swiperImgUrl[0]
    }
  },

  onNavigateBack(){
    if(enteredFrom==1){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.redirectTo({
        url: '../commodity_list/commodity_list?uid=10698',
      })
    }
    
  },

  //图片预览
  onPreviewImg(event) {
    let idx = event.currentTarget.dataset.index;
    wx.previewImage({
      current:this.data.swiperImgUrl[idx],
      urls: this.data.swiperImgUrl
    })
  },

  // 面板显示
  onAskQuestion(){
    const registered = app.globalData.registered
    if(registered){
      this.setData({
        showAskPanel: true
      })
    }else{
      if(user_uid != commodity_uid){
        Dialog.alert({
          title: '出错了！',
          message:"你不能在其它大学中提问！",
        })
        return
      }
      this.setData({
        showLoginPopup: true
      })
    }
  },
  onCancelAskPanel(){
    this.setData({
      showAskPanel: false
    })
  },
  onAnswerQuestion(event){

    question_id = event.currentTarget.dataset.questionid
    const registered = app.globalData.registered
    if(registered){
      this.setData({
        showAnswerPanel: true,
      })
    }else{
      if(user_uid != commodity_uid){
        Dialog.alert({
          title: '出错了！',
          message:"你不能回复其它大学中的问题！",
        })
        return
      }
      this.setData({
        showLoginPopup: true
      })
    }
  },
  onCancelAnswerPanel(){
    this.setData({
      showAnswerPanel: false
    })
  },

  // 表单
  onChangeQuestionContent(event){
    this.setData({
      questionContent: event.detail.value
    })
  },
  onChangeAnswerContent(event){
    this.setData({
      answerContent: event.detail.value
    })
  },

  // 发布问题
  async onSubmitQuestion(){
    wx.showLoading({
      title: '提交中',
    })
    params = {
      commodity_id,
      content: this.data.questionContent
    }
    res = await api.setCommodityQuestion(params)
    if(res.errno != 0){
      wx.hideLoading()
      console.log("上传信息失败！")
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        success(res){
          setTimeout(() => {
          }, 1500)
        }
      })
      return
    }
    this.setData({
      questionContent: "",
      showAskPanel: false
    })

    wx.hideLoading()
    await this.onPullDownRefresh()
  },

  // 发布回复
  async onSubmitAnswer(){
    wx.showLoading({
      title: '提交中',
    })
    params = {
      question_id,
      commodity_id,
      content: this.data.answerContent
    }
    res = await api.setCommodityAnswer(params)
    if(res.errno != 0){
      wx.hideLoading()
      console.log("上传信息失败！")
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        success(res){
          setTimeout(() => {
          }, 1500)
        }
      })
      return
    }
    this.setData({
      answerContent: "",
      showAnswerPanel: false
    })
    wx.hideLoading()
    await this.onPullDownRefresh()
  },

  // 问题详情
  onEnterQuestionDetail(event){
    question_id = event.currentTarget.dataset.questionid
    wx.navigateTo({
      url: `../question_detail/question_detail?questionid=${question_id}&userid=${this.data.user_id}`,
    })
  },


  // 发起交易
  async onEnterTransaction(){
    const registered = app.globalData.registered
    if(!registered){
      this.setData({
        showLoginPopup: true
      })
      return
    }

    if(user_uid != commodity_uid){
      Dialog.alert({
        title: '出错了！',
        message:"你不能购买其它大学的商品！",
      })
      return
    }

    if(this.data.myUserId == this.data.user_id){
      Dialog.alert({
        title: '出错了！',
        message:"你不能购买自己发布的商品！",
      })
      return
    }

    // 再次获取商品详情信息
    params = {
      id: commodity_id
    }
    res = await api.getCommodityDetail(params)
    if(res.errno == -1){
      console.log("商品详情获取失败！")
      Dialog.alert({
        title: '出错了！',
        message:res.message,
      }).then(() => {
        wx.navigateBack()
      })
      return
    }
    commodityDetail = res.data


    if(commodityDetail.status != 0){
      Dialog.alert({
        title: '出错了！',
        message:"该商品已下架或正在交易中",
      }).then(async () => {
        await this.onPullDownRefresh()
      })
      
      return
    }

    wx.navigateTo({
      url: `../commodity_transaction/commodity_transaction?commodityid=${commodity_id}`,
    })
  },


  onCancelLoginPopup(){
    this.setData({
      showLoginPopup: false
    })
  },

  // 用户注册
  async onAuth(event){
    const userInfo = event.detail.userInfo
    console.log(userInfo)
    wx.setStorageSync('userInfo', userInfo)
    this.setData({
      showLoginPopup: false
    })
    wx.redirectTo({
      url: '../index_register/index_register',
    })
    
  },
   
})