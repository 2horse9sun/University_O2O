// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()
const _ = db.command

const commodityCollection = db.collection('commodity')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

    // 获取商品列表
    app.router('getCommodityListByUidAndCid', async (ctx, next) => {
      const {uid, cid, keyword, start, count, is_mine} = event.params
      let w = {}
      if (keyword.trim() != '') {
        w = {
          title: new db.RegExp({
            regexp: keyword,
            options: 'i'
          }),
        }
      }
      w["is_deleted"] = false
      w["uid"] = uid
      if(cid != -1){
        w["cid"] = cid
      }
      
      if(is_mine){
        w["user_id"] = wxContext.OPENID
      }
      try{
        ctx.body = await commodityCollection.where(w)
        .orderBy('create_time', 'desc')
        .skip(start)
        .limit(count)
        .field({
          _id: true,
          cid: true,
          content: true,
          number: true,
          price_now: true,
          price_origin: true,
          status: true,
          thumbnail_url: true,
          title: true
        })
        .get()
        ctx.body.errno = 0
      }catch(e){
        ctx.body = {
          errno: -1
        }
      }
    })

  // 通过_id获取商品详细信息
  app.router('getCommodityDetail', async (ctx, next) => {
    const {id} = event.params
    try{
      ctx.body = await commodityCollection.where({
        _id: id,
        is_deleted: false
      })
      .field({
        create_time: false,
        update_time: false,
        is_deleted: false,
        cid: false
      })
      .get()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
    
  })

  // 上传商品详细信息
  app.router('setCommodityDetail', async (ctx, next) => {
    let params = event.params
    const userPrimaryKey = params.userPrimaryKey
    delete params.userPrimaryKey
    // 创建事务
    const transaction = await db.startTransaction()
    try{
      await transaction
      .collection("commodity")
      .add({
        data:{
          ...params,
          user_id: wxContext.OPENID,
          status: 0,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
          is_deleted: false
        }
      })

      await transaction
      .collection("user")
      .doc(userPrimaryKey)
      .update({
        data:{
          total_release: _.inc(1),
          update_time: db.serverDate(),
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


  // 通过_id删除商品(soft-del)，涉及多张表，使用事务
  // !!!!! 在事务中仅能进行单记录操作，也就是不能使用 where、aggregate 接口 ???  !!!
  // 不能用事务怎么保证ACID?
  // 先查到所有相关主键。。。再传过来一个个删除。。。???
  // 有无更好的解决方法？？？
  app.router('delCommodity', async (ctx, next) => {
    const {cid, tids, qids, aids, fileIDs} = event.params
    // 创建事务
    const transaction = await db.startTransaction()

    try{

      let res = {}

      // 判断该商品是否有相关联的交易，若还有状态处于进行中的交易，则禁止删除
      for(let i = 0;i < tids.length;i++){
        res = await transaction
        .collection("transaction")
        .doc(tids[i])
        .get()
        console.log(res)
        const transactionDetail = res.data
        if(transactionDetail.status == 0){
          ctx.body = {
            errno: -2
          }
          return
        }
      }

      


      // 删除相关提问
      for(let i = 0;i < qids.length;i++){
        res = await transaction
        .collection("commodity_question")
        .doc(qids[i])
        .update({
          data:{
            is_deleted: true
          }
        })
        console.log(res)
      }

      // 删除相关回答
      for(let i = 0;i < aids.length;i++){
        res = await transaction
        .collection("commodity_answer")
        .doc(aids[i])
        .update({
          data:{
            is_deleted: true
          }
        })
        console.log(res)
      }

      // 删除商品信息
      res = await transaction
      .collection("commodity")
      .doc(cid)
      .update({
        data:{
          is_deleted: true
        }
      })

      // 删除相关图片
      // 不在事务内，但是最后一步执行，若删除图片出错，事务仍然会回滚
      res = await cloud.deleteFile({
        fileList: fileIDs,
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


  return app.serve()
}