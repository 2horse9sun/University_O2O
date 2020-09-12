// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const userCollection = db.collection('user')



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 获取此用户信息和大学信息
  app.router('getMyInfoAndMyUniversityInfo', async (ctx, next) => {
    try{
      ctx.body = await userCollection.aggregate()
      .match({
        openid: wxContext.OPENID,
        is_deleted: false
      })
      .project({
        create_time: false,
        update_time: false,
        is_deleted: false
      })
      .lookup({
        from: 'university',
        localField: 'uid',
        foreignField: 'uid',
        as: 'universityInfo'
      })
      .end()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1,
      }
    }
  })

  // 获取用户信息
  app.router('getUserInfoFromDbByUserId', async (ctx, next) => {
    const {userId} = event.params
    try{
      ctx.body = await userCollection.where({
        openid: userId,
        is_deleted: false
      })
      .field({
        _id: true,
        contact_info_qq: true,
        contact_info_wx: true,
      })
      .get()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
   
  })

  // 添加自己的信息
  app.router('setMyInfo', async (ctx, next) => {
    try{
      ctx.body = await userCollection.add({
        data: {
          ...event.params,
          openid: wxContext.OPENID,
          student_auth: true,
          total_transaction: 0,
          total_sell: 0,
          total_buy: 0,
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

  // 更新自己的信息
  app.router('updateMyInfo', async (ctx, next) => {
    try{
      ctx.body = await userCollection.where({
        openid: wxContext.OPENID
      }).update({
        data: {
          ...event.params,
          update_time: db.serverDate()
        }
      })
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1,
      }
    }
    
  })


  // 学生身份验证, 空方法，默认返回true
  // TODO: 完善学生身份验证
  // app.router('studentIdAuth', async (ctx, next) => {
  //   ctx.body = await userCollection.where({
  //     openid: wxContext.OPENID,
  //     is_deleted: false
  //   }).get().then((res) => {
  //     return true
  //   })
  // })

  return app.serve()
}