const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const {dummyTodos, user, populateTodos, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var newTodo = {
      text: 'A NEW Test todo text',
      compleated: false,
      compleatedAt: null
      }

    request(app)
      .post('/todos')
      .send(newTodo)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(newTodo.text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        var text = newTodo.text
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(newTodo.text)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(dummyTodos.length)
          done()
        }).catch((e) => done(e))
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(dummyTodos.length)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummyTodos[0].text)
      })
      .end(done)
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString()

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done)
  })
})

//DELETE method test
describe('Delete /todos/:id', () => {
  it('should DELETE/:id todo doc', (done) => {
    request(app)
      .delete(`/todos/${dummyTodos[3]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummyTodos[3].text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(dummyTodos[3]._id.toHexString()).then((todo) => {
          expect(todo).toBeFalsy()
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for invalide ids', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done)
  })
})

// PATCH method test
describe('PATCH /todos/:id', () => {
  it('should change completed to \"true\" on 1st record', (done) => {
    var hexId = dummyTodos[0]._id.toHexString()
    var text = "The first value changed to complete"
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
          text,
          completedAt: new Date().getTime(),
          completed: true
        })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.text).toBe(text)
      })
      .end(done)
  })

  it('should change completed to \"false\" on 2st record', (done) => {
    var hexId = dummyTodos[1]._id.toHexString()
    var text = "The second value changed to NOT complete"
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
          text,
          completedAt: null,
          completed: false
        })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false)
      })
      .end(done)
  })
})

describe('GET /users/me', () => {
  it('should return user if authenicated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', user[0].tokens.token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(user[0]._id.toHexString())
        expect(res.body.email).toBe(user[0].email)
      })
      .end(done)
  })

  it('Should return a 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    })
    .end(done)
  })
})

describe('POST /user', () => {
  it('should create a user', (done) => {
    var email = "aTestUser@test.com"
    var password = "atestpassword"

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy()
      expect(res.body._id).toBeTruthy()
      expect(res.body.email).toEqual(email)
    })
    // .end(done)
    .end((err) => {
      if (err) {
        return done(err)
      }

      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy()
        expect(user.password).toNotBe(password)
        done()
      }).catch((e) => done(e))
    })
  })
  it('should return validatioon erros if request is invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: 'aname',
      password: '123'
    })
    .expect(400)
    .end(done)
  })
  it('sholud not create a user if email is in use', (done) => {
    request(app)
    .post('/users')
    .send(user[0].email, user[0].password)
    .expect(400)
    .end(done)
  })
})

describe('POST /users/login', () => {
 
  it('should login user & return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: user[1].email,
      password: user[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist()
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }

      User.findById(user[1]._id).then((user) => {
        expect(user.tokens[0])
          .toInclude({
            access: 'auth',
            token: res.header['x-auth']
        })
        done()
      }).catch((e) => done(e))
    })
  })

  it('Should reject a invalid login', (done) => {
    
    request(app)
    .post('/users/login')
    .send({
      email: user[1].email,
      password: user[1].password+ '1'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist()
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }

      User.findById(user[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0)
        done()
      }).catch((e) => done(e))
    })
  })
})
