import { StyleSheet } from 'react-native'
import { Responsivo } from '../components/Responsivo'

const invitacion_styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Responsivo(5),
    justifyContent: 'space-evenly',
  },
  Containerlogo: {
    width: Responsivo(10),
    height: Responsivo(10),
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  title: {
    fontSize: Responsivo(1.9),
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    width: '100%',
  },
  titlespan: {
    fontSize: Responsivo(2),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Monserrat-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  button: {
    width: '100%',
    maxWidth: 200,
    backgroundColor: '#000',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
})

export default invitacion_styles
