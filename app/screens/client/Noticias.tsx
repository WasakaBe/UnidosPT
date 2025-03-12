import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Animated,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import LoadingSpinner from '@/app/components/loadingSpinner'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  FontAwesome,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Banners from '@/app/components/banners'
import CustomModal from '@/app/components/customModal'
//styles
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
//interfaces
import { Noticia, Reaccion } from '@/app/utils/interface'
//services
import {
  fetchNoticias,
  fetchComentarios,
  handleAddComment,
  handleReaction,
} from '@/app/services/noticiasService'

import { Socket } from 'socket.io-client'
let socket: Socket | null = null
export default function Noticias() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [loading, setLoading] = useState<boolean>(true)
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [page, setPage] = useState<number>(1)
  const limit = 10

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedNoticia, setSelectedNoticia] = useState<any>(null)
  const [comentarios, setComentarios] = useState<any[]>([])
  const [loadingComentarios, setLoadingComentarios] = useState<boolean>(false)

  const [newComment, setNewComment] = useState('')

  // Estados para el CustomModal
  const [modalMessage, setModalMessage] = useState<string>('')
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [customModalVisible, setCustomModalVisible] = useState(false)

  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }

  useEffect(() => {
    const fetchNoticiasWrapper = () => {
      fetchNoticias(idPartido, page, limit, setNoticias, setLoading)
    }

    fetchNoticiasWrapper() // Llamada inicial
    const interval = setInterval(fetchNoticiasWrapper, 10000) // Polling cada 10s

    return () => clearInterval(interval)
  }, [idPartido, page])

  // Llamada a fetchComentarios
  const obtenerComentarios = (noticiaId: number) => {
    fetchComentarios(
      noticiaId,
      setLoadingComentarios,
      setComentarios,
      setSelectedNoticia,
      setModalVisible
    )
  }

  // Llamada a handleAddComment
  const agregarComentario = () => {
    handleAddComment(
      newComment,
      idUsuario,
      selectedNoticia,
      setLoadingComentarios,
      setComentarios,
      setNewComment
    )
  }

  // Llamada a handleReaction
  const reaccionar = (noticiaId: number) => {
    handleReaction(
      noticiaId,
      idUsuario,
      noticias,
      setNoticias,
      setModalType,
      setModalMessage,
      setCustomModalVisible
    )
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}>Noticias </Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      {/* Componente de Banners */}
      <Banners idPartido={Number(idPartido)} />

      {loading ? (
        <LoadingSpinner text="Cargando noticias..." color="#FFD700" />
      ) : (
        <FlatList
          data={noticias}
          keyExtractor={(item) => item.NoticiaID.toString()}
          renderItem={({ item }) => (
            <Animated.View
              style={[
                noticias_styles.container,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity activeOpacity={0.97} onPress={handlePress}>
                <View style={noticias_styles.imageContainer}>
                  <Image
                    source={{ uri: item.ImagenesAsociadas[0] }}
                    style={noticias_styles.image}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={noticias_styles.gradient}
                  />
                  <View style={noticias_styles.badgeContainer}>
                    <View style={noticias_styles.badge}>
                      <FontAwesome5
                        name="newspaper"
                        size={12}
                        color="#FFF"
                        style={noticias_styles.badgeIcon}
                      />
                      <Text style={noticias_styles.badgeText}>
                        {item.TipoNoticia}
                      </Text>
                    </View>
                    {item.NombrePartido && (
                      <View
                        style={[
                          noticias_styles.badge,
                          noticias_styles.partidoBadge,
                        ]}
                      >
                        <FontAwesome5
                          name="shield-alt"
                          size={12}
                          color="#FFF"
                          style={noticias_styles.badgeIcon}
                        />
                        <Text style={noticias_styles.badgeText}>
                          {item.NombrePartido}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={noticias_styles.content}>
                  <Text style={noticias_styles.titulo}>{item.Titulo}</Text>
                  <Text style={noticias_styles.descripcion}>
                    {item.Descripcion}
                  </Text>

                  <View style={noticias_styles.footer}>
                    <TouchableOpacity
                      style={noticias_styles.interactionButton}
                      onPress={() => obtenerComentarios(item.NoticiaID)}
                    >
                      <MaterialCommunityIcons
                        name="comment-outline"
                        size={22}
                        color="#4A90E2"
                      />
                      <Text style={noticias_styles.interactionText}>
                        {item.TotalComentarios}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={noticias_styles.interactionButton}
                      onPress={() => reaccionar(item.NoticiaID)}
                    >
                      <FontAwesome
                        name={
                          item.reacciones?.some(
                            (r: Reaccion) => r.id_usuario === idUsuario
                          )
                            ? 'heart'
                            : 'heart-o'
                        } // Si reaccionó, cambia el icono
                        size={22}
                        color={
                          item.reacciones?.some(
                            (r: Reaccion) => r.id_usuario === idUsuario
                          )
                            ? '#007BFF'
                            : '#000'
                        } // Si reaccionó, cambia el color
                      />
                      <Text style={noticias_styles.interactionText}>
                        {item.TotalReacciones || 0} Me Encanta
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}

      {/* Modal de comentarios */}
      {/* Modal de comentarios */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={noticias_styles.modalContainer}>
          <View style={noticias_styles.modalContent}>
            <View style={noticias_styles.modalHeader}>
              <Text style={noticias_styles.modalTitle}>Comentarios</Text>
              <TouchableOpacity
                style={noticias_styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#CE1126" />
              </TouchableOpacity>
            </View>

            {loadingComentarios ? (
              <LoadingSpinner text="Cargando comentarios..." color="#FFD700" />
            ) : (
              <FlatList
                data={comentarios}
                keyExtractor={(item) => item.ComentarioID.toString()}
                style={noticias_styles.commentsList}
                renderItem={({ item }) => (
                  <View style={noticias_styles.commentContainer}>
                    <FontAwesome name="user-circle" size={24} color="#000" />
                    <Text style={noticias_styles.username}>
                      {item.NombreUsuario} :
                    </Text>
                    <Text style={noticias_styles.commentText}>
                      {item.Comentario}
                    </Text>
                    <Text style={noticias_styles.timeAgo}>
                      {new Date(item.FechaComentario).toLocaleDateString(
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
            )}

            {/* Input para agregar comentario */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={noticias_styles.inputContainer}
            >
              <FontAwesome name="user-circle" size={24} color="#000" />
              <TextInput
                style={noticias_styles.input}
                placeholder="Agregar un comentario..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                onPress={agregarComentario}
                disabled={!newComment.trim()}
                style={[
                  noticias_styles.publishButton,
                  !newComment.trim() && noticias_styles.publishButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    noticias_styles.publishButtonText,
                    !newComment.trim() &&
                      noticias_styles.publishButtonTextDisabled,
                  ]}
                >
                  Publicar
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* Custom Modal */}
      <CustomModal
        visible={customModalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setCustomModalVisible(false)}
      />
    </ImageBackground>
  )
}
