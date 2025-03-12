import { StyleSheet } from 'react-native'

const directorio_styles = StyleSheet.create({
  containerDirectorio: {
    padding: 16,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  sectionHeaderContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  listItem: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  //card
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 'auto',
    width: 400,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userLocation: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
    width: '100%',
    maxWidth: 250,
  },
  whatsappButton: {
    width: 36,
    height: 36,
    backgroundColor: '#25D366',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    objectFit: 'fill',
  },
  //btn
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
    marginTop: 10,
  },
  defaultProfileIcon: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  busqueda: {
    flexDirection: 'row', // 📌 Alinear elementos en fila
    justifyContent: 'space-between', // 📌 Espacio entre los elementos
    alignItems: 'center', // 📌 Centrar elementos verticalmente
    marginBottom: 10, // 📌 Separación con otros elementos
  },

  busqueda2: {
    flex: 1, // 📌 Ambos ocupan la misma cantidad de espacio
    marginHorizontal: 5, // 📌 Espaciado entre los elementos
  },

  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flex: 1, // 📌 Hace que ocupe todo el ancho posible dentro de su contenedor
  },

  picker: {
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  busquedaSec2: {
    flexDirection: 'row', // 📌 Alinear elementos en fila
    justifyContent: 'space-between', // 📌 Espacio entre los elementos
    alignItems: 'center', // 📌 Centrar elementos verticalmente
    margin: 10, // 📌 Separación con otros elementos
  },

  busqueda2Sec2: {
    flex: 1, // 📌 Ambos ocupan la misma cantidad de espacio
    marginHorizontal: 5, // 📌 Espaciado entre los elementos
  },

  inputSec2: {
    height: 40,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
})

export default directorio_styles
