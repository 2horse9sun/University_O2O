// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()
const _ = db.command

const transactionCollection = db.collection('transaction')
const commodityCollection = db.collection('commodity')

let AsyncLock = require('async-lock');
let lock = new AsyncLock();

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

  // 根据交易编号获取交易详情
  app.router('getTransactionByTransactionNumber', async (ctx, next) => {
    const {transaction_no} = event.params
    ctx.body = await transactionCollection.where({
      transaction_no,
      is_deleted: false
    }).get().then((res) => {
        return res.data
      })
  })


  // 发起交易
  app.router('setTransaction', async (ctx, next) => {
    const params = event.params
    const commodity_id = params.commodity_id
    const purchaseNumber = params.number
    console.log(params)

    // 查询库存并修改库存(原子操作)，若修改失败则说明库存不足，无法进行交易
    const resModifyCommodifyNumber = await commodityCollection.where({
      _id: commodity_id,
      number: _.gte(parseInt(purchaseNumber))
    }).update({
      data:{
        number: _.inc(-parseInt(purchaseNumber))
      }
    })
    console.log(resModifyCommodifyNumber)
    if(resModifyCommodifyNumber.stats.updated == 0){
      ctx.body = {
        errno: -1
      }
    }else{
      const resModifyCommodifyStatus = await commodityCollection.where({
        _id: commodity_id,
        number: 0
      }).update({
        data:{
          status: 1
        }
      })
      console.log(resModifyCommodifyStatus)
      const transactionNumber = Date.now() + "-" + parseInt(Math.random() * 10000000) 
      ctx.body = await transactionCollection.add({
        data:{
          ...params,
          transaction_no: transactionNumber,
          buyer_id: wxContext.OPENID,
          status: 0,
          seller_status: 0,
          buyer_status: 0,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
          end_time: "未结束",
          is_deleted: false
        }
      })
      ctx.body.errno = 0
      ctx.body.transactionNumber = transactionNumber
    }
    
  })

  app.router('cancelTransaction', async (ctx, next) => {
    const {id} = event.params

    const resModifyTransactionStatus = await transactionCollection.where({
      _id: id
    }).update({
      data:{
        status: 2,
        update_time: db.serverDate(),
        end_time: db.serverDate(),
      }
    })
    console.log(resModifyTransactionStatus)

    
    const resGetTransactionDetail = await transactionCollection.where({
      _id: id
    }).get()
    console.log(resGetTransactionDetail)
    const purchaseNumber = resGetTransactionDetail.data[0].number
    const commodity_id = resGetTransactionDetail.data[0].commodity_id


    const resModifyCommodifyNumber = await commodityCollection.where({
      _id: commodity_id,
    }).update({
      data:{
        number: _.inc(parseInt(purchaseNumber))
      }
    })
    console.log(resModifyCommodifyNumber)
  })

  // 更新交易状态至确认状态，若都确认，则交易完成
  app.router('confirmFinishTransaction', async (ctx, next) => {
    let {id, isSeller, seller_status, buyer_status} = event.params
    if(isSeller){
      seller_status = 1
      await transactionCollection.where({
        _id: id
      }).update({
        data:{
          seller_status: 1,
          status: buyer_status==1?1:0,
          update_time: db.serverDate()
        }
      })

    }else{
      buyer_status = 1
      await transactionCollection.where({
        _id: id
      }).update({
        data:{
          buyer_status: 1,
          status: seller_status==1?1:0,
          update_time: db.serverDate()
        }
      })
    }


    
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
    })
  })


  return app.serve()
}