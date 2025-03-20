const API_URL = process.env.EXPO_PUBLIC_API_URL

/**
 * Obtiene los tipos de servicios disponibles.
 */
export const fetchTiposServicios = async (
  setTiposServicios: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const response = await fetch(`${API_URL}api/services`)
    const data = await response.json()

    if (response.ok && Array.isArray(data)) {
      setTiposServicios(data)
    } else {
      setError('Error al obtener los tipos de servicios')
    }
  } catch (error) {
    setError('Error de conexión con el servidor')
  }
}

/**
 * Obtiene los datos del directorio según el tipo de servicio seleccionado.
 */
export const fetchDirectorio = async (
  idPartido: number | undefined,
  idServicio: number,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setDirectorioData: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!idPartido) return

  setLoading(true)

  try {
    const response = await fetch(
      `${API_URL}api/services/directorio/${idPartido}/${idServicio}`
    )
    const data = await response.json()

    if (response.ok && Array.isArray(data.message)) {
      setDirectorioData(data.message)
    } else {
      setError('No hay datos disponibles')
      setDirectorioData([])
    }
  } catch (error) {
    setError('Error en la conexión con el servidor')
  } finally {
    setLoading(false)
  }
}

/**
 * Inicia el polling para obtener los datos del directorio periódicamente.
 */
export const startDirectorioPolling = (
  idPartido: number | undefined,
  idServicio: number,
  setDirectorioData: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  intervalTime: number = 10000 // 🔄 Intervalo de 10 segundos
): NodeJS.Timeout | null => {
  if (!idPartido) return null // ✅ Si no hay partido, detenemos la ejecución

  let previousData: any[] = [] // Guardamos datos previos para evitar renders innecesarios

  const pollingInterval: NodeJS.Timeout = setInterval(async () => {
    try {
      const response = await fetch(
        `${API_URL}api/services/directorio/${idPartido}/${idServicio}`
      )
      const data = await response.json()

      if (response.ok && Array.isArray(data.message)) {
        if (JSON.stringify(data.message) !== JSON.stringify(previousData)) {
          setDirectorioData(data.message)
          previousData = data.message
          console.log('🔄 Directorio actualizado.')
        }
      } else {
        setError('No hay datos disponibles')
        setDirectorioData([])
      }
    } catch (error) {
      setError('Error en la conexión con el servidor')
    }
  }, intervalTime)

  return pollingInterval
}

/**
 * Detiene el polling cuando el usuario cambia de pantalla o se desmonta el componente.
 */
export const stopDirectorioPolling = (
  pollingInterval: NodeJS.Timeout | null
) => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    console.log('🛑 Polling del directorio detenido.')
  }
}
