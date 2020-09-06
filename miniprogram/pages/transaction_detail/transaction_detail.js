// miniprogram/pages/transaction_detail/transaction_detail.js
import Dialog from '@vant/weapp/dialog/dialog';

const api = require('../../api/api')
const cache = require('../../cache/cache')
const fmt = require('../../utils/formatTime')
let res = {}
let params = {}
let opts = {}
let fromCommodityTransaction = false;
let transactionNumber = ""
let isSeller = false
let isBuyer = false
let seller_status = 0
let buyer_status = 0
let alreadyConfirmed = false
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    opts = options
    fromCommodityTransaction = options.fromCommodityTransaction
    transactionNumber = options.transactionNumber
    params = {
      transaction_no: transactionNumber
    }
    res = await api.getTransactionByTransactionNumber(params)
    if(res.errno == -1){
      console.log("获取交易详情失败！")
      return
    }
    const transactionDetail = res.data
    console.log(transactionDetail)
    transactionDetail.create_time = fmt(new Date(transactionDetail.create_time))
    if(transactionDetail.end_time!=""){
      transactionDetail.end_time = fmt(new Date(transactionDetail.end_time))
    }else{
      transactionDetail.end_time = "未结束"
    }

    // 获取我的信息和大学信息
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    const openid = myInfoAndMyUniversityInfo.openid
    if(openid == transactionDetail.seller_id){
      isSeller = true
    }
    if(openid == transactionDetail.buyer_id){
      isBuyer = true
    }

    seller_status = transactionDetail.seller_status
    buyer_status = transactionDetail.buyer_status
    alreadyConfirmed = isSeller&&seller_status==1 || isBuyer&&buyer_status==1
    this.setData({
      ...transactionDetail,
      fromCommodityTransaction,
      alreadyConfirmed
    })

  },

  onNavigateBack(){
    if(fromCommodityTransaction == true){
      const commodity_id = this.data.commodity_id
      wx.redirectTo({
        url: `../commodity_detail/commodity_detail?id=${commodity_id}`,
      })
    }else{
      wx.navigateBack()
    }
    
  },


  async onShowContactInfo(){
    if(isSeller){
      params = {
        userId: this.data.buyer_id
      }
      res = await api.getUserInfoFromDbByUserId(params)
      if(res.errno == -1){
        console.log("获取用户信息失败！")
        return
      }
      const buyerContactInfoWX = res.data.contact_info_wx?res.data.contact_info_wx:"暂无"
      const buyerContactInfoQQ = res.data.contact_info_qq?res.data.contact_info_qq:"暂无"

      Dialog.alert({
        message: `
        买家微信联系方式：${buyerContactInfoWX}
        买家QQ联系方式：${buyerContactInfoQQ}`,
        theme: 'round-button',
      })

    }


    if(isBuyer){
      params = {
        userId: this.data.seller_id
      }
      res = await api.getUserInfoFromDbByUserId(params)
      if(res.errno == -1){
        console.log("获取用户信息失败！")
        return
      }
      const sellerContactInfoWX = res.data.contact_info_wx?res.data.contact_info_wx:"暂无"
      const sellerContactInfoQQ = res.data.contact_info_qq?res.data.contact_info_qq:"暂无"

      Dialog.alert({
        message: `卖家微信联系方式：${sellerContactInfoWX}
        卖家QQ联系方式：${sellerContactInfoQQ}`,
        theme: 'round-button',
      })
    }

  },

  // 确认交易完成
  async onConfirmFinishTransaction(){
    params = {
      id: this.data._id,
      isSeller,
      seller_status,
      buyer_status
    }
    res = await api.confirmFinishTransaction(params)
    if(res.errno != 0){
      Dialog.alert({
        message: res.message,
        theme: 'round-button',
      })
    }

    await this.onLoad(opts)
  },

  onEnterCommodityDetail(){
    const commodity_id = this.data.commodity_id
    wx.navigateTo({
      url: `../commodity_detail/commodity_detail?id=${commodity_id}`,
    })
  },

  // 取消交易
  async onCancelTransaction(){
    Dialog.confirm({
      title: '取消交易',
      message: '确认取消此次交易吗？',
    })
      .then(async() => {
        params = {
          id: this.data._id,
        }
        res = await api.cancelTransaction(params)
        if(res.errno != 0){
          Dialog.alert({
            message: res.message,
            theme: 'round-button',
          })
        }
        await this.onLoad(opts)

      })
  },

  // async onDelTransaction(){
  //   Dialog.confirm({
  //     title: '删除交易',
  //     message: '确认删除此次交易吗？',
  //   })
  //     .then(async() => {
  //       let params = {
  //         id: this.data._id,
  //       }
  //       const resDelTransaction = await api.delTransaction(params)
  //       console.log(resDelTransaction)

  //     })
  //     .catch(() => {

  //     })
  // }
})