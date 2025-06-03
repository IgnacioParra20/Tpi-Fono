"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, BookOpen, Settings, Stethoscope, User, Volume2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserData {
  name: string
  email: string
  age: string
  career: string
  gender: string
  progress: {
    level1: number
    level2: number
    level3: number
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)

      // Ensure progress object exists with default values
      if (!parsedUser.progress) {
        parsedUser.progress = { level1: 0, level2: 0, level3: 0 }
        localStorage.setItem("user", JSON.stringify(parsedUser))
      }

      setUser(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      localStorage.removeItem("user")
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const levels = [
    {
      id: 1,
      title: "Foundation Level",
      description: "Complete 10 fundamental phonology questions",
      icon: BookOpen,
      progress: user.progress?.level1 || 0,
      maxProgress: 10,
      color: "bg-green-500",
      href: "/levels/1",
    },
    {
      id: 2,
      title: "Equipment Mastery",
      description: "Identify different parts of an audiometer",
      icon: Stethoscope,
      progress: user.progress?.level2 || 0,
      maxProgress: 8,
      color: "bg-yellow-500",
      href: "/levels/2",
    },
    {
      id: 3,
      title: "Clinical Application",
      description: "Modify audiometry to match pathological conditions",
      icon: Activity,
      progress: user.progress?.level3 || 0,
      maxProgress: 5,
      color: "bg-red-500",
      href: "/levels/3",
    },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-100/80 to-indigo-200/80 bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo-textura.png')" }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">PhonologyLearn</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Continue your phonology learning journey. Choose a level to get started.</p>
        </div>

        {/* User Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Career</p>
                  <p className="font-semibold">{user.career}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-gray-600">Total Progress</p>
                <p className="font-semibold">
                  {(user.progress?.level1 || 0) + (user.progress?.level2 || 0) + (user.progress?.level3 || 0)}/23
                  Completed
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-gray-600">Current Level</p>
                <p className="font-semibold">
                  {(user.progress?.level1 || 0) === 10
                    ? (user.progress?.level2 || 0) === 8
                      ? "Level 3"
                      : "Level 2"
                    : "Level 1"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold">{user.age} years old</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Levels */}
        <div className="grid md:grid-cols-3 gap-6">
          {levels.map((level) => {
            const Icon = level.icon
            const isLocked = level.id > 1 && levels[level.id - 2].progress < levels[level.id - 2].maxProgress
            const isCompleted = level.progress >= level.maxProgress

            return (
              <Card key={level.id} className={`relative ${isLocked ? "opacity-50" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${level.color} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{level.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={isCompleted ? "default" : "secondary"}>Level {level.id}</Badge>
                          {isCompleted && <Badge variant="outline">Completed</Badge>}
                          {isLocked && <Badge variant="destructive">Locked</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>
                          {level.progress}/{level.maxProgress}
                        </span>
                      </div>
                      <Progress value={(level.progress / level.maxProgress) * 100} />
                    </div>

                    <Link href={isLocked ? "#" : level.href}>
                      <Button className="w-full" disabled={isLocked} variant={isCompleted ? "outline" : "default"}>
                        {isLocked ? "Complete Previous Level" : isCompleted ? "Review" : "Continue"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
