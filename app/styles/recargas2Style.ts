import { StyleSheet } from 'react-native'

const recargas_dos_styles = StyleSheet.create({
  Caseta: {
    padding: 20,
    borderRadius: 12,
    margin: 6,
  },
  CasetaTxt: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 10,
  },
  SubCaseta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  PlanesTxt: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    margin: 6,
  },
  PlanItem: {
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    elevation: 2,
  },
  PlanCard: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',

    alignItems: 'center',
  },
  PlanImageContainer: {
    width: 80,
    height: 80,
  },
  PlanImage: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  PlanPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0068d1',
  },
  PlanName: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  PlanDetails: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    margin: 6,
  },
  PlanDetailsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
  },
  PlaPriceDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  planDetails: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    width: '100%',
    textAlign: 'center',
  },
  //modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
  },
  spann: {
    color: '#0068d1',
    fontWeight: 'bold',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonCancel: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default recargas_dos_styles
