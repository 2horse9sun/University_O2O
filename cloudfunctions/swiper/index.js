// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const swiperCollection = db.collection('swiper')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 获取轮播图路径
  app.router('getSwiperImg', async (ctx, next) => {
    ctx.body = await swiperCollection.where({
      is_deleted: false
    }).get().then((res) => {
      return res.data
    })
  })

  return app.serve()
}