import { StyleSheet } from 'react-native'
import fonts from '../constants/fonts'
import { Responsivo } from '../components/Responsivo'
const login_styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: Responsivo(3),
  },
  content: {
    width: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Responsivo(2),
  },
  title: {
    ...fonts.title,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
    width: Responsivo(30),
    textAlign: 'center',
  },
  underline: {
    width: Responsivo(30),
    height: 3,
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
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    margin: Responsivo(2),
  },
  button: {
    width: Responsivo(40),

    borderRadius: 12,
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
    justifyContent: 'center',
    paddingVertical: Responsivo(2),
    paddingHorizontal: Responsivo(2),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Responsivo(2),
    letterSpacing: 1,
  },
  linksContainer: {
    marginTop: Responsivo(5),
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexDirection: 'row',
    width: '100%',
  },
  link: {
    width: Responsivo(15),
    color: '#fff',
    fontSize: Responsivo(1.5),
    textDecorationLine: 'underline',
  },
  logo: {
    width: '50%',
    height: 200,
    objectFit: 'fill',
    alignSelf: 'center',
  },
  errorText: {
    ...fonts.smallText,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 12,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
})

export default login_styles
