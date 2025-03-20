import { StyleSheet } from 'react-native'
import fonts from '../constants/fonts'
import { Responsivo } from '../components/Responsivo'
const index_styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  fotoii: {
    width: Responsivo(30),
    height: Responsivo(30),
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Responsivo(10),
  },
  title: {
    ...fonts.title,
    fontSize: Responsivo(2),
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontStyle: 'italic',
    textAlign: 'center',
    width: Responsivo(50),
  },
  underline: {
    width: Responsivo(40),
    height: Responsivo(0.5),
    backgroundColor: '#750808',
    borderRadius: 2,
    marginTop: 8,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: Responsivo(2),
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Responsivo(2),
    paddingHorizontal: Responsivo(5),
    borderRadius: 30,
  },
  buttonText: {
    ...fonts.buttonText,
    color: '#FFFFFF',
    fontSize: Responsivo(2),
    fontWeight: '600',
    marginLeft: 12,
    letterSpacing: 1,
  },
})

export default index_styles
