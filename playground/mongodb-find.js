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

  // db.collection(collection).find({compleated: false}).toArray().then((docs) => {  // find only object with the complkeated === false
  //   console.log(collection)
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  // db.collection(collection).find({   // find only objects that make the _id that === 'cursor' or 'query'
  //   _id: new ObjectId('5ab798a204b44d08f0a75a4f')
  // }).toArray().then((docs) => {
  //   console.log(collection)
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })
  
  const query = {
    name: 'Fred Hill'
  }

  db.collection(collection).find(query).count().then((count) => {
    console.log(`There are ${count} records in the ${collection} collection in the ${dbName} DataBase`)
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })
  db.collection(collection).find(query).toArray().then((docs) => {
    console.log('They are listed below:-')
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })
  
  
  
  // client.close('Connection Closed')
})