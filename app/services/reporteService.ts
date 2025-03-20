const API_URL = process.env.EXPO_PUBLIC_API_URL

import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

/**
 * Conectar al socket si no está conectado
 */
export const connectSocket = (idPartido?: number): Socket => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket'],
      forceNew: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    })

    socket.on('connect', () => {
      console.log(`✅ Conectado a Socket.io con ID: ${socket?.id}`)
      if (idPartido) {
        joinRoom(idPartido) // Unirse al canal del partido
      }
    })

    socket.on('disconnect', (reason: string) => {
      console.log(`❌ Desconectado de Socket.io: ${reason}`)
    })

    socket.on('connect_error', (error: Error) => {
      console.log(`⚠️ Error de conexión con Socket.io: ${error.message}`)
    })
  }

  return socket
}

// Unirse a una sala de partido
export const joinRoom = (idPartido: number) => {
  if (socket) {
    socket.emit('joinPartido', { idPartido })
    console.log(`📢 Unido a la sala del partido: ${idPartido}`)
  }
}

// Salir de la sala del partido
export const leaveRoom = (idPartido: number) => {
  if (socket) {
    socket.emit('leavePartido', { idPartido })
    console.log(`🚪 Saliste de la sala del partido: ${idPartido}`)
  }
}

// Desconectar el socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log('🔌 Socket.io desconectado manualmente')
  }
}

/**
 * Obtiene los reportes de un partido específico.
 */
export const fetchReportes = async (
  idPartido: number | undefined,
  setReportes: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  lastFetchedReportesRef: React.MutableRefObject<any[]>,
  isFetchingRef: React.MutableRefObject<boolean>,
  lastFetchTime: React.MutableRefObject<number>
) => {
  if (!idPartido || isFetchingRef.current) return
  isFetchingRef.current = true

  try {
    const response = await fetch(`${API_URL}api/reportes/partido/${idPartido}`)
    const data = await response.json()

    if (
      JSON.stringify(lastFetchedReportesRef.current) !== JSON.stringify(data)
    ) {
      lastFetchedReportesRef.current = data
      setReportes(data)
    }
  } catch (error) {
    console.error('❌ Error al obtener reportes:', error)
  } finally {
    isFetchingRef.current = false
    setLoading(false)
  }

  // 🔹 Conectar socket y escuchar nuevos reportes en tiempo real
  const socket = connectSocket(idPartido)

  socket.on('nuevoReporte', (nuevoReporte) => {
    console.log('🆕 Nuevo reporte recibido:', nuevoReporte)
    setReportes((prevReportes) => [nuevoReporte, ...prevReportes])
  })
}

/**
 * Obtiene las dependencias disponibles para los reportes.
 */
export const fetchDepartments = async (
  setDepartments: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >
) => {
  try {
    const response = await fetch(`${API_URL}api/reportes/dependencias`)
    const data = await response.json()

    const formattedDepartments = data.map(
      (dep: { id_dependencia: number; nombre: string }) => ({
        label: dep.nombre,
        value: dep.id_dependencia.toString(),
      })
    )

    setDepartments([{ label: 'Todos', value: '' }, ...formattedDepartments])
  } catch (error) {
    console.error('❌ Error al obtener dependencias:', error)
  }
}

/**
 * Crea un nuevo reporte ciudadano.
 */
export const createReport = async (
  reportData: FormData,
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setModalType: React.Dispatch<
    React.SetStateAction<'success' | 'error' | 'ban'>
  >,
  setModalMessage: React.Dispatch<React.SetStateAction<string>>,
  setCustomModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  resetFields: () => void,
  fetchReportes: () => void
) => {
  setSubmitting(true)

  try {
    const response = await fetch(`${API_URL}api/reportes/crear`, {
      method: 'POST',
      body: reportData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const result = await response.json()

    if (response.ok) {
      setModalType('success')
      setModalMessage('Reporte creado exitosamente.')
      setCustomModalVisible(true)
      setModalVisible(false)
      resetFields()
      fetchReportes()
      // 🔹 Enviar evento de reporte creado a través de Socket.io
      const socket = connectSocket()
      socket.emit('reporteCreado', {
        idPartido: reportData.get('id_partido'),
        nuevoReporte: result,
      })
    } else {
      setModalType('error')
      setModalMessage(result.message || 'Error al crear el reporte.')
      setCustomModalVisible(true)
    }
  } catch (error) {
    setModalType('error')
    setModalMessage('Error al enviar el reporte. Intenta nuevamente.')
    setCustomModalVisible(true)
  } finally {
    setSubmitting(false)
  }
}
