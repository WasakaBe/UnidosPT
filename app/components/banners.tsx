const API_URL = process.env.EXPO_PUBLIC_API_URL
import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native'

import { connectSocket, leaveRoom } from '../auth/socket'
import LoadingSpinner from './loadingSpinner'

//interface
import { Banner } from '../utils/interface'
import { Responsivo } from './Responsivo'

// Librerías de Expo
import Animated from 'react-native-reanimated'

const { width } = Dimensions.get('window')

export default function Banners({ idPartido }: { idPartido: number }) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [partidoActivo, setPartidoActivo] = useState<number | null>(null) // Estado del partido
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // 📌 Función para obtener banners y estado del partido desde la API (polling)
  const fetchBanners = async () => {
    try {
      const response = await fetch(
        `${API_URL}api/imagenes_banner/partido/${idPartido}`
      )
      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Error al obtener los banners')
        return
      }

      setBanners(data.imagenes)
      setPartidoActivo(data.partido_activo) // Actualiza el estado del partido en tiempo real
      setError(null)
    } catch (error) {
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // 📌 Conectar al socket para recibir banners en tiempo real
  useEffect(() => {
    const socket = connectSocket(idPartido)

    socket.on('bannersActualizados', (nuevosBanners: Banner[]) => {
      setBanners(nuevosBanners) // Actualiza banners en tiempo real
    })

    return () => {
      leaveRoom(idPartido) // Salir del canal al desmontar
    }
  }, [idPartido])

  // 📌 Polling cada 10 segundos para obtener el estado del partido
  useEffect(() => {
    fetchBanners() // Llamado inicial

    const interval = setInterval(() => {
      fetchBanners()
    }, 10000) // Actualizar cada 10 segundos

    return () => clearInterval(interval) // Limpiar intervalo al desmontar
  }, [idPartido])

  // 📌 Desplazamiento automático de banners si el partido está activo
  useEffect(() => {
    if (banners.length > 0 && partidoActivo === 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length
          scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true })
          return nextIndex
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [banners.length, partidoActivo])

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingSpinner text="Cargando Banners..." color="#1E88E5" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (partidoActivo === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.inactiveText}>🚫 Este partido está inactivo</Text>
      </View>
    )
  }

  return (
    <View>
      {/* Carrusel con animaciones */}
      <Animated.View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          scrollEventThrottle={1}
          contentOffset={{ x: currentIndex * width, y: 0 }}
          onMomentumScrollEnd={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x
            setCurrentIndex(Math.floor(contentOffsetX / width))
          }}
        >
          {banners.map((item, index) => (
            <View style={styles.bannerItem} key={item.id_imagen}>
              <Image source={{ uri: item.ruta_imagen }} style={styles.image} />
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerItem: {
    width: width,
    height: Responsivo(10),
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  inactiveText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
})
