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

  // findOneAndUpdate
  db.collection(collection).findOneAndUpdate({
      name: "Alison Smith"
    }, {
      $inc: {
        age: -5
      }
    }, {
      returnOriginal: false
    }
  ).then((result) => {
    console.log(result)
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })
  
  
  // client.close('Connection Closed')
})