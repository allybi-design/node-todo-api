const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require("lodash")

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
    token:{
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

//as above BUT condenced
UserSchema.methods.toJSON = function () {
  return _.pick(this.toObject(), ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'mysecret').toString()

  user.tokens = user.tokens.concat([{access, token}])

  return user.save().then(() => {
    return token
  })
}

UserSchema.statics.findByToken = function (token) {
  var User = this
  var decoded

  try {
    decoded = jwt.verify(token, 'mysecret')
  } catch (e) {
      return Promise.reject('NOT Authenticated')
    }
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    })
  }

const User = mongoose.model('User', UserSchema)

module.exports = {User}
