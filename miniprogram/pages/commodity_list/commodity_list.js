const app = getApp()
const api = require("../../api/api")
const cache = require("../../cache/cache")
const MAX_COMMODITY_LIMIT_SIZE = 10
let res = {}
let params = {}
let uid = 0
let cid = -1
let start = 0
let categories = [{
  name: "全部",
  cid: -1
}]
let currCategory = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginPopup: false,
    pageIndex: 0,
    searchInput:"",
    universityName: "",
    commodityList: [],
    categoryName: [],
    start: 0,
    isLoading: false,
    hasMore: true,
    // TabCur: 0,
    // scrollLeft:0,
    // cardCur: 0,
    // swiperList: [{
    //   id: 0,
    //   url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599226937003&di=9483bdd1b64c46fba86c64aacec17a2f&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180914%2F22e3a39c94ce42c18695dfd34baf2e88.jpeg'
    // }, {
    //   id: 1,
    //     url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599227021556&di=b0593c143f5da01fb3f637b085395d53&imgtype=0&src=http%3A%2F%2Fimg.zhichiwangluo.com%2Fzcimgdir%2Falbum%2Ffile_5b7cd6f55524c.png',
    // }, {
    //   id: 2,
    //   url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599227108895&di=172a8eed28325010eb5d45b4d039ca83&imgtype=0&src=http%3A%2F%2Fwww.mingshuokj.cn%2Fuploadfile%2F2018%2F0828%2F20180828102548978.jpg'
    // }, {
    //   id: 3,
    //   url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599227194023&di=38dca0fbe4351fb95ec4dc04515245b3&imgtype=0&src=http%3A%2F%2Ftxt39-1.book118.com%2F2018%2F0220%2Fbook153950%2F153949206.jpg'
    // }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    wx.showLoading({
      title: '加载中',
    })

    // 获取我的信息和大学信息
    const registered = app.globalData.registered
    let myInfoAndMyUniversityInfo = {}
    if(registered){
      res = await cache.getMyInfoAndMyUniversityInfo()
      myInfoAndMyUniversityInfo = res.data
    }else{
      myInfoAndMyUniversityInfo = {
        "uid": parseInt(options.uid),
        "universityInfo": {
          "name": "注册后可选择大学"
        }
      }
    }
    
    uid = myInfoAndMyUniversityInfo.uid
    cid = -1
    
    // 获取分类信息
    categories = [{
      name: "全部",
      cid: -1
    }]
    res = await cache.getCommodityCategory()
    if(res.errno == -1){
      console.log("获取商品分类信息失败！")
      return
    }
    const commodityCategory = res.data
    // 渲染分类tab
    for(let i = 0;i < commodityCategory.length;i++){
      categories.push({
        name:commodityCategory[i].name,
        cid: commodityCategory[i].cid
      })
    }

    // 获取商品列表
    start = 0
    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await cache.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取商品列表失败！")
      return
    }
    let commodityList = res.data
    start = commodityList.length

    let categoryInfo = categories.map(function(item){
      return {
        "name": item.name
      }
    })
    for(let i = 0;i < categoryInfo.length;i++){
      switch(categoryInfo[i].name) {
        case "全部":
           categoryInfo[i]["icon"] = "shopfill"
           categoryInfo[i]["color"] = "orange"
           break
        case "服饰":
           categoryInfo[i]["icon"] = "clothesfill"
           categoryInfo[i]["color"] = "red"
           break
        case "数码":
          categoryInfo[i]["icon"] = "mobilefill"
          categoryInfo[i]["color"] = "blue"
          break
        case "洗护/家居":
          categoryInfo[i]["icon"] = "homefill"
          categoryInfo[i]["color"] = "green"
          break
        case "书籍/学习":
          categoryInfo[i]["icon"] = "writefill"
          categoryInfo[i]["color"] = "yellow"
          break
        case "食品":
          categoryInfo[i]["icon"] = "deliver_fill"
          categoryInfo[i]["color"] = "green"
          break
        case "体育/出行":
          categoryInfo[i]["icon"] = "peoplefill"
          categoryInfo[i]["color"] = "purple"
          break
        case "虚拟产品":
          categoryInfo[i]["icon"] = "discoverfill"
          categoryInfo[i]["color"] = "black"
          break
   } 
    }

    currCategory = categoryInfo[0].name
    this.setData({
      commodityList,
      categoryInfo,
      currCategory,
      universityName: myInfoAndMyUniversityInfo.universityInfo.name
    })    
    wx.hideLoading()
  },

  async onShow(){
    
    wx.showLoading({
      title: '加载中',
    })

    // 获取我的信息和大学信息
    const registered = app.globalData.registered
    let myInfoAndMyUniversityInfo = {}
    if(registered){
      res = await cache.getMyInfoAndMyUniversityInfo()
      myInfoAndMyUniversityInfo = res.data
    }else{
      myInfoAndMyUniversityInfo = {
        "uid": parseInt(options.uid),
        "universityInfo": {
          "name": "注册后可选择大学"
        }
      }
    }
    
    uid = myInfoAndMyUniversityInfo.uid
    cid = -1
    
    // 获取分类信息
    categories = [{
      name: "全部",
      cid: -1
    }]
    res = await cache.getCommodityCategory()
    if(res.errno == -1){
      console.log("获取商品分类信息失败！")
      return
    }
    const commodityCategory = res.data
    // 渲染分类tab
    for(let i = 0;i < commodityCategory.length;i++){
      categories.push({
        name:commodityCategory[i].name,
        cid: commodityCategory[i].cid
      })
    }

    // 获取商品列表
    start = 0
    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await cache.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取商品列表失败！")
      return
    }
    let commodityList = res.data
    start = commodityList.length

    let categoryInfo = categories.map(function(item){
      return {
        "name": item.name
      }
    })
    for(let i = 0;i < categoryInfo.length;i++){
      switch(categoryInfo[i].name) {
        case "全部":
           categoryInfo[i]["icon"] = "shopfill"
           categoryInfo[i]["color"] = "orange"
           break
        case "服饰":
           categoryInfo[i]["icon"] = "clothesfill"
           categoryInfo[i]["color"] = "red"
           break
        case "数码":
          categoryInfo[i]["icon"] = "mobilefill"
          categoryInfo[i]["color"] = "blue"
          break
        case "洗护/家居":
          categoryInfo[i]["icon"] = "homefill"
          categoryInfo[i]["color"] = "green"
          break
        case "书籍/学习":
          categoryInfo[i]["icon"] = "writefill"
          categoryInfo[i]["color"] = "yellow"
          break
        case "食品":
          categoryInfo[i]["icon"] = "deliver_fill"
          categoryInfo[i]["color"] = "green"
          break
        case "体育/出行":
          categoryInfo[i]["icon"] = "peoplefill"
          categoryInfo[i]["color"] = "purple"
          break
        case "虚拟产品":
          categoryInfo[i]["icon"] = "discoverfill"
          categoryInfo[i]["color"] = "black"
          break
   } 
    }

    currCategory = categoryInfo[0].name
    this.setData({
      commodityList,
      categoryInfo,
      currCategory,
      universityName: myInfoAndMyUniversityInfo.universityInfo.name
    })    
    wx.hideLoading()
  },

  // 表单
  onSearchInput(event){
    this.setData({
      searchInput: event.detail.value
    })
  },

  // 搜索
  async onSearchCommodity(event){
    const keyword = event.detail.value
    wx.navigateTo({
      url: `../commodity_search/commodity_search?keyword=${keyword}`,
    })
  },

  // 标签页，切换分类
  async tabSelect(e) {
    wx.showLoading({
      title: '加载中',
    })
    const idx = e.currentTarget.dataset.id
    currCategory = this.data.categoryInfo[idx].name,
    this.setData({
      // TabCur: e.currentTarget.dataset.id,
      // scrollLeft: (e.currentTarget.dataset.id-1)*60,
      commodityList: [],
      currCategory,
    })
    cid = categories[idx].cid
    start = 0

    // 获取商品列表
    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await cache.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取商品列表失败！")
      return
    }
    const commodityList = res.data
    start = commodityList.length
    this.setData({
      commodityList,
      hasMore: true,
      isLoading: false
    })    
    wx.hideLoading()
  },

  // 轮播图相关 cardSwiper
  // cardSwiper(e) {
  //   this.setData({
  //     cardCur: e.detail.current
  //   })
  // },

  // 刷新商品列表
  async onPullDownRefresh() {

    wx.showLoading({
      title: '加载中',
    })

    params = {
      uid,
      cid,
      keyword: "",
      start: 0,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await api.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("刷新商品列表失败！")
      return
    }
    const commodityList = res.data
    start = commodityList.length

    params = {
      cid,
      commodityList
    }
    res = await cache.setCommodityListByCid(params)
    if(res.errno == -1){
      console.log("新数据写入缓存失败")
      return
    }
    this.setData({
      commodityList,
      hasMore: true,
      isLoading: false
    })  
    wx.hideLoading()
  },

  // 到底加载更多数据
  async onReachBottom() {

    if(!this.data.hasMore){
      return
    }
    this.setData({
      isLoading: true
    })

    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await api.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("加载更多商品列表失败！")
      return
    }
    const moreCommodityList = res.data
    if(moreCommodityList.length == 0){
      console.log("没有更多数据了！")
      this.setData({
        isLoading:false,
        hasMore: false
      })
      return
    }
    start += moreCommodityList.length
    const newCommodityList = this.data.commodityList.concat(moreCommodityList)
    params = {
      cid,
      commodityList: newCommodityList
    }
    res = await cache.setCommodityListByCid(params)
    if(res.errno == -1){
      console.log("新数据写入缓存失败")
      return
    }
    this.setData({
      commodityList: newCommodityList
    })  

  },


  async onEnterCommodityDetail(event){
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../commodity_detail/commodity_detail?id=${id}&enteredFrom=1`,
    })
  },


  //底部Tab相关
  async onCommodityReleaseTab(){
    const registered = app.globalData.registered
    if(registered){
      wx.navigateTo({
        url: '../commodity_release/commodity_release',
      })
    }else{
      this.setData({
        showLoginPopup: true
      })
    }
    
  },

  async onHomeTab(){
    wx.redirectTo({
      url: '../home/home',
    })
  },

  onShowLoginPopup(){
    const registered = app.globalData.registered
    if(!registered){
      this.setData({
        showLoginPopup: true
      })
    }
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