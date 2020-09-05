// miniprogram/pages/question_detail/question_detail.js
const api = require('../../api/api')
const fmt = require('../../utils/formatTime')
const MAX_ANSWER_LIMIT_SIZE = 10
let res = {}
let params = {}
let opts = {}
let user_id = ""
let question_id = ""
let start = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    hasMore: true,
    answerContent: "",
    showAnswerPanel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    opts = options
    question_id = options.questionid
    user_id = options.userid
    start = 0
    // 根据问题_id获取商品提问
    params = {
      question_id,
    }
    res = await api.getCommodityQuestionAndUserInfoByQid(params)
    if(res.errno == -1){
      console.log("获取指定商品问题失败！")
      return
    }
    let commodityQuestion = res.data
    commodityQuestion.create_time = fmt(new Date(commodityQuestion.create_time))
    console.log(commodityQuestion)

    // 获取问题的回答，并加入到commodityQuestion中
    // 回答数量
    params = {
      question_id
    }
    res = await api.getCommodityAnswerCount(params)
    if(res.errno == -1){
      console.log("获取问题回答数量失败！")
      return
    }
    this.setData({
      commodityQuestionCount: res.data
    })
    // 回答详情
    params = {
      question_id,
      start: 0,
      count: MAX_ANSWER_LIMIT_SIZE
    }
    res = await api.getCommodityAnswerAndUserInfo(params)
    if(res.errno == -1){
      console.log("获取问题的回答失败！")
      return
    }
    const commodityAnswer = res.data
    start = commodityAnswer.length
    commodityQuestion["commodityAnswer"] = commodityAnswer

    this.setData({
      commodityQuestion,
      user_id
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


    // 获取问题的回答，并加入到commodityQuestion中
    params = {
      question_id,
      start: start,
      count: MAX_ANSWER_LIMIT_SIZE
    }
    res = await api.getCommodityAnswerAndUserInfo(params)
    if(res.errno == -1){
      console.log("获取问题的回答失败！")
      return
    }
    const newCommodityAnswer = res.data
    start += newCommodityAnswer.length

    if(newCommodityAnswer.length == 0){
      this.setData({
        isLoading: false,
        hasMore: false
      })
      return
    }

    let commodityQuestion = this.data.commodityQuestion
    commodityQuestion["commodityAnswer"] = commodityQuestion["commodityAnswer"].concat(newCommodityAnswer)

    this.setData({
      commodityQuestion,
    })

  },

  onNavigateBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  onAnswerQuestion(event){
    this.setData({
      showAnswerPanel: true,
    })
  },

  onCancelAnswerPanel(){
    this.setData({
      showAnswerPanel: false
    })
  },

  onChangeAnswerContent(event){
    this.setData({
      answerContent: event.detail.value
    })
  },

  async onSubmitAnswer(){
    params = {
      question_id,
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
    await this.onLoad(opts)
  },

})