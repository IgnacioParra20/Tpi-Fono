"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Activity, ArrowLeft, CheckCircle, Volume2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const pathologies = [
  {
    id: 1,
    name: "Hipoacusia Conductiva",
    description: "Pérdida auditiva causada por problemas en el oído externo o medio",
    targetPattern: {
      frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
      rightEar: {
        airConduction: [35, 40, 45, 50, 55, 50, 45],
        boneConduction: [5, 10, 15, 20, 25, 20, 15],
      },
      leftEar: {
        airConduction: [40, 45, 50, 55, 60, 55, 50],
        boneConduction: [10, 15, 20, 25, 30, 25, 20],
      },
    },
    instructions:
      "Ajusta el audiograma para mostrar un patrón de hipoacusia conductiva con una brecha aéreo-ósea en ambos oídos.",
  },
  {
    id: 2,
    name: "Hipoacusia Neurosensorial",
    description: "Pérdida auditiva por daño en el oído interno o en el nervio auditivo",
    targetPattern: {
      frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
      rightEar: {
        airConduction: [15, 20, 25, 35, 50, 70, 80],
        boneConduction: [15, 20, 25, 35, 50, 70, 80],
      },
      leftEar: {
        airConduction: [20, 25, 30, 40, 55, 75, 85],
        boneConduction: [20, 25, 30, 40, 55, 75, 85],
      },
    },
    instructions:
      "Crea un patrón de hipoacusia neurosensorial sin brecha aéreo-ósea y con pérdida en frecuencias altas.",
  },
  {
    id: 3,
    name: "Hipoacusia Mixta",
    description: "Combinación de componentes conductivos y neurosensoriales",
    targetPattern: {
      frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
      rightEar: {
        airConduction: [45, 50, 55, 60, 70, 75, 80],
        boneConduction: [25, 30, 35, 40, 50, 55, 60],
      },
      leftEar: {
        airConduction: [50, 55, 60, 65, 75, 80, 85],
        boneConduction: [30, 35, 40, 45, 55, 60, 65],
      },
    },
    instructions: "Muestra una hipoacusia mixta con brecha aéreo-ósea y componente neurosensorial en ambos oídos.",
  },
  {
    id: 4,
    name: "Hipoacusia por Ruido",
    description: "Pérdida auditiva causada por exposición a sonidos intensos",
    targetPattern: {
      frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
      rightEar: {
        airConduction: [5, 10, 15, 20, 45, 60, 40],
        boneConduction: [5, 10, 15, 20, 45, 60, 40],
      },
      leftEar: {
        airConduction: [10, 15, 20, 25, 50, 65, 45],
        boneConduction: [10, 15, 20, 25, 50, 65, 45],
      },
    },
    instructions: "Crea el patrón característico de caída en 4000 Hz típico de la hipoacusia inducida por ruido.",
  },
  {
    id: 5,
    name: "Presbiacusia",
    description: "Pérdida auditiva relacionada con la edad que afecta las frecuencias altas",
    targetPattern: {
      frequencies: [125, 250, 500, 1000, 2000, 4000, 8000],
      rightEar: {
        airConduction: [10, 15, 20, 25, 35, 55, 70],
        boneConduction: [10, 15, 20, 25, 35, 55, 70],
      },
      leftEar: {
        airConduction: [15, 20, 25, 30, 40, 60, 75],
        boneConduction: [15, 20, 25, 30, 40, 60, 75],
      },
    },
    instructions: "Muestra la pérdida auditiva progresiva en frecuencias altas típica del envejecimiento.",
  },
]

