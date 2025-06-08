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

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
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
      totalError += Math.abs(
        userAudiogram[ear].airConduction[i] -
          pathology.targetPattern[ear].airConduction[i]
      )
      totalError += Math.abs(
        userAudiogram[ear].boneConduction[i] -
          pathology.targetPattern[ear].boneConduction[i]
      )
    }
  })

  const maxPossibleError = 28 * 100 // 28 points, max 100 dB difference each
  const accuracy = Math.max(0, 100 - (totalError / maxPossibleError) * 100)
  return accuracy > 70 ? 1 : 0
}

  const handleNext = () => {
    const isCorrect = calculateAccuracy()

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
      let finalScore = 0
      for (let i = 0; i <= currentPathology; i++) {
        finalScore += 1
      }

      setScore(finalScore)
      setShowResult(true)

      if (user) {
        const updatedUser = {
          ...user,
          progress: {
            ...user.progress,
            level3: Math.max(user.progress.level3, finalScore),
          },
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
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
    return <div>Cargando...</div>
  }

  if (showResult) {
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

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Controles Oído Derecho - Izquierda */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center justify-between text-red-600">
                    Oído Derecho
                    <Badge variant="outline" className="border-red-200 text-red-600">
                      OD
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pathology.targetPattern.frequencies.map((freq, index) => (
                      <div key={`right-${freq}`} className="p-1 bg-red-50 rounded border border-red-100">
                        <h4 className="font-medium mb-1 text-red-800 text-xs">{freq} Hz</h4>

                        <div className="space-y-1">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block flex items-center">
                              <span className="w-3 h-3 border-2 border-red-500 rounded-full mr-1"></span>
                              CA: {userAudiogram.rightEar.airConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.rightEar.airConduction[index]]}
                              onValueChange={(value) => handleAirConductionChange("rightEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full h-1"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block flex items-center">
                              <span className="text-red-500 font-bold mr-1 text-sm">{"<"}</span>
                              CO: {userAudiogram.rightEar.boneConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.rightEar.boneConduction[index]]}
                              onValueChange={(value) => handleBoneConductionChange("rightEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full h-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visualización del Audiograma - Centro */}
            <div className="lg:col-span-1.25">
              <Card className="w-full h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-center">{pathology.name}</CardTitle>
                  <CardDescription className="text-center">{pathology.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertDescription>{pathology.instructions}</AlertDescription>
                  </Alert>

                  <div className="bg-white border rounded-lg p-4" style={{ height: "350px", width: "350px"  }}>
                    <AudiogramChart
                      frequencies={pathology.targetPattern.frequencies}
                      rightEar={userAudiogram.rightEar}
                      leftEar={userAudiogram.leftEar}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-red-600">Oído Derecho</h4>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 border-2 border-red-500 rounded-full bg-white"></div>
                        <span>CA</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-red-500 font-bold">{"<"}</span>
                        <span>CO</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-blue-600">Oído Izquierdo</h4>
                      <div className="flex items-center space-x-1">
                        <span className="text-blue-500 font-bold">X</span>
                        <span>CA</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-blue-500 font-bold">{">"}</span>
                        <span>CO</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPathology === 0}
                      onClick={() => setCurrentPathology(currentPathology - 1)}
                    >
                      Anterior
                    </Button>
                    <Button size="sm" onClick={handleNext}>
                      {currentPathology === pathologies.length - 1 ? "Finalizar" : "Siguiente"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controles Oído Izquierdo - Derecha */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center justify-between text-blue-600">
                    Oído Izquierdo
                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                      OI
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pathology.targetPattern.frequencies.map((freq, index) => (
                      <div key={`left-${freq}`} className="p-1 bg-blue-50 rounded border border-blue-100">
                        <h4 className="font-medium mb-1 text-blue-800 text-xs">{freq} Hz</h4>

                        <div className="space-y-1">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block flex items-center">
                              <span className="text-blue-500 font-bold mr-1 text-sm">X</span>
                              CA: {userAudiogram.leftEar.airConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.leftEar.airConduction[index]]}
                              onValueChange={(value) => handleAirConductionChange("leftEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full h-1"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block flex items-center">
                              <span className="text-blue-500 font-bold mr-1 text-sm">{">"}</span>
                              CO: {userAudiogram.leftEar.boneConduction[index]} dB
                            </Label>
                            <Slider
                              value={[userAudiogram.leftEar.boneConduction[index]]}
                              onValueChange={(value) => handleBoneConductionChange("leftEar", index, value)}
                              max={100}
                              min={-10}
                              step={5}
                              className="w-full h-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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

// Componente del gráfico del audiograma
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
    return 60 + index * (100 / (frequencies.length - 1)) * 3.8
  }

  const getYPosition = (dbValue: number) => {
    return 40 + ((dbValue + 10) / 110) * 400
  }

  return (
    <div className="relative w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 500 500">
        {/* Grid lines */}
        {dbLevels.map((db, index) => (
          <line
            key={`h-${db}`}
            x1="60"
            y1={40 + (index * 400) / 11}
            x2="440"
            y2={40 + (index * 400) / 11}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {frequencies.map((_, index) => (
          <line
            key={`v-${index}`}
            x1={getXPosition(index)}
            y1="40"
            x2={getXPosition(index)}
            y2="440"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Frequency labels */}
        {frequencies.map((freq, index) => (
          <text key={`freq-${freq}`} x={getXPosition(index)} y="30" textAnchor="middle" fontSize="12" fill="#374151">
            {freq}
          </text>
        ))}

        {/* dB HL labels */}
        {dbLevels.map((db, index) => (
          <text key={`db-${db}`} x="50" y={40 + (index * 400) / 11 + 4} textAnchor="end" fontSize="12" fill="#374151">
            {db}
          </text>
        ))}

        {/* Right ear air conduction line */}
        <polyline
          points={rightEar.airConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
        />

        {/* Right ear bone conduction line */}
        <polyline
          points={rightEar.boneConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Left ear air conduction line */}
        <polyline
          points={leftEar.airConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Left ear bone conduction line */}
        <polyline
          points={leftEar.boneConduction.map((db, index) => `${getXPosition(index)},${getYPosition(db)}`).join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Right ear air conduction symbols (circles) */}
        {rightEar.airConduction.map((db, index) => (
          <circle
            key={`right-air-${index}`}
            cx={getXPosition(index)}
            cy={getYPosition(db)}
            r="6"
            fill="white"
            stroke="#ef4444"
            strokeWidth="2"
          />
        ))}

        {/* Right ear bone conduction symbols (<) */}
        {rightEar.boneConduction.map((db, index) => (
          <text
            key={`right-bone-${index}`}
            x={getXPosition(index)}
            y={getYPosition(db) + 4}
            textAnchor="middle"
            fontSize="14"
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
            y={getYPosition(db) + 4}
            textAnchor="middle"
            fontSize="14"
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
            y={getYPosition(db) + 4}
            textAnchor="middle"
            fontSize="14"
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
