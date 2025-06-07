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
  gender: string
  id: string
}
interface progresoData {
  lvl1: number
  lvl2: number
  lvl3: number
  usuario: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [progreso, setProgreso] = useState<progresoData | null>(null)
  
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      console.log("No se encontró el usuario en localStorage")
      router.push("/login")
      return
    }
    const  email  = JSON.parse(userData)
    // Buscar usuario en la base de datos
    fetch("/api/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)

          

        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false))
  }, [router])
  useEffect(() => {
    console.log("user", user)
    if (!user || !user.id) return; // Espera a que user esté cargado
  
    fetch("/api/getProgress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.progreso) {
          setProgreso(data.progreso)
        }
      });
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) return <div>Cargando...</div>
  if (!user) return <div>No se encontró el usuario.</div>

  const levels = [
  {
    id: 1,
    title: "Nivel Fundamentos",
    description: "Completa 10 preguntas fundamentales de fonología",
    icon: BookOpen,
    progress: progreso?.lvl1 || 0,
    maxProgress: 10,
    color: "bg-green-500",
    href: "/levels/1",
  },
  {
    id: 2,
    title: "Dominio del Equipamiento",
    description: "Identifica las distintas partes de un audiómetro",
    icon: Stethoscope,
    progress: progreso?.lvl2 || 0,
    maxProgress: 8,
    color: "bg-yellow-500",
    href: "/levels/2",
  },
  {
    id: 3,
    title: "Aplicación Clínica",
    description: "Modifica la audiometría para ajustarse a condiciones patológicas",
    icon: Activity,
    progress: progreso?.lvl3 || 0,
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
{/* Encabezado */}
<header className="bg-white shadow-sm">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Volume2 className="h-8 w-8 text-indigo-600" />
        <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/profile">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Perfil
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  </div>
</header>

<main className="container mx-auto px-4 py-8">
  {/* Sección de bienvenida */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido/a de nuevo, {user.name}!</h1>
    <p className="text-gray-600">Continúa tu aprendizaje en fonología. Elige un nivel para comenzar.</p>
  </div>

  {/* Estadísticas del usuario */}
  <div className="grid md:grid-cols-4 gap-4 mb-8">
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-600">Carrera</p>
            <p className="font-semibold">{user.career}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div>
          <p className="text-sm text-gray-600">Progreso total</p>
          <p className="font-semibold">
            {(progreso?.lvl1 || 0) + (progreso?.lvl2|| 0) + (progreso?.lvl3 || 0)}/23 Completado
          </p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div>
          <p className="text-sm text-gray-600">Nivel actual</p>
          <p className="font-semibold">
            {(progreso?.lvl1 || 0) === 10
              ? (progreso?.lvl2 || 0) === 8
                ? "Nivel 3"
                : "Nivel 2"
              : "Nivel 1"}
          </p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div>
          <p className="text-sm text-gray-600">Edad</p>
          <p className="font-semibold">{user.age} años</p>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Niveles de aprendizaje */}
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
                    <Badge variant={isCompleted ? "default" : "secondary"}>Nivel {level.id}</Badge>
                    {isCompleted && <Badge variant="outline">Completado</Badge>}
                    {isLocked && <Badge variant="destructive">Bloqueado</Badge>}
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
                  <span>Progreso</span>
                  <span>
                    {level.progress}/{level.maxProgress}
                  </span>
                </div>
                <Progress value={(level.progress / level.maxProgress) * 100} />
              </div>

              <Link href={isLocked ? "#" : level.href}>
                <Button className="w-full" disabled={isLocked} variant={isCompleted ? "outline" : "default"}>
                  {isLocked ? "Completa el nivel anterior" : isCompleted ? "Revisar" : "Continuar"}
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
