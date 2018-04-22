const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Todo.remove({}).then((res) => {
//   console.log(res)
// })

// Todo.findByIdAndRemove({_id: '5aca24a1566b4847f8078bea'}).then ((res) => {
//  console.log(res);
// })

Todo.findByIdAndRemove('5aca24a1566b4847f8078bea').then((res) => {
  console.log(res);
})
