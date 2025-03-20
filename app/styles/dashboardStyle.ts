import { StyleSheet } from 'react-native'
import { Responsivo } from '../components/Responsivo'
const dashboard_styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
  },

  header: {
    width: Responsivo(30),
    height: Responsivo(6),
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginVertical: 10,
  },
  headerIcons: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconos: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  profileContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  profileContainerText: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainerImage: {
    width: 50,
    height: 50,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    borderRadius: 50,
  },
  userName: {
    fontSize: Responsivo(1.7),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  phoneNumber: {
    fontSize: Responsivo(1.3),
    color: '#FFFFFF',
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
    alignSelf: 'center',
  },
  mainButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    height: Responsivo(12),
  },
  buttonGrid: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryButton: {
    width: '30%', // 🔥 Asegura que haya 3 botones por fila
    paddingVertical: Responsivo(1),
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: Responsivo(0.1),
    alignSelf: 'center',
    marginBottom: Responsivo(1),
    height: Responsivo(15),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // 🔥 Mantiene el fondo semi-transparente
  },
  headerIcons2: {
    width: '80%',
    height: Responsivo(12),
  },
})
export default dashboard_styles
