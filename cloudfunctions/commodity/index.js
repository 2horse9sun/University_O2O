// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const universityCollection = db.collection('university')
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
        _id: id
      }).get()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
    
  })

  // 上传商品详细信息
  app.router('setCommodityDetail', async (ctx, next) => {
    try{
      ctx.body = await commodityCollection.add({
        data:{
          ...event.params,
          user_id: wxContext.OPENID,
          status: 0,
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


  // 通过_id删除商品(soft-del)
  app.router('delCommodity', async (ctx, next) => {
    const {id} = event.params
    
    ctx.body = await commodityCollection.where({
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