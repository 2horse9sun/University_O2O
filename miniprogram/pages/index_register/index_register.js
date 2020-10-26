// miniprogram/pages/index_register/index_register.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
const api = require("../../api/api")
const cache = require("../../cache/cache")
const rules = require('../../utils/rules')
let params = {}
let res = {}
let uid = 0

// 二级联动表单
let universities = [[],[]]
let objectMultiArray = [[],[]]
let multiIndex = [0, 0]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    avatarUrl: "",
    contactInfoQQ: "",
    contactInfoWX: "",
    objectMultiArray: [[],[]],
    multiIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    // 获取用户头像，性别等信息
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    const avatarUrl = userInfo.avatarUrl
    const gender = userInfo.gender

    // 从数据库中读取大学信息，加工成合适的格式
    universities = [[],[]]
    objectMultiArray = [[],[]]
    multiIndex = [0, 0]
    params = {
      is_mine: false
    }
    res = await api.getUniversityInfo(params)
    if(res.errno == -1){
      console.log("获取大学信息失败！")
      return
    }
    const universityInfo = res.data
    for(let i = 0;i < universityInfo.length;i++){
      const province = universityInfo[i].province
      const name = universityInfo[i].name
      uid = universityInfo[i].uid
      if(universities[0].indexOf(province) == -1){
        universities[0].push(province)
      }
      universities[1].push({
        province,
        uid,
        name
      })
    }
    universities[0] = universities[0].map(function (item){
      return {
        name: item
      }
    })
    console.log({"二级联动":universities})

    // 渲染大学信息
    uid = universities[1][0].uid
    console.log({"用户uid":uid})
    objectMultiArray = [universities[0],[]]
    for(let i = 0;i < universities[1].length;i++){
      if(universities[1][i].province == universities[0][0].name){
        objectMultiArray[1].push(universities[1][i])
      }
    }
    this.setData({
      objectMultiArray,
      multiIndex,
      avatarUrl,
      gender
    }) 
    wx.hideLoading()
  },


  // 导航栏
  onNavigateBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  // 表单相关
  onChangeName(event){
    this.setData({
      name: event.detail.value
    })
  },
  onChangeContactInfoWX(event){
    this.setData({
      contactInfoWX: event.detail.value
    })
  },
  onChangeContactInfoQQ(event){
    this.setData({
      contactInfoQQ: event.detail.value
    })
  },

  // 选择大学表单 二级联动
  onMultiColumnChange(event){
    if(universities[0].length==0 || universities[1].length==0){
      console.log("大学信息条数为0！")
      return
    }
    objectMultiArray = [universities[0],[]]
    const columnIndex = event.detail.column
    const index = event.detail.value
    multiIndex[columnIndex] = index
    if(columnIndex == 0){
      for(let i = 0;i < universities[1].length;i++){
        if(universities[1][i].province == universities[0][index].name){
          objectMultiArray[1].push(universities[1][i])
        }
      }
      multiIndex[1] = 0
      uid = objectMultiArray[1][0].uid
      console.log({"当前选择大学uid":uid})
      this.setData({
        objectMultiArray,
        multiIndex
      })
    }else{
      uid = this.data.objectMultiArray[1][index].uid
      console.log({"当前选择大学uid":uid})
      this.setData({
        multiIndex
      })
    } 
  },

  // 提交注册信息
  async onRegister(){
    params = {
      "contact_info_wx": this.data.contactInfoWX,
      "avatar_url": this.data.avatarUrl,
      "contact_info_qq": this.data.contactInfoQQ,
      "name": this.data.name,
      uid,
    }
    if(!rules.required(params.name)){
      Dialog.alert({
        title: '格式错误',
        message:"昵称不能为空！",
      })
      return
    }

    wx.showLoading({
      title: '正在提交中',
    })

    res = await api.setMyInfo(params)
    if(res.errno != 0){
      wx.hideLoading()
      console.log("上传用户信息失败！")
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
    console.log("注册成功！")
    // 缓存数据库中用户的信息
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("读取我的信息和我的大学信息失败！")
      wx.showToast({
        title: '内部错误',
        icon: 'none',
        duration: 2000,
        success(res){
          setTimeout(() => {
            wx.redirectTo({
              url: `../index/index`,
            })
          }, 1500)
        }
      })
      return
    }
    console.log({"我的信息和我的大学信息:":res.data})
    const myInfoAndMyUniversityInfo = res.data
    wx.hideLoading()
    app.globalData.registered = true
    wx.showToast({
      title: '注册成功！',
      icon: 'success',
      duration: 2000,
      success(res){
        setTimeout(() => {
          wx.redirectTo({
            url: `../commodity_list/commodity_list?uid=${myInfoAndMyUniversityInfo.uid}`,
          })
        }, 1500)
      }
    })
  }
})
