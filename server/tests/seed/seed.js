const {ObjectID} = require('mongodb')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')
const jwt = require('jsonwebtoken')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const dummyTodos = [{
  _id: new ObjectID(),
  text: '1st test todo',
  completed: false,
  completedAt: null,
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: '2nd test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}]

const users = [
  {
    _id: userOneId,
    email: 'user1@here.com',
    password: 'mysecret',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'user2@there.co.uk',
    password: 'abc123',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
]

const populateTodos = ((done) => {
  Todo.remove().then(() => {
     return Todo.insertMany(dummyTodos)
    }).then(() => done())
})

const populateUsers = ((done) => {
  User.remove().then(() => {
    var userOne = new User(users[0]).save()
    var userTwo = new User(users[1]).save()
    return Promise.all([userOne, userTwo])
  }).then(() => done())
})

module.exports = {
  populateTodos,
  populateUsers,
  dummyTodos,
  users
}