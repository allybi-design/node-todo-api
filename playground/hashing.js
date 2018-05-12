const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var password = '123abc'

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

// var hashedpassword = '$2a$10$E4XlyxgsltyYt479nFVrS.MMl6/7OKLfzwM8DPgQPnqhsCcm3x//K'

// bcrypt.compare(password, hashedpassword, (err, res) => {
//   console.log(res);
// })

const secret = 'mysecret'
var data = {
  id: 10
}
const user = {
  _id: 6
}
var access = 'auth'
// var token = jwt.sign(data, secret)
var token = jwt.sign({_id: user._id, access}, 'mysecret').toString()
console.log(`the tokern is - ${token}`)

var decoded = jwt.verify(token, secret)
console.log(decoded);


// const message = 'Im user number 3'
// var hash = SHA256(message).toString()

// console.log('message:- ', message);
// console.log('hashed: - ', hash)

// var data = {
//   id: 4
// }
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+ 'mysecret').toString()
// }

// // token.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data)+ 'mysecret').toString()
// if (resultHash === token.hash) {
//   console.log('Data is \"GOOD\"')
// } else {
//   console.log('Data was changed')
// }