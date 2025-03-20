import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

// Estilos
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import consulta_saldo_styles from '@/app/styles/consultarSaldoStyle'
import LoadingSpinner from '@/app/components/loadingSpinner'
import AsyncStorage from '@react-native-async-storage/async-storage'
import promociones_descuentos_styles from '@/app/styles/promocionesDescuentosStyle'

// Interfaces para TypeScript
interface Plan {
  offeringId: string
  imagen_movil1: string
}

interface DatosPlan {
  datos_iniciales: number
  datos: number
  fecha_datos_final: { date: string }
  mensajes_iniciales: number
  mensajes: number
  minutos_iniciales: number
  minutos: number
  offering_datos: string
}

// Funciones utilitarias
const formatDate = (dateString: string) => {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const date = new Date(dateString)
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return { day, monthYear: `${month} del ${year}` }
}

const calcularDiasRestantes = (fechaObjetivo: string) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const objetivo = new Date(fechaObjetivo)
  objetivo.setHours(0, 0, 0, 0)

  const diferencia =
    (objetivo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(Math.ceil(diferencia), 0)
}

// Asegurar que `convertirAGB()` devuelva un número
const convertirAGB = (mb: number): number => {
  if (!mb || isNaN(mb)) return 0
  return parseFloat((mb / 1024).toFixed(1)) // `parseFloat` para garantizar `number`
}

const restarSinRetorno = (a: number, b: number): number => {
  return Math.max(a - b, 0) // Evita valores negativos
}

