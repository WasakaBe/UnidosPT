import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import dashboard_styles from '@/app/styles/dashboardStyle'
import { useLocalSearchParams, useRouter } from 'expo-router'
import noticias_styles from '@/app/styles/noticiasStyle'
import { FontAwesome } from '@expo/vector-icons'
import promociones_descuentos_styles from '@/app/styles/promocionesDescuentosStyle'
import recargas_dos_styles from '@/app/styles/recargas2Style'

interface Plan {
  cv_plan?: string
  imagen_movil1?: string
  nombre_comercial: string
  monto: number
  datos: string
  vigencia: string
  ticket: string
}

export default function Recarga() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const phoneNumber = Array.isArray(params.phoneNumber)
    ? decodeURIComponent(params.phoneNumber[0])
    : decodeURIComponent(params.phoneNumber || '')
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false) // Estado para controlar la modal
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null) // Estado para almacenar el plan seleccionado
  const Telefono = phoneNumber

  // Fetch planes function
  const fetchPlanes = async () => {
    setLoading(true)
    setErrorMessage(null) // Reset error message on each fetch attempt
    try {
      const response = await fetch('https://likephone.mx/api/getPlanes')
      if (!response.ok) {
        throw new Error('Error al obtener los planes')
      }
      const data = await response.json()

      // Ordenar los planes por precio de menor a mayor
      const sortedPlanes = data.sort((a: Plan, b: Plan) => a.monto - b.monto)

      setPlanes(sortedPlanes)
    } catch (error) {
      console.error('Error al obtener los planes:', error)
      setErrorMessage(
        'Error al cargar los planes. Inténtalo de nuevo más tarde.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Ejecutar fetchPlanes cuando el componente se monta
  useEffect(() => {
    fetchPlanes()
  }, [])

  // Manejar el clic en un plan para mostrar la modal de confirmación
  const handlePlanClick = (plan: Plan) => {
    setSelectedPlan(plan)
    setShowModal(true) // Mostrar la modal
  }

  // Confirmar la recarga y redirigir
  const confirmRecarga = () => {
    if (selectedPlan) {
      router.push({
        pathname: '/screens/client/webview',
        params: {
          cv_plan: selectedPlan.cv_plan || '',
          phoneNumber: Telefono,
        },
      })
      setShowModal(false) // Cerrar la modal
    }
  }

  // Cancelar la recarga y cerrar la modal
  const cancelRecarga = () => {
    setShowModal(false) // Solo cerrar la modal
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
        <Text style={promociones_descuentos_styles.txtPromo}>RECARGA AQUI</Text>
        <View style={dashboard_styles.divider} />
      </View>

      <View style={recargas_dos_styles.Caseta}>
        <Text style={recargas_dos_styles.CasetaTxt}>
          ¿A quien le harás la recarga?
        </Text>
        <View style={recargas_dos_styles.SubCaseta}>
          <Text>Para Mi: {Telefono}</Text>
        </View>
      </View>

      <Text style={recargas_dos_styles.PlanesTxt}>Planes Para Ti:</Text>

      {/* Mostrar estado de carga o error */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorMessage ? (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {planes.map((plan, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePlanClick(plan)} // Mostrar la modal
            >
              <View style={recargas_dos_styles.PlanItem}>
                <View style={recargas_dos_styles.PlanCard}>
                  <View style={recargas_dos_styles.PlanImageContainer}>
                    <Image
                      source={{
                        uri: `https://crm.likephone.mx/public/img/${plan.imagen_movil1}`,
                      }}
                      style={recargas_dos_styles.PlanImage}
                    />
                  </View>
                  <View style={recargas_dos_styles.PlanDetailsContainer}>
                    <Text style={recargas_dos_styles.PlanName}>
                      {plan.nombre_comercial}
                    </Text>
                    <View style={recargas_dos_styles.PlaPriceDetailsContainer}>
                      <Text style={recargas_dos_styles.planDetails}>
                        Datos: {(parseInt(plan.datos, 10) / 1000).toFixed(0)} GB
                        por {plan.vigencia} Días a solo{' '}
                        <Text style={recargas_dos_styles.PlanPrice}>
                          ${plan.monto}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal de Confirmación */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelRecarga}
      >
        <View style={recargas_dos_styles.modalBackground}>
          <View style={recargas_dos_styles.modalContainer}>
            <Text style={recargas_dos_styles.modalTitle}>
              ¿Estás seguro que deseas recargar al{' '}
              <Text style={recargas_dos_styles.spann}>{Telefono}</Text> del plan{' '}
              <Text style={recargas_dos_styles.spann}>
                {' '}
                {selectedPlan?.nombre_comercial}
              </Text>{' '}
              de{' '}
              <Text style={recargas_dos_styles.spann}>
                ${selectedPlan?.monto}
              </Text>
              ?
            </Text>
            <View style={recargas_dos_styles.modalButtonsContainer}>
              <TouchableOpacity
                style={recargas_dos_styles.modalButtonCancel}
                onPress={cancelRecarga}
              >
                <Text style={recargas_dos_styles.modalButtonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={recargas_dos_styles.modalButton}
                onPress={confirmRecarga}
              >
                <Text style={recargas_dos_styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  )
}
