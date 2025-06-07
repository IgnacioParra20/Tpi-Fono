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
    <header>
      <div className="container    mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
            <Link href="/dashboard">  
              <Button variant="outline" size="sm"
              className="text-base font-bold px-6 py-3 transition-transform duration-200 hover:scale-105 hover:shadow-md border-gray-300 text-gray-700">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al Panel
              </Button>
            </Link>
            <div className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center space-x-2">
              <Volume2 className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
          </div>
        </div>
      </div>  
    </header>

    {/* Sección Principal */}
    <main className="container mx-auto px-8 py-12">
      <div className="max-w-3xl mx-auto"> 
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

              <Button type="submit" className="w-full transition-transform duration-200 hover:scale-105 active:scale-95" disabled={isLoading}>
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