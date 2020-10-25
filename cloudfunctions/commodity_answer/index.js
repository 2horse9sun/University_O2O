// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const MAX_LIMIT = 50

const commodityAnswerCollection = db.collection('commodity_answer')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 通过提问_id获取问题回答
  app.router('getCommodityAnswerAndUserInfo', async (ctx, next) => {
    const {question_id, start, count} = event.params

    try{
      ctx.body = await commodityAnswerCollection.aggregate()
      .match({
        question_id
      })
      .project({
        update_time: false,
        is_deleted: false
      })
      .lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: 'openid',
        as: 'userInfoList'
      })
      .sort({
        create_time: -1
      })
      .skip(start)
      .limit(count)
      .end()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
  })

  // 通过提问_id上传问题回答
  app.router('setCommodityAnswer', async (ctx, next) => {
    try{
      res = await cloud.openapi.security.msgSecCheck({
        content: JSON.stringify(event.params)
      })
      ctx.body = await commodityAnswerCollection.add({
        data:{
          ...event.params,
          user_id: wxContext.OPENID,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
          is_deleted: false
        }
      })
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
      if (e.errCode.toString() === '87014'){
        ctx.body = {
          errno: 87014
        }
     }
    }
  })

  app.router('getCommodityAnswerCount', async (ctx, next) => {
    const {question_id} = event.params
    try{
      ctx.body = await commodityAnswerCollection
      .where({
        question_id
      })
      .count()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
  })

  // 获取所有问题
  app.router('getCommodityAnswerByCidAll', async (ctx, next) => {
    const {commodity_id} = event.params
    try{
      const countResult = await commodityAnswerCollection.where({
        commodity_id,
        is_deleted: false
      }).count()
      const total = countResult.total
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      console.log(batchTimes)
      let res = {}
      ctx.body = {
        data: []
      }
      for (let i = 0; i < batchTimes; i++) {
        res = await commodityAnswerCollection.where({
          commodity_id,
          is_deleted: false
        })
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .field({
          _id: true
        })
        .get()
        console.log(res)
        ctx.body.data = ctx.body.data.concat(res.data)
      }
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
  })


  return app.serve()
}