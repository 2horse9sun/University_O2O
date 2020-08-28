// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
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

  // 获取用户信息
  app.router('getUserInfo', async (ctx, next) => {
    ctx.body = await userCollection.where({
      openid: wxContext.OPENID,
      is_deleted: false
    }).get().then((res) => {
      return res.data
    })
  })

  // 添加用户信息
  app.router('setUserInfo', async (ctx, next) => {
    const params = event.params
    await userCollection.add({
      data: {
        ...params,
        openid: wxContext.OPENID,
        student_auth: true,
        create_time: db.serverDate(),
        update_time: db.serverDate(),
        is_deleted: false
      }
    }).then((res) => {
      return res
    })
  })

  // 更新用户信息
  app.router('updateUserInfo', async (ctx, next) => {
    const params = event.params
    await userCollection.where({
      openid: wxContext.OPENID
    }).update({
      data: {
        ...params,
        update_time: db.serverDate()
      }
    }).then((res) => {
      return res
    })
  })

  // 学生身份验证, 空方法，默认返回true
  // TODO: 完善学生身份验证
  app.router('studentIdAuth', async (ctx, next) => {
    ctx.body = await userCollection.where({
      openid: wxContext.OPENID,
      is_deleted: false
    }).get().then((res) => {
      return true
    })
  })

  return app.serve()
}