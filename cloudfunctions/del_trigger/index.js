// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dreamland2-a708ef"
})

const db = cloud.database()
const _ = db.command

const commodityCollection = db.collection('commodity')
const commodityQuestionCollection = db.collection('commodity_question')
const commodityAnswerCollection = db.collection('commodity_answer')
const transactionCollection = db.collection('transaction')

const MAX_LIMIT = 100

// 云函数入口函数
// 删除：距发布时间超过30天且未被删除的商品，图片
// 删除：距发布时间超过30天的且未被删除商品提问
// 删除：距发布时间超过30天的且未被删除问题回答
// 删除：距结束时间超过30天的交易
exports.main = async (event, context) => {

  let countResult = 0
  let total = 0
  let batchTimes = 0
  let res = {}
  let currentDate = new Date()
  console.log(currentDate)
  let currentDateMinusOneMonth = new Date()
  currentDateMinusOneMonth.setMonth(currentDateMinusOneMonth.getMonth()-1)

  console.log(currentDateMinusOneMonth)

  // 删除：距发布时间超过30天且未被删除的商品，图片
  countResult = await commodityCollection.count()
  total = countResult.total
  batchTimes = Math.ceil(total / MAX_LIMIT)
  let fileIDs = []
  for (let i = 0; i < batchTimes; i++) {
    // 获取图片fileIDs
    res = await commodityCollection
    .where({
      is_deleted: false,
      create_time: _.lte(currentDateMinusOneMonth)
    })
    .field({
      thumbnail_url: true,
      img_url: true
    })
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .get()
    console.log(res)
    const commodityList = res.data
    for(let i = 0;i < commodityList.length;i++){
      fileIDs = fileIDs.concat(commodityList[i].thumbnail_url)
      fileIDs = fileIDs.concat(commodityList[i].img_url)
    }


    // soft-del
    res = await commodityCollection
    .where({
      is_deleted: false,
      create_time: _.lte(currentDateMinusOneMonth)
    })
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .update({
      data:{
        is_deleted: true
      }
    })
  }

  console.log(fileIDs)
  if(fileIDs.length > 0){
    res = await cloud.deleteFile({
      fileList: fileIDs,
    })
  }
  


  // 删除：距发布时间超过30天的且未被删除商品提问
  // soft-del
  countResult = await commodityQuestionCollection.count()
  total = countResult.total
  batchTimes = Math.ceil(total / MAX_LIMIT)
  for (let i = 0; i < batchTimes; i++) {
    res = await commodityQuestionCollection
    .where({
      is_deleted: false,
      create_time: _.lte(currentDateMinusOneMonth)
    })
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .update({
      data:{
        is_deleted: true
      }
    })
  }


  // 删除：距发布时间超过30天的且未被删除问题回答
  // soft-del
  countResult = await commodityAnswerCollection.count()
  total = countResult.total
  batchTimes = Math.ceil(total / MAX_LIMIT)
  for (let i = 0; i < batchTimes; i++) {
    res = await commodityAnswerCollection
    .where({
      is_deleted: false,
      create_time: _.lte(currentDateMinusOneMonth)
    })
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .update({
      data:{
        is_deleted: true
      }
    })
  }


  // 删除：距结束时间超过30天的已完成/已取消的交易
  countResult = await transactionCollection.count()
  total = countResult.total
  batchTimes = Math.ceil(total / MAX_LIMIT)
  for (let i = 0; i < batchTimes; i++) {
    res = await transactionCollection
    .where({
      is_deleted: false,
      status: _.neq(0),
      end_time: _.lte(currentDateMinusOneMonth)
    })
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .update({
      data:{
        is_deleted: true
      }
    })
  }


}