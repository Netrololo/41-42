const socketClient = {
  socket: null,

  connect(token) {
    this.socket = io('http://localhost:3000/chat', {
      auth: { token },
    })

    this.socket.on('connect_error', (err) => {
      console.error('Socket ошибка подключения:', err.message)
    })
  },

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  },

  joinRoom(roomId) {
    this.socket.emit('room:join', roomId)
  },

  leaveRoom(roomId) {
    this.socket.emit('room:leave', roomId)
  },

  sendMessage(roomId, content) {
    this.socket.emit('message:send', roomId, content)
  },

  onRoomJoined(cb) {
    this.socket.on('room:joined', cb)
  },

  onRoomLeft(cb) {
    this.socket.on('room:left', cb)
  },

  onMessage(cb) {
    this.socket.on('message:receive', cb)
  },

  onRoomUsers(cb) {
    this.socket.on('room:users', cb)
  },

  onUserOnline(cb) {
    this.socket.on('user:online', cb)
  },

  onUserOffline(cb) {
    this.socket.on('user:offline', cb)
  },

  onError(cb) {
    this.socket.on('error', cb)
  },
}