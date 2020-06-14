import socket from 'socket.io'

let numUsers = 0
let admin

// const emitMessages = async (db, emitter) => {
//   const messages = await getMessages(db)
//   emitter.emit('messages', messages)
// }

const getMessages = async (socket, db) => {
  const snapshot = await db.collection('chat').orderBy('timestamp', 'asc').get()
  const messages = snapshot.docs.map((doc) => doc.data())
  socket.emit('get messages', messages)
  // socket.broadcast.emit('get messages', messages)
}

const handleNewMessage = (socket, db) => {
  socket.on('message', function (messageObj) {
    const snapshot = db.collection('chat').add(messageObj)
    socket.broadcast.emit('message', messageObj)
  })
}

const handleDisconnect = (socket) => {
  socket.on('user disconnect', function (name) {
    --numUsers
    console.log(name, 'left')
    socket.broadcast.emit(
      'user disconnect',
      {
        timestamp: Date.now(),
        displayName: 'Server',
        message: `${name} has left the chat.`,
      },
      numUsers
    )
    socket.disconnect()
  })
}

const handleLogout = (socket) => {
  socket.on('user logged out', function (name) {
    --numUsers
    console.log(name, 'left')
    socket.emit(
      'user left',
      {
        timestamp: Date.now(),
        displayName: 'Server',
        message: `${name} has left the chat.`,
      },
      numUsers
    )
  })
}

const setUpConnection = (io) => {
  io.on('connection', async (socket) => {
    ++numUsers
    const db = admin.firestore()
    handleNewMessage(socket, db)
    await getMessages(socket, db)
    const messageObj = {
      displayName: 'Server',
      message: 'has joined the chat',
      timestamp: Date.now(),
    }
    console.log(messageObj)
    socket.broadcast.emit('user joined', { messageObj, numUsers }) // sends to all other clients except new connection
    handleDisconnect(socket)
    handleLogout(socket)
    console.log('connection set')
  })
}

export default async (server) => {
  admin = await import('./firebase/admin')
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
