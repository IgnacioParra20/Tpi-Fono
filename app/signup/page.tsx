"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2 } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    career: "",
    gender: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          career: formData.career,
          gender: formData.gender,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Registration failed")
        return
      }

      router.push("/login")
    } catch (err) {
      setError("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <div
    className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-100/80 to-indigo-200/80 bg-cover bg-center"
    style={{ backgroundImage: "url('/fondo-textura.png')" }}
  >
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-2">
          <Volume2 className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
        </Link>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crea tu cuenta</CardTitle>
          <CardDescription>
            Únete a miles de estudiantes aprendiendo fonología
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crea una contraseña"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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
              <Select onValueChange={(value) => handleInputChange("career", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speech-pathology">Fonoaudiología</SelectItem>
                  <SelectItem value="audiology">Audiología</SelectItem>
                  <SelectItem value="linguistics">Lingüística</SelectItem>
                  <SelectItem value="communication-disorders">Trastornos de la comunicación</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select onValueChange={(value) => handleInputChange("gender", value)}>
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

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)
}