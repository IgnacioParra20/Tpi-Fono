"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Stethoscope, Volume2 } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const audiometerParts = [
  {
    id: 1,
    name: "Oído derecho",
    description: "Canal de salida correspondiente al oído derecho",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 27.7, y: 66.4 }
  },
  {
    id: 2,
    name: "Vía ósea",
    description: "Permite activar la conducción ósea en el test auditivo",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 36.4, y: 66.0 }
  },
  {
    id: 3,
    name: "Oído izquierdo",
    description: "Canal de salida correspondiente al oído izquierdo",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 32.0, y: 66.0 }
  },
  {
    id: 4,
    name: "Intensidad de ruido",
    description: "Control para ajustar el nivel de ruido en enmascaramiento",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 27.2, y: 82.0 }
  },
  {
    id: 5,
    name: "Bajar frecuencia",
    description: "Disminuye la frecuencia del tono de prueba",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 47.7, y: 85.0 }
  },
  {
    id: 6,
    name: "Subir frecuencia",
    description: "Aumenta la frecuencia del tono de prueba",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 52.4, y: 85.3 }
  },
  {
    id: 7,
    name: "Intensidad de tono",
    description: "Control para ajustar la intensidad del estímulo tonal",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 72.9, y: 82.8 }
  },
  {
    id: 8,
    name: "Estimulo de tono",
    description: "Botón que activa el tono de prueba (presentación)",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 38.6, y: 83.0 }
  }
]

export default function Level2Page() {
  const [currentPart, setCurrentPart] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{x: number, y: number}[]>([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [selectedPosition, setSelectedPosition] = useState<{x: number, y: number} | null>(null)
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
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
  }, [router])

  // ✅ Capturar clic en la imagen
  const handlePositionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSelectedPosition({ x, y })
  }

  // ✅ Evaluar respuestas y actualizar progreso
  const handleNext = async () => {
    if (!selectedPosition) return

    const newAnswers = [...userAnswers, selectedPosition]
    setUserAnswers(newAnswers)

    if (currentPart < audiometerParts.length - 1) {
      setCurrentPart(currentPart + 1)
      setSelectedPosition(null)
    } else {
      const correctAnswers = newAnswers.filter((answer, index) => {
        const correct = audiometerParts[index].correctPosition
        const distance = Math.sqrt(
          Math.pow(answer.x - correct.x, 2) +
          Math.pow(answer.y - correct.y, 2)
        )
        return distance <= 2
      }).length

      setScore(correctAnswers)
      setShowResult(true)

      // ✅ Enviar progreso del nivel 2 al backend
      if (user) {
        try {
          const updatedProgress = {
            ...user.progress,
            level2: correctAnswers, // Podés cambiarlo dinámicamente si querés
          }
          const res = await fetch("/api/users/updateProgress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              nuevoValor: correctAnswers,
              nivel: "lvl2",
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
    setCurrentPart(0)
    setUserAnswers([])
    setShowResult(false)
    setScore(0)
    setSelectedPosition(null)
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
              <CardTitle className="text-2xl">¡Nivel 2 Completado!</CardTitle>
              <CardDescription>
                Has finalizado el nivel de Dominio del Equipamiento
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {score}/8
                </div>
                <p className="text-gray-600">Partes correctamente identificadas</p>
              </div>

              <Alert>
                <AlertDescription>
                  {score >= 6
                    ? "¡Excelente trabajo! Estás listo para el Nivel 3."
                    : score >= 4
                    ? "¡Buen trabajo! Considera repasar antes de avanzar al Nivel 3."
                    : "¡Sigue practicando! Revisa el equipamiento e inténtalo nuevamente."}
                </AlertDescription>
              </Alert>

              <div className="flex gap-4 justify-center">
                <Button onClick={handleRetry} variant="outline">
                  Intentar de nuevo
                </Button>
                <Link href="/dashboard">
                  <Button>Volver al Panel</Button>
                </Link>
                {score >= 4 && (
                  <Link href="/levels/3">
                    <Button>Continuar al Nivel 3</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

const part = audiometerParts[currentPart]
const progress = ((currentPart + 1) / audiometerParts.length) * 100

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
<div className="max-w-6xl mx-auto">
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold flex items-center">
          <Stethoscope className="h-6 w-6 mr-2" />
          Nivel 2: Dominio del Equipamiento
        </h1>
        <span className="text-sm text-gray-600">
          Parte {currentPart + 1} de {audiometerParts.length}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Identifica: {part.name}
            <Badge variant="outline">Haz clic para seleccionar</Badge>
          </CardTitle>
          <CardDescription>{part.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-gray-100 rounded-lg cursor-crosshair overflow-hidden"
            style={{ height: "400px" }}
            onClick={handlePositionClick}
          >
            {/* Imagen del audiómetro */}
            <img
              src="/audiometro.jpg"
              alt="Diagrama del Audiómetro"
              className="w-full h-full object-contain"
            />

{/* Punto rojo: selección del usuario */}
{selectedPosition && (
  <div
    className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2 border-2 border-white shadow-lg"
    style={{
      left: `${selectedPosition.x}%`,
      top: `${selectedPosition.y}%`
    }}
  />
)}Z
          </div>

          {selectedPosition && (
            <Alert className="mt-4">
              <AlertDescription>
                ¡Posición seleccionada! Haz clic en "Siguiente" para continuar o selecciona otro punto si deseas cambiarla.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Tarea actual:</h3>
            <p className="text-gray-600">
              Ubica y haz clic en el/la <strong>{part.name}</strong> en el diagrama del audiómetro.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Acerca de este componente:</h3>
            <p className="text-gray-600">{part.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">¿Cómo responder?</h3>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Observa detenidamente el diagrama del audiómetro</li>
              <li>• Haz clic en el lugar donde crees que está ubicado el/la {part.name}</li>
              <li>• Aparecerá un punto rojo para mostrar tu selección</li>
              <li>• Haz clic en "Siguiente" para confirmar y continuar</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={currentPart === 0}
                onClick={() => setCurrentPart(currentPart - 1)}
              >
                Anterior
              </Button>
              <Button onClick={handleNext} disabled={!selectedPosition}>
                {currentPart === audiometerParts.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</main>
  </div>
  )
}