const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require("lodash")
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message:"value is NOT a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

// UserSchema.methods.toJSON = function () {
//   var user = this
//   var userObject = user.toObject()

//   return _.pick(userObject, ['_id', 'email'])
// }

// as above BUT condenced
UserSchema.methods.toJSON = function () {
  return _.pick(this.toObject(), ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id: user._id, access}, 'abc123').toString()
  
  // user.tokens = [{access, token}]
  user.tokens.push({access, token}) //might mave trouble with .push

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  return this.update({
    $pull: {
      tokens: {
        token
      }
    }
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject()
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user)
        } else {
          reject()
        }
      })
    })
  })
}

UserSchema.statics.findByToken = function (token) {
  var decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
      return Promise.reject()
  }
  
  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash
      next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}
