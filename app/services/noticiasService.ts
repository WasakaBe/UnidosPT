const API_URL=process.env.EXPO_PUBLIC_API_URL;

import connectSocket from '../auth/socket'
import { Socket } from 'socket.io-client'

let socket: Socket | null = null

/**
 * Inicializa el socket y maneja eventos en tiempo real.
 */
export const initializeSocket = (
  idPartido: number,
  setNoticias: React.Dispatch<React.SetStateAction<any[]>>,
  setComentarios?: React.Dispatch<React.SetStateAction<any[]>>,
  selectedNoticia?: number | null
) => {
  if (!socket) {
    socket = connectSocket(idPartido)

    // 🔥 Escuchar nuevas noticias en tiempo real
    socket.on('nuevaNoticia', (nuevaNoticia) => {
      console.log('📢 Nueva noticia recibida:', nuevaNoticia)
      setNoticias((prevNoticias) => [nuevaNoticia, ...prevNoticias])
    })

    // 🔥 Escuchar actualización de reacciones en tiempo real
    socket.on('actualizarReaccion', (data) => {
      console.log('💖 Reacción actualizada:', data)
      setNoticias((prevNoticias) =>
        prevNoticias.map((noticia) =>
          noticia.NoticiaID === data.noticiaId
            ? { ...noticia, TotalReacciones: data.totalReacciones }
            : noticia
        )
      )
    })

    // 🔥 Escuchar nuevos comentarios en tiempo real si hay una noticia seleccionada
    if (setComentarios && selectedNoticia) {
      socket.emit('joinNoticia', { noticiaId: selectedNoticia }) // Unirse al canal de la noticia

      socket.on('nuevoComentario', (nuevoComentario) => {
        console.log('🆕 Nuevo comentario recibido:', nuevoComentario)

        setComentarios((prevComentarios) => {
          // Verifica que el comentario sea de la noticia que está abierta
          if (nuevoComentario.idnoticia === selectedNoticia) {
            return [nuevoComentario, ...prevComentarios]
          }
          return prevComentarios
        })
      })
    }
  }
}

/**
 * Obtiene las noticias del partido específico (Petición inicial).
 */
export const fetchNoticias = async (
  idPartido: number | undefined,
  page: number,
  limit: number,
  setNoticias: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!idPartido) return

  try {
    console.log('📡 Obteniendo noticias...')
    const response = await fetch(
      `${API_URL}api/noticias/partido/${idPartido}?page=${page}&limit=${limit}`
    )
    const data = await response.json()

    if (data.success && data.noticias) {
      setNoticias(data.noticias)
    }
  } catch (error) {
    console.error('❌ Error al obtener noticias:', error)
  } finally {
    setLoading(false)
  }
}

/**
 * Obtiene los comentarios de una noticia específica.
 */
export const fetchComentarios = async (
  noticiaId: number,
  setLoadingComentarios: React.Dispatch<React.SetStateAction<boolean>>,
  setComentarios: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedNoticia: React.Dispatch<React.SetStateAction<any>>,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoadingComentarios(true)
  setComentarios([])
  setSelectedNoticia(noticiaId)
  setModalVisible(true)

  try {
    const response = await fetch(
      `${API_URL}api/noticias/comentarios/${noticiaId}?page=1&limit=10`
    )
    const data = await response.json()

    if (data.success) {
      setComentarios(data.comentarios)
    } else {
      console.log('No se encontraron comentarios')
    }
    // 🔥 Conectar al socket si no está conectado
    if (!socket) {
      socket = connectSocket()
    }

    // 📢 Unirse al canal de la noticia para recibir comentarios en tiempo real
    socket.emit('joinNoticia', { noticiaId })
    console.log(`🟢 Unido al canal de comentarios de la noticia: ${noticiaId}`)

    // 🔥 Escuchar nuevos comentarios en tiempo real
    const handleNuevoComentario = (nuevoComentario: any) => {
      console.log('🆕 Nuevo comentario recibido:', nuevoComentario)

      setComentarios((prevComentarios) => {
        // Asegurar que el comentario es de la noticia seleccionada
        if (nuevoComentario.idnoticia === noticiaId) {
          return [nuevoComentario, ...prevComentarios]
        }
        return prevComentarios
      })
    }

    socket.on('nuevoComentario', handleNuevoComentario)

    // 🧹 Cleanup: salir del canal al cerrar el modal
    return () => {
      if (socket) {
        socket.emit('leaveNoticia', { noticiaId }) // Salir del canal
        socket.off('nuevoComentario', handleNuevoComentario) // Remover el listener
        console.log(`🚪 Saliste del canal de la noticia: ${noticiaId}`)
      }
    }
  } catch (error) {
    console.error('Error al obtener comentarios:', error)
  } finally {
    setLoadingComentarios(false)
  }
}

