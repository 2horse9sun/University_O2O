// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const transactionCollection = db.collection('transaction')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 获取交易列表
  // TODO: 表连接，同时查到出售和购买的交易记录
  app.router('getTransactionList', async (ctx, next) => {
    const {start, count} = event.params
    let w = {}
    w["is_deleted"] = false
    w["buyer_id"] = wxContext.OPENID
    ctx.body = await transactionCollection.where(w).skip(start).limit(count)
      .orderBy('create_time', 'desc').get().then((res) => {
        return res.data
      })
  })


  // 发起交易
  // TODO: 表连接，查询商品出售者的_id，加入到交易表中
  app.router('setTransaction', async (ctx, next) => {
    const params = event.params
    
    ctx.body = await transactionCollection.add({
      data:{
        ...params,
        buyer_id: wxContext.OPENID,
        commission_fee: 0,
        status: 0,
        create_time: db.serverDate(),
        end_time: "",
        is_deleted: false
      }
    }).then((res) => {
        return res.data
      })
  })

  // 根据交易_id删除交易(soft-del)
  app.router('delTransaction', async (ctx, next) => {
    const {id} = event.params
    ctx.body = await transactionCollection.where({
      _id: id
    }).update({
      data:{
        is_deleted: true
      }
    }).then((res) => {
        return res.data
      })
  })


  return app.serve()
}