// miniprogram/pages/commodity_detail/commodity_detail.js
const api = require('../../api/api')
const MAX_QUESTION_LIMIT_SIZE = 2
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
    showAnswerPanel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    opts = options
    start = 0
    
    // 获取商品详情信息
    commodity_id = options.id
    commodity_id = "b5416b755f4d1ec400d462d6699ae2f3"
    params = {
      id: commodity_id
    }
    res = await api.getCommodityDetail(params)
    if(res.errno == -1){
      console.log("商品详情获取失败！")
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
      status
    })
    console.log(commodityDetail)

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
      const commodityAnswer = res.data
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
      const newCommodityAnswer = res.data
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





  // 获取问题回答
  async onGetCommodityAnswer(){
    // 测试数据
    const params = {
      question_id: "ac5f38825f48712b008283406e7ea8f3",
      start: 0,
      count: MAX_ANSWER_LIMIT_SIZE
    }
    const resGetCommodityAnswer = await api.getCommodityAnswer(params)
    const commodityAnswer = resGetCommodityAnswer.result
    console.log(commodityAnswer)
  },

  // 上传问题回答
  async onSetCommodityAnswer(){
    // 测试数据
    const params = {
      question_id: "ac5f38825f48712b008283406e7ea8f3",
      content: "对ipad的提问的又一次回答"
    }
    const resSetCommodityAnswer = await api.setCommodityAnswer(params)
    console.log(resSetCommodityAnswer)
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
    const params = {
      commodity_id,
      content: this.data.questionContent
    }
    console.log(params)
    const resSetCommodityQuestion = await api.setCommodityQuestion(params)
    console.log(resSetCommodityQuestion)
    this.setData({
      questionContent: "",
      showAskPanel: false
    })

    await this.onPullDownRefresh()
  },

  async onSubmitAnswer(){
    const params = {
      question_id,
      content: this.data.answerContent
    }
    console.log(params)
    const resSetCommodityAnswer = await api.setCommodityAnswer(params)
    console.log(resSetCommodityAnswer)
    this.setData({
      answerContent: "",
      showAnswerPanel: false
    })

    await this.onPullDownRefresh()
  },

  onEnterTransaction(){
    wx.navigateTo({
      url: `../commodity_transaction/commodity_transaction?commodity_id=${commodity_id}`,
    })
  }

   
})