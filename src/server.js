import sirv from 'sirv'
import http from 'http'
import express from 'express'
import session from 'express-session'
import compression from 'compression'
import * as sapper from '@sapper/server'
// import bodyParser from 'body-parser'
import setUpConfig from './config'
import setUpSockets from './sockets'
require('dotenv').config()

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()
const server = http.createServer(app)

app.use(
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  // bodyParser.json(),
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
  }),
  sapper.middleware({
    session: (req, res) => {
      return {} // TODO: Figure out how this works
    },
  })
)

const start = async () => {
  await setUpConfig(process.env)
  setUpSockets(server)

  server.listen(PORT, (err) => {
    if (err) console.log('error', err)
  })
}

start()

export { app, sapper }
