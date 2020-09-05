// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const commodityQuestionCollection = db.collection('commodity_question')

const MAX_LIMIT = 50

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 通过商品_id获取商品提问
  app.router('getCommodityQuestionAndUserInfo', async (ctx, next) => {
    const {commodity_id, start, count} = event.params
    try{
      ctx.body = await commodityQuestionCollection.aggregate()
      .match({
        commodity_id
      }).lookup({
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

  // 通过问题_id获取商品提问
  app.router('getCommodityQuestionAndUserInfoByQid', async (ctx, next) => {
    const {question_id} = event.params
    try{
      ctx.body = await commodityQuestionCollection.aggregate()
      .match({
        _id: question_id
      }).lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: 'openid',
        as: 'userInfoList'
      })
      .sort({
        create_time: -1
      })
      .end()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
  })

  // 通过_id上传商品提问
  app.router('setCommodityQuestion', async (ctx, next) => {
    try{
      ctx.body = await commodityQuestionCollection.add({
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
    }
  })

    // 获取问题数量
    app.router('getCommodityQuestionCount', async (ctx, next) => {
      const {commodity_id} = event.params
      try{
        ctx.body = await commodityQuestionCollection
        .where({
          commodity_id
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
    app.router('getCommodityQuestionByCidAll', async (ctx, next) => {
      const {commodity_id} = event.params
      try{
        const countResult = await commodityQuestionCollection.where({
          commodity_id,
          is_deleted: false
        }).count()
        const total = countResult.total
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        let res = {}
        ctx.body = {
          data: []
        }
        for (let i = 0; i < batchTimes; i++) {
          res = await commodityQuestionCollection.where({
            commodity_id,
            is_deleted: false
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
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