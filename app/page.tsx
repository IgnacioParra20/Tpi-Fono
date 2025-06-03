import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Volume2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">PhonologyLearn</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Phonology with Interactive Learning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advance your phonology skills through progressive levels - from basic concepts to complex audiometry analysis. 
            Perfect for students pursuing careers in speech-language pathology and audiology.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Learning Today
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Progressive Learning</CardTitle>
              <CardDescription>
                Three carefully designed levels that build upon each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Start with fundamental questions, progress to audiometer identification, 
                and master pathology-specific audiometry modifications.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Personalized Experience</CardTitle>
              <CardDescription>
                Customize your profile and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Set up your profile with your academic background and track 
                your advancement through each difficulty level.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Practical Skills</CardTitle>
              <CardDescription>
                Real-world applications and hands-on practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Learn through interactive exercises that mirror real clinical 
                scenarios and professional practice requirements.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Levels */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Learning Levels</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Foundation Level</h3>
              <p className="text-gray-600">
                Complete 10 fundamental phonology questions to build your knowledge base
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-yellow-100 text-yellow-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipment Mastery</h3>
              <p className="text-gray-600">
                Identify and understand different parts of audiometric equipment
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-red-100 text-red-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Clinical Application</h3>
              <p className="text-gray-600">
                Modify audiometry results to match specific pathological conditions
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 PhonologyLearn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
