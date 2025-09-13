import { io } from 'socket.io-client'

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  upgrade: false
})

export const initializeSocket = () => {
  socket.on('connect', () => {
    console.log('Connected to server:', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export default socket
