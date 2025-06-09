"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  })
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateEmail = (email: string) => {
    // Verificar que contenga @ y .com
    if (!email.includes("@")) {
      return "El correo debe contener @"
    }
    if (!email.includes(".com")) {
      return "El correo debe contener .com"
    }
    // Validación adicional de formato básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/
    if (!emailRegex.test(email)) {
      return "Formato de correo inválido (ejemplo: usuario@dominio.com)"
    }
    return ""
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validar email en tiempo real
    if (field === "email") {
      const emailValidation = validateEmail(value)
      setEmailError(emailValidation)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validar email antes de enviar
    const emailValidation = validateEmail(formData.email)
    if (emailValidation) {
      setEmailError(emailValidation)
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo-textura.png')" }}
    >
      <div className="w-full max-w-md">
        {/* Logo con animación */}
        <div className="text-center mb-8 opacity-0 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Volume2 className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
          </Link>
        </div>

        {/* Tarjeta de registro animada */}
        <Card className="opacity-0 animate-fade-in delay-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crea tu cuenta</CardTitle>
            <CardDescription>Únete a miles de estudiantes aprendiendo fonología</CardDescription>
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
                  placeholder="ejemplo@dominio.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={emailError ? "border-red-500 focus:border-red-500" : ""}
                  required
                />
                {emailError && <p className="text-sm text-red-600 animate-fade-in">{emailError}</p>}
                <p className="text-xs text-gray-500">Debe contener @ y terminar en .com</p>
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

              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full transition-transform duration-200 hover:scale-105 active:scale-95"
                disabled={isLoading || !!emailError}
              >
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
