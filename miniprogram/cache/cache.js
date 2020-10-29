// 缓存管理
const api = require("../api/api")
const {RespSuccess, RespError} = require("../utils/resp")
let res = {}

const cache = {

    // 获取此用户信息和大学信息
    async getMyInfoAndMyUniversityInfo(){
      // 先读缓存
      let myInfoAndMyUniversityInfo = wx.getStorageSync('myInfoAndMyUniversityInfo')
      console.log(myInfoAndMyUniversityInfo)
      if(myInfoAndMyUniversityInfo){
        console.log({"获取我的信息和我的大学信息缓存":myInfoAndMyUniversityInfo})
        return new RespSuccess(myInfoAndMyUniversityInfo)
      }
      res = await api.getMyInfoAndMyUniversityInfo()
      if(res.errno == -1){
        console.log("调用云数据库获取我的信息和我的大学信息错误！")
        return new RespError("调用云数据库获取我的信息和我的大学信息错误！")
      }
      myInfoAndMyUniversityInfo = res.data
      // 存入缓存
      console.log({"写入我的信息和我的大学信息缓存":myInfoAndMyUniversityInfo})
      wx.setStorageSync('myInfoAndMyUniversityInfo', myInfoAndMyUniversityInfo)
      return new RespSuccess(myInfoAndMyUniversityInfo)
    },

    // 把数据写入缓存
    setMyInfoAndMyUniversityInfo(params){
      const {myInfoAndMyUniversityInfo} = params
      wx.setStorageSync("myInfoAndMyUniversityInfo", myInfoAndMyUniversityInfo)
      console.log({"新数据写入商品列表缓存":myInfoAndMyUniversityInfo})
      return new RespSuccess()
    },

    // 获取商品分类信息
    async getCommodityCategory(){
      let commodityCategory = wx.getStorageSync('commodityCategory')
      if(commodityCategory){
        console.log({"获取商品分类信息缓存":commodityCategory})
        return new RespSuccess(commodityCategory)
      }else{
        res = await api.getCommodityCategory()
        if(res.errno == -1){
          console.log("获取商品分类信息失败！")
          return new RespError("获取商品分类信息失败！")
        }
        commodityCategory = res.data
        console.log({"获取商品分类信息成功":commodityCategory})
        wx.setStorageSync('commodityCategory', commodityCategory)
        console.log({"写入商品分类信息缓存":commodityCategory})
        return new RespSuccess(commodityCategory)
      }
    },

    // 获取商品列表，使用分页查询
    async getCommodityListByUidAndCid(params){
      const cid = params.cid
      let commodityList = wx.getStorageSync(`commodityList?cid=${cid}`)
      if(commodityList){
        console.log({"获取商品列表缓存":commodityList})
        return new RespSuccess(commodityList)
      }
      res = await api.getCommodityListByUidAndCid(params)
      if(res.errno == -1){
        console.log("获取商品列表失败！")
        return new RespError("获取商品列表失败！")
      }
      commodityList = res.data
      console.log({"获取商品列表成功":commodityList})
      wx.setStorageSync(`commodityList?cid=${cid}`, commodityList)
      console.log({"写入商品列表缓存":commodityList})
      return new RespSuccess(commodityList)
    },

    // 把数据写入缓存
    setCommodityListByCid(params){
      const {cid, commodityList} = params
      wx.setStorageSync(`commodityList?cid=${cid}`, commodityList)
      console.log({"新数据写入商品列表缓存":commodityList})
      return new RespSuccess(commodityList)
    },

    // 清空商品列表缓存
    clearCommodityList(){
      const commodityCategory = wx.getStorageSync('commodityCategory')
      const len = commodityCategory.length
      for(let i = -1;i < len;i++){
        const str = `commodityList?cid=${i}`
        wx.clearStorageSync(str)
      }
    }
}

module.exports = cache