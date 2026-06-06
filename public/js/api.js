const API_URL = 'http://localhost:3000/api'

const api = {
  getToken() {
    return localStorage.getItem('token')
  },

  authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer \${this.getToken()}`,
    }
  },

  async request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, options)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || 'Ошибка запроса')
    return data
  },

  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    return data
  },

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return data
  },

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
      headers: this.authHeaders(),
    })
  },

async getMe() {
  const data = await this.request('/auth/me', {
    headers: this.authHeaders(),
  })
  return data.user
},

async getMyRooms() {
  const data = await this.request('/rooms/my', {
    headers: this.authHeaders(),
  })
  return data.roomIds
},

async getRooms() {
  const data = await this.request('/rooms', {
    headers: this.authHeaders(),
  })
  return data.rooms
},

async createRoom(name) {
  const data = await this.request('/rooms', {
    method: 'POST',
    headers: this.authHeaders(),
    body: JSON.stringify({ name }),
  })
  return data.room
},

async deleteRoom(id) {
  await this.request(`/rooms/\${id}`, {
    method: 'DELETE',
    headers: this.authHeaders(),
  })
},

async getMessages(roomId) {
  const data = await this.request(`/rooms/\${roomId}/messages`, {
    headers: this.authHeaders(),
  })
  return data.messages
},
}