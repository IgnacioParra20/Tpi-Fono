"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Frecuencias estándar para audiometría
const frecuencias = [125, 250, 500, 1000, 2000, 4000, 8000]

// Umbrales de intensidad
const intensidades = Array.from({ length: 27 }, (_, i) => -10 + i * 5) // -10 a 120 dB HL

// Protocolo de audiometría estándar
const protocoloAudiometria = {
  frecuenciasObligatorias: [125, 250, 500, 1000, 2000, 4000, 8000],
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
  const [tipoTono, setTipoTono] = useState<"pure" | "warble">("pure")

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

      // Configurar frecuencia base
      oscillatorRef.current.frequency.setValueAtTime(frecuencia, audioContextRef.current.currentTime)
      oscillatorRef.current.type = "sine"

      // Calcular volumen basado en intensidad (simulado)
      const volumen = Math.max(0, Math.min(1, (intensidadDb + 10) / 130))
      gainNodeRef.current.gain.setValueAtTime(volumen * 0.1, audioContextRef.current.currentTime)

      // Aplicar modulación si es warble
      if (tipoTono === "warble") {
        // Crear oscilador de modulación para el efecto warble
        const modulatorOsc = audioContextRef.current.createOscillator()
        const modulatorGain = audioContextRef.current.createGain()

        // Configurar modulación (frecuencia de modulación de 6.25 Hz, típica para warble)
        modulatorOsc.frequency.setValueAtTime(6.25, audioContextRef.current.currentTime)
        modulatorOsc.type = "sine"

        // Profundidad de modulación (±5% de la frecuencia base)
        modulatorGain.gain.setValueAtTime(frecuencia * 0.05, audioContextRef.current.currentTime)

        // Conectar modulación
        modulatorOsc.connect(modulatorGain)
        modulatorGain.connect(oscillatorRef.current.frequency)

        // Iniciar modulador
        modulatorOsc.start()

        // Programar parada del modulador
        setTimeout(() => {
          try {
            modulatorOsc.stop()
            modulatorOsc.disconnect()
          } catch (error) {
            // El modulador ya fue detenido
          }
        }, duracion)
      }

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
        title: `${tipoTono === "pure" ? "Tono puro" : "Tono warble"} reproducido`,
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

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-2 sm:p-4">
      {/* Header responsive */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="bg-white rounded-lg shadow transition-transform hover:scale-105 border border-gray-200 px-3 py-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-sm sm:text-base font-semibold text-gray-700 hover:text-blue-700 transition-colors p-1 sm:p-2"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Volver al Panel de Niveles</span>
            <span className="sm:hidden">Volver</span>
          </Button>
        </div>
        <h1 className="text-lg sm:text-xl font-bold">Simulador de Audiómetro</h1>
      </div>

      {/* Layout principal responsive */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Panel principal del audiómetro */}
        <div className="w-full xl:w-3/4">
          <div className="bg-white rounded-lg border border-[#E4E4E7] p-2 sm:p-4">
            {/* Audiograma responsive */}
            <div className="w-full overflow-x-auto mb-4">
              <div className="min-w-[600px] lg:min-w-[750px]">
                <svg width="100%" height="300" viewBox="0 0 750 320" className="border-2 border-black bg-white rounded">
                  {/* Fondo del audiograma */}
                  <rect x="0" y="0" width="750" height="320" fill="white" />

                  {/* Líneas horizontales principales (cada 20 dB) */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <line
                      key={`h-main-${i}`}
                      x1="50"
                      y1={30 + i * 35}
                      x2="700"
                      y2={30 + i * 35}
                      stroke={i === 1 ? "#000" : "#666"}
                      strokeWidth={i === 1 ? "2" : "1"}
                    />
                  ))}

                  {/* Líneas horizontales secundarias (cada 10 dB) */}
                  {Array.from({ length: 7 }, (_, i) => (
                    <line
                      key={`h-sec-${i}`}
                      x1="50"
                      y1={47.5 + i * 35}
                      x2="700"
                      y2={47.5 + i * 35}
                      stroke="#ccc"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                    />
                  ))}

                  {/* Líneas verticales principales (octavas) */}
                  {[125, 250, 500, 1000, 2000, 4000, 8000].map((freq, i) => {
                    const positions = [100, 180, 260, 360, 460, 560, 660]
                    return (
                      <line
                        key={`v-main-${freq}`}
                        x1={positions[i]}
                        y1="30"
                        x2={positions[i]}
                        y2="275"
                        stroke="#666"
                        strokeWidth="1"
                      />
                    )
                  })}

                  {/* Etiquetas de frecuencia */}
                  {[
                    { freq: 125, x: 100 },
                    { freq: 250, x: 180 },
                    { freq: 500, x: 260 },
                    { freq: 1000, x: 360 },
                    { freq: 2000, x: 460 },
                    { freq: 4000, x: 560 },
                    { freq: 8000, x: 660 },
                  ].map(({ freq, x }) => (
                    <text
                      key={`freq-${freq}`}
                      x={x}
                      y="295"
                      fontSize="12"
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
                      x="35"
                      y={35 + i * 35}
                      fontSize="12"
                      textAnchor="end"
                      fill="#333"
                      fontWeight="500"
                    >
                      {-10 + i * 20}
                    </text>
                  ))}

                  {/* Título del eje X */}
                  <text x="375" y="315" fontSize="14" textAnchor="middle" fontWeight="bold" fill="#333">
                    Frecuencia (Hz)
                  </text>

                  {/* Título del eje Y */}
                  <text
                    x="20"
                    y="160"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="bold"
                    fill="#333"
                    transform="rotate(-90, 20, 160)"
                  >
                    Nivel de Audición (dB HL)
                  </text>


                  {/* Indicador de frecuencia actual */}

                  {(() => {
                    const freqPositions: Record<number, number> = {
                      125: 100,
                      250: 180,
                      500: 260,
                      1000: 360,
                      2000: 460,
                      4000: 560,
                      8000: 660,
                    }
                    const x = freqPositions[frecuenciaSeleccionada] || 360
                    return <rect x={x - 3} y="28" width="6" height="249" fill="#0066cc" opacity="0.3" />
                  })()}

                  {/* Indicador de intensidad actual */}
                  {(() => {
                    const y = 30 + (intensidad + 10) * 1.75
                    return <rect x="48" y={y - 3} width="654" height="6" fill="#ff6600" opacity="0.3" />
                  })()}

                  {/* Símbolos y líneas del audiograma */}
                  {/* Líneas conectoras para oído derecho (vía aérea) */}
                  <g>
                    {(() => {
                      const freqPositions: Record<number, number> = {
                        125: 100,
                        250: 180,
                        500: 260,
                        1000: 360,
                        2000: 460,
                        4000: 560,
                        8000: 660,
                      }
                      const puntos = Object.entries(resultados.derecho.aerea)
                        .filter(([_, valor]) => valor !== null)
                        .map(([freq, valor]) => ({
                          x: freqPositions[Number(freq)],
                          y: 30 + (valor! + 10) * 1.75,
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
                            strokeWidth="3"
                          />
                        )
                      })
                    })()}
                  </g>

                  {/* Líneas conectoras para oído izquierdo (vía aérea) */}
                  <g>
                    {(() => {
                      const freqPositions: Record<number, number> = {
                        125: 100,
                        250: 180,
                        500: 260,
                        1000: 360,
                        2000: 460,
                        4000: 560,
                        8000: 660,
                      }
                      const puntos = Object.entries(resultados.izquierdo.aerea)
                        .filter(([_, valor]) => valor !== null)
                        .map(([freq, valor]) => ({
                          x: freqPositions[Number(freq)],
                          y: 30 + (valor! + 10) * 1.75,
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
                            strokeWidth="3"
                            strokeDasharray="6,3"
                          />
                        )
                      })
                    })()}
                  </g>

                  {/* Símbolos para oído derecho (vía aérea) */}
                  {Object.entries(resultados.derecho.aerea)
                    .filter(([_, valor]) => valor !== null)
                    .map(([freq, valor]) => {
                      const freqPositions: Record<number, number> = {
                        125: 100,
                        250: 180,
                        500: 260,
                        1000: 360,
                        2000: 460,
                        4000: 560,
                        8000: 660,
                      }
                      const x = freqPositions[Number(freq)]
                      const y = 30 + (valor! + 10) * 1.75
                      return (
                        <g key={`right-air-${freq}`}>
                          <circle cx={x} cy={y} r="8" fill="white" stroke="#cc0000" strokeWidth="3" />
                        </g>
                      )
                    })}

                  {/* Símbolos para oído izquierdo (vía aérea) */}
                  {Object.entries(resultados.izquierdo.aerea)
                    .filter(([_, valor]) => valor !== null)
                    .map(([freq, valor]) => {
                      const freqPositions: Record<number, number> = {
                        125: 100,
                        250: 180,
                        500: 260,
                        1000: 360,
                        2000: 460,
                        4000: 560,
                        8000: 660,
                      }
                      const x = freqPositions[Number(freq)]
                      const y = 30 + (valor! + 10) * 1.75
                      return (
                        <g key={`left-air-${freq}`}>
                          <rect x={x - 8} y={y - 8} width="16" height="16" fill="white" stroke="none" />
                          <path
                            d={`M ${x - 7} ${y - 7} L ${x + 7} ${y + 7} M ${x - 7} ${y + 7} L ${x + 7} ${y - 7}`}
                            stroke="#0066cc"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </g>
                      )
                    })}

                  {/* Símbolos para vía ósea derecha */}
                  {Object.entries(resultados.derecho.osea)
                    .filter(([_, valor]) => valor !== null)
                    .map(([freq, valor]) => {
                      const freqPositions: Record<number, number> = {
                        125: 100,
                        250: 180,
                        500: 260,
                        1000: 360,
                        2000: 460,
                        4000: 560,
                        8000: 660,
                      }
                      const x = freqPositions[Number(freq)]
                      const y = 30 + (valor! + 10) * 1.75
                      return (
                        <text
                          key={`right-bone-${freq}`}
                          x={x}
                          y={y + 6}
                          textAnchor="middle"
                          fontSize="20"
                          fill="#cc0000"
                          fontWeight="bold"
                        >
                          {"<"}
                        </text>
                      )
                    })}

                  {/* Símbolos para vía ósea izquierda */}
                  {Object.entries(resultados.izquierdo.osea)
                    .filter(([_, valor]) => valor !== null)
                    .map(([freq, valor]) => {
                      const freqPositions: Record<number, number> = {
                        125: 100,
                        250: 180,
                        500: 260,
                        1000: 360,
                        2000: 460,
                        4000: 560,
                        8000: 660,
                      }
                      const x = freqPositions[Number(freq)]
                      const y = 30 + (valor! + 10) * 1.75
                      return (
                        <text
                          key={`left-bone-${freq}`}
                          x={x}
                          y={y + 6}
                          textAnchor="middle"
                          fontSize="20"
                          fill="#0066cc"
                          fontWeight="bold"
                        >
                          {">"}
                        </text>
                      )
                    })}
                </svg>
              </div>
            </div>

            {/* Leyenda responsive */}
            <div className="mb-4 bg-gradient-to-br from-blue-50 to-white p-3 rounded-xl shadow-lg border-2 border-blue-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Oído derecho */}
                <div className="bg-red-50 p-2 rounded-lg border border-red-200">
                  <h5 className="font-bold mb-1 text-red-700 flex items-center text-xs">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                    Oído Derecho
                  </h5>
                  <div className="flex items-center mb-1">
                    <svg width="16" height="16" className="mr-1">
                      <circle cx="8" cy="8" r="5" stroke="#cc0000" fill="white" strokeWidth="2" />
                    </svg>
                    <span className="text-xs text-gray-700">Vía Aérea</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-red-600 mr-1 font-bold">{"<"}</span>
                    <span className="text-xs text-gray-700">Vía Ósea</span>
                  </div>
                </div>

                {/* Oído izquierdo */}
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <h5 className="font-bold mb-1 text-blue-700 flex items-center text-xs">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                    Oído Izquierdo
                  </h5>
                  <div className="flex items-center mb-1">
                    <svg width="16" height="16" className="mr-1">
                      <path d="M 4 4 L 12 12 M 4 12 L 12 4" stroke="#0066cc" strokeWidth="2" />
                    </svg>
                    <span className="text-xs text-gray-700">Vía Aérea</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-blue-600 mr-1 font-bold">{">"}</span>
                    <span className="text-xs text-gray-700">Vía Ósea</span>
                  </div>
                </div>

                {/* Líneas */}
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <h5 className="font-bold mb-1 text-gray-700 text-xs">Conexiones:</h5>
                  <div className="flex items-center mb-1">
                    <div className="w-4 h-0.5 bg-red-600 mr-1"></div>
                    <span className="text-xs text-gray-600">Línea derecha</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-0.5 bg-blue-600 mr-1"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, #0066cc 0, #0066cc 2px, transparent 2px, transparent 4px)",
                      }}
                    ></div>
                    <span className="text-xs text-gray-600">Línea izquierda</span>
                  </div>
                </div>

                {/* Estado actual */}
                <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                  <h5 className="font-bold mb-1 text-green-700 text-xs">Estado:</h5>
                  <div className="text-xs space-y-0.5">
                    <div>{frecuenciaSeleccionada} Hz</div>
                    <div>{intensidad} dB HL</div>
                    <div className="capitalize">{oido}</div>
                    <div className="capitalize">{viaSeleccionada}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles responsive */}
            <div className="space-y-4">
              {/* Primera fila de controles */}
              <div className="flex flex-wrap gap-2 justify-center">
                {/* Botón Tone/Warble */}
                <button
                  className="flex-1 min-w-[80px] max-w-[120px] h-12 bg-[#2C2C2C] rounded-lg border-t border-black shadow-lg relative"
                  onClick={() => {
                    const nuevoTipo = tipoTono === "pure" ? "warble" : "pure"
                    setTipoTono(nuevoTipo)
                    toast({
                      title: `Modo ${nuevoTipo === "pure" ? "Tono Puro" : "Warble"} activado`,
                      description: `Ahora reproduciendo ${nuevoTipo === "pure" ? "tonos puros" : "tonos warble"}`,
                    })
                  }}
                >
                  <div className="absolute top-[-20px] left-1 text-xs font-semibold text-gray-700">Tone</div>
                  <div className="absolute top-[-20px] right-1 text-xs font-semibold text-gray-700">Warble</div>
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black transform -translate-x-0.5"></div>
                  {tipoTono === "pure" ? (
                    <div className="absolute left-2 top-1/2 w-6 h-1 bg-green-400 rounded shadow-sm transform -translate-y-0.5"></div>
                  ) : (
                    <div className="absolute right-2 top-1/2 w-6 h-1 bg-green-400 rounded shadow-sm transform -translate-y-0.5"></div>
                  )}
                </button>

                {/* Botón Guardar */}
                <Button
                  className="flex-1 min-w-[80px] max-w-[120px] h-12 bg-[#FFD65C] hover:bg-[#FFD040] text-black font-semibold text-sm transition-all duration-200 hover:scale-105"
                  onClick={guardarResultado}
                  disabled={modoAutomatico}
                >
                  Guardar
                </Button>

                {/* Botones de intensidad */}
                <Button
                  className="flex-1 min-w-[80px] max-w-[120px] h-12 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-xs font-semibold transition-all duration-200 hover:scale-105"
                  onClick={() => cambiarIntensidad("bajar")}
                  disabled={modoAutomatico}
                >
                  Subir Tono
                </Button>

                <Button
                  className="flex-1 min-w-[80px] max-w-[120px] h-12 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-xs font-semibold transition-all duration-200 hover:scale-105"
                  onClick={() => cambiarIntensidad("subir")}
                  disabled={modoAutomatico}
                >
                  Bajar Tono
                </Button>
              </div>

              {/* Segunda fila de controles */}
              <div className="flex flex-wrap gap-2 justify-center">
                {/* Botones de oído */}
                <div className="flex flex-col items-center">
                  <span className="mb-1 text-xs text-black font-semibold">Oído Derecho</span>
                  <button
                    className={`w-16 h-12 bg-[#C00F0C] hover:bg-[#A00A08] rounded-lg shadow-lg transition-all duration-200 hover:scale-105 relative ${
                      oido === "derecho" ? "ring-2 ring-white ring-inset" : ""
                    }`}
                    onClick={() => cambiarOido("derecho")}
                  >
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black transform -translate-x-0.5"></div>
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <span className="mb-1 text-xs text-black font-semibold">Oído Izquierdo</span>
                  <button
                    className={`w-16 h-12 bg-[#1D0990] hover:bg-[#150770] rounded-lg shadow-lg transition-all duration-200 hover:scale-105 relative ${
                      oido === "izquierdo" ? "ring-2 ring-white ring-inset" : ""
                    }`}
                    onClick={() => cambiarOido("izquierdo")}
                  >
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black transform -translate-x-0.5"></div>
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <span className="mb-1 text-xs text-black font-semibold">Vía Ósea/Aérea</span>
                  <button
                    className={`w-16 h-12 bg-[#00BFFF] hover:bg-[#00A5E6] rounded-lg shadow-lg transition-all duration-200 hover:scale-105 relative ${
                      viaSeleccionada === "osea" ? "ring-2 ring-white ring-inset" : ""
                    }`}
                    onClick={() => {
                      if (viaSeleccionada === "osea") {
                        setViaSeleccionada("aerea")
                      } else {
                        cambiarVia("osea")
                      }
                    }}
                  >
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black transform -translate-x-0.5"></div>
                  </button>
                </div>
              </div>

              {/* Tercera fila - Controles principales */}
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {/* Perilla frecuencia izquierda */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2C2C2C] rounded-full cursor-pointer shadow-xl hover:bg-[#3C3C3C] transition-colors relative"
                    onClick={() => !modoAutomatico && cambiarFrecuencia("bajar")}
                  >
                    <div
                      className="absolute w-1 h-8 bg-white rounded top-4 left-1/2 shadow-sm transform -translate-x-1/2"
                      style={{
                        transformOrigin: "center bottom",
                        transform: `translateX(-50%) rotate(${frecuencias.indexOf(frecuenciaSeleccionada) * 20 - 100}deg)`,
                      }}
                    ></div>
                    <div className="absolute inset-4 border-2 border-gray-600 rounded-full"></div>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-center">Frecuencia ←</div>
                </div>

                {/* Botón reproducir */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-700 cursor-pointer transition-all shadow-xl hover:scale-105 relative ${
                      reproduciendo
                        ? "bg-green-600 hover:bg-green-700 shadow-green-400/50"
                        : esperandoRespuesta
                          ? "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-400/50"
                          : "bg-[#2C2C2C] hover:bg-gray-800"
                    }`}
                    onClick={handleReproducir}
                  >
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-white rounded"></div>
                    {reproduciendo && (
                      <div className="absolute inset-1 border-2 border-green-300 rounded-full animate-pulse"></div>
                    )}
                    {esperandoRespuesta && !reproduciendo && (
                      <div className="absolute inset-1 border-2 border-yellow-300 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-center">REPRODUCIR</div>
                </div>

                {/* Perilla frecuencia derecha */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2C2C2C] rounded-full cursor-pointer shadow-xl hover:bg-[#3C3C3C] transition-colors relative"
                    onClick={() => !modoAutomatico && cambiarFrecuencia("subir")}
                  >
                    <div
                      className="absolute w-1 h-8 bg-white rounded top-4 left-1/2 shadow-sm transform -translate-x-1/2"
                      style={{
                        transformOrigin: "center bottom",
                        transform: `translateX(-50%) rotate(${frecuencias.indexOf(frecuenciaSeleccionada) * 20 - 100}deg)`,
                      }}
                    ></div>
                    <div className="absolute inset-4 border-2 border-gray-600 rounded-full"></div>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-center">Frecuencia →</div>
                </div>
              </div>
            </div>

            <div className="absolute left-[655px] top-[515px] text-sm text-center font-semibold">REPRODUCIR TONO</div>
          </div>
        </div>

        {/* Panel lateral de resultados - Responsive */}
        <div className="w-full xl:w-1/4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Resultados</h2>

            {/* Estado actual */}
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
                  Tipo de tono: <span className="font-bold">{tipoTono === "pure" ? "Puro" : "Warble"}</span>
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

            {/* Tabla de umbrales responsive */}
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
                    {[125, 250, 500, 1000, 2000, 4000, 8000].map((freq) => (
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
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-xs transition-all duration-200 hover:scale-105"
                onClick={() => toast({ title: "Guardar", description: "Resultados guardados correctamente" })}
              >
                Guardar Resultados
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="w-full text-xs transition-all duration-200 hover:scale-105"
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

      {/* Instrucciones responsive */}
      <div className="mt-6 bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-lg font-bold mb-3 text-blue-700">📋 Instrucciones del Audiómetro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">🎛️ Controles principales:</h4>
            <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
              <li>
                • <strong>Perillas izquierda/derecha:</strong> Cambiar frecuencia
              </li>
              <li>
                • <strong>Botón central:</strong> Reproducir tono
              </li>
              <li>
                • <strong>Botones de oído:</strong> Seleccionar derecho/izquierdo
              </li>
              <li>
                • <strong>Botón azul:</strong> Cambiar vía ósea/aérea
              </li>
            </ul>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-800">✅ Respuestas:</h4>
            <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
              <li>
                • <strong>Guardar:</strong> Almacenar umbral encontrado
              </li>
              <li>
                • <strong>SÍ/NO:</strong> Respuesta del paciente
              </li>
              <li>
                • <strong>Subir/Bajar Tono:</strong> Ajustar intensidad
              </li>
              <li>
                • <strong>Panel lateral:</strong> Ver resultados en tiempo real
              </li>
            </ul>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2 text-purple-800">⚙️ Características:</h4>
            <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
              <li>
                • <strong>Responsive:</strong> Se adapta a móviles
              </li>
              <li>
                • <strong>Audiograma:</strong> Visualización en tiempo real
              </li>
              <li>
                • <strong>Historial:</strong> Registro de todas las pruebas
              </li>
              <li>
                • <strong>Símbolos:</strong> Estándar audiológico
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
