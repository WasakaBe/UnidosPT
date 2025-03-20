import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import Banners from '@/app/components/banners'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import promociones_descuentos_styles from '@/app/styles/promocionesDescuentosStyle'
import { LinearGradient } from 'expo-linear-gradient'

const API_URL = process.env.EXPO_PUBLIC_API_URL
import { Promo } from '@/app/utils/interface'

import LoadingSpinner from '@/app/components/loadingSpinner'
export default function PromocionesDescuentos() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const [promociones, setPromociones] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null) // Estado para la promoción seleccionada
  const [modalVisible, setModalVisible] = useState(false) // Estado para la modal
  const [countdown, setCountdown] = useState(900) // 15 minutos en segundos

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (modalVisible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setModalVisible(false) // Cerrar la modal cuando el tiempo se agote
    }
    return () => clearInterval(timer) // Limpiar el temporizador cuando el componente se desmonte o el tiempo se acabe
  }, [modalVisible, countdown])

  useEffect(() => {
    if (idPartido) {
      // Realizar la llamada a la API para obtener las promociones usando fetch
      fetch(`${API_URL}api/promociones/${idPartido}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPromociones(data.promociones) // Guardar promociones
          } else {
            setError('No hay promociones disponibles para este partido')
          }
          setLoading(false)
        })
        .catch((err) => {
          setError('Error al cargar las promociones')
          setLoading(false)
        })
    }
  }, [idPartido])

  // Llamada a registerClick cuando se selecciona una promoción
  const registerClick = async (idPromocion: number) => {
    try {
      const response = await fetch(
        `${API_URL}api/promociones/click/${idPromocion}`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()
      console.log('✔️ Click registrado:', data)
    } catch (error) {
      console.error('❌ Error al registrar el clic:', error)
    }
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={promociones_descuentos_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
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
        <Text style={promociones_descuentos_styles.txtPromo}>
          PROMOCIONES Y DESCUENTOS
        </Text>
        <View style={dashboard_styles.divider} />
      </View>

      {/* Mostrar promociones */}
      <ScrollView>
        <View>
          {loading ? (
            <LoadingSpinner />
          ) : (
            promociones.map((promo) => (
              <View
                key={promo.idPromocion}
                style={promociones_descuentos_styles.cardPromocion}
              >
                <View style={promociones_descuentos_styles.cardTitlePromocion}>
                  {promo.logo ? (
                    <View
                      style={
                        promociones_descuentos_styles.logoContainerPromocion
                      }
                    >
                      <Image
                        source={{ uri: promo.logo }}
                        style={promociones_descuentos_styles.logoPromocion}
                      />
                    </View>
                  ) : (
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color="#666"
                    />
                  )}
                  <Text style={promociones_descuentos_styles.namePromocion}>
                    {promo.nombreNegocio}
                  </Text>
                </View>
                <View style={promociones_descuentos_styles.BoletoPromocion}>
                  <View
                    style={promociones_descuentos_styles.BoletoCuponPromocion}
                  >
                    <Text
                      style={
                        promociones_descuentos_styles.BoletoTxtCuponPromocion
                      }
                    >
                      CUPÓN
                    </Text>
                  </View>
                  <View
                    style={
                      promociones_descuentos_styles.BoletoDetallesPromocion
                    }
                  >
                    <Text
                      style={
                        promociones_descuentos_styles.BoletoDetallesTxtTituloPromocion
                      }
                    >
                      {promo.tituloPromocion}
                    </Text>
                    <Text
                      style={
                        promociones_descuentos_styles.BoletoDetallesTxtDescripcionPromocion
                      }
                    >
                      {promo.descripcionPromocion}
                    </Text>
                  </View>
                </View>

                <View
                  style={promociones_descuentos_styles.DetallesBotonPromocion}
                >
                  <Text style={promociones_descuentos_styles.TxtDetallesCupon}>
                    {promo.detalles}
                  </Text>

                  <TouchableOpacity
                    style={promociones_descuentos_styles.ButtonCupon}
                    onPress={() => {
                      setSelectedPromo(promo) // Almacena la promoción seleccionada
                      setModalVisible(true) // Abrir la modal
                      registerClick(promo.idPromocion)
                    }}
                  >
                    <Text style={promociones_descuentos_styles.TxtButtonCupon}>
                      UTILIZAR CUPÓN
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal de cupón */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={promociones_descuentos_styles.modalBackground}>
          <LinearGradient
            colors={['#eedf08', '#ffffff']} // Gradiente amarillo a blanco
            style={promociones_descuentos_styles.modalContainer}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 1 }}
          >
            <>
              {/* Borde derecho dentado */}
              <View style={promociones_descuentos_styles.ticketEdge}>
                {[...Array(3)].map((_, i) => (
                  <View
                    key={`right-${i}`}
                    style={promociones_descuentos_styles.toothLeft}
                  />
                ))}
              </View>
              <View style={promociones_descuentos_styles.mainContentModal}>
                {/* Logo */}
                <Image
                  source={{ uri: selectedPromo?.logo }}
                  style={promociones_descuentos_styles.modalLogo}
                />

                {/* Título y Descripción */}
                <Text style={promociones_descuentos_styles.modalTitle}>
                  PROMO ESPECIAL
                </Text>
                <Text style={promociones_descuentos_styles.modalDescription}>
                  {selectedPromo?.descripcionPromocion}
                </Text>

                {/* Temporizador */}
                <Text style={promociones_descuentos_styles.timerText}>
                  Tiempo restante: {Math.floor(countdown / 60)}:{countdown % 60}
                </Text>

                {/* Botones */}
                <TouchableOpacity
                  style={promociones_descuentos_styles.closeButton}
                  onPress={() => setModalVisible(false)} // Cerrar la modal
                >
                  <Text style={promociones_descuentos_styles.closeButtonText}>
                    Salir
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Borde derecho dentado */}
              <View style={promociones_descuentos_styles.ticketEdge}>
                {[...Array(3)].map((_, i) => (
                  <View
                    key={`right-${i}`}
                    style={promociones_descuentos_styles.toothRight}
                  />
                ))}
              </View>
            </>
          </LinearGradient>
        </View>
      </Modal>

      {/* Componente de Banners */}
      <View style={promociones_descuentos_styles.backBanner}>
        <Banners idPartido={Number(idPartido)} />
      </View>
    </ImageBackground>
  )
}
