require('./config/config')

const express = require("express")
const _ = require("lodash")
const bodyParser = require("body-parser")

const { ObjectID } = require("mongodb")
const { mongoose } = require("./db/mongoose")
const { Todo } = require("./models/todo")
const { User } = require("./models/user")
const { authenticate } = require('./middleware/authenicate')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

// PUSH a new todo to DB
app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo
    .save()
    .then(doc => {
      res.send(doc)
    })
    .catch(e => {
      res.status(400).send(e)
    })
})

//GET All todos from DB
app.get("/todos", (req, res) => {
  Todo.find()
    .then(todos => {
      res.send({ todos })
    })
    .catch(e => {
      res.status(400).send(e)
    })
})

//GET A todos from DB
app.get("/todos/:id", (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(e => {
      res.status(400).send()
    })
})

//DELETE a todos from DB
app.delete("/todos/:id", (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({ message: "Item could not be found" })
      }
      res.status(200).send({ todo: todo })
    })
    .catch(e => {
      res.status(400).send(e)
    })
})

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ["text", "completed"])
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(400).send()
      }
      res.status(200).send({todo})
    })
    .catch(e => {
      res.status(400).send(e)
  })
})

// PUSH a new USER to DB
app.post("/users", (req, res) => {
  var user = new User(_.pick(req.body, ['email', 'password']))
  user.save().then(() => {
     return user.generateAuthToken()
    }).then ((token) => {
      res.header('x-auth', token).send(user)
    }).catch(e => {
      res.status(400).send(e)
    })
})

// exported to module in ./middleware
// var authenticate = (req, res, next) => {
//   var token = req.header('x-auth')

//   User.findByToken(token).then((user) => {
//     if (!user) {
//       return Promise.reject('Can\'t find user')
//     }
//     req.user = user
//     req.token = token
//     next()
//   }).catch((e) => {
//     res.status(401).send(e)
//   })
// }

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = { app }
