// miniprogram/pages/index_auth/index_auth.js
import Toast from '@vant/weapp/toast/toast';
const api = require("../../api/api")
const cache = require("../../cache/cache")

let res = {}
let myInfoAndMyUniversityInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    

  },


  async onStudentIdAuth(){
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和我的大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    wx.redirectTo({
      url: `../commodity_list/commodity_list?uid=${myInfoAndMyUniversityInfo.uid}`,
    })
  },

  // 暂不进行学生身份验证， 直接跳转至商品界面
  async onDelayStudentIdAuth(){
    await this.onStudentIdAuth()
  }
})