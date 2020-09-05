// miniprogram/pages/commodity_detail/commodity_detail.js
import Dialog from '@vant/weapp/dialog/dialog';
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
    opts = options
    start = 0

    // 获取我的信息和大学信息
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    const myUserId = myInfoAndMyUniversityInfo.openid
    
    // 获取商品详情信息
    commodity_id = options.id
    // commodity_id = "b5416b755f4d1ec400d462d6699ae2f3"
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
      remark,
      originUrl:origin_url,
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

    // 获取商品提问
    params = {
      commodity_id,
      start: 0,
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
    await this.onLoad(opts)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onNavigateBack(){

    wx.navigateBack({
      delta: 1
    })
  },

  //图片预览
  onPreviewImg(event) {
    let idx = event.currentTarget.dataset.index;
    wx.previewImage({
      current:this.data.swiperImgUrl[idx],
      urls: this.data.swiperImgUrl
    })
  },

  onAskQuestion(){
    this.setData({
      showAskPanel: true
    })
  },

  onCancelAskPanel(){
    this.setData({
      showAskPanel: false
    })
  },

  onAnswerQuestion(event){
    question_id = event.currentTarget.dataset.questionid
    this.setData({
      showAnswerPanel: true,
    })
  },

  onCancelAnswerPanel(){
    this.setData({
      showAnswerPanel: false
    })
  },

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

  async onSubmitQuestion(){
    params = {
      commodity_id,
      content: this.data.questionContent
    }
    res = await api.setCommodityQuestion(params)
    if(res.errno == -1){
      console.log("上传商品问题失败！")
      return
    }
    this.setData({
      questionContent: "",
      showAskPanel: false
    })
    await this.onPullDownRefresh()
  },

  async onSubmitAnswer(){
    params = {
      question_id,
      commodity_id,
      content: this.data.answerContent
    }
    res = await api.setCommodityAnswer(params)
    if(res.errno == -1){
      console.log("上传问题回答失败！")
      return
    }
    this.setData({
      answerContent: "",
      showAnswerPanel: false
    })
    await this.onPullDownRefresh()
  },

  onEnterQuestionDetail(event){
    question_id = event.currentTarget.dataset.questionid
    wx.navigateTo({
      url: `../question_detail/question_detail?questionid=${question_id}&userid=${this.data.user_id}`,
    })
  },


  onEnterTransaction(){
    if(this.data.status != 0){
      console.log("该商品已下架或者正在交易中！")
      this.setData({
        showFailPanel: true
      })
      return
    }
    wx.navigateTo({
      url: `../commodity_transaction/commodity_transaction?commodityid=${commodity_id}`,
    })
  },

  async onDelCommodity(){
    params = {
      commodity_id
    }
    res = await api.delCommodity(params)
    if(res.errno == -1){
      Dialog.alert({
        title: '出错了！',
        message:res.message,
      }).then(() => {
        wx.navigateBack()
      })
      return
    }else if(res.errno == -2){
      Dialog.alert({
        title: '出错了！',
        message:res.message,
      }).then(() => {
        wx.navigateBack()
      })
      return
    }else{
      Dialog.alert({
        title: '成功',
        message:'成功删除商品！',
      }).then(() => {
        wx.navigateBack()
      })
      return
    }
  },

  onCancelFailPanel(){
    this.setData({
      showFailPanel: false
    })
  }

   
})