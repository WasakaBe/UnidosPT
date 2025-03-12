import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Linking,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Banners from '@/app/components/banners'
import LoadingSpinner from '@/app/components/loadingSpinner'
import CustomModal from '@/app/components/customModal'
//styles
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import directorio_styles from '@/app/styles/directorioStyle'
//interfaces
import { TipoServicio, DirectorioItem } from '@/app/utils/interface'
//services
import {
  fetchTiposServicios,
  fetchDirectorio,
  startDirectorioPolling,
  stopDirectorioPolling,
} from '@/app/services/directorioService'
import { TextInput } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'

export default function Directorio() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [tiposServicios, setTiposServicios] = useState<TipoServicio[]>([])
  const [directorioData, setDirectorioData] = useState<DirectorioItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [searchText, setSearchText] = useState('')
  const [searchTextDirectorio, setSearchTextDirectorio] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // ✅ Estado del Modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [modalMessage, setModalMessage] = useState('')

  // ✅ Función para mostrar el Modal
  const mostrarModal = (type: 'success' | 'error' | 'ban', message: string) => {
    setModalType(type)
    setModalMessage(message)
    setModalVisible(true)
  }

  // ✅ Función para abrir WhatsApp
  const abrirWhatsApp = (numero: string, mensaje?: string) => {
    if (!numero) {
      mostrarModal('error', 'Número de teléfono no disponible')
      return
    }

    let url = `whatsapp://send?phone=+52${numero}`
    if (mensaje) {
      url += `&text=${encodeURIComponent(mensaje)}`
    }

    Linking.openURL(url)
      .then(() => {
        console.log('WhatsApp abierto')
      })
      .catch(() => {
        mostrarModal('error', 'Asegúrate de tener WhatsApp instalado')
      })
  }

  // Estado para tipos de servicios
  useEffect(() => {
    fetchTiposServicios(setTiposServicios, setError)
  }, [])

  // Obtener el directorio cuando se selecciona un servicio
  // Función para obtener directorio cuando se selecciona un servicio
  // ✅ Obtener directorio cuando se selecciona un servicio
  const obtenerDirectorio = (idServicio: number) => {
    setSelectedService(idServicio)
    fetchDirectorio(
      idPartido,
      idServicio,
      setLoading,
      setDirectorioData,
      setError
    )

    // Iniciar polling y almacenar el intervalo en ref
    if (pollingIntervalRef.current) {
      stopDirectorioPolling(pollingIntervalRef.current) // Detener si hay uno activo
    }
    const interval = startDirectorioPolling(
      idPartido,
      idServicio,
      setDirectorioData,
      setError,
      10000
    )
    pollingIntervalRef.current = interval !== undefined ? interval : null
  }

  useEffect(() => {
    return () => {
      // Detener polling al desmontar la pantalla
      if (pollingIntervalRef.current) {
        stopDirectorioPolling(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [])

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => {
            // Si está en la vista de resultados, regresar a la lista de servicios
            if (selectedService) {
              setSelectedService(null)
              setDirectorioData([]) // Limpiar los datos del directorio
              setError('') // Limpiar cualquier error previo
            } else {
              router.back() // Si ya está en la lista de letras, regresar a la pantalla anterior
            }
          }}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}>
          Directorio de Servicios
        </Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      {/* SECCIÓN 1: Lista de Tipos de Servicios */}
      {/* SECCIÓN 1: Lista de Tipos de Servicios */}
      {!selectedService ? (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={directorio_styles.busqueda}>
            <View style={directorio_styles.busqueda2}>
              {/* 🔍 Barra de búsqueda */}
              <TextInput
                placeholder="Buscar servicio.."
                style={directorio_styles.input}
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* 📌 Select para ordenar (Ascendente/Descendente) */}
            <View style={directorio_styles.busqueda2}>
              <Picker
                selectedValue={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
                style={directorio_styles.picker}
              >
                <Picker.Item label="Orden Ascendente" value="asc" />
                <Picker.Item label="Orden Descendente" value="desc" />
              </Picker>
            </View>
          </View>

          {error ? (
            <Text style={directorio_styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={[...tiposServicios]
                .filter((item) =>
                  item.nombre.toLowerCase().includes(searchText.toLowerCase())
                )
                .sort((a, b) =>
                  sortOrder === 'asc'
                    ? a.nombre.localeCompare(b.nombre)
                    : b.nombre.localeCompare(a.nombre)
                )}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={directorio_styles.listItem}
                  onPress={() => obtenerDirectorio(item.id)}
                >
                  <Text style={directorio_styles.listItemText}>
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      ) : (
        <>
          {/* SECCIÓN 2: Lista de Directorio */}
          <Text style={directorio_styles.sectionTitle}>
            Resultados para:{' '}
            {tiposServicios.find((t) => t.id === selectedService)?.nombre}
          </Text>

          {/* 🔍 Barra de búsqueda en la Sección 2 */}
          <View style={directorio_styles.busquedaSec2}>
            <View style={directorio_styles.busqueda2Sec2}>
              <TextInput
                placeholder="Buscar por nombre o teléfono..."
                style={directorio_styles.inputSec2}
                placeholderTextColor="#aaa"
                value={searchTextDirectorio}
                onChangeText={setSearchTextDirectorio}
              />
            </View>
          </View>

          {loading ? (
            <LoadingSpinner text="Cargando Servicios..." color="#FFD700" />
          ) : (
            <FlatList
              data={directorioData.filter(
                (item) =>
                  item.nombre
                    .toLowerCase()
                    .includes(searchTextDirectorio.toLowerCase()) ||
                  (item.telefono ? item.telefono.toLowerCase() : '').includes(
                    searchTextDirectorio.toLowerCase()
                  )
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={directorio_styles.containerDirectorio}
              renderItem={({ item }) => (
                <View style={directorio_styles.card}>
                  {/* Imagen de perfil */}
                  <Image
                    source={{ uri: item.foto_perfil }}
                    style={directorio_styles.profileImage}
                  />

                  {/* Información del usuario */}
                  <View style={directorio_styles.userInfo}>
                    <Text style={directorio_styles.userName}>
                      {item.nombre} {item.apellido_paterno || ''}{' '}
                      {item.apellido_materno || ''}
                    </Text>

                    <View style={directorio_styles.locationContainer}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#007bff"
                      />
                      <Text style={directorio_styles.userLocation}>
                        {item.direccion_usuario || 'Ubicación no disponible'}
                      </Text>
                    </View>
                  </View>

                  {/* Botón de WhatsApp */}
                  <TouchableOpacity
                    style={directorio_styles.whatsappButton}
                    onPress={() =>
                      abrirWhatsApp(
                        item.telefono || '',
                        `Hola ${item.nombre}, estoy interesado en tus servicios.`
                      )
                    }
                  >
                    <Ionicons name="logo-whatsapp" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </>
      )}

      {/* Modal de Notificación */}
      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      {/* Componente de Banners */}
      <Banners idPartido={Number(idPartido)} />
    </ImageBackground>
  )
}
