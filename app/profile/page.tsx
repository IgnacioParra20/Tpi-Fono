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
    gender: ""
  })
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Mapeo de traducción
  const careerMap: Record<string, string> = {
    "speech-pathology": "Fonoaudiología",
    "audiology": "Audiología",
    "linguistics": "Lingüística",
    "communication-disorders": "Trastornos de la comunicación",
    "other": "Otro"
  }

  const genderMap: Record<string, string> = {
    "female": "Femenino",
    "male": "Masculino",
    "non-binary": "No binario",
    "prefer-not-to-say": "Prefiero no decirlo"
  }

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const email  = JSON.parse(userData)
    fetch("/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setFormData({
            name: data.user.name,
            age: data.user.age,
            gender: data.user.gender
          })
        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
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
      setSuccess("¡Perfil actualizado correctamente!")
    } catch (err) {
      console.error("Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Cargando...</div>
  }

 return (
  <div
    className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-100/80 to-indigo-200/80 bg-cover bg-center"
    style={{ backgroundImage: "url('/fondo-textura.png')" }}
  >
    {/* Encabezado */}
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
      </div>
    </header>

    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Perfil</h1>
          <p className="text-gray-600">
            Actualiza tu información personal y preferencias.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Administra los detalles de tu cuenta y preferencias de aprendizaje.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">El correo no se puede modificar</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ingresa tu edad"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="career">Carrera / Campo de estudio</Label>
                <Select value={formData.career} onValueChange={(value) => handleInputChange("career", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu campo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fonoaudiologo">Fonoaudiología</SelectItem>
                    <SelectItem value="Audiologo">Audiología</SelectItem>
                    <SelectItem value="Linguista">Lingüística</SelectItem>
                    <SelectItem value="Persona con transtorno de comunicación">Trastornos de la comunicación</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="non-binary">No binario</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefiero no decirlo</SelectItem>
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
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
)
}