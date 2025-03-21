import { StyleSheet } from 'react-native'
import { Responsivo } from '../components/Responsivo'

const promociones_descuentos_styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  txtPromo: {
    fontSize: Responsivo(2.3),
    color: 'white',
    textAlign: 'center',
    fontWeight: 100,
  },
  backBanner: {
    backgroundColor: '#000',
    padding: Responsivo(2),
    height: Responsivo(18),
  },
  cardPromocion: {
    marginHorizontal: Responsivo(1.2),
    marginVertical: Responsivo(1.2),
    alignItems: 'center',
  },
  cardTitlePromocion: {
    flexDirection: 'row',
    textAlign: 'center',
    marginBottom: Responsivo(0.5),
    gap: 10,
  },
  logoContainerPromocion: {
    width: Responsivo(4),
    height: Responsivo(3),
  },

  logoPromocion: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  namePromocion: {
    fontSize: Responsivo(2.1),
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  BoletoPromocion: {
    width: Responsivo(40),
    height: Responsivo(10),
    backgroundColor: '#eee400',
    borderRadius: 10,
    flexDirection: 'row',
  },
  BoletoCuponPromocion: {
    backgroundColor: '#c0baba',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  BoletoTxtCuponPromocion: {
    fontSize: Responsivo(1.6),
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: Responsivo(1),
    paddingHorizontal: Responsivo(1),
    transform: [{ rotate: '-90deg' }],
  },
  BoletoDetallesPromocion: {
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    width: '80%',
    gap: 10,
  },
  BoletoDetallesTxtTituloPromocion: {
    fontSize: Responsivo(1.8),
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  BoletoDetallesTxtDescripcionPromocion: {
    fontSize: Responsivo(1.2),
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: '400',
    width: '100%',
    maxWidth: 400,
  },
  DetallesBotonPromocion: {
    width: Responsivo(40),
    height: Responsivo(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Responsivo(1),
  },
  TxtDetallesCupon: {
    fontSize: Responsivo(1.2),
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: '500',
    width: '50%',
  },
  ButtonCupon: {
    backgroundColor: '#fff',
    padding: Responsivo(1),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: Responsivo(4),
  },
  TxtButtonCupon: {
    fontSize: Responsivo(1.5),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Estilos existentes...
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo semitransparente
  },
  modalContainer: {
    flexDirection: 'row',
    elevation: 5,
    width: '90%',
    maxWidth: 620,
    height: 'auto',
  },
  mainContentModal: {
    padding: 15,
    alignItems: 'center',
  },
  modalLogo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: Responsivo(2.3),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: Responsivo(1.2),
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    width: '70%',
  },
  timerText: {
    fontSize: Responsivo(1.8),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: Responsivo(1),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    height: Responsivo(4),
  },
  closeButtonText: {
    fontSize: Responsivo(1.5),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Estilos para el borde dentado
  ticketEdge: {
    width: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
  },
  toothRight: {
    width: 25,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo semitransparente
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    marginTop: -20,
    marginLeft: 20,
  },
  toothLeft: {
    width: 25,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo semitransparente
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginTop: -20,
    marginLeft: -10,
  },
})

export default promociones_descuentos_styles
