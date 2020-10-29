// miniprogram/pages/commodity_release/commodity_release.js
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
const api = require('../../api/api')
const cache = require("../../cache/cache")
const rules = require('../../utils/rules')
const {RespSuccess, RespError} = require('../../utils/resp')
let res = {}
let params = {}
let categories = []
let cid = 0
let uid = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    thumbnail: [],
    commodityImg: [],
    commodityNumber: 1,
    columns:[],
    categoryIndex: 0,
    commodityTitle: "",
    commodityContent:"",
    commodityPurchaseUrl:"",
    commodityOriginPrice:"",
    commodityCurrentPrice:"",
    commodityRemark:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 读取商品分类信息
    categories = []
    res = await cache.getCommodityCategory()
    if(res.errno == -1){
      console.log("获取商品分类信息失败")
    }else{
      // 分类信息渲染
      const commodityCategory = res.data
      for(let i = 0;i < commodityCategory.length;i++){
        const name = commodityCategory[i].name
        const cid = commodityCategory[i].cid
        categories.push({
          name,
          cid
        })
      }
      cid = categories[0].cid
      this.setData({
        categories
      })
    }
  },


  onNavigateBack(){
    wx.navigateBack({
      delta: 1,
    })
  },

  // 表单
  onChangeCommodityTitle(event){
    this.setData({
      commodityTitle: event.detail.value
    })
  },
  onChangeCommodityContent(event){
    this.setData({
      commodityContent: event.detail.value
    })
  },
  onChangeCommodityOriginPrice(event){
    this.setData({
      commodityOriginPrice: event.detail.value
    })
  },
  onChangeCommodityCurrentPrice(event){
    this.setData({
      commodityCurrentPrice: event.detail.value
    })
  },
  onChangeCommodityPurchaseUrl(event){
    this.setData({
      commodityPurchaseUrl: event.detail.value
    })
  },
  onChangeCommodityRemark(event){
    this.setData({
      commodityRemark: event.detail.value
    })
  },
  onChangeCommodityNumber(event){
    console.log(event.detail.value)
    this.setData({
      commodityNumber: event.detail.value
    })
  },
  onChangeCommodityCategory(event){
    const idx = event.detail.value
    cid = categories[idx].cid
    this.setData({
      categoryIndex: idx
    })
  },

  // 添加缩略图
  onUpdateThumbnail(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album','camera'], //从相册选择
      success: (res) => {
        if (this.data.thumbnail.length != 0) {
          this.setData({
            thumbnail: this.data.thumbnail.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            thumbnail: res.tempFilePaths
          })
        }
      }
    });
  },
  onViewThumbnail(e) {
    wx.previewImage({
      urls: this.data.thumbnail,
      current: e.currentTarget.dataset.url
    });
  },
  onDelThumbnail(e) {
    this.data.thumbnail.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      thumbnail: this.data.thumbnail
    })
  },

  // 添加详情图
  onUpdateCommodityImg(e) {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.commodityImg.length != 0) {
          this.setData({
            commodityImg: this.data.commodityImg.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            commodityImg: res.tempFilePaths
          })
        }
      }
    });
  },
  onViewCommodityImg(e) {
    wx.previewImage({
      urls: this.data.commodityImg,
      current: e.currentTarget.dataset.url
    });
  },
  onDelCommodityImg(e) {
    this.data.commodityImg.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      commodityImg: this.data.commodityImg
    })
  },


  // 验证表单格式
  isValid(params){
    console.log(params)
    if(!rules.required(params.title)){
      return new RespError("商品名称不能为空！")
    }
    if(!rules.required(params.number)){
      return new RespError("商品数量不能为空！")
    }
    if(!rules.required(params.price_origin)){
      return new RespError("商品原价不能为空！")
    }
    if(!rules.required(params.price_now)){
      return new RespError("商品现价不能为空！")
    }
    if(!rules.required(params.content)){
      return new RespError("商品详情不能为空！")
    }
    if(!rules.onlyNumber(params.number)){
      return new RespError("商品数量必须是数字")
    }
    if(!rules.onlyNumber(params.price_origin)){
      return new RespError("商品原价必须是数字")
    }
    if(!rules.onlyNumber(params.price_now)){
      return new RespError("商品现价必须是数字")
    }
    if(params.number < 1){
      return new RespError("商品数量至少为1")
    }
    if(params.price_origin < 0){
      return new RespError("商品原价至少为0")
    }
    if(params.price_now < 0){
      return new RespError("商品现价至少为0")
    }
    return new RespSuccess()
  },

  
  // 上传商品信息
  async onCommodityRelease(){ 

    // 订阅消息：当有人购买用户发布的商品时，推送消息给此用户
    const tmplId = 's9MweXoRKb_IWTm0edo6Ztso2BLcWSrYuTcNT1cDTME'
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      complete: async (res) => {

        res = await cache.getMyInfoAndMyUniversityInfo()
        if(res.errno == -1){
          console.log("获取我的信息和我的大学信息失败！")
        }
        console.log(res)
        const myInfoAndMyUniversityInfo = res.data
        const userPrimaryKey = myInfoAndMyUniversityInfo._id
        uid = myInfoAndMyUniversityInfo.uid
        let uploadParams = {
          cid: cid,
          content: this.data.commodityContent,
          title: this.data.commodityTitle,
          number: parseInt(this.data.commodityNumber),            
          origin_url: this.data.commodityPurchaseUrl?this.data.commodityPurchaseUrl:"",
          price_origin: parseFloat(this.data.commodityOriginPrice),
          price_now: parseFloat(this.data.commodityCurrentPrice),
          remark: this.data.commodityRemark?this.data.commodityRemark:"",
          uid: uid,
          userPrimaryKey
        }
        res = this.isValid(uploadParams)
        
        if(res.errno == -1){
          Dialog.alert({
            title: '格式错误',
            message:res.message,
          })
          return
        }
        
        // 上传图片到云存储，获取fileId
        if(this.data.thumbnail.length == 0 || this.data.commodityImg.length == 0){
          wx.hideLoading()
          Dialog.alert({
            title: '格式错误',
            message:"至少上传一张缩略图和一张详情图！",
          })
          return
        }

        wx.showLoading({
          title: '上传中',
        })

        params = {
          thumbnail: this.data.thumbnail,
          commodityImg: this.data.commodityImg,
        }
        res = await api.uploadImgAndGetFileID(params)
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
        
        const fileIDs = res.data
    
        // 上传数据到云数据库
        const thumbnailFileID = fileIDs.splice(0,1)
        const commodityImgFileID = fileIDs
        uploadParams["thumbnail_url"] = thumbnailFileID
        uploadParams["img_url"] = commodityImgFileID
        
        res = await api.setCommodityDetail(uploadParams)
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

          // 若数据上传失败，需要删除已经上传的图片
          res = await api.delImg({fileIDs})
          if(res.errno!=0){
            console.log(res.message)
          }
          return
        }
        // 清空缓存
        wx.clearStorageSync()
        wx.hideLoading()
    
        wx.showToast({
          title: '上传成功！',
          icon: 'success',
          duration: 2000,
          success(res){
            setTimeout(() => {
              wx.redirectTo({
                url: `../commodity_list/commodity_list?uid=${uid}`,
              })
            }, 1500)
          }
        })
      }
    })  
  }
})