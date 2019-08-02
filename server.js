const express = require('express')
const server = express()
const usersRouter = require('./users/userRouter.js')
const postsRouter = require('./posts/postRouter.js')

server.use(logger)
server.use(express.json())
server.use('/api/users', usersRouter)
server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
})

//custom middleware

function logger(req, res, next) {
  console.log("url: ", req.url)
  console.log("method: ", req.method)
  console.log("time: ", new Date().getTime())
  next()
}

module.exports = server
