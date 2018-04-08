const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

var id = '5abe6be423c70418281bdad1'

if (!ObjectID.isValid(id)) {
  console.log('ID is invalid')
} 

// Todo.find({
//   _id: id
// }).then((todos) => {
//   if (todos.length === 0) {
//     return console.log('No Todos with ID found')
//   } 
//   console.log('All Todos', todos)
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   if (!todo) {
//     return console.log('No Todo with ID found')
//   } 
//   console.log('Todo', todo)
// })

// Todo.findById(id)
//   .then((todo) => {
//     if (!todo) {
//       return console.log('ID Not found')
//     }
//     console.log('TodoBy ID', todo)
// }).catch((e) => console.log(e))

User.findById(id)
  .then((user) => {
    if (!user) {return console.log('Cant user by ID')}
    console.log('User By ID', user)
  })
  .catch((e) => console.log(e))