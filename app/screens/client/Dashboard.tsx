const API_URL = process.env.EXPO_PUBLIC_API_URL
import React, { useEffect, useState } from 'react'

import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import colors from '@/app/constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decode as atob } from 'base-64'
import LoadingSpinner from '@/app/components/loadingSpinner'
import Banners from '@/app/components/banners'
import HamburgerMenu from '@/app/components/HamburgerMenu'
import * as Notifications from 'expo-notifications'

//styles
import dashboard_styles from '@/app/styles/dashboardStyle'

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [idUsuario, setIdUsuario] = useState<number | null>(null)
  const [idPartido, setIdPartido] = useState<number | null>(null)
  const [userName, setUserName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [userPhoto, setUserPhoto] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [pushToken, setPushToken] = useState<string | null>(null)

  console.log(userData?.id_usuario)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken') // Verificar que 'userToken' es la clave correcta

        if (!token) {
          console.log('❌ No se encontró un token almacenado')
          return
        }

        console.log('✅ Token obtenido:', token)

        const payload = JSON.parse(atob(token.split('.')[1]))

        if (!payload.id || !payload.id_partido) {
          console.error('❌ Error: Token no contiene id de usuario o partido')
          return
        }

        console.log('🔹 ID Usuario:', payload.id)
        console.log('🔹 ID Partido:', payload.id_partido)

        setIdUsuario(payload.id)
        setIdPartido(payload.id_partido)
        setUserName(
          `${payload.nombre} ${payload.a_paterno} ${payload.a_materno}` ||
            'Usuario'
        )
        setUserEmail(payload.correo || '')

        setPhoneNumber(payload.telefono)
        setUserPhoto(payload.foto_perfil || '')

        setUserData(payload) // Guardar todos los datos del usuario
        setLoading(false)
      } catch (error) {
        console.error('❌ Error al obtener los datos del usuario:', error)
      }
    }

    fetchUserData()
  }, [])

  // Registrar token de notificaciones solo si es necesario
  useEffect(() => {
    const registerPushToken = async () => {
      if (!idUsuario) return

      try {
        const existingPushToken = await AsyncStorage.getItem('pushToken')

        if (!existingPushToken) {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync()
          let finalStatus = existingStatus

          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
          }

          if (finalStatus !== 'granted') {
            console.log(
              '⚠️ No se otorgaron permisos para recibir notificaciones.'
            )
            return
          }

          const token = (await Notifications.getExpoPushTokenAsync()).data
          setPushToken(token)
          await AsyncStorage.setItem('pushToken', token)

          console.log('✅ Token de notificación obtenido:', token)

          // Enviar el token al backend
          await fetch(`${API_URL}api/notifications/register-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: idUsuario,
              token: token,
            }),
          })

          console.log('✅ Token de notificación registrado en el backend')
        } else {
          console.log('✅ Token de notificación ya registrado')
        }
      } catch (error) {
        console.log('❌ Error al registrar el token de notificación:', error)
      }
    }

    registerPushToken()
  }, [idUsuario]) // Solo se ejecuta cuando `idUsuario` está disponible

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('userData')

          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData)
            setUserName(
              `${parsedUserData.nombre} ${parsedUserData.apellidoPaterno} ${parsedUserData.apellidoMaterno}`
            )
            setUserPhoto(parsedUserData.photoUrl)
          }
        } catch (error) {
          console.error('❌ Error al cargar datos actualizados:', error)
        }
      }

      fetchUserData()
    }, []) // Se ejecuta cuando el Dashboard vuelve a estar en foco
  )

  if (loading) {
    return (
      <View style={dashboard_styles.loadingContainer}>
        <LoadingSpinner text="Cargando Dashboard..." color="#FFD700" />
      </View>
    )
  }

  // 🔥 Obtener color según el partido del usuario
  const partidoColors =
    colors[userData?.nombre_partido as keyof typeof colors] || colors.LIKEPHONE

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <HamburgerMenu
        idUsuario={idUsuario}
        idPartido={idPartido}
        userName={userName}
        userEmail={userEmail}
        phoneNumber={phoneNumber}
        userPhoto={userPhoto}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={dashboard_styles.header}>
          <Image
            source={require('../../assets/logo_partidos/unidosPt.png')}
            style={dashboard_styles.logo}
          />
        </View>

        <View style={dashboard_styles.profileContainer}>
          <View style={dashboard_styles.profileContainerImage}>
            <Image
              source={{ uri: userPhoto }}
              style={dashboard_styles.profileImage}
            />
          </View>
          <View style={dashboard_styles.profileContainerText}>
            <Text style={dashboard_styles.userName}>¡Hola {userName}!</Text>
            <Text style={dashboard_styles.phoneNumber}>{phoneNumber}</Text>
          </View>
        </View>
        <View style={dashboard_styles.divider} />
        <View>
          {/* Botones principales */}
          {idUsuario !== 7 ? (
            <View style={dashboard_styles.buttonRow}>
              <TouchableOpacity
                style={dashboard_styles.mainButton}
                onPress={() => {
                  if (idUsuario && idPartido) {
                    router.push({
                      pathname: '/screens/client/Noticias',
                      params: {
                        idUsuario: idUsuario.toString(),
                        idPartido: idPartido.toString(),
                      },
                    })
                  } else {
                    console.error(
                      '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                    )
                  }
                }}
              >
                <View style={dashboard_styles.headerIcons}>
                  <Image
                    source={require('../../assets/botones/BOTON NOTICIAS PT.png')}
                    style={dashboard_styles.iconos}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={dashboard_styles.mainButton}
                onPress={() => {
                  if (idUsuario && idPartido) {
                    router.push({
                      pathname: '/screens/client/Reporte',
                      params: {
                        idUsuario: idUsuario.toString(),
                        idPartido: idPartido.toString(),
                      },
                    })
                  } else {
                    console.error(
                      '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                    )
                  }
                }}
              >
                <View style={dashboard_styles.headerIcons}>
                  <Image
                    source={require('../../assets/botones/BOTON REPORTE CIUDADANO.png')}
                    style={dashboard_styles.iconos}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}

          {/* Botones secundarios */}
          {/* Botones secundarios en 3x3 */}
          <View style={dashboard_styles.buttonGrid}>
            {idUsuario !== 7 ? (
              <>
                <TouchableOpacity
                  style={dashboard_styles.secondaryButton}
                  onPress={() => {
                    if (idUsuario && idPartido) {
                      router.push({
                        pathname: '/screens/client/PromocionesDescuentos',
                        params: {
                          idUsuario: idUsuario.toString(),
                          idPartido: idPartido.toString(),
                        },
                      })
                    } else {
                      console.error(
                        '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                      )
                    }
                  }}
                >
                  <View style={dashboard_styles.headerIcons2}>
                    <Image
                      source={require('../../assets/botones/BOTON PROMOCIONES Y DESCUENTOS.png')}
                      style={dashboard_styles.iconos}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={dashboard_styles.secondaryButton}
                  onPress={() => {
                    if (idUsuario && idPartido) {
                      router.push({
                        pathname: '/screens/client/Directorio',
                        params: {
                          idUsuario: idUsuario.toString(),
                          idPartido: idPartido.toString(),
                        },
                      })
                    } else {
                      console.error(
                        '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                      )
                    }
                  }}
                >
                  <View style={dashboard_styles.headerIcons2}>
                    <Image
                      source={require('../../assets/botones/BOTON DIRECTORIO DE SERVICIOS.png')}
                      style={dashboard_styles.iconos}
                    />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )}

            {idUsuario !== 7 ? (
              <>
                <TouchableOpacity
                  style={dashboard_styles.secondaryButton}
                  onPress={() => {
                    if (idUsuario && idPartido) {
                      router.push({
                        pathname: '/screens/client/Conectate',
                        params: {
                          idUsuario: idUsuario.toString(),
                          idPartido: idPartido.toString(),
                        },
                      })
                    } else {
                      console.error(
                        '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                      )
                    }
                  }}
                >
                  <View style={dashboard_styles.headerIcons2}>
                    <Image
                      source={require('../../assets/botones/BOTON CONECTATE.png')}
                      style={dashboard_styles.iconos}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={dashboard_styles.secondaryButton}
                  onPress={() => {
                    if (idUsuario && idPartido) {
                      router.push({
                        pathname: '/screens/client/Invitacion',
                        params: {
                          idUsuario: idUsuario.toString(),
                          idPartido: idPartido.toString(),
                        },
                      })
                    } else {
                      console.error(
                        '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                      )
                    }
                  }}
                >
                  <View style={dashboard_styles.headerIcons2}>
                    <Image
                      source={require('../../assets/botones/BOTON INVITA AL PT.png')}
                      style={dashboard_styles.iconos}
                    />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )}

            {idUsuario !== 7 ? (
              <>
                <TouchableOpacity
                  style={dashboard_styles.secondaryButton}
                  onPress={() => {
                    if (idUsuario && idPartido) {
                      router.push({
                        pathname: '/screens/client/Recarga',
                        params: {
                          idUsuario: idUsuario.toString(),
                          idPartido: idPartido.toString(),
                          phoneNumber: encodeURIComponent(phoneNumber), // Número de teléfono codificado
                        },
                      })
                    } else {
                      console.error(
                        '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                      )
                    }
                  }}
                >
                  <View style={dashboard_styles.headerIcons2}>
                    <Image
                      source={require('../../assets/botones/BOTON RECARGAS.png')}
                      style={dashboard_styles.iconos}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={dashboard_styles.secondaryButton}
                  onPress={() => {
                    if (idUsuario && idPartido) {
                      router.push({
                        pathname: '/screens/client/ConsultarSaldo2',
                        params: {
                          idUsuario: idUsuario.toString(),
                          idPartido: idPartido.toString(),
                          userName: encodeURIComponent(userName), // Enviamos el nombre completo
                          phoneNumber: encodeURIComponent(phoneNumber), // Número de teléfono codificado
                        },
                      })
                    } else {
                      console.error(
                        '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                      )
                    }
                  }}
                >
                  <View style={dashboard_styles.headerIcons2}>
                    <Image
                      source={require('../../assets/botones/BOTON CONSULTAR SALDO.png')}
                      style={dashboard_styles.iconos}
                    />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={dashboard_styles.secondaryButton}
                onPress={() => {
                  if (idUsuario && idPartido) {
                    router.push({
                      pathname: '/screens/client/ConsultarSaldo2',
                      params: {
                        idUsuario: idUsuario.toString(),
                        idPartido: idPartido.toString(),
                        userName: encodeURIComponent(userName), // Enviamos el nombre completo
                        phoneNumber: encodeURIComponent(phoneNumber), // Número de teléfono codificado
                      },
                    })
                  } else {
                    console.error(
                      '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                    )
                  }
                }}
              >
                <View style={dashboard_styles.headerIcons2}>
                  <Image
                    source={require('../../assets/botones/BOTON CONSULTAR SALDO.png')}
                    style={dashboard_styles.iconos}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Componente de Banners */}
        <Banners idPartido={Number(idPartido)} />
      </ScrollView>
    </ImageBackground>
  )
}
