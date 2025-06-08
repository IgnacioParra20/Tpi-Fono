"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Frecuencias estándar para audiometría
const frecuencias = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000]

// Umbrales de intensidad
const intensidades = Array.from({ length: 27 }, (_, i) => -10 + i * 5) // -10 a 120 dB HL

// Protocolo de audiometría estándar
const protocoloAudiometria = {
  frecuenciasObligatorias: [250, 500, 1000, 2000, 4000, 8000],
  frecuenciasOpcionales: [125, 750, 1500, 3000, 6000],
  intensidadInicial: 40,
  pasoIntensidad: 10,
  pasoFino: 5,
}

export default function Simulador() {
  const router = useRouter()
  const { toast } = useToast()
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Estados principales
  const [frecuenciaSeleccionada, setFrecuenciaSeleccionada] = useState(1000)
  const [intensidad, setIntensidad] = useState(40)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [oido, setOido] = useState<"derecho" | "izquierdo">("derecho")
  const [viaSeleccionada, setViaSeleccionada] = useState<"aerea" | "osea">("aerea")
  const [enmascaramiento, setEnmascaramiento] = useState(false)
  const [intensidadEnmascaramiento, setIntensidadEnmascaramiento] = useState(60)

  // Estados del protocolo
  const [modoAutomatico, setModoAutomatico] = useState(false)
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false)
  const [ultimaRespuesta, setUltimaRespuesta] = useState<"si" | "no" | null>(null)
  const [secuenciaUmbral, setSecuenciaUmbral] = useState<number[]>([])
  const [umbralEncontrado, setUmbralEncontrado] = useState(false)

  // Estados de resultados
  const [resultados, setResultados] = useState<{
    derecho: { aerea: Record<number, number | null>; osea: Record<number, number | null> }
    izquierdo: { aerea: Record<number, number | null>; osea: Record<number, number | null> }
  }>({
    derecho: { aerea: {}, osea: {} },
    izquierdo: { aerea: {}, osea: {} },
  })

  const [historialPruebas, setHistorialPruebas] = useState<
    Array<{
      frecuencia: number
      intensidad: number
      oido: string
      via: string
      respuesta: "si" | "no"
      timestamp: Date
    }>
  >([])

  // Inicializar Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn("Web Audio API no disponible:", error)
      }
    }

    initAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Inicializar resultados
  useEffect(() => {
    const inicializarResultados = () => {
      const nuevoResultados = {
        derecho: { aerea: {} as Record<number, number | null>, osea: {} as Record<number, number | null> },
        izquierdo: { aerea: {} as Record<number, number | null>, osea: {} as Record<number, number | null> },
      }

      frecuencias.forEach((freq) => {
        nuevoResultados.derecho.aerea[freq] = null
        nuevoResultados.derecho.osea[freq] = null
        nuevoResultados.izquierdo.aerea[freq] = null
        nuevoResultados.izquierdo.osea[freq] = null
      })

      setResultados(nuevoResultados)
    }

    inicializarResultados()
  }, [])

  // Función para reproducir tono
  const reproducirTono = (frecuencia: number, intensidadDb: number, duracion = 1000) => {
    if (!audioContextRef.current) {
      toast({
        title: "Audio no disponible",
        description: "No se puede reproducir el tono. Verifique los permisos de audio.",
        variant: "destructive",
      })
      return
    }

    try {
      // Detener tono anterior si existe
      detenerTono()

      // Crear oscilador
      oscillatorRef.current = audioContextRef.current.createOscillator()
      gainNodeRef.current = audioContextRef.current.createGain()

      // Configurar frecuencia
      oscillatorRef.current.frequency.setValueAtTime(frecuencia, audioContextRef.current.currentTime)
      oscillatorRef.current.type = "sine"

      // Calcular volumen basado en intensidad (simulado)
      // En un audiómetro real, esto sería calibrado en dB HL
      const volumen = Math.max(0, Math.min(1, (intensidadDb + 10) / 130))
      gainNodeRef.current.gain.setValueAtTime(volumen * 0.1, audioContextRef.current.currentTime) // Volumen bajo para seguridad

      // Conectar nodos
      oscillatorRef.current.connect(gainNodeRef.current)
      gainNodeRef.current.connect(audioContextRef.current.destination)

      // Iniciar oscilador
      oscillatorRef.current.start()

      // Programar parada automática
      setTimeout(() => {
        detenerTono()
      }, duracion)

      toast({
        title: "Tono reproducido",
        description: `${frecuencia} Hz a ${intensidadDb} dB HL - Oído ${oido}`,
      })
    } catch (error) {
      console.error("Error al reproducir tono:", error)
      toast({
        title: "Error de audio",
        description: "No se pudo reproducir el tono.",
        variant: "destructive",
      })
    }
  }

  // Función para detener tono
  const detenerTono = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
      } catch (error) {
        // El oscilador ya fue detenido
      }
      oscillatorRef.current = null
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect()
      gainNodeRef.current = null
    }
    setReproduciendo(false)
    setEsperandoRespuesta(false)
  }

  // Manejar reproducción de estímulo
  const handleReproducir = () => {
    if (reproduciendo) {
      detenerTono()
      return
    }

    setReproduciendo(true)
    setEsperandoRespuesta(true)
    reproducirTono(frecuenciaSeleccionada, intensidad, 1000)

    // Auto-detener después de 1 segundo
    setTimeout(() => {
      setReproduciendo(false)
    }, 1000)
  }

  // Guardar resultado/umbral
  const guardarResultado = () => {
    const nuevosResultados = { ...resultados }
    nuevosResultados[oido][viaSeleccionada][frecuenciaSeleccionada] = intensidad
    setResultados(nuevosResultados)
    setUmbralEncontrado(true)

    toast({
      title: "Umbral guardado",
      description: `${frecuenciaSeleccionada} Hz: ${intensidad} dB HL (${oido}, ${viaSeleccionada})`,
    })

    // Avanzar a siguiente frecuencia automáticamente
    if (modoAutomatico) {
      setTimeout(() => {
        avanzarSiguienteFrecuencia()
      }, 500)
    }
  }

  // Borrar resultado
  const borrarResultado = () => {
    const nuevosResultados = { ...resultados }
    nuevosResultados[oido][viaSeleccionada][frecuenciaSeleccionada] = null
    setResultados(nuevosResultados)
    setUmbralEncontrado(false)

    toast({
      title: "Umbral borrado",
      description: `${frecuenciaSeleccionada} Hz (${oido}, ${viaSeleccionada})`,
    })
  }

  // Registrar respuesta del paciente
  const registrarRespuesta = (respuesta: "si" | "no") => {
    setUltimaRespuesta(respuesta)
    setEsperandoRespuesta(false)

    // Agregar al historial
    const nuevaPrueba = {
      frecuencia: frecuenciaSeleccionada,
      intensidad: intensidad,
      oido: oido,
      via: viaSeleccionada,
      respuesta: respuesta,
      timestamp: new Date(),
    }
    setHistorialPruebas((prev) => [...prev, nuevaPrueba])

    // Lógica de búsqueda de umbral automática
    if (modoAutomatico) {
      buscarUmbralAutomatico(respuesta)
    } else {
      // Sugerir siguiente intensidad
      if (respuesta === "si") {
        // Paciente escuchó, bajar intensidad
        const nuevaIntensidad = Math.max(-10, intensidad - protocoloAudiometria.pasoFino)
        setIntensidad(nuevaIntensidad)
        toast({
          title: "Respuesta: SÍ",
          description: `Sugerencia: Bajar a ${nuevaIntensidad} dB HL`,
        })
      } else {
        // Paciente no escuchó, subir intensidad
        const nuevaIntensidad = Math.min(120, intensidad + protocoloAudiometria.pasoIntensidad)
        setIntensidad(nuevaIntensidad)
        toast({
          title: "Respuesta: NO",
          description: `Sugerencia: Subir a ${nuevaIntensidad} dB HL`,
        })
      }
    }
  }

  // Búsqueda automática de umbral
  const buscarUmbralAutomatico = (respuesta: "si" | "no") => {
    const nuevaSecuencia = [...secuenciaUmbral, intensidad]
    setSecuenciaUmbral(nuevaSecuencia)

    if (respuesta === "si") {
      // Paciente escuchó, bajar intensidad
      const nuevaIntensidad = Math.max(-10, intensidad - protocoloAudiometria.pasoFino)
      setIntensidad(nuevaIntensidad)

      // Si ya bajamos mucho, podríamos haber encontrado el umbral
      if (nuevaSecuencia.length >= 3) {
        const ultimasRespuestas = historialPruebas.slice(-2)
        if (
          ultimasRespuestas.length >= 2 &&
          ultimasRespuestas[0].respuesta === "no" &&
          ultimasRespuestas[1].respuesta === "si"
        ) {
          // Encontramos el umbral (última intensidad donde escuchó)
          guardarResultado()
          return
        }
      }
    } else {
      // Paciente no escuchó, subir intensidad
      const nuevaIntensidad = Math.min(120, intensidad + protocoloAudiometria.pasoIntensidad)
      setIntensidad(nuevaIntensidad)
    }

    // Continuar automáticamente después de un breve delay
    setTimeout(() => {
      if (intensidad <= 120) {
        handleReproducir()
      }
    }, 1500)
  }

  // Avanzar a siguiente frecuencia
  const avanzarSiguienteFrecuencia = () => {
    const frecuenciasObligatorias = protocoloAudiometria.frecuenciasObligatorias
    const indiceActual = frecuenciasObligatorias.indexOf(frecuenciaSeleccionada)

    if (indiceActual < frecuenciasObligatorias.length - 1) {
      const siguienteFrecuencia = frecuenciasObligatorias[indiceActual + 1]
      setFrecuenciaSeleccionada(siguienteFrecuencia)
      setIntensidad(protocoloAudiometria.intensidadInicial)
      setSecuenciaUmbral([])
      setUmbralEncontrado(false)

      toast({
        title: "Siguiente frecuencia",
        description: `Ahora probando ${siguienteFrecuencia} Hz`,
      })
    } else {
      // Completamos todas las frecuencias
      setModoAutomatico(false)
      toast({
        title: "Audiometría completada",
        description: "Se han probado todas las frecuencias obligatorias",
      })
    }
  }

  // Cambiar frecuencia manualmente
  const cambiarFrecuencia = (direccion: "subir" | "bajar") => {
    const indiceActual = frecuencias.indexOf(frecuenciaSeleccionada)
    if (direccion === "subir" && indiceActual < frecuencias.length - 1) {
      setFrecuenciaSeleccionada(frecuencias[indiceActual + 1])
      resetearEstadoPrueba()
    } else if (direccion === "bajar" && indiceActual > 0) {
      setFrecuenciaSeleccionada(frecuencias[indiceActual - 1])
      resetearEstadoPrueba()
    }
  }

  // Cambiar intensidad
  const cambiarIntensidad = (direccion: "subir" | "bajar") => {
    const indiceActual = intensidades.indexOf(intensidad)
    if (direccion === "subir" && indiceActual < intensidades.length - 1) {
      setIntensidad(intensidades[indiceActual + 1])
    } else if (direccion === "bajar" && indiceActual > 0) {
      setIntensidad(intensidades[indiceActual - 1])
    }
  }

  // Resetear estado de prueba
  const resetearEstadoPrueba = () => {
    setSecuenciaUmbral([])
    setUmbralEncontrado(false)
    setUltimaRespuesta(null)
    setEsperandoRespuesta(false)
    detenerTono()
  }

  // Cambiar oído
  const cambiarOido = (nuevoOido: "derecho" | "izquierdo") => {
    setOido(nuevoOido)
    resetearEstadoPrueba()
    toast({
      title: "Oído cambiado",
      description: `Ahora probando oído ${nuevoOido}`,
    })
  }

  // Cambiar vía
  const cambiarVia = (nuevaVia: "aerea" | "osea") => {
    setViaSeleccionada(nuevaVia)
    resetearEstadoPrueba()
    toast({
      title: "Vía cambiada",
      description: `Ahora probando vía ${nuevaVia}`,
    })
  }

  // Iniciar modo automático
  const iniciarModoAutomatico = () => {
    setModoAutomatico(true)
    setFrecuenciaSeleccionada(protocoloAudiometria.frecuenciasObligatorias[0])
    setIntensidad(protocoloAudiometria.intensidadInicial)
    resetearEstadoPrueba()

    toast({
      title: "Modo automático iniciado",
      description: "Comenzando audiometría automática",
    })

    // Iniciar primera prueba
    setTimeout(() => {
      handleReproducir()
    }, 1000)
  }

  // Calcular PTA (Pure Tone Average)
  const calcularPTA = () => {
    const ptaDerecho =
      [500, 1000, 2000].map((freq) => resultados.derecho.aerea[freq] || 0).reduce((sum, val) => sum + val, 0) / 3

    const ptaIzquierdo =
      [500, 1000, 2000].map((freq) => resultados.izquierdo.aerea[freq] || 0).reduce((sum, val) => sum + val, 0) / 3

    return { derecho: Math.round(ptaDerecho), izquierdo: Math.round(ptaIzquierdo) }
  }

  // Calcular gap aéreo-óseo
  const calcularGapAereoOseo = () => {
    const gaps: Record<string, number[]> = { derecho: [], izquierdo: [] }

    for (const freq of [500, 1000, 2000, 4000]) {
      const aereoD = resultados.derecho.aerea[freq]
      const oseoD = resultados.derecho.osea[freq]
      if (aereoD !== null && oseoD !== null) {
        gaps.derecho.push(aereoD - oseoD)
      }

      const aereoI = resultados.izquierdo.aerea[freq]
      const oseoI = resultados.izquierdo.osea[freq]
      if (aereoI !== null && oseoI !== null) {
        gaps.izquierdo.push(aereoI - oseoI)
      }
    }

    const gapPromedioDerecho =
      gaps.derecho.length > 0 ? gaps.derecho.reduce((sum, gap) => sum + gap, 0) / gaps.derecho.length : 0

    const gapPromedioIzquierdo =
      gaps.izquierdo.length > 0 ? gaps.izquierdo.reduce((sum, gap) => sum + gap, 0) / gaps.izquierdo.length : 0

    return { derecho: gapPromedioDerecho, izquierdo: gapPromedioIzquierdo }
  }

  // Determinar tipo de hipoacusia
  const determinarTipoHipoacusia = () => {
    const gaps = calcularGapAereoOseo()
    const pta = calcularPTA()

    const resultadoDerecho = {
      tipo: "Normal",
      grado: "Normal",
      descripcion: "Audición normal",
    }

    const resultadoIzquierdo = {
      tipo: "Normal",
      grado: "Normal",
      descripcion: "Audición normal",
    }

    // Determinar tipo para oído derecho
    if (pta.derecho > 20) {
      if (gaps.derecho >= 15) {
        resultadoDerecho.tipo = "Conductiva"
        resultadoDerecho.descripcion = "Hipoacusia conductiva"
      } else if (gaps.derecho < 10) {
        resultadoDerecho.tipo = "Neurosensorial"
        resultadoDerecho.descripcion = "Hipoacusia neurosensorial"
      } else {
        resultadoDerecho.tipo = "Mixta"
        resultadoDerecho.descripcion = "Hipoacusia mixta"
      }

      // Determinar grado
      if (pta.derecho < 25) resultadoDerecho.grado = "Normal"
      else if (pta.derecho < 40) resultadoDerecho.grado = "Leve"
      else if (pta.derecho < 55) resultadoDerecho.grado = "Moderada"
      else if (pta.derecho < 70) resultadoDerecho.grado = "Moderada a severa"
      else if (pta.derecho < 90) resultadoDerecho.grado = "Severa"
      else resultadoDerecho.grado = "Profunda"
    }

    // Determinar tipo para oído izquierdo
    if (pta.izquierdo > 20) {
      if (gaps.izquierdo >= 15) {
        resultadoIzquierdo.tipo = "Conductiva"
        resultadoIzquierdo.descripcion = "Hipoacusia conductiva"
      } else if (gaps.izquierdo < 10) {
        resultadoIzquierdo.tipo = "Neurosensorial"
        resultadoIzquierdo.descripcion = "Hipoacusia neurosensorial"
      } else {
        resultadoIzquierdo.tipo = "Mixta"
        resultadoIzquierdo.descripcion = "Hipoacusia mixta"
      }

      // Determinar grado
      if (pta.izquierdo < 25) resultadoIzquierdo.grado = "Normal"
      else if (pta.izquierdo < 40) resultadoIzquierdo.grado = "Leve"
      else if (pta.izquierdo < 55) resultadoIzquierdo.grado = "Moderada"
      else if (pta.izquierdo < 70) resultadoIzquierdo.grado = "Moderada a severa"
      else if (pta.izquierdo < 90) resultadoIzquierdo.grado = "Severa"
      else resultadoIzquierdo.grado = "Profunda"
    }

    return { derecho: resultadoDerecho, izquierdo: resultadoIzquierdo }
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
        <h1 className="text-xl font-bold">Simulador de Audiómetro</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Panel principal del audiómetro */}
        <div className="w-full lg:w-3/4">
          <div className="relative w-full h-[812px] bg-[#F4F4F5] rounded-lg border border-[#E4E4E7] overflow-hidden">
            {/* Área de visualización del audiograma */}
            <div className="absolute left-[171px] top-[33px] w-[841px] h-[240px] bg-white border border-black">
              {/* Audiograma */}
              <svg width="100%" height="100%" viewBox="0 0 841 240">
                {/* Fondo del audiograma */}
                <rect x="0" y="0" width="841" height="240" fill="white" />

                {/* Líneas horizontales principales (cada 20 dB) */}
                {Array.from({ length: 8 }, (_, i) => (
                  <line
                    key={`h-main-${i}`}
                    x1="40"
                    y1={20 + i * 25}
                    x2="800"
                    y2={20 + i * 25}
                    stroke={i === 1 ? "#000" : "#666"}
                    strokeWidth={i === 1 ? "2" : "1"}
                    strokeDasharray={i === 1 ? "none" : "none"}
                  />
                ))}

                {/* Líneas horizontales secundarias (cada 10 dB) */}
                {Array.from({ length: 7 }, (_, i) => (
                  <line
                    key={`h-sec-${i}`}
                    x1="40"
                    y1={32.5 + i * 25}
                    x2="800"
                    y2={32.5 + i * 25}
                    stroke="#ccc"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                ))}

                {/* Líneas verticales principales (octavas) */}
                {[125, 250, 500, 1000, 2000, 4000, 8000].map((freq, i) => {
                  const positions = [80, 140, 200, 280, 360, 440, 520]
                  return (
                    <line
                      key={`v-main-${freq}`}
                      x1={positions[i]}
                      y1="20"
                      x2={positions[i]}
                      y2="195"
                      stroke="#666"
                      strokeWidth="1"
                    />
                  )
                })}

                {/* Líneas verticales secundarias (inter-octavas) */}
                {[750, 1500, 3000, 6000].map((freq, i) => {
                  const positions = [240, 320, 400, 480]
                  return (
                    <line
                      key={`v-sec-${freq}`}
                      x1={positions[i]}
                      y1="20"
                      x2={positions[i]}
                      y2="195"
                      stroke="#ccc"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                    />
                  )
                })}

                {/* Etiquetas de frecuencia */}
                {[
                  { freq: 125, x: 80 },
                  { freq: 250, x: 140 },
                  { freq: 500, x: 200 },
                  { freq: 750, x: 240 },
                  { freq: 1000, x: 280 },
                  { freq: 1500, x: 320 },
                  { freq: 2000, x: 360 },
                  { freq: 3000, x: 400 },
                  { freq: 4000, x: 440 },
                  { freq: 6000, x: 480 },
                  { freq: 8000, x: 520 },
                ].map(({ freq, x }) => (
                  <text
                    key={`freq-${freq}`}
                    x={x}
                    y="215"
                    fontSize="10"
                    textAnchor="middle"
                    fill={freq === frecuenciaSeleccionada ? "#0066cc" : "#333"}
                    fontWeight={freq === frecuenciaSeleccionada ? "bold" : "normal"}
                  >
                    {freq >= 1000 ? `${freq / 1000}K` : freq}
                  </text>
                ))}

                {/* Etiquetas de intensidad */}
                {Array.from({ length: 8 }, (_, i) => (
                  <text
                    key={`db-${i}`}
                    x="30"
                    y={25 + i * 25}
                    fontSize="10"
                    textAnchor="end"
                    fill="#333"
                    fontWeight="500"
                  >
                    {-10 + i * 20}
                  </text>
                ))}

                {/* Título del eje X */}
                <text x="420" y="235" fontSize="12" textAnchor="middle" fontWeight="bold" fill="#333">
                  Frequency (Hz)
                </text>

                {/* Título del eje Y */}
                <text
                  x="15"
                  y="120"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#333"
                  transform="rotate(-90, 15, 120)"
                >
                  Hearing Level (dB HL)
                </text>

                {/* Zona de audición normal */}
                <rect x="40" y="20" width="760" height="50" fill="#e8f5e8" opacity="0.3" />
                <text x="420" y="40" fontSize="9" textAnchor="middle" fill="#2d5a2d" fontStyle="italic">
                  Normal Hearing Range
                </text>

                {/* Indicador de frecuencia actual */}
                {(() => {
                  const freqPositions: Record<number, number> = {
                    125: 80,
                    250: 140,
                    500: 200,
                    750: 240,
                    1000: 280,
                    1500: 320,
                    2000: 360,
                    3000: 400,
                    4000: 440,
                    6000: 480,
                    8000: 520,
                  }
                  const x = freqPositions[frecuenciaSeleccionada] || 280
                  return <rect x={x - 2} y="18" width="4" height="179" fill="#0066cc" opacity="0.3" />
                })()}

                {/* Indicador de intensidad actual */}
                {(() => {
                  const y = 20 + (intensidad + 10) * 1.25
                  return <rect x="38" y={y - 2} width="764" height="4" fill="#ff6600" opacity="0.3" />
                })()}

                {/* Líneas conectoras para oído derecho (vía aérea) */}
                <g>
                  {(() => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const puntos = Object.entries(resultados.derecho.aerea)
                      .filter(([_, valor]) => valor !== null)
                      .map(([freq, valor]) => ({
                        x: freqPositions[Number(freq)],
                        y: 20 + (valor! + 10) * 1.25,
                        freq: Number(freq),
                      }))
                      .sort((a, b) => a.freq - b.freq)

                    return puntos.map((punto, i) => {
                      if (i === 0) return null
                      const puntoAnterior = puntos[i - 1]
                      return (
                        <line
                          key={`line-right-air-${punto.freq}`}
                          x1={puntoAnterior.x}
                          y1={puntoAnterior.y}
                          x2={punto.x}
                          y2={punto.y}
                          stroke="#cc0000"
                          strokeWidth="2"
                        />
                      )
                    })
                  })()}
                </g>

                {/* Líneas conectoras para oído izquierdo (vía aérea) */}
                <g>
                  {(() => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const puntos = Object.entries(resultados.izquierdo.aerea)
                      .filter(([_, valor]) => valor !== null)
                      .map(([freq, valor]) => ({
                        x: freqPositions[Number(freq)],
                        y: 20 + (valor! + 10) * 1.25,
                        freq: Number(freq),
                      }))
                      .sort((a, b) => a.freq - b.freq)

                    return puntos.map((punto, i) => {
                      if (i === 0) return null
                      const puntoAnterior = puntos[i - 1]
                      return (
                        <line
                          key={`line-left-air-${punto.freq}`}
                          x1={puntoAnterior.x}
                          y1={puntoAnterior.y}
                          x2={punto.x}
                          y2={punto.y}
                          stroke="#0066cc"
                          strokeWidth="2"
                          strokeDasharray="4,2"
                        />
                      )
                    })
                  })()}
                </g>

                {/* Líneas conectoras para oído derecho (vía ósea) */}
                <g>
                  {(() => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const puntos = Object.entries(resultados.derecho.osea)
                      .filter(([_, valor]) => valor !== null)
                      .map(([freq, valor]) => ({
                        x: freqPositions[Number(freq)],
                        y: 20 + (valor! + 10) * 1.25,
                        freq: Number(freq),
                      }))
                      .sort((a, b) => a.freq - b.freq)

                    return puntos.map((punto, i) => {
                      if (i === 0) return null
                      const puntoAnterior = puntos[i - 1]
                      return (
                        <line
                          key={`line-right-bone-${punto.freq}`}
                          x1={puntoAnterior.x}
                          y1={puntoAnterior.y}
                          x2={punto.x}
                          y2={punto.y}
                          stroke="#cc0000"
                          strokeWidth="2"
                          strokeDasharray="6,3"
                        />
                      )
                    })
                  })()}
                </g>

                {/* Líneas conectoras para oído izquierdo (vía ósea) */}
                <g>
                  {(() => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const puntos = Object.entries(resultados.izquierdo.osea)
                      .filter(([_, valor]) => valor !== null)
                      .map(([freq, valor]) => ({
                        x: freqPositions[Number(freq)],
                        y: 20 + (valor! + 10) * 1.25,
                        freq: Number(freq),
                      }))
                      .sort((a, b) => a.freq - b.freq)

                    return puntos.map((punto, i) => {
                      if (i === 0) return null
                      const puntoAnterior = puntos[i - 1]
                      return (
                        <line
                          key={`line-left-bone-${punto.freq}`}
                          x1={puntoAnterior.x}
                          y1={puntoAnterior.y}
                          x2={punto.x}
                          y2={punto.y}
                          stroke="#0066cc"
                          strokeWidth="2"
                          strokeDasharray="6,3"
                        />
                      )
                    })
                  })()}
                </g>

                {/* Símbolos para oído derecho (vía aérea) - Círculos */}
                {Object.entries(resultados.derecho.aerea)
                  .filter(([_, valor]) => valor !== null)
                  .map(([freq, valor]) => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const x = freqPositions[Number(freq)]
                    const y = 20 + (valor! + 10) * 1.25
                    return (
                      <g key={`right-air-${freq}`}>
                        <circle cx={x} cy={y} r="6" fill="white" stroke="#cc0000" strokeWidth="2" />
                        <text x={x} y={y + 3} fontSize="8" textAnchor="middle" fill="#cc0000" fontWeight="bold">
                          R
                        </text>
                      </g>
                    )
                  })}

                {/* Símbolos para oído izquierdo (vía aérea) - X */}
                {Object.entries(resultados.izquierdo.aerea)
                  .filter(([_, valor]) => valor !== null)
                  .map(([freq, valor]) => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const x = freqPositions[Number(freq)]
                    const y = 20 + (valor! + 10) * 1.25
                    return (
                      <g key={`left-air-${freq}`}>
                        <rect x={x - 6} y={y - 6} width="12" height="12" fill="white" stroke="none" />
                        <path
                          d={`M ${x - 5} ${y - 5} L ${x + 5} ${y + 5} M ${x - 5} ${y + 5} L ${x + 5} ${y - 5}`}
                          stroke="#0066cc"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <text x={x + 10} y={y + 3} fontSize="7" fill="#0066cc" fontWeight="bold">
                          L
                        </text>
                      </g>
                    )
                  })}

                {/* Símbolos para oído derecho (vía ósea) - Corchetes angulares */}
                {Object.entries(resultados.derecho.osea)
                  .filter(([_, valor]) => valor !== null)
                  .map(([freq, valor]) => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const x = freqPositions[Number(freq)]
                    const y = 20 + (valor! + 10) * 1.25
                    return (
                      <g key={`right-bone-${freq}`}>
                        <rect x={x - 6} y={y - 6} width="12" height="12" fill="white" stroke="none" />
                        <path
                          d={`M ${x - 5} ${y - 3} L ${x - 2} ${y} L ${x - 5} ${y + 3}`}
                          fill="none"
                          stroke="#cc0000"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={`M ${x + 5} ${y - 3} L ${x + 2} ${y} L ${x + 5} ${y + 3}`}
                          fill="none"
                          stroke="#cc0000"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )
                  })}

                {/* Símbolos para oído izquierdo (vía ósea) - Corchetes cuadrados */}
                {Object.entries(resultados.izquierdo.osea)
                  .filter(([_, valor]) => valor !== null)
                  .map(([freq, valor]) => {
                    const freqPositions: Record<number, number> = {
                      125: 80,
                      250: 140,
                      500: 200,
                      750: 240,
                      1000: 280,
                      1500: 320,
                      2000: 360,
                      3000: 400,
                      4000: 440,
                      6000: 480,
                      8000: 520,
                    }
                    const x = freqPositions[Number(freq)]
                    const y = 20 + (valor! + 10) * 1.25
                    return (
                      <g key={`left-bone-${freq}`}>
                        <rect x={x - 6} y={y - 6} width="12" height="12" fill="white" stroke="none" />
                        <path
                          d={`M ${x - 5} ${y - 4} L ${x - 5} ${y + 4} M ${x - 5} ${y - 4} L ${x - 2} ${y - 4} M ${x - 5} ${y + 4} L ${x - 2} ${y + 4}`}
                          stroke="#0066cc"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d={`M ${x + 5} ${y - 4} L ${x + 5} ${y + 4} M ${x + 5} ${y - 4} L ${x + 2} ${y - 4} M ${x + 5} ${y + 4} L ${x + 2} ${y + 4}`}
                          stroke="#0066cc"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </g>
                    )
                  })}

                {/* Leyenda mejorada */}
                <g transform="translate(600, 30)">
                  <rect x="-10" y="-5" width="180" height="85" fill="white" stroke="#ccc" strokeWidth="1" rx="3" />

                  <text x="0" y="10" fontSize="11" fontWeight="bold" fill="#333">
                    AUDIOGRAM LEGEND
                  </text>

                  {/* Oído derecho */}
                  <text x="0" y="25" fontSize="9" fontWeight="bold" fill="#cc0000">
                    RIGHT EAR
                  </text>
                  <circle cx="10" cy="35" r="4" fill="white" stroke="#cc0000" strokeWidth="2" />
                  <text x="20" y="38" fontSize="8" fill="#333">
                    Air Conduction
                  </text>

                  <path
                    d="M 5 45 L 8 48 L 5 51 M 15 45 L 12 48 L 15 51"
                    fill="none"
                    stroke="#cc0000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x="20" y="50" fontSize="8" fill="#333">
                    Bone Conduction
                  </text>

                  {/* Oído izquierdo */}
                  <text x="90" y="25" fontSize="9" fontWeight="bold" fill="#0066cc">
                    LEFT EAR
                  </text>
                  <path d="M 95 32 L 105 42 M 95 42 L 105 32" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" />
                  <text x="110" y="38" fontSize="8" fill="#333">
                    Air Conduction
                  </text>

                  <path
                    d="M 95 45 L 95 55 M 95 45 L 98 45 M 95 55 L 98 55 M 105 45 L 105 55 M 105 45 L 102 45 M 105 55 L 102 55"
                    stroke="#0066cc"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <text x="110" y="52" fontSize="8" fill="#333">
                    Bone Conduction
                  </text>

                  {/* Líneas */}
                  <line x1="0" y1="65" x2="20" y2="65" stroke="#cc0000" strokeWidth="2" />
                  <text x="25" y="68" fontSize="8" fill="#333">
                    Right Ear
                  </text>

                  <line x1="90" y1="65" x2="110" y2="65" stroke="#0066cc" strokeWidth="2" strokeDasharray="4,2" />
                  <text x="115" y="68" fontSize="8" fill="#333">
                    Left Ear
                  </text>
                </g>

                {/* Clasificación de pérdida auditiva */}
                <g transform="translate(40, 205)">
                  <rect x="0" y="0" width="200" height="30" fill="#f8f9fa" stroke="#dee2e6" strokeWidth="1" rx="2" />
                  <text x="5" y="12" fontSize="8" fontWeight="bold" fill="#495057">
                    HEARING LOSS CLASSIFICATION:
                  </text>
                  <text x="5" y="22" fontSize="7" fill="#6c757d">
                    Normal: ≤20 dB | Mild: 21-40 dB | Moderate: 41-70 dB | Severe: 71-90 dB | Profound: &gt;90 dB
                  </text>
                </g>
              </svg>
            </div>

            {/* Botones superiores */}
            <div className="absolute left-[58px] top-[292px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[-2px] top-[-14px] text-xs text-center">Shift</span>
            </div>
            <div className="absolute left-[126px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[-5px] top-[-16px] text-xs text-center">Setup</span>
            </div>
            <div className="absolute left-[255px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[348px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[441px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[534px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[627px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[720px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[813px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[906px] top-[294px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[10px] top-[-16px] text-xs text-center">|</span>
            </div>
            <div className="absolute left-[1014px] top-[292px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[-4px] top-[-14px] text-xs text-center">Tests</span>
            </div>
            <div className="absolute left-[1083px] top-[293px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[-3px] top-[-31px] text-xs text-center">
                Del
                <br />
                Point
              </span>
              <span className="absolute left-[-15px] top-[40px] text-xs italic font-light">del curve</span>
            </div>
            <div className="absolute left-[1158px] top-[293px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[-11px] top-[-31px] text-xs text-center">
                Save
                <br />
                Session
              </span>
              <span className="absolute left-[-23px] top-[40px] text-xs italic font-light">new session</span>
            </div>
            <div className="absolute left-[1226px] top-[290px] w-[23px] h-[40px] bg-[#2C2C2C] rounded-lg">
              <span className="absolute left-[-2px] top-[-23px] text-xs text-center">Print</span>
              <span className="absolute left-[-7px] top-[43px] text-xs italic font-light">clients</span>
            </div>

            {/* Primera fila de botones */}
            <button
              className="absolute left-[172px] top-[381px] w-[75px] h-[40px] bg-[#2C2C2C] rounded-lg border-t border-black flex flex-col"
              onClick={() => toast({ title: "Tone/Warble", description: "Seleccionado modo de tono puro" })}
            >
              <div className="absolute left-[4px] top-[-23px] text-xs">Tone</div>
              <div className="absolute left-[38px] top-[-23px] text-xs">Warble</div>
              <div className="absolute left-[35px] top-[0px] h-full w-[1px] bg-black"></div>
            </button>

            <button
              className="absolute left-[260px] top-[381px] w-[75px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => toast({ title: "Wavefile", description: "Función no disponible en el simulador" })}
            >
              <div className="absolute left-[14px] top-[-23px] text-xs">Wavefile</div>
            </button>

            <button
              className="absolute left-[349.06px] top-[381px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => toast({ title: "Mic", description: "Función no disponible en el simulador" })}
            >
              <div className="absolute left-[28.17px] top-[-23px] text-xs">Mic</div>
            </button>

            <button
              className="absolute left-[436px] top-[381px] w-[75px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => toast({ title: "1 CD 2", description: "Función no disponible en el simulador" })}
            >
              <div className="absolute left-[16px] top-[-23px] text-xs">1 CD 2</div>
              <div className="absolute left-[35px] top-[0px] h-full w-[1px] bg-black"></div>
            </button>

            <button
              className="absolute left-[642.81px] top-[381px] w-[75.45px] h-[40px] bg-[#BF6A02] rounded-lg"
              onClick={() => toast({ title: "Ext Range", description: "Función no disponible en el simulador" })}
            >
              <div className="absolute left-[9.05px] top-[-23px] text-xs">Ext Range</div>
            </button>

            <button
              className="absolute left-[848.03px] top-[381px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => toast({ title: "1 Monitor 2", description: "Función no disponible en el simulador" })}
            >
              <div className="absolute left-[6.03px] top-[-23px] text-xs">1 Monitor 2</div>
              <div className="absolute left-[35px] top-[0px] h-full w-[1px] bg-black"></div>
            </button>

            <button
              className="absolute left-[936.55px] top-[381px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => toast({ title: "Talk Back", description: "Función no disponible en el simulador" })}
            >
              <div className="absolute left-[10.06px] top-[-23px] text-xs">Talk Back</div>
            </button>

            {/* Segunda fila de botones */}
            <button
              className="absolute left-[171px] top-[459px] w-[75px] h-[40px] bg-[#C00F0C] rounded-lg"
              onClick={() => cambiarOido("derecho")}
            >
              <div className="absolute left-[4px] top-[-23px] text-xs">Right</div>
              <div className="absolute left-[38px] top-[-23px] text-xs">Insert</div>
              <div className="absolute left-[35px] top-[0px] h-full w-[1px] bg-black"></div>
              {oido === "derecho" && <div className="absolute inset-1 border-2 border-white rounded-md"></div>}
            </button>

            <button
              className="absolute left-[260px] top-[459px] w-[75px] h-[40px] bg-[#1D0990] rounded-lg"
              onClick={() => cambiarOido("izquierdo")}
            >
              <div className="absolute left-[4px] top-[-23px] text-xs">Left</div>
              <div className="absolute left-[38px] top-[-23px] text-xs">Insert</div>
              <div className="absolute left-[35px] top-[0px] h-full w-[1px] bg-black"></div>
              {oido === "izquierdo" && <div className="absolute inset-1 border-2 border-white rounded-md"></div>}
            </button>

            <button
              className="absolute left-[349px] top-[459px] w-[75px] h-[40px] bg-[#1C098B] rounded-lg"
              onClick={() => cambiarVia("osea")}
            >
              <div className="absolute left-[9px] top-[-23px] text-xs">R Bone L</div>
              <div className="absolute left-[35px] top-[0px] h-full w-[1px] bg-black"></div>
              {viaSeleccionada === "osea" && <div className="absolute inset-1 border-2 border-white rounded-md"></div>}
            </button>

            <button
              className="absolute left-[436px] top-[459px] w-[75px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => toast({ title: "1 FF 2", description: "Función no disponible en el simulador" })}
            >
              <div className="absolute left-[17px] top-[-23px] text-xs">1 FF 2</div>
              <div className="absolute left-[35px] top-[0px] h-full w-[1px] bg-black"></div>
            </button>

            {/* Botones de control */}
            <div className="absolute left-[598.54px] top-[467px] w-[164px] h-[40px] bg-[#BF6A02] rounded-lg flex">
              <button
                className="w-1/2 h-full flex flex-col items-center justify-center"
                onClick={() => toast({ title: "Man", description: "Modo manual activado" })}
              >
                <span className="absolute left-[5.03px] top-[-23px] text-xs">Man</span>
                <div className="absolute left-[80px] top-[0px] h-full w-[1px] bg-black"></div>
              </button>
              <button
                className="w-1/2 h-full flex flex-col items-center justify-center"
                onClick={() => toast({ title: "Rev", description: "Modo reverso activado" })}
              >
                <span className="absolute left-[47.28px] top-[-23px] text-xs">Rev</span>
              </button>
            </div>

            <div className="absolute left-[687.07px] top-[467px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg flex">
              <button
                className="w-1/2 h-full flex flex-col items-center justify-center"
                onClick={() => toast({ title: "Single", description: "Modo único activado" })}
              >
                <span className="absolute left-[0px] top-[-23px] text-xs">Single</span>
                <div className="absolute left-[40px] top-[0px] h-full w-[1px] bg-black"></div>
              </button>
              <button
                className="w-1/2 h-full flex flex-col items-center justify-center"
                onClick={() => toast({ title: "Multi", description: "Modo múltiple activado" })}
              >
                <span className="absolute left-[44.26px] top-[-23px] text-xs">Multi</span>
              </button>
            </div>

            <button
              className="absolute left-[848.03px] top-[467px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => setEnmascaramiento(!enmascaramiento)}
            >
              <div className="absolute left-[3.01px] top-[-23px] text-xs">Mask on/off</div>
              {enmascaramiento && <div className="absolute inset-1 border-2 border-white rounded-md"></div>}
            </button>

            <button
              className="absolute left-[936.55px] top-[467px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg"
              onClick={() => toast({ title: "Sync", description: "Sincronización activada" })}
            >
              <div className="absolute left-[23.14px] top-[-23px] text-xs">Sync</div>
            </button>

            {/* Botones de respuesta */}
            <button
              className="absolute left-[598.54px] top-[545px] w-[75.45px] h-[40px] bg-[#FFD65C] rounded-lg"
              onClick={guardarResultado}
              disabled={modoAutomatico}
            >
              <div className="absolute left-[22.13px] top-[-15px] text-xs">Store</div>
            </button>

            <button
              className="absolute left-[687.07px] top-[545px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg text-white"
              onClick={() => registrarRespuesta("no")}
              disabled={!esperandoRespuesta}
            >
              <div className="absolute left-[14.08px] top-[-15px] text-xs text-black">No Resp</div>
            </button>

            <button
              className="absolute left-[598.54px] top-[623px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg text-white"
              onClick={() => cambiarIntensidad("bajar")}
              disabled={modoAutomatico}
            >
              <div className="absolute left-[20.12px] top-[40px] text-xs text-black">Down</div>
              <div className="absolute left-[12.07px] top-[-15px] text-xs text-black">Incorrect</div>
            </button>

            <button
              className="absolute left-[687.07px] top-[623px] w-[75.45px] h-[40px] bg-[#2C2C2C] rounded-lg text-white"
              onClick={() => cambiarIntensidad("subir")}
              disabled={modoAutomatico}
            >
              <div className="absolute left-[28.17px] top-[40px] text-xs text-black">Up</div>
              <div className="absolute left-[16.09px] top-[-15px] text-xs text-black">Correct</div>
            </button>

            {/* Perillas grandes */}
            <div
              className="absolute left-[109px] top-[601px] w-[124px] h-[124px] bg-[#2C2C2C] rounded-full cursor-pointer"
              onClick={() => !modoAutomatico && cambiarFrecuencia("bajar")}
            >
              <div
                className="absolute w-2 h-10 bg-white rounded top-[20px] left-[62px]"
                style={{
                  transformOrigin: "center bottom",
                  transform: `translateX(-50%) rotate(${frecuencias.indexOf(frecuenciaSeleccionada) * 20 - 100}deg)`,
                }}
              ></div>
              <div className="absolute inset-8 border border-gray-600 rounded-full"></div>
            </div>

            <div
              className="absolute left-[950px] top-[601px] w-[124px] h-[124px] bg-[#2C2C2C] rounded-full cursor-pointer"
              onClick={() => !modoAutomatico && cambiarFrecuencia("subir")}
            >
              <div
                className="absolute w-2 h-10 bg-white rounded top-[20px] left-[62px]"
                style={{
                  transformOrigin: "center bottom",
                  transform: `translateX(-50%) rotate(${frecuencias.indexOf(frecuenciaSeleccionada) * 20 - 100}deg)`,
                }}
              ></div>
              <div className="absolute inset-8 border border-gray-600 rounded-full"></div>
            </div>

            {/* Botón central - Tone Switch */}
            <button
              className={`absolute left-[280px] top-[644px] w-[67px] h-[67px] rounded-full border-4 border-gray-700 cursor-pointer transition-all shadow-lg ${
                reproduciendo
                  ? "bg-green-600 hover:bg-green-700 shadow-green-400/50"
                  : esperandoRespuesta
                    ? "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-400/50"
                    : "bg-[#2C2C2C] hover:bg-gray-800"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleReproducir}
              disabled={modoAutomatico && !esperandoRespuesta}
            >
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white rounded"></div>
              {reproduciendo && (
                <div className="absolute inset-1 border-2 border-green-300 rounded-full animate-pulse"></div>
              )}
              {esperandoRespuesta && !reproduciendo && (
                <div className="absolute inset-1 border-2 border-yellow-300 rounded-full animate-pulse"></div>
              )}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                {reproduciendo ? <Square className="h-3 w-3 text-white" /> : <Play className="h-3 w-3 text-white" />}
              </div>
            </button>
            <div className="absolute left-[277px] top-[725px] text-xs text-center">
              Tone Switch/
              <br />
              Enter
            </div>
          </div>
        </div>

        {/* Panel lateral de resultados */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Resultados</h2>

            <div className="mb-4">
              <h3 className="text-sm font-bold mb-1">Estado Actual</h3>
              <div className="text-xs space-y-1 p-2 bg-gray-50 rounded">
                <div>
                  Frecuencia: <span className="font-bold">{frecuenciaSeleccionada} Hz</span>
                </div>
                <div>
                  Intensidad: <span className="font-bold">{intensidad} dB HL</span>
                </div>
                <div>
                  Oído: <span className="font-bold">{oido === "derecho" ? "Derecho" : "Izquierdo"}</span>
                </div>
                <div>
                  Vía: <span className="font-bold">{viaSeleccionada === "aerea" ? "Aérea" : "Ósea"}</span>
                </div>
                <div>
                  Modo: <span className="font-bold">{modoAutomatico ? "Automático" : "Manual"}</span>
                </div>
                <div>
                  Estado:{" "}
                  <span
                    className={`font-bold ${
                      reproduciendo ? "text-green-600" : esperandoRespuesta ? "text-yellow-600" : "text-gray-600"
                    }`}
                  >
                    {reproduciendo ? "REPRODUCIENDO" : esperandoRespuesta ? "ESPERANDO RESPUESTA" : "LISTO"}
                  </span>
                </div>
              </div>
            </div>

            {/* Controles de modo */}
            <div className="mb-4">
              <h3 className="text-sm font-bold mb-1">Modo de operación</h3>
              <div className="flex gap-2">
                <Button onClick={iniciarModoAutomatico} disabled={modoAutomatico} className="w-full text-xs" size="sm">
                  Modo Automático
                </Button>
                <Button
                  onClick={() => setModoAutomatico(false)}
                  disabled={!modoAutomatico}
                  variant="outline"
                  className="w-full text-xs"
                  size="sm"
                >
                  Modo Manual
                </Button>
              </div>
            </div>

            {/* Respuesta del paciente */}
            {esperandoRespuesta && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm font-medium text-yellow-800 mb-2">¿El paciente escuchó el tono?</p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => registrarRespuesta("si")}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    SÍ
                  </Button>
                  <Button onClick={() => registrarRespuesta("no")} className="bg-red-600 hover:bg-red-700" size="sm">
                    NO
                  </Button>
                </div>
              </div>
            )}

            {/* Tabla de umbrales */}
            <div className="mb-4">
              <h3 className="text-sm font-bold mb-1">Umbrales (dB HL)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-1">Hz</th>
                      <th className="border border-gray-300 p-1" colSpan={2}>
                        Oído Derecho
                      </th>
                      <th className="border border-gray-300 p-1" colSpan={2}>
                        Oído Izquierdo
                      </th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-1"></th>
                      <th className="border border-gray-300 p-1">VA</th>
                      <th className="border border-gray-300 p-1">VO</th>
                      <th className="border border-gray-300 p-1">VA</th>
                      <th className="border border-gray-300 p-1">VO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[250, 500, 1000, 2000, 4000, 8000].map((freq) => (
                      <tr key={freq} className={freq === frecuenciaSeleccionada ? "bg-blue-50" : ""}>
                        <td className="border border-gray-300 p-1 font-medium">{freq}</td>
                        <td className="border border-gray-300 p-1 text-center">
                          {resultados.derecho.aerea[freq] !== null ? resultados.derecho.aerea[freq] : "-"}
                        </td>
                        <td className="border border-gray-300 p-1 text-center">
                          {resultados.derecho.osea[freq] !== null ? resultados.derecho.osea[freq] : "-"}
                        </td>
                        <td className="border border-gray-300 p-1 text-center">
                          {resultados.izquierdo.aerea[freq] !== null ? resultados.izquierdo.aerea[freq] : "-"}
                        </td>
                        <td className="border border-gray-300 p-1 text-center">
                          {resultados.izquierdo.osea[freq] !== null ? resultados.izquierdo.osea[freq] : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historial de pruebas recientes */}
            {historialPruebas.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold mb-1">Últimas Pruebas</h3>
                <div className="max-h-32 overflow-y-auto">
                  {historialPruebas
                    .slice(-5)
                    .reverse()
                    .map((prueba, index) => (
                      <div key={index} className="text-xs p-2 mb-1 bg-gray-50 rounded border">
                        <div className="flex justify-between">
                          <span>
                            {prueba.frecuencia} Hz - {prueba.intensidad} dB
                          </span>
                          <span
                            className={`font-bold ${prueba.respuesta === "si" ? "text-green-600" : "text-red-600"}`}
                          >
                            {prueba.respuesta === "si" ? "SÍ" : "NO"}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          {prueba.oido} - {prueba.via} - {prueba.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => toast({ title: "Imprimir", description: "Función no disponible en el simulador" })}
              >
                Imprimir
              </Button>
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                onClick={() => toast({ title: "Guardar", description: "Resultados guardados correctamente" })}
              >
                Guardar
              </Button>
            </div>

            {/* Botón de reinicio */}
            <div className="mt-2">
              <Button
                size="sm"
                variant="destructive"
                className="w-full text-xs"
                onClick={() => {
                  setResultados({
                    derecho: { aerea: {}, osea: {} },
                    izquierdo: { aerea: {}, osea: {} },
                  })
                  setHistorialPruebas([])
                  setModoAutomatico(false)
                  resetearEstadoPrueba()
                  toast({
                    title: "Audiometría reiniciada",
                    description: "Todos los datos han sido borrados",
                  })
                }}
              >
                Reiniciar Audiometría
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-bold mb-2">Instrucciones del Audiómetro</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <h4 className="font-semibold mb-1">Controles principales:</h4>
            <ul className="space-y-1">
              <li>
                • <strong>Perillas izquierda/derecha:</strong> Cambiar frecuencia
              </li>
              <li>
                • <strong>Botón central:</strong> Reproducir tono
              </li>
              <li>
                • <strong>Right/Left Insert:</strong> Seleccionar oído
              </li>
              <li>
                • <strong>R Bone L:</strong> Seleccionar vía ósea
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Respuestas:</h4>
            <ul className="space-y-1">
              <li>
                • <strong>Store:</strong> Guardar umbral
              </li>
              <li>
                • <strong>No Resp:</strong> Paciente no escuchó
              </li>
              <li>
                • <strong>Incorrect:</strong> Borrar punto / Bajar intensidad
              </li>
              <li>
                • <strong>Correct/Up:</strong> Paciente escuchó / Subir intensidad
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Modos:</h4>
            <ul className="space-y-1">
              <li>
                • <strong>Automático:</strong> Búsqueda automática de umbrales
              </li>
              <li>
                • <strong>Manual:</strong> Control total del operador
              </li>
              <li>
                • <strong>Mask on/off:</strong> Activar/desactivar enmascaramiento
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