export default function Level3Page() {
  const [currentPathology, setCurrentPathology] = useState(0)
  const [userAudiogram, setUserAudiogram] = useState({
    rightEar: {
      airConduction: [0, 0, 0, 0, 0, 0, 0],
      boneConduction: [0, 0, 0, 0, 0, 0, 0],
    },
    leftEar: {
      airConduction: [0, 0, 0, 0, 0, 0, 0],
      boneConduction: [0, 0, 0, 0, 0, 0, 0],
    },
  })
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const email = JSON.parse(userData)

    fetch("/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
  }, [router])

  const handleAirConductionChange = (ear: "rightEar" | "leftEar", index: number, value: number[]) => {
    setUserAudiogram((prev) => ({
      ...prev,
      [ear]: {
        ...prev[ear],
        airConduction: prev[ear].airConduction.map((val, i) => (i === index ? value[0] : val)),
      },
    }))
  }

  const handleBoneConductionChange = (ear: "rightEar" | "leftEar", index: number, value: number[]) => {
    setUserAudiogram((prev) => ({
      ...prev,
      [ear]: {
        ...prev[ear],
        boneConduction: prev[ear].boneConduction.map((val, i) => (i === index ? value[0] : val)),
      },
    }))
  }

  const calculateAccuracy = () => {
    const pathology = pathologies[currentPathology]
    let totalError = 0
    const ears: Array<"rightEar" | "leftEar"> = ["rightEar", "leftEar"]

    ears.forEach((ear) => {
      for (let i = 0; i < 7; i++) {
        totalError += Math.abs(userAudiogram[ear].airConduction[i] - pathology.targetPattern[ear].airConduction[i])
        totalError += Math.abs(userAudiogram[ear].boneConduction[i] - pathology.targetPattern[ear].boneConduction[i])
      }
    })

    const maxPossibleError = 28 * 100 // 28 points, max 100 dB difference each
    const accuracy = Math.max(0, 100 - (totalError / maxPossibleError) * 100)
    return accuracy > 70 ? 1 : 0
  }

  const handleNext = async () => {
    console.log("user", user.id)
    const isCorrect = calculateAccuracy()
    setScore(score + isCorrect)

    if (currentPathology < pathologies.length - 1) {
      setCurrentPathology(currentPathology + 1)
      setUserAudiogram({
        rightEar: {
          airConduction: [0, 0, 0, 0, 0, 0, 0],
          boneConduction: [0, 0, 0, 0, 0, 0, 0],
        },
        leftEar: {
          airConduction: [0, 0, 0, 0, 0, 0, 0],
          boneConduction: [0, 0, 0, 0, 0, 0, 0],
        },
      })
    } else {
      setShowResult(true)

      if (user) {
        try {
          console.log("user", user.id)
          const res = await fetch("/api/users/updateProgress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              nuevoValor: score,
              nivel: "lvl3",
            }),
          })

          if (!res.ok) {
            console.error("Fallo al actualizar el progreso del usuario")
          }
        } catch (error) {
          console.error("Error al actualizar progreso:", error)
        }
      }
    }
  }

  const handleRetry = () => {
    setCurrentPathology(0)
    setUserAudiogram({
      rightEar: {
        airConduction: [0, 0, 0, 0, 0, 0, 0],
        boneConduction: [0, 0, 0, 0, 0, 0, 0],
      },
      leftEar: {
        airConduction: [0, 0, 0, 0, 0, 0, 0],
        boneConduction: [0, 0, 0, 0, 0, 0, 0],
      },
    })
    setShowResult(false)
    setScore(0)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-transform duration-200 hover:scale-105 hover:shadow-md text-base font-bold px-6 py-3 border-gray-300 text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Panel de Niveles
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">¡Nivel 3 Completado!</CardTitle>
                <CardDescription>Has dominado la Aplicación Clínica</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">{score}/5</div>
                  <p className="text-gray-600">Patologías correctamente asociadas</p>
                </div>

                <Alert>
                  <AlertDescription>
                    {score >= 4
                      ? "¡Excelente! Has dominado todos los niveles del aprendizaje en fonología."
                      : score >= 3
                        ? "¡Muy bien! Tienes un conocimiento sólido sobre aplicaciones clínicas."
                        : "¡Buen intento! Continúa practicando para mejorar tus habilidades clínicas."}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    Intentar de nuevo
                  </Button>
                  <Link href="/dashboard">
                    <Button>Volver al Panel</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const pathology = pathologies[currentPathology]
  const progress = ((currentPathology + 1) / pathologies.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold flex items-center">
                <Activity className="h-6 w-6 mr-2" />
                Nivel 3: Aplicación Clínica
              </h1>
              <span className="text-sm text-gray-600">
                Patología {currentPathology + 1} de {pathologies.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Información de la patología e instrucciones - Separadas */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{pathology.name}</CardTitle>
                <CardDescription className="text-base">{pathology.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription className="text-base font-medium">{pathology.instructions}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Layout principal responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controles Oído Derecho */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center justify-between text-red-600">
                    Oído Derecho
                    <Badge variant="outline" className="border-red-200 text-red-600">
                      OD
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pathology.targetPattern.frequencies.map((freq, index) => (
                      <div key={`right-${freq}`} className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <h4 className="font-medium mb-2 text-red-800 text-sm">{freq} Hz</h4>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block flex items-center">
                              <span className="w-3 h-3 border-2 border-red-500 rounded-full mr-2"></span>
                              CA: {userAudiogram.rightEar.airConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.rightEar.airConduction[index]]}
                              onValueChange={(value) => handleAirConductionChange("rightEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block flex items-center">
                              <span className="text-red-500 font-bold mr-2 text-base">{"<"}</span>
                              CO: {userAudiogram.rightEar.boneConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.rightEar.boneConduction[index]]}
                              onValueChange={(value) => handleBoneConductionChange("rightEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Leyenda de símbolos */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Símbolos:</h5>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 border-2 border-red-500 rounded-full bg-white"></span>
                        <span className="font-medium">CA</span>
                        <span className="text-gray-500">(Conducción Aérea)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-500 font-bold text-base">{"<"}</span>
                        <span className="font-medium">CO</span>
                        <span className="text-gray-500">(Conducción Ósea)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audiograma - Más grande y centrado */}
            <div className="lg:col-span-6">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-center text-lg">Audiograma</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white border-2 rounded-lg p-4 w-full max-w-2xl">
                    <div className="aspect-square w-full max-w-[500px] mx-auto">
                      <AudiogramChart
                        frequencies={pathology.targetPattern.frequencies}
                        rightEar={userAudiogram.rightEar}
                        leftEar={userAudiogram.leftEar}
                      />
                    </div>
                  </div>

                  {/* Leyenda del audiograma */}
                  <div className="mt-4 grid grid-cols-2 gap-6 text-sm w-full max-w-md">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600">Oído Derecho</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-red-500 rounded-full bg-white"></div>
                        <span>CA</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 font-bold text-base">{"<"}</span>
                        <span>CO</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-600">Oído Izquierdo</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500 font-bold text-base">X</span>
                        <span>CA</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500 font-bold text-base">{">"}</span>
                        <span>CO</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de navegación */}
                  <div className="mt-6 flex justify-between w-full max-w-md">
                    <Button
                      variant="outline"
                      disabled={currentPathology === 0}
                      onClick={() => setCurrentPathology(currentPathology - 1)}
                    >
                      Anterior
                    </Button>
                    <Button onClick={handleNext}>
                      {currentPathology === pathologies.length - 1 ? "Finalizar" : "Siguiente"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controles Oído Izquierdo */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center justify-between text-blue-600">
                    Oído Izquierdo
                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                      OI
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pathology.targetPattern.frequencies.map((freq, index) => (
                      <div key={`left-${freq}`} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-medium mb-2 text-blue-800 text-sm">{freq} Hz</h4>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block flex items-center">
                              <span className="text-blue-500 font-bold mr-2 text-base">X</span>
                              CA: {userAudiogram.leftEar.airConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.leftEar.airConduction[index]]}
                              onValueChange={(value) => handleAirConductionChange("leftEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block flex items-center">
                              <span className="text-blue-500 font-bold mr-2 text-base">{">"}</span>
                              CO: {userAudiogram.leftEar.boneConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.leftEar.boneConduction[index]]}
                              onValueChange={(value) => handleBoneConductionChange("leftEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Leyenda de símbolos */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Símbolos:</h5>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-blue-500 font-bold text-base">X</span>
                        <span className="font-medium">CA</span>
                        <span className="text-gray-500">(Conducción Aérea)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-blue-500 font-bold text-base">{">"}</span>
                        <span className="font-medium">CO</span>
                        <span className="text-gray-500">(Conducción Ósea)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Componente del gráfico del audiograma mejorado y responsive
function AudiogramChart({
  frequencies,
  rightEar,
  leftEar,
}: {
  frequencies: number[]
  rightEar: { airConduction: number[]; boneConduction: number[] }
  leftEar: { airConduction: number[]; boneConduction: number[] }
}) {
  const dbLevels = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  const getXPosition = (index: number) => {
    return 80 + index * (340 / (frequencies.length - 1))
  }

  const getYPosition = (dbValue: number) => {
    return 60 + ((dbValue + 10) / 110) * 360
  }

  return (
    <div className="relative w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 500 500" className="border rounded">
        {/* Título */}
        <text x="250" y="30" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
          Audiograma
        </text>

        <text x="30" y="250" textAnchor="middle" fontSize="14" fill="#374151" transform="rotate(-90 30 250)">
          dB HL
        </text>

        <text x="250" y="490" textAnchor="middle" fontSize="14" fill="#374151">
          Frecuencia (Hz)
        </text>

        {/* Grid lines horizontales */}
        {dbLevels.map((db, index) => (
          <line
            key={`h-${db}`}
            x1="80"
            y1={60 + (index * 360) / 11}
            x2="420"
            y2={60 + (index * 360) / 11}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines verticales */}
        {frequencies.map((_, index) => (
          <line
            key={`v-${index}`}
            x1={getXPosition(index)}
            y1="60"
            x2={getXPosition(index)}
            y2="420"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Frequency labels */}
        {frequencies.map((freq, index) => (
          <text
            key={`freq-${freq}`}
            x={getXPosition(index)}
            y="45"
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="500"
          >
            {freq}
          </text>
        ))}

        {/* dB HL labels */}
        {dbLevels.map((db, index) => (
          <text
            key={`db-${db}`}
            x="70"
            y={60 + (index * 360) / 11 + 4}
            textAnchor="end"
            fontSize="12"
            fill="#374151"
            fontWeight="500"
          >
            {db}
          </text>
        ))}

        {/* Right ear air conduction line */}
        <polyline
          points={rightEar.airConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />

        {/* Right ear bone conduction line */}
        <polyline
          points={rightEar.boneConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeDasharray="8,4"
        />

        {/* Left ear air conduction line */}
        <polyline
          points={leftEar.airConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
        />

        {/* Left ear bone conduction line */}
        <polyline
          points={leftEar.boneConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeDasharray="8,4"
        />

        {/* Right ear air conduction symbols (circles) */}
        {rightEar.airConduction.map((db, index) => (
          <circle
            key={`right-air-${index}`}
            cx={getXPosition(index)}
            cy={getYPosition(db)}
            r="8"
            fill="white"
            stroke="#ef4444"
            strokeWidth="3"
          />
        ))}

        {/* Right ear bone conduction symbols (<) */}
        {rightEar.boneConduction.map((db, index) => (
          <text
            key={`right-bone-${index}`}
            x={getXPosition(index)}
            y={getYPosition(db) + 6}
            textAnchor="middle"
            fontSize="18"
            fill="#ef4444"
            fontWeight="bold"
          >
            {"<"}
          </text>
        ))}

        {/* Left ear air conduction symbols (X) */}
        {leftEar.airConduction.map((db, index) => (
          <text
            key={`left-air-${index}`}
            x={getXPosition(index)}
            y={getYPosition(db) + 6}
            textAnchor="middle"
            fontSize="18"
            fill="#3b82f6"
            fontWeight="bold"
          >
            X
          </text>
        ))}

        {/* Left ear bone conduction symbols (>) */}
        {leftEar.boneConduction.map((db, index) => (
          <text
            key={`left-bone-${index}`}
            x={getXPosition(index)}
            y={getYPosition(db) + 6}
            textAnchor="middle"
            fontSize="18"
            fill="#3b82f6"
            fontWeight="bold"
          >
            {">"}
          </text>
        ))}
      </svg>
    </div>
  )
}
