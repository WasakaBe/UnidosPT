import { StyleSheet } from 'react-native'
import { Responsivo } from '../components/Responsivo'
const dashboard_styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    zIndex: 100,
  },
  header: {
    width: Responsivo(30),
    height: Responsivo(10),
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    alignSelf: 'center',
  },
  headerIcons: {
    width: Responsivo(8),
    height: Responsivo(8),
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
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  phoneNumber: {
    fontSize: 16,
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
    marginHorizontal: 5,
    height: Responsivo(12.4),
  },
  buttonText: {
    fontSize: Responsivo(1.3),
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 5,
  },
  buttonGrid: {
    width: '90%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  secondaryButton: {
    width: '30%', // 🔥 Asegura que haya 3 botones por fila
    backgroundColor: '#9f9898',
    paddingVertical: Responsivo(1.3),
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    alignSelf: 'center',
    marginBottom: Responsivo(1.5),
    height: Responsivo(14),
  },
  secondaryButtonText: {
    fontSize: Responsivo(1.2),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
    width: '80%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // 🔥 Mantiene el fondo semi-transparente
  },
})
export default dashboard_styles
