const API_URL = process.env.EXPO_PUBLIC_API_URL
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'

import LoadingSpinner from '@/app/components/loadingSpinner'
import CustomModal from '@/app/components/customModal'
import useMediaAndLocation from '@/app/hooks/useMediaAndLocation'
//styles
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import reporte_styles from '@/app/styles/reporteStyle'
import conectate_styles from '@/app/styles/conectateStyle'
//interfaces
import { Post, Comment } from '@/app/utils/interface'
import promociones_descuentos_styles from '@/app/styles/promocionesDescuentosStyle'

export default function Conectate() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [loadingComentarios, setLoadingComentarios] = useState(false)

  const {
    selectedImage,
    setSelectedImage,
    handleTakePhoto,
    handleSelectImage,
  } = useMediaAndLocation()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [postText, setPostText] = useState('')
  const limit = 10

  // 🔹 Estado para el modal de mensajes
  const [customModalVisible, setCustomModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [modalMessage, setModalMessage] = useState('')

  // Estados para la modal de comentarios
  const [commentModalVisible, setCommentModalVisible] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    // Cargar posts iniciales
    fetchPosts()

    // Configurar polling cada 10 segundos
    const pollingInterval = setInterval(() => {
      fetchPosts(true) // Pasar true para indicar que es una llamada de polling
    }, 10000) // Intervalo de 10 segundos

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(pollingInterval)
  }, [idPartido, currentPage])

  const fetchPosts = async (isPolling = false) => {
    if (!hasMorePosts && !isPolling) return // No hacer polling si no hay más posts

    setLoading(true)
    try {
      const url = `${API_URL}api/post/${idPartido}?page=${currentPage}&limit=${limit}`
      console.log('URL de la API:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (data.posts.length > 0) {
        const postsWithReactions = data.posts.map((post: Post) => {
          // Si el API indica que el usuario reaccionó (aunque el tipo venga vacío),
          // asignamos 'meencanta' como tipo de reacción.
          const reactionData =
            post.usuario_reaccion &&
            idUsuario &&
            post.usuario_reaccion.toString() === idUsuario.toString()
              ? [{ tipo_reaccion: 'meencanta', id_usuario: idUsuario }]
              : []
          return { ...post, reacciones: reactionData }
        })

        // 🔹 Filtrar posts duplicados antes de actualizar el estado
        setPosts((prevPosts) => {
          const combinedPosts = isPolling
            ? [...prevPosts, ...postsWithReactions]
            : [...prevPosts, ...postsWithReactions]

          const uniquePosts = combinedPosts.filter(
            (post, index, self) =>
              index ===
              self.findIndex((p) => p.id_contenido === post.id_contenido)
          )
          return uniquePosts
        })
        // Si es polling, no incrementar la página
        if (!isPolling) {
          setCurrentPage((prevPage) => prevPage + 1)
        }
      } else {
        setHasMorePosts(false)
      }
    } catch (error) {
      console.log('Error en la petición:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!postText || !idUsuario) {
      setModalType('error')
      setModalMessage('Todos los campos son obligatorios.')
      setCustomModalVisible(true)
      return
    }

    const formData = new FormData()
    formData.append('descripcion', postText)
    formData.append('id_usuario', idUsuario.toString())

    if (selectedImage) {
      const fileName = selectedImage.split('/').pop() || 'image.jpg'
      const fileType = fileName.split('.').pop() || 'jpg'

      formData.append('imagen', {
        uri: selectedImage,
        name: 'post_image.jpg',
        type: `image/${fileType}`,
      } as any)
    }

    try {
      const response = await fetch(`${API_URL}api/post/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      })
      const data = await response.json()

      if (response.ok) {
        setModalType('success')
        setModalMessage('Post creado exitosamente')
        setCustomModalVisible(true)
        setPostText('')
        setSelectedImage(null)

        // Recargar la lista de posts
        setCurrentPage(1)
        setPosts([])
        fetchPosts()

        setTimeout(() => {
          setCustomModalVisible(false)
        }, 3000) // Cierra la modal automáticamente después de 3 segundos
      } else if (data.message === 'No puedes realizar publicaciones') {
        setModalType('ban')
        setModalMessage(
          'Usted está baneado. No puede realizar post, comuníquese con soporte técnico'
        )
        setCustomModalVisible(true)
      } else {
        console.log('Error', data.message || 'Error desconocido')
      }
    } catch (error) {
      console.log('Error al crear post:', error)
      console.log('Error', 'Ocurrió un error al crear el post.')
    }
  }

  const handleReaction = async (postId: number) => {
    const tipo_reaccion = 'me_encanta' // Puedes cambiar esto según el tipo de reacción
    const id_usuario = idUsuario

    if (!id_usuario) {
      console.log('Usuario no autenticado')
      return
    }

    // Verifica si el usuario ya reaccionó a esta publicación
    const post = posts.find((p) => p.id_contenido === postId)
    if (post && post.reacciones.some((r) => r.id_usuario === id_usuario)) {
      console.log('El usuario ya ha reaccionado a esta publicación.')
      return
    }

    try {
      const response = await fetch(`${API_URL}api/post/reaccion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contenido: postId,
          id_usuario: id_usuario,
          tipo_reaccion: tipo_reaccion,
        }),
      })
      console.log('Respuesta de la API:', tipo_reaccion)
      const data = await response.json()

      if (response.ok) {
        console.log('Reacción registrada o actualizada:', data.message)

        // Actualizar el estado local
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id_contenido === postId
              ? {
                  ...post,
                  reacciones: [
                    ...post.reacciones,
                    { tipo_reaccion, id_usuario },
                  ],
                }
              : post
          )
        )
      } else {
        console.log('Error al registrar la reacción:', data.message)
      }
    } catch (error) {
      console.log('Error en la solicitud:', error)
    }
  }

  // Función para abrir la modal de comentarios y cargar los comentarios del post
  const handleComment = (postId: number) => {
    setLoadingComentarios(true)
    setSelectedPostId(postId)
    fetchComments(postId)
    setCommentModalVisible(true)
  }

  // Función para obtener comentarios del post
  const fetchComments = async (postId: number) => {
    setLoadingComentarios(true)
    setComments([])
    try {
      const response = await fetch(
        `${API_URL}api/post/comentarios/${postId}?page=1&limit=99999999`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (response.ok) {
        const data = await response.json()
        // Verificar que la respuesta contenga comentarios
        if (data.comentarios && Array.isArray(data.comentarios)) {
          // Ordenar los comentarios desde el más reciente hasta el más antiguo
          const sortedComments = data.comentarios.sort(
            (a: Comment, b: Comment) =>
              new Date(b.fecha_comentario).getTime() -
              new Date(a.fecha_comentario).getTime()
          )

          setComments(sortedComments)
        } else {
          console.log('No hay comentarios disponibles.')
        }
      } else {
        console.log('Error al obtener comentarios')
      }
    } catch (error) {
      console.log('Error al obtener comentarios:', error)
    }
  }

  // Función para agregar un nuevo comentario
  // Función para agregar un nuevo comentario
  const handleAddComment = async () => {
    if (!newComment || !idUsuario || !selectedPostId) return

    try {
      const response = await fetch(`${API_URL}api/post/comentar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_contenido: selectedPostId,
          id_usuario: idUsuario,
          comentario: newComment,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Se asume que el API retorna el resultado del procedimiento almacenado en "data.newComentario"
        // y que el primer elemento contiene los datos del comentario insertado.
        const usuarioData = data.newComentario[0][0]

        // Construimos el objeto del nuevo comentario usando la información retornada,
        // asegurándonos de incluir todas las propiedades definidas en la interfaz Comment.
        const newCommentObj: Comment = {
          id: usuarioData.idcomentario || Math.floor(Math.random() * 1000000),
          id_contenido: usuarioData.idcontenido,
          usuario: usuarioData.usuario,
          fotoPerfil: usuarioData.fotoPerfil || '', // Se asigna el valor retornado o cadena vacía
          comentario: newComment, // Puedes usar usuarioData.comentario si se retorna, de lo contrario newComment
          fecha_comentario:
            usuarioData.fecha_comentario || new Date().toISOString(),
          tiempo_transcurrido: usuarioData.tiempo_transcurrido || '0 min',
        }

        setComments([...comments, newCommentObj])
        setNewComment('')
      } else {
        console.log('Error al agregar comentario')
      }
    } catch (error) {
      console.log('Error al agregar comentario:', error)
    }
  }

  const renderItem = ({ item }: { item: Post }) => (
    <View style={reporte_styles.container}>
      <View style={reporte_styles.cardContainer}>
        <View style={reporte_styles.statusContainer}>
          <View style={reporte_styles.statusBadge}>
            <Image
              source={{ uri: item.foto_perfil }}
              style={conectate_styles.profileImage}
            />
            <Text style={conectate_styles.author}>{item.usuario}</Text>
          </View>
          <View style={reporte_styles.typeBadge}>
            <Text style={reporte_styles.typeText}>{item.nombre_partido}</Text>
          </View>
        </View>
        <View style={reporte_styles.imageContainer}>
          {item.ruta_imagen && (
            <Image
              source={{ uri: item.ruta_imagen }}
              style={reporte_styles.image}
            />
          )}
        </View>
        <View style={conectate_styles.postContent}>
          <View style={reporte_styles.dateContainer}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={20}
              color="#000"
            />
            <Text style={reporte_styles.dateText}>
              {new Date(item.fecha_publicacion).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          <View style={reporte_styles.contentContainer}>
            <Text style={reporte_styles.description}>{item.descripcion}</Text>
          </View>
        </View>

        {/* Iconos de Reacción y Comentario */}
        <View style={conectate_styles.interactionContainer}>
          <TouchableOpacity
            style={conectate_styles.interactionButton}
            onPress={() => handleReaction(item.id_contenido)}
          >
            <FontAwesome
              name={
                item.reacciones?.some((r) => r.id_usuario === idUsuario)
                  ? 'heart'
                  : 'heart-o'
              }
              size={20}
              color={
                item.reacciones?.some((r) => r.id_usuario === idUsuario)
                  ? '#007BFF'
                  : '#000'
              }
            />
            <Text style={conectate_styles.interactionText}>
              {item.reacciones?.length || 0} Me Encanta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={conectate_styles.interactionButton}
            onPress={() => handleComment(item.id_contenido)}
          >
            <FontAwesome name="comment-o" size={20} color="#007BFF" />
            <Text style={conectate_styles.interactionText}>Comentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Logo del Partido */}
        <View style={noticias_styles.Backlogo}>
          <Image
            source={require('../../assets/logo_partidos/unidosPt.png')}
            style={noticias_styles.logo}
          />
        </View>
      </View>

      <View>
        <Text style={promociones_descuentos_styles.txtPromo}>CONECTATE</Text>
        <View style={dashboard_styles.divider} />
      </View>
      {/* Botón flotante "Crear post" */}
      <TouchableOpacity
        style={reporte_styles.createReportButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={reporte_styles.createReportButtonText}>Crear Post </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          item.id_contenido ? `post-${item.id_contenido}` : `fallback-${index}`
        }
        renderItem={renderItem}
        onEndReached={() => {
          if (!loading && hasMorePosts) {
            setCurrentPage((prevPage) => prevPage + 1)
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <LoadingSpinner /> : null}
        ListEmptyComponent={
          !loading ? (
            <View style={conectate_styles.emptyContainer}>
              <Text style={conectate_styles.emptyText}>
                No hay publicaciones disponibles.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Modal de new post */}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={reporte_styles.modalOverlay}>
          <View style={reporte_styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={reporte_styles.header}>
                <Text style={reporte_styles.headerTitle}>Nuevo POST</Text>
              </View>
              <View style={reporte_styles.form}>
                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Descripcion </Text>
                  <TextInput
                    style={reporte_styles.input}
                    placeholder="Escribe tu publicación"
                    value={postText}
                    onChangeText={setPostText}
                  />
                </View>
                <View style={reporte_styles.imageSection}>
                  <Text style={reporte_styles.label}>Imagen</Text>
                  <TouchableOpacity
                    style={reporte_styles.imageButton}
                    onPress={handleTakePhoto}
                  >
                    <Ionicons name="camera" size={24} color="#fff" />
                    <Text style={reporte_styles.buttonText}>Tomar Foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={reporte_styles.imageButton}
                    onPress={handleSelectImage}
                  >
                    <Ionicons name="image" size={24} color="#fff" />
                    <Text style={reporte_styles.buttonText}>
                      Seleccionar desde Galería
                    </Text>
                  </TouchableOpacity>
                  {selectedImage ? (
                    <Image
                      source={{
                        uri: selectedImage,
                      }}
                      style={reporte_styles.previewImage}
                    />
                  ) : (
                    <View style={reporte_styles.imagePlaceholder}>
                      <MaterialIcons name="image" size={40} color="#ccc" />
                      <Text style={reporte_styles.placeholderText}>
                        Vista previa de imagen
                      </Text>
                    </View>
                  )}
                </View>

                <View style={reporte_styles.footer}>
                  <TouchableOpacity
                    style={reporte_styles.createButton}
                    onPress={handleCreatePost}
                  >
                    <Text style={reporte_styles.createButtonText}>
                      Publicar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={reporte_styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={reporte_styles.cancelButtonText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Comentarios */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={noticias_styles.modalContainer}>
          <View style={noticias_styles.modalContent}>
            <View style={noticias_styles.modalHeader}>
              <Text style={noticias_styles.modalTitle}>Comentarios</Text>
              <TouchableOpacity
                style={noticias_styles.closeButton}
                onPress={() => setCommentModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#CE1126" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={comments}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              renderItem={({ item }) => (
                <View style={noticias_styles.commentContainer}>
                  <Image
                    source={{ uri: item.fotoPerfil }}
                    style={conectate_styles.profileImage}
                  />
                  <Text style={noticias_styles.username}>{item.usuario}</Text>
                  <Text style={noticias_styles.commentText}>
                    {item.comentario}
                  </Text>
                  <Text style={noticias_styles.timeAgo}>
                    {new Date(item.fecha_comentario).toLocaleDateString(
                      'es-MX',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <View style={noticias_styles.containerNoText}>
                  <MaterialCommunityIcons
                    name="chat-remove-outline"
                    size={64}
                    color="#CE1126"
                    style={noticias_styles.iconNoText}
                  />
                  <Text style={noticias_styles.mainText}>
                    No hay comentarios
                  </Text>
                  <Text style={noticias_styles.subText}>
                    Sé el primero en iniciar la conversación
                  </Text>
                </View>
              }
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={noticias_styles.inputContainer}
            >
              <FontAwesome name="user-circle" size={24} color="#000" />
              <TextInput
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChangeText={setNewComment}
                style={noticias_styles.input}
              />
              <TouchableOpacity
                style={[
                  noticias_styles.publishButton,
                  !newComment.trim() && noticias_styles.publishButtonDisabled,
                ]}
                onPress={handleAddComment}
              >
                <Text
                  style={[
                    noticias_styles.publishButtonText,
                    !newComment.trim() &&
                      noticias_styles.publishButtonTextDisabled,
                  ]}
                >
                  Enviar
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* 🔹 Modal de mensajes */}
      <CustomModal
        visible={customModalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setCustomModalVisible(false)}
      />
    </ImageBackground>
  )
}
