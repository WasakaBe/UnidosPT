import { Stack } from 'expo-router'
import * as Sentry from '@sentry/react-native'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef, useState } from 'react'
import { View, Text, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NotificationModal from './components/NotificationModal'
import React from 'react'

Sentry.init({
  dsn: 'https://abc52c85903bf6cde2785bfaa90ccc12@o4508286180196352.ingest.us.sentry.io/4508933740560384',
  tracesSampleRate: 1.0,
  debug: __DEV__,
})

export default function RootLayout() {
  const notificationListener = useRef<any>()
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    checkNotificationPermission()

    // Escuchar notificaciones cuando la app está abierta
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('🔔 Notificación recibida:', notification)
        Alert.alert(
          notification.request.content.title || 'Notificación',
          notification.request.content.body || 'Tienes un nuevo mensaje.'
        )
      })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
    }
  }, [])

  // Función para verificar si el usuario ya ha aceptado las notificaciones
  async function checkNotificationPermission() {
    const alreadyAsked = await AsyncStorage.getItem('askedForNotifications')

    if (!alreadyAsked) {
      setModalVisible(true)
    }
  }

  // Función para solicitar permisos de notificación
  async function requestNotifications() {
    const { status } = await Notifications.requestPermissionsAsync()

    if (status === 'granted') {
      console.log('✅ Permisos de notificación concedidos.')
    } else {
      console.log('❌ Permisos de notificación denegados.')
    }

    // Guardar en AsyncStorage que ya se mostró el modal
    await AsyncStorage.setItem('askedForNotifications', 'true')
    setModalVisible(false)
  }

  return (
    <>
      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAccept={requestNotifications}
      />

      <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
        <Stack screenOptions={{ headerShown: false }} />
      </Sentry.ErrorBoundary>
    </>
  )
}

// Componente para manejar errores de UI en producción
function ErrorFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'red' }}>Ocurrió un error inesperado</Text>
    </View>
  )
}
