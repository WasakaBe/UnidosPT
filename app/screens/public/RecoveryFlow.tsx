import { API_URL } from '@env'
import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'
import CustomModal from '@/app/components/customModal'

export default function RecoveryFlow() {
  const [currentScreen, setCurrentScreen] = useState<
    'recovery' | 'validate-token' | 'change-pwd'
  >('recovery')
  const [isEmail, setIsEmail] = useState<boolean>(true)
  const [inputValue, setInputValue] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'success' | 'error'>('success')
  const [modalMessage, setModalMessage] = useState<string>('')

  const savedInputValue = useRef<string>('')

  const toggleInputType = () => {
    setIsEmail(!isEmail)
    setInputValue('')
  }

  const validateInput = () => {
    if (!inputValue.trim()) {
      Alert.alert('Error', 'Por favor, ingresa un valor válido.')
      return false
    }

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(inputValue)) {
        Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.')
        return false
      }
    } else {
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(inputValue)) {
        Alert.alert(
          'Error',
          'Por favor, ingresa un número de teléfono válido (10 dígitos).'
        )
        return false
      }
    }

    return true
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 'N/A'
    if (password.length < 6) return 'Débil'
    if (password.length < 8) return 'Moderada'
    return 'Fuerte'
  }

  const handleRecoverPassword = async () => {
    if (!validateInput()) return
    setIsLoading(true)
    savedInputValue.current = inputValue //guardamos valor

    const payload = {
      method: isEmail ? 2 : 1,
      [isEmail ? 'email' : 'telefono']: inputValue,
    }
    console.log('Input Value antes de validar token:', inputValue)

    try {
      const response = await fetch(
        `${API_URL}api/userspartido/recover-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      console.log('Payload enviado:', {
        [isEmail ? 'email' : 'telefono']: inputValue,
        token,
      })

      const data = await response.json()

      if (response.ok) {
        setModalType('success')
        setModalMessage(data.message)
        setModalVisible(true)
        setCurrentScreen('validate-token')
      } else {
        setModalType('error')
        setModalMessage(data.message || 'Ocurrió un error inesperado.')
        setModalVisible(true)
        setInputValue('')
      }
    } catch (error) {
      console.log('Error en la solicitud:', error)

      setInputValue('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidateToken = async () => {
    if (!token.trim() || token.length !== 6) {
      setModalType('error')
      setModalMessage('Por favor, ingresa un token válido de 6 dígitos.')
      setModalVisible(true)
      return
    }

    setIsLoading(true)

    const payload = {
      [isEmail ? 'email' : 'telefono']: inputValue,
      token,
    }

    try {
      const response = await fetch(
        `${API_URL}api/userspartido/validate-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )
      console.log('Payload enviado token:', {
        [isEmail ? 'email' : 'telefono']: inputValue,
        token,
      })

      const data = await response.json()

      if (response.ok) {
        setModalType('success')
        setModalMessage(data.message)
        setModalVisible(true)
        setCurrentScreen('change-pwd')
        setToken('')
      } else {
        setModalType('error')
        setModalMessage(data.message || 'Ocurrió un error inesperado.')
        setModalVisible(true)
        setToken('')
      }
    } catch (error) {
      console.log('Error en la solicitud:', error)
      setToken('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setModalType('error')
      setModalMessage('Por favor, completa ambos campos.')
      setModalVisible(true)
      return
    }

    if (newPassword !== confirmPassword) {
      setModalType('error')
      setModalMessage('Las contraseñas no coinciden.')
      setModalVisible(true)
      return
    }

    setIsLoading(true)

    const payload = {
      [isEmail ? 'email' : 'telefono']: inputValue,
      nueva_contraseña: newPassword,
    }

    try {
      const response = await fetch(
        `${API_URL}api/userspartido/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (response.ok) {
        setModalType('success')
        setModalMessage(data.message)
        setModalVisible(true)
        setCurrentScreen('recovery')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setModalType('error')
        setModalMessage(data.message || 'Ocurrió un error inesperado.')
        setModalVisible(true)
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      console.log('Error en la solicitud:', error)

      setNewPassword('')
      setConfirmPassword('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'recovery' && (
        <>
          <Text style={styles.title}>Recuperación de Contraseña</Text>

          {isEmail ? (
            <TextInput
              style={styles.input}
              placeholder="Ingrese su correo"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Ingrese su teléfono"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="phone-pad"
            />
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleRecoverPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Siguiente</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleTextBtn}
            onPress={toggleInputType}
          >
            <Text style={styles.toggleText}>
              {isEmail
                ? 'Reestablecer por medio de teléfono'
                : 'Reestablecer por medio de correo'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {currentScreen === 'validate-token' && (
        <>
          <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.content}>
                <View style={styles.header}>
                  <MaterialIcons
                    name="verified-user"
                    size={64}
                    color="#4CAF50"
                  />
                  <Text style={styles.title}>Verificación</Text>
                  <Text style={styles.subtitle}>
                    Ingresa el código de 6 dígitos que enviamos a tu dispositivo
                  </Text>
                </View>
                <View style={styles.inputContainerToken}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese el token de 6 dígitos"
                    value={token}
                    onChangeText={setToken}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.disabledButton]}
                  onPress={handleValidateToken}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Validar Token</Text>
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </>
      )}

      {currentScreen === 'change-pwd' && (
        <>
          <Text style={styles.title}>Cambiar Contraseña</Text>

          {/* Campo para nueva contraseña */}
          <View style={styles.inputContainerPwd}>
            <TextInput
              style={styles.inputpwd}
              placeholder="Ingrese su nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.iconButton}
            >
              <MaterialIcons
                name={showNewPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          {/* Campo para confirmar contraseña */}
          <View style={styles.inputContainerPwd}>
            <TextInput
              style={styles.inputpwd}
              placeholder="Repita su nueva contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.iconButton}
            >
              <MaterialIcons
                name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          {/* Mensaje de fortaleza de la contraseña */}
          <Text style={styles.passwordStrengthText}>
            Fortaleza de la contraseña: {getPasswordStrength(newPassword)}
          </Text>

          {/* Botón para cambiar contraseña */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cambiar Contraseña</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        duration={3000} // Duración en milisegundos (opcional)
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputpwd: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  inputContainerToken: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputContainerPwd: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  iconButton: {
    padding: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleTextBtn: {
    width: '100%',
  },
  toggleText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  passwordStrengthText: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
})
