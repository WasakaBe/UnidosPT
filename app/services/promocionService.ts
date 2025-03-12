import { API_URL } from '@env'
import * as dotenv from '@env'

/**
 * Obtiene las promociones de un partido específico.
 */
export const fetchPromociones = async (
  idPartido: number | undefined,
  setPromociones: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!idPartido) return

  try {
    const response = await fetch(`${API_URL}api/promociones/${idPartido}`)
    const data = await response.json()

    if (data.success && data.promociones.length > 0) {
      setPromociones(data.promociones)
    } else {
      console.log('No se encontraron promociones.')
    }
  } catch (error) {
    console.error('❌ Error obteniendo promociones:', error)
  } finally {
    setLoading(false)
  }
}

/**
 * Inicia el polling para obtener promociones cada cierto tiempo.
 */
export const startPromocionesPolling = (
  idPartido: number | undefined,
  setPromociones: React.Dispatch<React.SetStateAction<any[]>>,
  intervalTime: number = 10000
): NodeJS.Timeout | null => {
  if (!idPartido) return null // ✅ Devolvemos `null` si `idPartido` es indefinido

  let previousData: any[] = []

  const pollingInterval: NodeJS.Timeout = setInterval(async () => {
    try {
      const response = await fetch(`${API_URL}api/promociones/${idPartido}`)
      const data = await response.json()

      if (
        data.success &&
        JSON.stringify(data.promociones) !== JSON.stringify(previousData)
      ) {
        setPromociones(data.promociones)
        previousData = data.promociones
        console.log('🔄 Actualización de promociones.')
      }
    } catch (error) {
      console.error('❌ Error en polling de promociones:', error)
    }
  }, intervalTime)

  return pollingInterval
}

export const stopPromocionesPolling = (
  pollingInterval: NodeJS.Timeout | null
) => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    console.log('🛑 Polling detenido.')
  }
}
