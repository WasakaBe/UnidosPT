import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import * as Notifications from 'expo-notifications'

interface NotificationModalProps {
  visible: boolean
  onClose: () => void
  onAccept: () => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  onAccept,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Recibe Notificaciones</Text>
          <Text style={styles.description}>
            ¿Quieres recibir notificaciones sobre eventos, novedades y mensajes
            importantes?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
            >
              <Text style={styles.buttonText}>Sí, Activar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>No, gracias</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})

export default NotificationModal
