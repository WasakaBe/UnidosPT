import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
const guidelineBaseWidth = 150 // iPhone 6 / 7 / 8 base width

export const Responsivo = (size: number): number => {
  return ((width + height) / guidelineBaseWidth) * size
}
