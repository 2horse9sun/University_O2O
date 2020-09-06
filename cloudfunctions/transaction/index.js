// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()
const _ = db.command

const MAX_LIMIT = 50

const transactionCollection = db.collection('transaction')
const commodityCollection = db.collection('commodity')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 获取交易列表
  app.router('getMySellTransactionList', async (ctx, next) => {
    const {start, count} = event.params
    let w = {}
    w["is_deleted"] = false
    w["seller_id"] = wxContext.OPENID
    try{
      ctx.body = await transactionCollection.where(w).skip(start).limit(count)
      .orderBy('create_time', 'desc').get()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
  })
  // 获取交易列表
  app.router('getMyBuyTransactionList', async (ctx, next) => {
    const {start, count} = event.params
    let w = {}
    w["is_deleted"] = false
    w["buyer_id"] = wxContext.OPENID
    try{
      ctx.body = await transactionCollection
      .where(w)
      .orderBy('create_time', 'desc')
      .skip(start)
      .limit(count)
      .get()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
  })

  // 根据交易编号获取交易详情
  app.router('getTransactionByTransactionNumber', async (ctx, next) => {
    const {transaction_no} = event.params
    try{
      ctx.body = await transactionCollection.where({
        transaction_no,
        is_deleted: false
      }).get()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
  })


  // 发起交易，涉及多张表，使用事务
  app.router('setTransaction', async (ctx, next) => {
    const params = event.params
    const commodity_id = params.commodity_id
    const purchaseNumber = params.number
    const sellerPrimaryKey = params.sellerPrimaryKey
    const buyerPrimaryKey = params.buyerPrimaryKey

    // 创建事务
    const transaction = await db.startTransaction()
    try{
    
      // 查询库存并修改库存(原子操作)，若修改失败则说明库存不足，无法进行交易
      const resGetCommodityDetail = await transaction
      .collection("commodity")
      .doc(commodity_id)
      .get()
      const commodityDetail = resGetCommodityDetail.data
      const commodityNumber = commodityDetail.number
      if(purchaseNumber > commodityNumber){
        ctx.body = {
          errno: -2
        }
        return
      }

      // 修改商品数量，若数量为0，则改为交易中状态
      const newNumber = commodityNumber - purchaseNumber
      const newStatus = newNumber==0 ? 1 : 0
      await transaction
      .collection("commodity")
      .doc(commodity_id)
      .update({
        data:{
          number: newNumber,
          status: newStatus
        }
      })

      // 更新用户的总交易数
      await transaction
      .collection("user")
      .doc(sellerPrimaryKey)
      .update({
        data:{
          total_transaction: _.inc(1),
          update_time: db.serverDate()
        }
      })
      await transaction
      .collection("user")
      .doc(buyerPrimaryKey)
      .update({
        data:{
          total_transaction: _.inc(1),
          update_time: db.serverDate()
        }
      })

      // 写入订单
      const transactionNumber = Date.now() + "-" + parseInt(Math.random() * 10000000) 
      ctx.body = await transaction
      .collection("transaction")
      .add({
        data:{
          ...params,
          transaction_no: transactionNumber,
          buyer_id: wxContext.OPENID,
          status: 0,
          seller_status: 0,
          buyer_status: 0,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
          end_time: "",
          is_deleted: false
        }
      })
      ctx.body.transactionNumber = transactionNumber
      ctx.body.errno = 0

      // 全部数据库操作成功后，提交事务
      await transaction.commit()

    }catch(e){
      console.log("事务错误！")
      // 事务回滚
      transaction.rollback()
      ctx.body = {
        errno: -1
      }
    }
  })

  // 取消交易，涉及多张表，使用事务
  app.router('cancelTransaction', async (ctx, next) => {
    const {id} = event.params
    const transaction = await db.startTransaction()

    try{
      // 判断交易的状态为进行中
      const resGetTransactionDetail = await transaction
      .collection("transaction")
      .doc(id)
      .get()
      const transactionDetail = resGetTransactionDetail.data
      const commodity_id = transactionDetail.commodity_id
      const purchaseNumber = transactionDetail.number
      const transactionStatus = transactionDetail.status
      if(transactionStatus != 0){
        ctx.body = {
          errno: -2
        }
        return
      }

      // 更新交易状态：已取消
      await transaction
        .collection("transaction")
        .doc(id)
        .update({
          data:{
            status: 2,
            update_time: db.serverDate(),
            end_time: db.serverDate()
          }
        })

      // 恢复商品的数量，改变商品状态
      const resGetCommodityDetail = await transaction
      .collection("commodity")
      .doc(commodity_id)
      .get()
      const commodityDetail = resGetCommodityDetail.data
      let commodityNumber = commodityDetail.number
      commodityNumber += purchaseNumber
      await transaction
      .collection("commodity")
      .doc(commodity_id)
      .update({
        data:{
          status: 0,
          number: commodityNumber,
          update_time: db.serverDate()
        }
      })
      transaction.commit()
      ctx.body = {
        errno: 0
      }
    }catch(e){
      transaction.rollback()
      ctx.body = {
        errno: -1
      }
    }
  })

  // 更新交易状态，涉及多张表，使用事务
  app.router('confirmFinishTransaction', async (ctx, next) => {
    let {id, isSeller, seller_status, buyer_status} = event.params
    const transaction = await db.startTransaction()


    try{
      // 判断交易的状态为进行中
      const resGetTransactionDetail = await transaction
      .collection("transaction")
      .doc(id)
      .get()
      const transactionDetail = resGetTransactionDetail.data
      const commodity_id = transactionDetail.commodity_id
      const transactionStatus = transactionDetail.status
      if(transactionStatus != 0){
        ctx.body = {
          errno: -2
        }
        return
      }

      // 更新交易表
      if(isSeller){
        seller_status = 1
        await transaction
        .collection("transaction")
        .doc(id)
        .update({
          data:{
            seller_status: 1,
            status: buyer_status==1?1:0,
            update_time: db.serverDate(),
            end_time: buyer_status==1?db.serverDate():""
          }
        })
      }else{
        buyer_status = 1
        await transaction
        .collection("transaction")
        .doc(id)
        .update({
          data:{
            buyer_status: 1,
            status: seller_status==1?1:0,
            update_time: db.serverDate(),
            end_time: seller_status==1?db.serverDate():""
          }
        })
      }

      // 若商品数量为0，则更新为下架状态
      const resGetCommodityDetail = await transaction
      .collection("commodity")
      .doc(commodity_id)
      .get()
      const commodityDetail = resGetCommodityDetail.data
      const commodityNumber = commodityDetail.number
      if(commodityNumber == 0){
        await transaction
        .collection("commodity")
        .doc(commodity_id)
        .update({
          data:{
            status: 2,
            update_time: db.serverDate()
          }
        })
      }
      transaction.commit()
      ctx.body = {
        errno: 0
      }
    }catch(e){
      transaction.rollback()
      ctx.body = {
        errno: -1
      }
    }
    
  })



  // 获取所有交易
  app.router('getTransactionByCidAll', async (ctx, next) => {
    const {commodity_id} = event.params
    try{
      const countResult = await transactionCollection.where({
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
        res = await transactionCollection.where({
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

  // 根据交易_id删除交易(soft-del)
  // app.router('delTransaction', async (ctx, next) => {
  //   const {id} = event.params
  //   try{
  //     ctx.body = await transactionCollection.where({
  //       _id: id
  //     }).update({
  //       data:{
  //         is_deleted: true
  //       }
  //     })
  //     ctx.body.errno = 0
  //   }catch(e){
  //     ctx.body = {
  //       errno: -1
  //     }
  //   }
    
  // })


  return app.serve()
}