// Componente ProgressBar corregido
const ProgressBar = ({
  iconName = 'wifi' as keyof typeof Ionicons.glyphMap, // Valor por defecto válido
  label = '',
  value = 0,
  minValue = 0,
  maxValue = 1, // Evita divisiones por 0
  color = '#007BFF',
  tipo = '@',
}) => {
  // Evitar valores negativos y problemas con valores pequeños
  const safeMax = maxValue > 0 ? maxValue : 1
  const safeValue = Math.min(Math.max(value, 0), safeMax)
  // Normalizar la escala para que se muestre de forma proporcional en la barra
  const progress = useSharedValue((safeValue / safeMax) * 100)

  useEffect(() => {
    progress.value = withTiming((safeValue / safeMax) * 100, { duration: 500 })
  }, [safeValue, safeMax])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.max(progress.value, 2)}%`, // Se asegura que al menos haya 2% de barra visible
    }
  })

  return (
    <View style={consulta_saldo_styles.progressBarContainer}>
      <Text style={consulta_saldo_styles.progressBarLabel}>{label}</Text>
      <View style={consulta_saldo_styles.progressBarContent}>
        <Ionicons
          name={iconName}
          size={30}
          color={color}
          style={consulta_saldo_styles.progressBarIcon}
        />
        <View style={consulta_saldo_styles.progressBarBackground}>
          <Animated.View
            style={[
              consulta_saldo_styles.progressBarFill,
              animatedStyle,
              { backgroundColor: color },
            ]}
          />
        </View>
      </View>
      <View style={consulta_saldo_styles.progressBarValues}>
        <Text style={consulta_saldo_styles.progressBarValueText}>
          {minValue}
        </Text>
        <Text style={consulta_saldo_styles.progressBarValueText}>
          {maxValue} {tipo}
        </Text>
      </View>
    </View>
  )
}

// Componente principal
export default function ConsultarLimitado() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const userName = Array.isArray(params.userName)
    ? decodeURIComponent(params.userName[0])
    : decodeURIComponent(params.userName || 'Usuario')

  const phoneNumber = Array.isArray(params.phoneNumber)
    ? decodeURIComponent(params.phoneNumber[0])
    : decodeURIComponent(params.phoneNumber || '')

  const [urlImagen, setUrlImagen] = useState(
    'https://likephone.mx/public/iconos/fondo1.png'
  )
  const [datosPlan, setDatosPlan] = useState<DatosPlan | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const Telefono = '8124447352'
  //const Telefono = phoneNumber

  const fetchData = useCallback(async () => {
    try {
      const formdata = new FormData()
      formdata.append('numero', Telefono)

      const res = await fetch('https://likephone.mx/api/SaldoUsuario/', {
        method: 'POST',
        body: formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (!res.ok) {
        throw new Error('Error al obtener los datos del plan')
      }

      const data: DatosPlan = await res.json()
      setDatosPlan(data)
    } catch (error) {
      console.error('Error en el servidor:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('https://likephone.mx/api/getPlanes')
      const data: Plan[] = await response.json()
      setPlans(data)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de planes.')
      console.error('Error al obtener los planes:', error)
    }
  }

  useEffect(() => {
    if (datosPlan && plans.length > 0) {
      const planEncontrado = plans.find(
        (plan) => plan.offeringId === datosPlan.offering_datos
      )
      setLoading(false)

      if (planEncontrado) {
        setUrlImagen(
          `https://crm.likephone.mx/public/img/${planEncontrado.imagen_movil1}`
        )
      } else {
        setUrlImagen('https://likephone.mx/public/iconos/fondo1.png')
      }
    }
  }, [datosPlan, plans])

  useEffect(() => {
    fetchData()
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <View style={consulta_saldo_styles.loadingContainer}>
        <LoadingSpinner text="Cargando Consulta de saldo...." color="#007BFF" />
      </View>
    )
  }

  const datos_iniciales = datosPlan?.datos_iniciales || 0
  const datos = datosPlan?.datos || 0
  const fecha = datosPlan?.fecha_datos_final?.date
  const mensajes_iniciales = datosPlan?.mensajes_iniciales || 0
  const mensajes = datosPlan?.mensajes || 0
  const minutos_iniciales = datosPlan?.minutos_iniciales || 0
  const minutos = datosPlan?.minutos || 0

  const fechaFormateada = fecha
    ? formatDate(fecha)
    : { day: '--', monthYear: '--' }
  const diasRestantes = fecha ? calcularDiasRestantes(fecha) : 0
  const gbInicial = convertirAGB(datos_iniciales)
  const Internet = restarSinRetorno(datos_iniciales, datos)
  const Totalgb = convertirAGB(Internet)
  const Mensaje = restarSinRetorno(mensajes_iniciales, mensajes)
  const llamdas = restarSinRetorno(minutos_iniciales, minutos)

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken')
      console.log('✅ Sesión cerrada correctamente')
      router.replace('/screens/public/Login')
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error)
    }
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={handleLogout}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Cerrar Sesión</Text>
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
        <Text style={promociones_descuentos_styles.txtPromo}>
          CONSULTAR SALDO
        </Text>
        <View style={dashboard_styles.divider} />
      </View>

      <Text style={consulta_saldo_styles.username}>
        ¡Bienvenido!, {userName}
      </Text>

      <ScrollView
        contentContainerStyle={consulta_saldo_styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={consulta_saldo_styles.promoContainer}>
          <Image
            source={{ uri: urlImagen }}
            style={consulta_saldo_styles.promoImage}
          />
        </View>

        <View style={consulta_saldo_styles.card}>
          <Text style={consulta_saldo_styles.cardDescription}>
            Fecha que expira el plan
          </Text>
          <View style={consulta_saldo_styles.cardContent}>
            <View style={consulta_saldo_styles.leftSection}>
              <Text style={consulta_saldo_styles.dateText}>
                {fechaFormateada.day}
              </Text>
              <Text style={consulta_saldo_styles.monthText}>
                {fechaFormateada.monthYear}
              </Text>
            </View>
            <View style={consulta_saldo_styles.rightSection}>
              <Text style={consulta_saldo_styles.timeText}>
                {diasRestantes}
              </Text>
              <Text style={consulta_saldo_styles.countryText}>
                {diasRestantes === 1 ? 'Día' : 'Días'}
              </Text>
            </View>
          </View>
        </View>

        <View style={consulta_saldo_styles.card}>
          <Text style={consulta_saldo_styles.cardDescription}>
            Detalle del consumo
          </Text>
          <ProgressBar
            iconName="wifi"
            label="Internet"
            value={Totalgb}
            minValue={Totalgb}
            maxValue={gbInicial}
            tipo="GB"
            color="#007BFF"
          />
          <ProgressBar
            iconName="chatbubble-outline"
            label="SMS"
            value={Mensaje}
            minValue={Mensaje}
            maxValue={mensajes_iniciales}
            tipo="SMS"
            color="#d9258e"
          />
          <ProgressBar
            iconName="call"
            label="Llamadas"
            value={llamdas}
            minValue={llamdas}
            maxValue={minutos_iniciales}
            tipo="MIN"
            color="#28a745"
          />
        </View>

        <View style={consulta_saldo_styles.card}>
          <Text style={consulta_saldo_styles.cardDescription}>
            Llamadas y SMS con Cobertura Nacional, Estados Unidos y Canada
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}
