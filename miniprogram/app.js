const cache = require("./cache/cache")
//app.js
App({
  async onLaunch() {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'dreamland2-a708ef',
        traceUser: true,
      })
    }

    this.globalData = {}



    // Color UI: 获得系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // 清空缓存
    wx.clearStorageSync()

    // 查询用户是否已经注册
    const res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      this.globalData['registered'] = false
    }else{
      this.globalData['registered'] = true
    }
  },
  
})
