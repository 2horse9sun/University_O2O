// miniprogram/pages/home_user_info/home_user_info.js
import Dialog from '@vant/weapp/dialog/dialog';
const api = require('../../api/api')
const cache = require('../../cache/cache')
const rules = require('../../utils/rules')
let res = {}
let params = {}
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
    isEditting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    // 获取我的信息和大学信息
    res = await api.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    uid = myInfoAndMyUniversityInfo.uid
    this.setData({
      ...myInfoAndMyUniversityInfo
    })

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
      if(universities[0].indexOf(province) == -1){
        universities[0].push(province)
      }
      universities[1].push({
        province,
        uid: universityInfo[i].uid,
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
    console.log({"用户uid":uid})

    objectMultiArray = [universities[0],[]]
    uid = universities[1][0].uid
    for(let i = 0;i < universities[1].length;i++){
      if(universities[1][i].province == universities[0][0].name){
        objectMultiArray[1].push(universities[1][i])
      }
    }
    
    this.setData({
      objectMultiArray,
      multiIndex,
    }) 

    wx.hideLoading()

  },

  onNavigateBack(){
    universities = [[],[]]
    objectMultiArray = [[],[]]
    multiIndex = [0, 0]
    wx.navigateBack({
      delta: 1
    })
  },

  onEditUserInfo(){
    this.setData({
      isEditting: true
    })
    
  },

  onCancelEditUserInfo(){
    this.setData({
      isEditting: false,
    })
  },

  // 保存用户信息
  async onSaveUserInfo(){
    params = {
      contact_info_wx: this.data.contact_info_wx,
      contact_info_qq: this.data.contact_info_qq,
      name: this.data.name,
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
      title: '上传中',
    })
    res = await api.updateMyInfo(params)
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
    console.log("修改成功！")

    universities = [[],[]]
    objectMultiArray = [[],[]]
    multiIndex = [0, 0]

    // 清空全部缓存
    wx.clearStorageSync()

    wx.hideLoading()
    wx.showToast({
      title: '修改成功！',
      icon: 'success',
      duration: 2000,
      success(res){
        setTimeout(() => {
          wx.redirectTo({
            url: '../home/home',
          })
        }, 2000)
      }
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
      contact_info_wx: event.detail.value
    })
  },
  onChangeContactInfoQQ(event){
    this.setData({
      contact_info_qq: event.detail.value
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

})