// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const commodityQuestionCollection = db.collection('commodity_question')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 通过_id获取商品提问
  app.router('getCommodityQuestion', async (ctx, next) => {
    const {commodity_id, start, count} = event.params
    
    ctx.body = await commodityQuestionCollection.where({
      commodity_id
    }).skip(start).limit(count)
    .orderBy('create_time', 'desc').get().then((res) => {
        return res.data
      })
  })

  // 通过_id上传商品提问
  app.router('setCommodityQuestion', async (ctx, next) => {
    
    ctx.body = await commodityQuestionCollection.add({
      data:{
        ...event.params,
        user_id: wxContext.OPENID,
        create_time: db.serverDate(),
        update_time: db.serverDate(),
        is_deleted: false
      }
    }).then((res) => {
        return res.data
      })
  })


  return app.serve()
}