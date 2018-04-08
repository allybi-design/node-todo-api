// C:\Program Files\MongoDB\Server\3.6\bin>mongod.exe --dbpath /users/aliso/mongo-data

// const MongoClient = require('mongodb').MongoClient // NB this is the same as below 
const {MongoClient, ObjectId} = require('mongodb')  // destructured objects from mongodb

// const object = new ObjectId() // create a local _Id from ObjectId
// console.log(object)
// console.log(object.getTimestamp()) // extract the timeStamp from _Id

const url = 'mongodb://localhost:27017'
const dbName = 'TodoApp'

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDb Server')
  } 
  console.log('Connected to MongoDB Server')
  const db = client.db(dbName)
  
  // db.collection('Todos').insertOne({
  //   text: 'Walk the dog',
  //   compleated: true
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Couldnt insert todo - ', err)
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  db.collection('Todos').insertOne({
    text: "Walk Dog",
    compleated: true
  }, (err, result) => {
    if (err) {
      return console.log('Couldnt insert todo - ', err)
    }
    console.log(result.ops[0]._id.getTimestamp())
  })

  
  client.close('Connection Closed')
})