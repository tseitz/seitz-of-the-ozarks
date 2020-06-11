import socket from 'socket.io'

const emitMessages = async (db, emitter) => {
  const messages = await getMessages(db)
  emitter.emit('messages', messages)
}

const getMessages = (db) => {
  return db.collection('messages').find().toArray()
}

const handleNewMessage = (db, client, io) => {
  client.on('newMessage', async (message) => {
    const { text, author } = message
    await db.collection('messages').insertOne({ text, author })
    emitMessages(db, io)
  })
}

// socket.on('message', function (msg) {
//   db.collection('chat').insertOne({ message: msg }, function (err, r) {
//     assert.equal(null, err)
//     assert.equal(1, r.insertedCount)
//   })
//   socket.broadcast.emit('message', msg)
// })

// socket.on('disconnect', function () {
//   --numUsers
//   socket.broadcast.emit('user left', numUsers)
// })

// socket.on('user disconnect', function (name) {
//   socket.broadcast.emit('message', `Server: ${name} has left the chat.`)
// })

const setUpConnection = (io) => {
  io.on('connection', async (client) => {
    // emitMessages(db, client)
    // handleNewMessage(db, client, io)
    console.log('connection set')
  })
}

export default (server) => {
  const io = socket(server)
  setUpConnection(io)
}

// let numUsers = 0
// io(server).on('connection', function (socket) {
//   ++numUsers
//   let message = 'Server: A new user has joined the chat'
//   socket.emit('user joined', { message, numUsers })
//   socket.broadcast.emit('user joined', { message, numUsers })

// })