/**
 * Publica un nuevo comentario en una noticia.
 */
export const handleAddComment = async (
  newComment: string,
  idUsuario: number | undefined,
  selectedNoticia: number | null,
  setLoadingComentarios: React.Dispatch<React.SetStateAction<boolean>>,
  setComentarios: React.Dispatch<React.SetStateAction<any[]>>,
  setNewComment: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!newComment.trim() || !idUsuario || !selectedNoticia) {
    console.error('❌ Error: idUsuario o selectedNoticia están indefinidos.')
    return
  }

  try {
    setLoadingComentarios(true)
    console.log(`📩 Enviando comentario: ${newComment}`)

    const response = await fetch(
      `${API_URL}api/noticias/comentario/${selectedNoticia}/${idUsuario}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comentario: newComment }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar el comentario')
    }

    const nuevoComentario = {
      ComentarioID: data.comentario.ComentarioID,
      idnoticia: data.comentario.idnoticia,
      id_usuario: data.comentario.id_usuario,
      NombreUsuario: data.comentario.NombreUsuario,
      Comentario: data.comentario.comentario,
      FechaComentario: data.comentario.FechaComentario,
    }

    // Agrega el comentario a la lista de comentarios actual
    setComentarios((prevComentarios) => [nuevoComentario, ...prevComentarios])
    setNewComment('')

    // 🔥 Emitir evento de nuevo comentario para que otros usuarios lo reciban en tiempo real
    if (socket) {
      socket.emit('nuevoComentario', nuevoComentario)
    }
  } catch (error) {
    console.error('❌ Error al enviar comentario:', error)
  } finally {
    setLoadingComentarios(false)
  }
}

/**
 * Maneja la reacción de un usuario en una noticia.
 */
export const handleReaction = async (
  noticiaId: number,
  idUsuario: number | undefined,
  noticias: any[],
  setNoticias: React.Dispatch<React.SetStateAction<any[]>>,
  setModalType: React.Dispatch<
    React.SetStateAction<'success' | 'error' | 'ban'>
  >,
  setModalMessage: React.Dispatch<React.SetStateAction<string>>,
  setCustomModalVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!idUsuario) {
    console.error('❌ Error: idUsuario no está definido.')
    return
  }

  const tipo_reaccion = 'meencanta'

  const noticia = noticias.find((n) => n.NoticiaID === noticiaId)
  if (
    noticia &&
    noticia.reacciones?.some((r: any) => r.id_usuario === idUsuario)
  ) {
    console.log('El usuario ya ha reaccionado a esta publicación.')
    return
  }

  try {
    const response = await fetch(
      `${API_URL}api/noticias/reaccion/${noticiaId}/${idUsuario}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo_reaccion }),
      }
    )

    const data = await response.json()

    if (!data.success) {
      setModalType('error')
      setModalMessage('Hubo un error al reaccionar. Inténtalo más tarde.')
      setCustomModalVisible(true)
      return
    }

    setNoticias((prevNoticias) =>
      prevNoticias.map((noticia) =>
        noticia.NoticiaID === noticiaId
          ? {
              ...noticia,
              reacciones: [
                ...(noticia.reacciones || []),
                { tipo_reaccion, id_usuario: idUsuario },
              ],
              TotalReacciones: (noticia.TotalReacciones || 0) + 1,
            }
          : noticia
      )
    )

    // Emitir evento para actualizar reacciones en tiempo real
    if (socket) {
      socket.emit('actualizarReaccion', {
        noticiaId,
        totalReacciones: (noticia?.TotalReacciones || 0) + 1,
      })
    }
    console.log('Reacción registrada o actualizada:', data.message)
  } catch (error) {
    console.error('❌ Error al registrar la reacción:', error)
  }
}
