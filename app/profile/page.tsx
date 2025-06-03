"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Volume2 } from 'lucide-react'
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

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    career: "",
    gender: ""
  })
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData({
      name: parsedUser.name,
      age: parsedUser.age,
      career: parsedUser.career,
      gender: parsedUser.gender
    })
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")

    try {
      if (!user) return

      const updatedUser = {
        ...user,
        ...formData
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setSuccess("Profile updated successfully!")
    } catch (err) {
      console.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">
              Update your personal information and preferences.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your account details and learning preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career">Career/Field of Study</Label>
                  <Select value={formData.career} onValueChange={(value) => handleInputChange("career", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="speech-pathology">Speech-Language Pathology</SelectItem>
                      <SelectItem value="audiology">Audiology</SelectItem>
                      <SelectItem value="linguistics">Linguistics</SelectItem>
                      <SelectItem value="communication-disorders">Communication Disorders</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Your current progress across all levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Level 1 - Foundation</span>
                  <span className="font-semibold">{user.progress.level1}/10 completed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Level 2 - Equipment Mastery</span>
                  <span className="font-semibold">{user.progress.level2}/8 completed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Level 3 - Clinical Application</span>
                  <span className="font-semibold">{user.progress.level3}/5 completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
