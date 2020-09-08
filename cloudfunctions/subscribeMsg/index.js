// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  app.router('sendNewTransactionMsg', async (ctx, next) => {
    const params = event.params
    console.log(params)
    try {  
        ctx.body = await cloud.openapi.subscribeMessage.send({
        touser: params.seller_id,
        // touser: wxContext.OPENID,
        templateId: 's9MweXoRKb_IWTm0edo6Ztso2BLcWSrYuTcNT1cDTME',
        page: `/pages/transaction_detail/transaction_detail?enteredFrom=2&transactionNumber=${params.transactionNumber}`,
        data: {
          thing1: {
            value: params.transactionNumber
          },
          thing3: {
            value: params.title
          },
          time7: {
            value: params.create_time
          }
        },
        miniprogramState: 'trial'
      })
      console.log(ctx.body)
      ctx.body.errno = 0
    } catch (err) {
      console.log(err)
      ctx.body = {
        errno: -1
      }
    }
  })


  return app.serve()
}