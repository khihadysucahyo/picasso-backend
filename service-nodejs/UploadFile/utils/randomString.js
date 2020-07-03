var fs = require('fs')

function getRandomString(length) {
  let randomString = ''
  do {
    randomString += Math.random().toString(36).substr(2)
  } while (randomString.length < length)

  randomString = randomString.substr(0, length)

  return randomString
}

function base64_encode(file) {
  var bitmap = fs.readFileSync(file)
  return new Buffer(bitmap).toString('base64')
}

module.exports = {
    getRandomString,
    base64_encode
}
