import socket from 'socket.io'

let numUsers = 0

// const emitMessages = async (db, emitter) => {
//   const messages = await getMessages(db)
//   emitter.emit('messages', messages)
// }

// const getMessages = (db) => {
//   return db.collection('messages').find().toArray()
// }

const handleNewMessage = (socket) => {
  socket.on('message', function (msg) {
    socket.broadcast.emit('message', msg)
  })
}

const handleDisconnect = (socket) => {
  socket.on('user disconnect', function (name) {
    --numUsers
    console.log(name, 'left')
    socket.broadcast.emit('message', `Server: ${name} has left the chat.`)
  })
}

const setUpConnection = (io, name) => {
  io.on('connection', async (socket, name) => {
    ++numUsers
    let message = ' has joined the chat'
    console.log(name)
    socket.emit('user joined', { message, numUsers })
    socket.broadcast.emit('user joined', { message, numUsers })
    // emitMessages(db, socket)
    handleNewMessage(socket)
    handleDisconnect(socket)
    console.log('connection set')
  })
}

export default (server, name) => {
  const io = socket(server)
  setUpConnection(io, name)
}

// let numUsers = 0
// io(server).on('connection', function (socket) {
//   ++numUsers
//   let message = 'Server: A new user has joined the chat'
//   socket.emit('user joined', { message, numUsers })
//   socket.broadcast.emit('user joined', { message, numUsers })

// })
