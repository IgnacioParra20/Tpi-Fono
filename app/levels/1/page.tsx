"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Volume2, ArrowLeft, CheckCircle } from 'lucide-react'

const questions = [
  {
    id: 1,
    question: "What is a phoneme?",
    options: [
      "A unit of sound that distinguishes meaning",
      "A written letter",
      "A syllable structure",
      "A type of vowel"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "Which of the following is an example of a minimal pair?",
    options: [
      "cat/bat",
      "dog/puppy",
      "run/running",
      "happy/sad"
    ],
    correct: 0
  },
  {
    id: 3,
    question: "What does IPA stand for?",
    options: [
      "International Phonetic Alphabet",
      "International Phonology Association",
      "Internal Phonetic Analysis",
      "International Pronunciation Academy"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "Which feature distinguishes voiced from voiceless consonants?",
    options: [
      "Vocal cord vibration",
      "Tongue position",
      "Lip rounding",
      "Airflow direction"
    ],
    correct: 0
  },
  {
    id: 5,
    question: "What is the difference between phonetics and phonology?",
    options: [
      "Phonetics studies sounds, phonology studies sound patterns",
      "They are the same thing",
      "Phonetics is theoretical, phonology is practical",
      "Phonetics studies vowels, phonology studies consonants"
    ],
    correct: 0
  },
  {
    id: 6,
    question: "Which of these is a place of articulation?",
    options: [
      "Alveolar",
      "Voiced",
      "Nasal",
      "High"
    ],
    correct: 0
  },
  {
    id: 7,
    question: "What is allophonic variation?",
    options: [
      "Different pronunciations of the same phoneme",
      "Different meanings of the same word",
      "Different spellings of the same sound",
      "Different languages using the same sound"
    ],
    correct: 0
  },
  {
    id: 8,
    question: "Which vowel feature refers to tongue height?",
    options: [
      "High/Mid/Low",
      "Front/Back",
      "Rounded/Unrounded",
      "Tense/Lax"
    ],
    correct: 0
  },
  {
    id: 9,
    question: "What is phonological awareness?",
    options: [
      "The ability to recognize and manipulate sounds in language",
      "The ability to read quickly",
      "The ability to spell correctly",
      "The ability to speak clearly"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "Which process involves sounds becoming more similar to nearby sounds?",
    options: [
      "Assimilation",
      "Deletion",
      "Insertion",
      "Metathesis"
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
    setUser(JSON.parse(userData))
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
        (answer, index) => answer === questions[index].correct
      ).length

      setScore(correctAnswers)
      setShowResult(true)

      // Actualizar progreso del usuario
      if (user) {
        try {
          const updatedProgress = {
            ...user.progress,
            level1: score, // Podés cambiarlo dinámicamente si querés
          }

          const res = await fetch("/api/users/updateProgress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              progress: updatedProgress,
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
    return <div>Loading...</div>
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
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">PhonologyLearn</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Level 1 Complete!</CardTitle>
                <CardDescription>
                  You've finished the Foundation Level
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {score}/10
                  </div>
                  <p className="text-gray-600">Questions Answered Correctly</p>
                </div>

                <Alert>
                  <AlertDescription>
                    {score >= 8 ? "Excellent work! You're ready for Level 2." : 
                     score >= 6 ? "Good job! Consider reviewing before moving to Level 2." :
                     "Keep practicing! Review the material and try again."}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    Try Again
                  </Button>
                  <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                  </Link>
                  {score >= 6 && (
                    <Link href="/levels/2">
                      <Button>Continue to Level 2</Button>
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
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">PhonologyLearn</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">Level 1: Foundation</h1>
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
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
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
