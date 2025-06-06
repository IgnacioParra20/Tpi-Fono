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
    question: "¿Qué es un fonema?",
    options: [
      "Una letra escrita",
      "Una estructura silábica",
      "Un tipo de vocal",
      "Una unidad de sonido que distingue significado"
    ],
    correct: 3
  },
  {
    id: 2,
    question: "¿Cuál de los siguientes es un ejemplo de un par mínimo?",
    options: [
      "perro/cachorro",
      "feliz/triste",
      "correr/corriendo",
      "gato/pato"
    ],
    correct: 3
  },
  {
    id: 3,
    question: "¿Qué significan las siglas AFI?",
    options: [
      "Alfabeto Fonético Internacional",
      "Análisis Fonético Interno",
      "Asociación de Fonología Internacional",
      "Academia Internacional de Pronunciación"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "¿Qué característica distingue a las consonantes sonoras de las sordas?",
    options: [
      "Redondeo de labios",
      "Posición de la lengua",
      "Vibración de las cuerdas vocales",
      "Dirección del flujo de aire"
    ],
    correct: 2
  },
  {
    id: 5,
    question: "¿Cuál es la diferencia entre fonética y fonología?",
    options: [
      "La fonética estudia las vocales y la fonología las consonantes",
      "La fonética es teórica y la fonología práctica",
      "Estudian lo mismo",
      "La fonética estudia los sonidos y la fonología los patrones sonoros"
    ],
    correct: 3
  },
  {
    id: 6,
    question: "¿Cuál de estos es un punto de articulación?",
    options: [
      "Nasal",
      "Sonoro",
      "Alveolar",
      "Alto"
    ],
    correct: 2
  },
  {
    id: 7,
    question: "¿Qué es la variación alofónica?",
    options: [
      "Diferentes lenguas usando el mismo sonido",
      "Diferentes significados de la misma palabra",
      "Diferentes formas de escribir el mismo sonido",
      "Diferentes pronunciaciones del mismo fonema"
    ],
    correct: 3
  },
  {
    id: 8,
    question: "¿Qué característica vocálica se refiere a la altura de la lengua?",
    options: [
      "Anterior/Posterior",
      "Alta/Media/Baja",
      "Tensa/Relajada",
      "Redondeada/No redondeada"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "¿Qué es la conciencia fonológica?",
    options: [
      "La capacidad de leer rápidamente",
      "La capacidad de reconocer y manipular sonidos en el lenguaje",
      "La capacidad de hablar con claridad",
      "La capacidad de deletrear correctamente"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "¿Qué proceso implica que los sonidos se vuelvan más similares a los sonidos cercanos?",
    options: [
      "Inserción",
      "Asimilación",
      "Metátesis",
      "Eliminación"
    ],
    correct: 1
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
    setUser(JSON.parse(userData))
  }, [router])

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNext = () => {
    const answerIndex = parseInt(selectedAnswer)
    const newAnswers = [...userAnswers, answerIndex]
    setUserAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      // Calculate score and finish
      const correctAnswers = newAnswers.filter((answer, index) => answer === questions[index].correct).length
      setScore(correctAnswers)
      setShowResult(true)
      
      // Update user progress
      if (user) {
        const updatedUser = {
          ...user,
          progress: {
            ...user.progress,
            level1: Math.max(user.progress.level1, correctAnswers)
          }
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
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
                  Terminaste los Fundamentos Básicos.
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
                    {score >= 8 ? "¡Excelente trabajo! Estás listo para el Nivel 2." : 
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
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">Nivel 1: Fundamentos</h1>
              <span className="text-sm text-gray-600">
                Pregunta {currentQuestion + 1} of {questions.length}
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
