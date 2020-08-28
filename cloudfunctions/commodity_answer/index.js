// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const commodityAnswerCollection = db.collection('commodity_answer')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 通过提问_id获取问题回答
  app.router('getCommodityAnswer', async (ctx, next) => {
    const {question_id, start, count} = event.params
    
    ctx.body = await commodityAnswerCollection.where({
      question_id
    }).skip(start).limit(count)
    .orderBy('create_time', 'desc').get().then((res) => {
        return res.data
      })
  })

  // 通过提问_id上传问题回答
  app.router('setCommodityAnswer', async (ctx, next) => {
    
    ctx.body = await commodityAnswerCollection.add({
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