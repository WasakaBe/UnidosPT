import { API_URL } from '@env'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
//styles
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'

import { Picker } from '@react-native-picker/picker'

import CustomModal from '@/app/components/customModal'
import LoadingSpinner from '@/app/components/loadingSpinner'
interface Servicio {
  id: number
  nombre: string
}

export default function SolicitudServicios() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined

  const [tipoServicio, setTipoServicio] = useState<string>('')
  const [otroServicio, setOtroServicio] = useState<string>('')
  const [direccion, setDireccion] = useState<string>('')
  const [servicios, setServicios] = useState<Servicio[]>([]) // Estado con tipado correcto
  const [loading, setLoading] = useState<boolean>(true)
  const [sending, setSending] = useState<boolean>(false) // Para manejar el estado de carga al enviar

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'success' | 'error'>('success')
  const [modalMessage, setModalMessage] = useState<string>('')

  const OTRO_SERVICIO_ID = 28 // ID fijo para "Otro servicio"

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch(`${API_URL}api/services`)
        if (!response.ok) {
          console.log('Error al obtener los tipos de servicios')
        }
        const data: Servicio[] = await response.json()
        setServicios(data) // Guardamos los servicios con tipado correcto
      } catch (error) {
        console.log('Error al obtener servicios:', error)
        console.log('Error', 'No se pudieron cargar los tipos de servicios.')
      } finally {
        setLoading(false)
      }
    }

    fetchServicios()
  }, [])

  // Función para enviar la solicitud de servicio a la API
  const handleSolicitarServicio = async () => {
    if (!idUsuario) {
      setModalType('error')
      setModalMessage('No se encontró el ID del usuario.')
      setModalVisible(true)
      return
    }

    if (!tipoServicio && !otroServicio) {
      setModalType('error')
      setModalMessage('Seleccione o ingrese un servicio.')
      setModalVisible(true)
      return
    }

    if (!direccion) {
      setModalType('error')
      setModalMessage('Ingrese una dirección válida.')
      setModalVisible(true)
      return
    }

    const servicioSeleccionado =
      tipoServicio === 'otro'
        ? OTRO_SERVICIO_ID
        : servicios.find((s) => s.nombre === tipoServicio)?.id
    const otroServicioValue = tipoServicio === 'otro' ? otroServicio : null

    if (!servicioSeleccionado) {
      setModalType('error')
      setModalMessage('El servicio seleccionado no es válido.')
      setModalVisible(true)
      return
    }

    const solicitud = {
      id_usuario: idUsuario,
      id_servicio: servicioSeleccionado,
      otro_servicio: otroServicioValue,
      direccion_usuario: direccion,
    }

    setSending(true)

    try {
      const response = await fetch(`${API_URL}api/services/solicitud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitud),
      })

      if (!response.ok) {
        console.log('Error al registrar la solicitud')
      }

      setModalType('success')
      setModalMessage(
        'Su solicitud de servicio ha sido registrada correctamente.'
      )
      setModalVisible(true)

      // Limpiar el formulario solo si la solicitud es exitosa
      setTipoServicio('')
      setOtroServicio('')
      setDireccion('')
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      setModalType('error')
      setModalMessage('No se pudo enviar la solicitud, inténtelo más tarde.')
      setModalVisible(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}>
          {' '}
          Solicitud de Servicios{' '}
        </Text>

        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Seleccione el Tipo de Servicio</Text>
        {loading ? (
          <LoadingSpinner text="Cargando Servicios..." color="#D32F2F" />
        ) : (
          <Picker
            selectedValue={tipoServicio}
            onValueChange={(itemValue) => setTipoServicio(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Seleccione un servicio" value="" />
            {servicios.map((servicio) => (
              <Picker.Item
                key={servicio.id}
                label={servicio.nombre}
                value={servicio.nombre}
              />
            ))}
            <Picker.Item label="Otro (especificar abajo)" value="otro" />
          </Picker>
        )}
        {tipoServicio === 'otro' && (
          <>
            <Text style={styles.label}>Otro Servicio</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Pintor"
              value={otroServicio}
              onChangeText={setOtroServicio}
            />
          </>
        )}

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Av. Hidalgo, etc."
          value={direccion}
          onChangeText={setDireccion}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSolicitarServicio}
          disabled={sending}
        >
          {sending ? (
            <LoadingSpinner text="Cargando..." color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Solicitar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* MODAL DE NOTIFICACIÓN */}
      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
