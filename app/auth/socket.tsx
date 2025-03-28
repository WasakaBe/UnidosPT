const API_URL = process.env.EXPO_PUBLIC_API_URL
import { io, Socket } from 'socket.io-client'

console.log('API_URL:', API_URL)
const SOCKET_URL = API_URL
let socket: Socket | null = null

export const connectSocket = (idPartido?: number): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'], // Usar solo WebSocket
      forceNew: true, // Habilitar reintentos de conexión
      reconnectionAttempts: 10, // Intentar reconectar 10 veces
      timeout: 3000, // Esperar 3 segundos entre intentos
    })

    socket.on('connect', () => {
      console.log(`✅ Conectado a Socket.io con ID: ${socket?.id}`)
      console.log(`🔗 Conectando a Socket.io en: ${SOCKET_URL}`)

      if (idPartido) {
        joinRoom(idPartido) // 🔥 Unirse al canal del partido
      }
    })

    socket.on('disconnect', (reason: string) => {
      console.log(`❌ Desconectado de Socket.io: ${reason}`)
    })

    socket.on('connect_error', (error: Error) => {
      console.log(`⚠️ Error de conexión con Socket.io: ${error.message}`)
    })
  }

  return socket as Socket
}

// Función para unirse a un grupo específico (por partido)
export const joinRoom = (idPartido: number) => {
  if (socket) {
    socket.emit('joinPartido', { idPartido }) // 🔥 Unirse al grupo del partido
    console.log(`📢 Unido al canal del partido: ${idPartido}`)
  }
}

// Función para salir de un grupo específico
export const leaveRoom = (idPartido: number) => {
  if (socket) {
    socket.emit('leavePartido', { idPartido }) // Salir del grupo
    console.log(`🚪 Saliste del canal del partido: ${idPartido}`)
  }
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log('🔌 Socket.io desconectado manualmente')
  }
}

export default connectSocket
