// C:\Program Files\MongoDB\Server\3.6\bin>mongod.exe --dbpath /users/aliso/mongo-data

const {MongoClient, ObjectId} = require('mongodb')  // destructured objects from mongodb

const url = 'mongodb://localhost:27017'
const dbName = 'TodoApp'
const collection = 'users'

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDb Server')
  } 
  console.log('Connected to MongoDB Server')
  const db = client.db(dbName)
 
  // deleteMany
  // var query = {
  //   name: "Fred Hill"
  // }
  // db.collection(collection).deleteMany(query).then((result) => {
  //   console.log(`${result} was Deleted from ${collection} collection in the ${dbName} DataBase`)
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  // //deleteOne
  // var query = {
  //   text: "Go Shopping"
  // }
  // db.collection(collection).deleteOne(query).then((result) => {
  //   console.log(`${result} was Deleted from ${collection} collection in the ${dbName} DataBase`)
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  // findOneAndDelete
  var query = {
    _id : new ObjectId("5aca6f846c0d34169c7d9c6b")
  }
  db.collection(collection).findOneAndDelete(query).then((result) => {
    console.log(result)
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })
  
  
  // client.close('Connection Closed')
})