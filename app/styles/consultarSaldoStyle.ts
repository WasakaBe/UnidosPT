import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('window')
const consulta_saldo_styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  promoContainer: {
    marginTop: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promoImage: {
    width: width * 0.9,
    height: width * 0.4,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  monthText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
  },
  rightSection: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  countryText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
  },
  progressBarContainer: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10,
    marginBottom: 1,
  },
  progressBarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  progressBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarIcon: {
    marginRight: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressBarValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
  },
  progressBarValueText: {
    fontSize: 14,
    color: '#666',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    marginTop: 16,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
})

export default consulta_saldo_styles
