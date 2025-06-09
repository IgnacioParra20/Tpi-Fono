"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CheckCircle, Volume2 } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const questions = [
  {
    id: 1,
    question: "¿Qué representa el color azul en un audiograma?",
    options: [
      "Vía ósea derecha",
      "Vía aérea izquierda",
      "Oído derecho",
      "Enmascaramiento"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "El símbolo “X” en un audiograma representa:",
    options: [
      "Oído derecho",
      "Vía ósea izquierda",
      "Vía aérea izquierda",
      "Oído no testeado"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "¿Qué se mide con un audiómetro?",
    options: [
      "La intensidad de la voz",
      "La frecuencia de resonancia",
      "El umbral auditivo",
      "La presión timpánica"
    ],
    correct: 2
  },
  {
    id: 4,
    question: "¿Cuál de los siguientes componentes NO pertenece al audiómetro?",
    options: [
      "Otoscopio",
      "Interruptor de estímulo",
      "Generador de tono puro",
      "Selector de transductor"
    ],
    correct: 0
  },
  {
    id: 5,
    question: "¿Qué vía se representa con los símbolos < y > en un audiograma?",
    options: [
      "Vía aérea",
      "Vía ósea ",
      "Vía mixta",
      "Oído externo",
    ],
    correct: 1
  },
  {
    id: 6,
    question: "¿Qué es el ensordecimiento?",
    options: [
      "Pérdida súbita de la audición",
      "Necesidad de mayor intensidad para oír después de un estímulo previo",
      "Presencia de acúfeno",
      "Dificultad para discriminar palabras"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "¿Qué indica el fenómeno del reclutamiento?",
    options: [
      "Falta de percepción auditiva",
      "Percepción anormal de los sonidos suaves",
      "Hipersensibilidad al silencio",
      "Disminución del umbral de disconfort"
    ],
    correct: 3
  },
  {
    id: 8,
    question: "Según Diamante, ¿cuántos dB se suman para el enmascaramiento por vía aérea?",
    options: [
      "15",
      "30",
      "25",
      "10"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "¿Qué mide la acufenometría?",
    options: [
      "El umbral de dolor",
      "El nivel de ensordecimiento",
      "La frecuencia e intensidad del acúfeno",
      "La percepción de la voz en ruido"
    ],
    correct: 2
  },
  {
    id: 10,
    question: "¿Qué autor plantea reglas específicas de ensordecimiento para la vía ósea?",
    options: [
      "Vicente Cursio",
      "Helms",
      "Katz",
      "Hall"
    ],
    correct: 0
  }
]

export default function Level1Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [userAnswers, setUserAnswers] = useState<number[]>([])
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
    const  email  = JSON.parse(userData)
    fetch("/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          console.log("user", data.user)
        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
  }, [router])

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNext = async () => {
    const answerIndex = parseInt(selectedAnswer)
    const newAnswers = [...userAnswers, answerIndex]
    setUserAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      // Calcular puntaje
      const correctAnswers = newAnswers.filter(
        (answer, index) => questions[index] && answer === questions[index].correct
      ).length

      setScore(correctAnswers)
      setShowResult(true)

      // Actualizar progreso del usuario
      if (user) {
        try {
          const updatedProgress = {
            ...user.progress,
            level1: correctAnswers, // Podés cambiarlo dinámicamente si querés
          }
          console.log("updatedProgress", JSON.stringify(updatedProgress))
          const res = await fetch("/api/users/updateProgress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              nuevoValor: correctAnswers,
              nivel: "lvl1",
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
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setUserAnswers([])
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
                  Volver al Panel de Niveles
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">Fono al día</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Nivel 1 Completado!</CardTitle>
                <CardDescription>
                  Terminaste los Fundamentos Básicos!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {score}/10
                  </div>
                  <p className="text-gray-600">Preguntas respondidas correctamente</p>
                </div>

                <Alert>
                  <AlertDescription>
                    {score >= 8 ? "¡Excelente! Estás listo para el Nivel 2." : 
                     score >= 6 ? "¡Buen trabajo! Considera repasar antes de avanzar al Nivel 2." :
                     "¡Sigue practicando! Revisa el material e inténtalo nuevamente."}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    Volver a Intentar
                  </Button>
                  <Link href="/dashboard">
                    <Button>Volver al Panel de niveles</Button>
                  </Link>
                  {score >= 6 && (
                    <Link href="/levels/2">
                      <Button>Continuar al nivel 2</Button>
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

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al panel
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
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">Nivel 1: Fundamentos</h1>
              <span className="text-sm text-gray-600">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                >
                  Anterior
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                >
                  {currentQuestion === questions.length - 1 ? "Terminar" : "Siguiente"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}