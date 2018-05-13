const {ObjectID} = require('mongodb')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')
const jwt = require('jsonwebtoken')

const dummyTodos = [{
  _id: new ObjectID(),
  text: '1st test todo',
  completed: false,
  completedAt: null
},{
  _id: new ObjectID(),
  text: '2nd test todo',
  completed: true,
  completedAt: 333
},{
  _id: new ObjectID(),
  text: '3rd test todo',
  completed: false,
  completedAt: null
},{
  _id: new ObjectID(),
  text: '4th test todo',
  completed: false,
  completedAt: null
}]

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const user = [
  {
    _id: userOneId,
    email: 'user1@here.com',
    password: 'mysecret',
    tokens: {
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }
  },
  {
    _id: userTwoId,
    email: 'user2@there.co.uk',
    password: 'abc123'
  }
]

const populateTodos = ((done) => {
  Todo.remove().then(() => {
     return Todo.insertMany(dummyTodos)
    }).then(() => done())
})

const populateUsers = ((done) => {
  User.remove().then(() => {
    var userOne = new User(user[0]).save()
    var userTwo = new User(user[1]).save()
    return Promise.all([userOne, userTwo])
  }).then(() => done())
})

module.exports = {
  populateTodos,
  populateUsers,
  dummyTodos,
  user
}