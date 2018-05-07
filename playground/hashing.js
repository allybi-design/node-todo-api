// const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const secret = 'mysecret'
var data = {
  id: 10
}

var token = jwt.sign(data, secret)
console.log(token)

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

// token.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data)+ 'mysecret').toString()
// if (resultHash === token.hash) {
//   console.log('Data is \"GOOD\"')
// } else {
//   console.log('Data was changed')
// }