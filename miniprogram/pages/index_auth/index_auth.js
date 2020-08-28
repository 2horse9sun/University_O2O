// miniprogram/pages/index_auth/index_auth.js
const api = require("../../api/api")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 进行学生身份认证，目前默认都为成功，更新数据库中用户的学生认证状态
  async onStudentIdAuth(){
    const isStudent = await api.studentIdAuth()
    // 验证成功，则写入数据库，并跳转至商品界面
    if(isStudent){
      const params = {
        student_auth: true
      }
      const resUpdateUserInfo = await api.updateUserInfo(params)
      console.log(resUpdateUserInfo)

      // TODO: 弹出认证成功

      

      // TODO: 跳转至商品界面



    }else{
      // 验证失败，弹出消息框
      // TODO: 弹出消息框



    }
  },

  // 暂不进行学生身份验证， 直接跳转至商品界面
  onDelayStudentIdAuth(){
    // TODO: 直接跳转至商品界面



  }
})