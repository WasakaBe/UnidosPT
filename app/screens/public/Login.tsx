const API_URL = process.env.EXPO_PUBLIC_API_URL
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomModal from '@/app/components/customModal'
import { validatePassword, validatePhone } from '@/app/constants/validations'
//styles
import login_styles from '@/app/styles/loginStyle'
//interfaces
import { LoginProps } from '@/app/utils/interface'
import { decode as atob } from 'base-64'

const Login: React.FC<LoginProps> = ({
  onLogin,
  onForgotPassword,
  onCreateAccount,
}) => {
  const router = useRouter() // ✅ Reemplazo de useNavigation
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  // Estado para manejar el modal
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean
    type: 'success' | 'error' | 'ban'
    message: string
  }>({ visible: false, type: 'success', message: '' })

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const buttonScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    )

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()

    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start()
  }

  // Comprobar si hay un token almacenado al abrir la aplicación
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')

        if (!token) return

        // Intentar decodificar el token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))

          if (!payload.id) {
            console.warn('🔴 Token inválido, eliminando...')
            await AsyncStorage.removeItem('userToken')
            return
          }

          console.log('🔑 Usuario ya autenticado, redirigiendo al Dashboard')

          if (payload.id === 7) {
            router.replace('/screens/client/ConsultarLimitado')
          } else {
            router.replace('/screens/client/Dashboard')
          }
        } catch (error) {
          console.warn('⚠️ No se pudo decodificar el token, eliminando...')
          await AsyncStorage.removeItem('userToken')
        }
      } catch (error) {
        console.error('Error al verificar la sesión del usuario:', error)
      }
    }

    checkUserSession()
  }, [])

  const handleLogin = async () => {
    setPhoneError(validatePhone(phone))
    setPasswordError(validatePassword(password))

    if (validatePhone(phone) || validatePassword(password)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}api/userspartido/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefono: phone, password: password }),
      })

      const data = await response.json()

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Error en el inicio de sesión.')
      }

      // Guardar token solo si la autenticación fue exitosa
      await AsyncStorage.setItem('userToken', data.token)

      // Decodificar el token JWT usando `base-64`
      const payload = JSON.parse(atob(data.token.split('.')[1]))

      if (!payload.id) {
        throw new Error('Token inválido: no contiene ID de usuario.')
      }

      console.log('🏛️ Usuario pertenece al partido:', payload.id_partido)
      console.log('🏛️ Usuario pertenece al usuario:', payload.id)

      // Mostrar modal de éxito
      setModalConfig({
        visible: true,
        type: 'success',
        message: 'Inicio de sesión exitoso. Bienvenido de nuevo.',
      })

      // Redirigir al Dashboard después de un pequeño delay
      setTimeout(() => {
        setModalConfig({ ...modalConfig, visible: false })
        if (payload.id === 7) {
          router.replace('/screens/client/ConsultarLimitado')
        } else {
          router.replace('/screens/client/Dashboard')
        }
      }, 1500)
    } catch (error: any) {
      console.log(error.message || 'Error en el inicio de sesión.')
      await AsyncStorage.removeItem('userToken')

      setModalConfig({
        visible: true,
        type: 'error',
        message: 'Error en el inicio de sesión.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/fondo_partidos/unidos_pt.png')}
      style={login_styles.container}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={login_styles.gradient}>
          <BlurView intensity={20} style={login_styles.blurContainer}>
            <Animated.View
              style={[
                login_styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Image
                source={require('../../assets/logo_partidos/LOGOTIPO VERTICAL.png')}
                style={login_styles.logo}
              />
              <View style={login_styles.titleContainer}>
                <Text style={login_styles.title}>Iniciar Sesión</Text>
                <Text style={login_styles.subtitle}>
                  Bienvenido de vuelta, te extrañamos
                </Text>
                <Animated.View style={login_styles.underline} />
              </View>

              <View style={login_styles.inputContainer}>
                <Text style={login_styles.label}>Teléfono</Text>
                <View style={login_styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                  <TextInput
                    style={login_styles.input}
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text)
                      setPhoneError(null)
                    }}
                    placeholder="Ingresa tu teléfono"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                  />
                </View>
                {phoneError && (
                  <Text style={login_styles.errorText}>{phoneError}</Text>
                )}
                <Text style={login_styles.label}>Contraseña</Text>
                <View style={login_styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    style={login_styles.input}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text)
                      setPasswordError(null)
                    }}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor="#666"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={login_styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError && (
                  <Text style={login_styles.errorText}>{passwordError}</Text>
                )}
              </View>

              <Animated.View
                style={[
                  login_styles.buttonContainer,
                  { transform: [{ scale: buttonScale }] },
                ]}
              >
                <TouchableOpacity
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={handleLogin}
                  style={login_styles.button}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={login_styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="log-in-outline" size={24} color="#FFFFFF" />
                    <Text style={login_styles.buttonText}>
                      {' '}
                      {loading ? 'Cargando...' : 'Login'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <View style={login_styles.linksContainer}>
                <TouchableOpacity
                  onPress={() => router.push('/screens/public/RecoveryFlow')}
                >
                  <Text style={login_styles.link}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
                <Text style={{ color: 'white' }}>||</Text>
                <TouchableOpacity
                  onPress={() => router.push('/screens/public/Register')}
                >
                  <Text style={login_styles.link}>Crear cuenta nueva</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </BlurView>
        </View>

        <CustomModal
          visible={modalConfig.visible}
          type={modalConfig.type}
          message={modalConfig.message}
          onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        />
      </ScrollView>
    </ImageBackground>
  )
}

export default Login
