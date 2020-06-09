import sirv from 'sirv'
import http from 'http'
import express from 'express'
import session from 'express-session'
import io from 'socket.io'
import compression from 'compression'
import * as sapper from '@sapper/server'
import bodyParser from 'body-parser'
import admin from './firebase/admin'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const httpServer = http.createServer()
const server = express()

let numUsers = 0
io(httpServer).on('connection', function (socket) {
  ++numUsers
  let message = 'Server: A new user has joined the chat'
  socket.emit('user joined', { message, numUsers })
  socket.broadcast.emit('user joined', { message, numUsers })

  socket.on('message', function (msg) {
    db.collection('chat').insertOne({ message: msg }, function (err, r) {
      assert.equal(null, err)
      assert.equal(1, r.insertedCount)
    })
    socket.broadcast.emit('message', msg)
  })

  socket.on('disconnect', function () {
    --numUsers
    socket.broadcast.emit('user left', numUsers)
  })

  socket.on('user disconnect', function (name) {
    socket.broadcast.emit('message', `Server: ${name} has left the chat.`)
  })
})

server
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    bodyParser.json(),
    session({
      secret: 'test',
      resave: false,
      saveUninitialized: false,
    }),
    sapper.middleware({
      session: (req, res) => {
        return {}
      },
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err)
  })
