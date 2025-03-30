const API_URL = process.env.EXPO_PUBLIC_API_URL

import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native'

import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from '@/app/constants/validations'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import CustomModal from '@/app/components/customModal'
import { useRouter } from 'expo-router'
import login_styles from '@/app/styles/loginStyle'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { ImageBackground } from 'react-native'

export default function Register() {
  const router = useRouter()

  const [nombre, setNombre] = useState<string>('')
  const [apellidoPaterno, setApellidoPaterno] = useState<string>('')
  const [apellidoMaterno, setApellidoMaterno] = useState<string>('')
  const [telefono, setTelefono] = useState<string>('')
  const [correo, setCorreo] = useState<string>('')
  const [contraseña, setContraseña] = useState<string>('')
  const [fechaNacimiento, setFechaNacimiento] = useState<string>('')
  const [sexo, setSexo] = useState<string>('') // Nuevo campo (1: Masculino, 0: Femenino)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Estados para errores
  const [errorNombre, setErrorNombre] = useState<string | null>(null)
  const [errorApellidoPaterno, setErrorApellidoPaterno] = useState<
    string | null
  >(null)
  const [errorApellidoMaterno, setErrorApellidoMaterno] = useState<
    string | null
  >(null)
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null)
  const [errorCorreo, setErrorCorreo] = useState<string | null>(null)
  const [errorContraseña, setErrorContraseña] = useState<string | null>(null)
  const [errorFechaNacimiento, setErrorFechaNacimiento] = useState<
    string | null
  >(null) // Nuevo error

  // Estados para el modal
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [modalMessage, setModalMessage] = useState<string>('')

  // Función para validar la edad
  const validateAge = (fechaNacimiento: string): string | null => {
    const fechaActual = new Date()
    const fechaNac = new Date(fechaNacimiento)
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear() // Cambia const por let

    // Verificar si el cumpleaños ya pasó este año
    const mesActual = fechaActual.getMonth()
    const diaActual = fechaActual.getDate()
    const mesNac = fechaNac.getMonth()
    const diaNac = fechaNac.getDate()

    if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
      edad-- // Ahora sí puedes modificar edad
    }

    if (edad < 17) {
      return 'Debes tener al menos 18 años para registrarte.'
    }

    return null
  }

  const handleRegister = async () => {
    // Validaciones y asignación de errores
    setErrorNombre(validateFullName(nombre))
    setErrorApellidoPaterno(validateFullName(apellidoPaterno))
    setErrorApellidoMaterno(validateFullName(apellidoMaterno))
    setErrorTelefono(validatePhone(telefono))
    setErrorCorreo(validateEmail(correo))
    setErrorContraseña(validatePassword(contraseña))
    setErrorFechaNacimiento(
      fechaNacimiento
        ? validateAge(fechaNacimiento)
        : 'La fecha de nacimiento es requerida'
    )

    // Verifica si hay algún error antes de enviar el formulario
    if (
      validateFullName(nombre) ||
      validateFullName(apellidoPaterno) ||
      validateFullName(apellidoMaterno) ||
      validatePhone(telefono) ||
      validateEmail(correo) ||
      validatePassword(contraseña) ||
      (fechaNacimiento && validateAge(fechaNacimiento))
    ) {
      setModalType('error')
      setModalMessage('Por favor, revisa los datos ingresados.')
      setModalVisible(true)
      return
    }

    setLoading(true)

    try {
      console.log('📞 Validando sexo:', sexo)
      // 1. Validar el número de teléfono con la API externa
      const validarNumeroResponse = await fetch(
        'https://crm.likephone.mx/xti/validarNumero',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numero: telefono }),
        }
      )

      const numeroData = await validarNumeroResponse.json()

      if (numeroData.alert === 'error') {
        setModalType('error')
        setModalMessage('Este número no está asociado a la empresa Likephone.')
        setModalVisible(true)
        setLoading(false)
        return
      }

      // 2. Enviar los datos al backend
      const response = await fetch(`${API_URL}api/userspartido/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          fecha_nacimiento: fechaNacimiento,
          sexo,
          telefono,
          correo,
          contraseña,
        }),
      })
      console.log('response', response)
      console.log('status', response.status)
      console.log('statusText', response.statusText)

      const data = await response.json()
      console.log('resultados de data', data)

      if (response.ok) {
        setModalType('success')
        setModalMessage('Usuario registrado correctamente.')

        // **Limpia los campos del formulario**
        setNombre('')
        setApellidoPaterno('')
        setApellidoMaterno('')
        setTelefono('')
        setCorreo('')
        setContraseña('')
        setFechaNacimiento('')
        setSexo('') // Reiniciar sexo a Masculino

        // **Redirige al Login después de 2 segundos**
        setTimeout(() => {
          setModalVisible(false)
          router.replace('/screens/public/Login')
        }, 2000)
      } else {
        // Manejo de errores específicos
        if (data.message.includes('correo')) {
          setModalType('error')
          setModalMessage('Correo existente. Pruebe con uno nuevo.')
        } else if (data.message.includes('teléfono')) {
          setModalType('error')
          setModalMessage('Teléfono existente. Pruebe con uno nuevo.')
        } else {
          setModalType('error')
          setModalMessage(data.message || 'Error al registrar usuario.')
        }
      }
    } catch (error) {
      setModalType('error')
      setModalMessage('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
      setModalVisible(true)
    }
  }

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const [keyboardVisible, setKeyboardVisible] = useState(false)
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
              <View style={login_styles.titleContainer}>
                <Text style={login_styles.title}>Registro</Text>
                <Animated.View style={login_styles.underline} />
              </View>

              <View style={login_styles.inputContainer}>
                <Text style={login_styles.label}>Nombre</Text>
                <View style={login_styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    placeholder="Nombre"
                    placeholderTextColor="#666"
                    value={nombre}
                    onChangeText={(text) => {
                      setNombre(text)
                      setErrorNombre(validateFullName(text))
                    }}
                    style={login_styles.input}
                  />
                </View>
                {errorNombre && (
                  <Text style={login_styles.errorText}>{errorNombre}</Text>
                )}

                <Text style={login_styles.label}>Apellido Paterno</Text>
                <View style={login_styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    placeholder="Apellido Paterno"
                    placeholderTextColor="#666"
                    value={apellidoPaterno}
                    onChangeText={(text) => {
                      setApellidoPaterno(text)
                      setErrorApellidoPaterno(validateFullName(text))
                    }}
                    style={login_styles.input}
                  />
                </View>
                {errorApellidoPaterno && (
                  <Text style={login_styles.errorText}>
                    {errorApellidoPaterno}
                  </Text>
                )}

                <Text style={login_styles.label}>Apellido Materno</Text>
                <View style={login_styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    placeholder="Apellido Materno"
                    placeholderTextColor="#666"
                    value={apellidoMaterno}
                    onChangeText={(text) => {
                      setApellidoMaterno(text)
                      setErrorApellidoMaterno(validateFullName(text))
                    }}
                    style={login_styles.input}
                  />
                </View>
                {errorApellidoMaterno && (
                  <Text style={login_styles.errorText}>
                    {errorApellidoMaterno}
                  </Text>
                )}

                {/* Nuevo campo: Fecha de Nacimiento */}
                <Text style={login_styles.label}>
                  Fecha de Nacimiento "YYYY-MM-DD"
                </Text>
                <View style={login_styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#666"
                    value={fechaNacimiento}
                    onChangeText={(text) => setFechaNacimiento(text)}
                    style={login_styles.input}
                    keyboardType="numeric"
                  />
                </View>
                {errorFechaNacimiento && (
                  <Text style={login_styles.errorText}>
                    {errorFechaNacimiento}
                  </Text>
                )}

                {/* Nuevo campo: Sexo */}
                <Text style={login_styles.label}>Sexo</Text>
                <View style={login_styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="gender-male-female"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Picker
                    selectedValue={sexo}
                    onValueChange={(itemValue) => setSexo(itemValue)}
                    style={login_styles.input}
                  >
                    <Picker.Item label="Masculino" value={1} />
                    <Picker.Item label="Femenino" value={0} />
                  </Picker>
                </View>

                <Text style={login_styles.label}>Telefono</Text>
                <View style={login_styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="phone"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    placeholder="Teléfono"
                    placeholderTextColor="#666"
                    value={telefono}
                    onChangeText={(text) => {
                      setTelefono(text)
                      setErrorTelefono(validatePhone(text))
                    }}
                    keyboardType="phone-pad"
                    style={login_styles.input}
                  />
                </View>
                {errorTelefono && (
                  <Text style={login_styles.errorText}>{errorTelefono}</Text>
                )}

                <Text style={login_styles.label}>Correo Electronico</Text>
                <View style={login_styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="email"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#666"
                    value={correo}
                    onChangeText={(text) => {
                      setCorreo(text)
                      setErrorCorreo(validateEmail(text))
                    }}
                    keyboardType="email-address"
                    style={login_styles.input}
                  />
                </View>
                {errorCorreo && (
                  <Text style={login_styles.errorText}>{errorCorreo}</Text>
                )}

                <Text style={login_styles.label}>Contraseña</Text>
                <View style={login_styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                  <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#666"
                    value={contraseña}
                    onChangeText={(text) => {
                      setContraseña(text)
                      setErrorContraseña(validatePassword(text))
                    }}
                    secureTextEntry={!showPassword}
                    style={login_styles.input}
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
                {errorContraseña && (
                  <Text style={login_styles.errorText}>{errorContraseña}</Text>
                )}

                <Animated.View
                  style={[
                    login_styles.buttonContainer,
                    { transform: [{ scale: buttonScale }] },
                  ]}
                >
                  <TouchableOpacity
                    onPress={handleRegister}
                    style={login_styles.button}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(255,255,255,0.15)',
                        'rgba(255,255,255,0.05)',
                      ]}
                      style={login_styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons
                        name="log-in-outline"
                        size={24}
                        color="#FFFFFF"
                      />
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text style={styles.buttonText}>Registrar</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Animated.View>
          </BlurView>

          {/* Modal de éxito, error o cuenta suspendida */}
          <CustomModal
            visible={modalVisible}
            type={modalType}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3b5998',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 20,
  },
})
