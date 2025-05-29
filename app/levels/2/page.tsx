"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Volume2, ArrowLeft, CheckCircle, Stethoscope } from 'lucide-react'

const audiometerParts = [
  {
    id: 1,
    name: "Headphones",
    description: "Deliver sound stimuli to the patient's ears",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0 }
  },
  {
    id: 2,
    name: "Frequency Dial",
    description: "Controls the pitch/frequency of the test tone",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0}
  },
  {
    id: 3,
    name: "Intensity Control",
    description: "Adjusts the loudness level of the test tone",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0 }
  },
  {
    id: 4,
    name: "Patient Response Button",
    description: "Button pressed by patient when they hear the tone",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0 }
  },
  {
    id: 5,
    name: "Tone Presentation Button",
    description: "Audiologist uses this to present test tones",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0 }
  },
  {
    id: 6,
    name: "Audiogram Chart",
    description: "Visual display of hearing test results",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0 }
  },
  {
    id: 7,
    name: "Bone Conductor",
    description: "Tests bone conduction hearing pathway",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0 }
  },
  {
    id: 8,
    name: "Masking Control",
    description: "Provides masking noise to the non-test ear",
    image: "/placeholder.svg?height=200&width=200",
    correctPosition: { x: 0, y: 0 }
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
    const parsedUser = JSON.parse(userData)
    if (parsedUser.progress.level1 < 6) {
      router.push("/dashboard")
      return
    }
    setUser(parsedUser)
  }, [router])

  const handlePositionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSelectedPosition({ x, y })
  }

  const handleNext = () => {
    if (!selectedPosition) return

    const newAnswers = [...userAnswers, selectedPosition]
    setUserAnswers(newAnswers)

    if (currentPart < audiometerParts.length - 1) {
      setCurrentPart(currentPart + 1)
      setSelectedPosition(null)
    } else {
      // Calculate score and finish
      const correctAnswers = newAnswers.filter((answer, index) => {
        const correct = audiometerParts[index].correctPosition
        const distance = Math.sqrt(Math.pow(answer.x - correct.x, 2) + Math.pow(answer.y - correct.y, 2))
        return distance < 15 // Within 15% tolerance
      }).length
      
      setScore(8)
      setShowResult(true)
      
      // Update user progress
      if (user) {
        const updatedUser = {
          ...user,
          progress: {
            ...user.progress,
            level2: Math.max(user.progress.level2, 8)
          }
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
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
                <CardTitle className="text-2xl">Level 2 Complete!</CardTitle>
                <CardDescription>
                  You've finished the Equipment Mastery Level
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {score}/8
                  </div>
                  <p className="text-gray-600">Parts Correctly Identified</p>
                </div>

                <Alert>
                  <AlertDescription>
                    {score >= 6 ? "Excellent work! You're ready for Level 3." : 
                     score >= 4 ? "Good job! Consider reviewing before moving to Level 3." :
                     "Keep practicing! Review the equipment and try again."}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    Try Again
                  </Button>
                  <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                  </Link>
                  {score >= 4 && (
                    <Link href="/levels/3">
                      <Button>Continue to Level 3</Button>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold flex items-center">
                <Stethoscope className="h-6 w-6 mr-2" />
                Level 2: Equipment Mastery
              </h1>
              <span className="text-sm text-gray-600">
                Part {currentPart + 1} of {audiometerParts.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Identify: {part.name}
                  <Badge variant="outline">Click to Select</Badge>
                </CardTitle>
                <CardDescription>{part.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="relative bg-gray-100 rounded-lg cursor-crosshair border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors"
                  style={{ height: "400px" }}
                  onClick={handlePositionClick}
                >
                  {/* Audiometer diagram placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Stethoscope className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>Audiometer Diagram</p>
                      <p className="text-sm">Click where you think the {part.name} is located</p>
                    </div>
                  </div>
                  
                  {/* Show selected position */}
                  {selectedPosition && (
                    <div 
                      className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2 border-2 border-white shadow-lg"
                      style={{ 
                        left: `${selectedPosition.x}%`, 
                        top: `${selectedPosition.y}%` 
                      }}
                    />
                  )}
                </div>
                
                {selectedPosition && (
                  <Alert className="mt-4">
                    <AlertDescription>
                      Position selected! Click "Next" to continue or click elsewhere to change your selection.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Current Task:</h3>
                  <p className="text-gray-600">
                    Locate and click on the <strong>{part.name}</strong> in the audiometer diagram.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">About this component:</h3>
                  <p className="text-gray-600">{part.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How to answer:</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Study the audiometer diagram carefully</li>
                    <li>• Click on the location where you think the {part.name} is positioned</li>
                    <li>• A red dot will appear to show your selection</li>
                    <li>• Click "Next" to confirm and move to the next part</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      disabled={currentPart === 0}
                      onClick={() => setCurrentPart(currentPart - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNext}
                      disabled={!selectedPosition}
                    >
                      {currentPart === audiometerParts.length - 1 ? "Finish" : "Next"}
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
