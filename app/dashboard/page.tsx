"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, BookOpen, Settings, Stethoscope, Volume2 } from "lucide-react"
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
  const [devMode, setDevMode] = useState(false)
  const [keyPressCount, setKeyPressCount] = useState(0)
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = Date.now()
      if (e.key.toLowerCase() === '-') {
        if (currentTime - lastKeyPressTime < 1000) { // 1 segundo entre presiones
          setKeyPressCount(prev => {
            const newCount = prev + 1
            if (newCount === 4) {
              if (process.env.NODE_ENV === 'production') {
                console.warn(
                  '%c⚠️ ADVERTENCIA: Modo desarrollador detectado en producción ⚠️\n' +
                  'Este modo no debería estar disponible en el entorno de producción.\n' +
                  'Por favor, asegúrese de que esta funcionalidad esté deshabilitada antes de desplegar.',
                  'color: red; font-weight: bold; font-size: 14px;'
                )
              }
              setDevMode(true)
              return 0
            }
            return newCount
          })
        } else {
          setKeyPressCount(1)
        }
        setLastKeyPressTime(currentTime)
      }
    }

    // Solo agregar el listener en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [lastKeyPressTime])

  // Advertencia adicional al cargar el componente en producción
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '%c⚠️ ADVERTENCIA: Modo desarrollador detectado en producción ⚠️\n' +
        'Esta funcionalidad no debería estar disponible en el entorno de producción.\n' +
        'Por favor, revise el código fuente y asegúrese de que esta característica esté deshabilitada.',
        'color: red; font-weight: bold; font-size: 14px;'
      )
    }
  }, [])

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

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-700 font-semibold">Cargando...</p>
      </div>
    </div>
  )
}

if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5]">
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center space-y-4">
        <Volume2 className="h-10 w-10 text-red-500" />
        <p className="text-lg font-medium text-gray-800">No se encontró el usuario.</p>
        <Button onClick={() => router.push("/login")} variant="outline">
          Ir al inicio de sesión
        </Button>
      </div>
    </div>
  )
}


  const levels = [
    {
      id: 1,
      title: "Nivel Fundamentos",
      description: "Completa 10 preguntas fundamentales de fonología",
      icon: BookOpen,
      progress: devMode ? 10 : progreso?.lvl1 || 0,
      maxProgress: 10,
      color: "bg-green-500",
      href: "/levels/1",
    },
    {
      id: 2,
      title: "Dominio del Equipamiento",
      description: "Identifica las distintas partes de un audiómetro",
      icon: Stethoscope,
      progress: devMode ? 8 : progreso?.lvl2 || 0,
      maxProgress: 8,
      color: "bg-yellow-500",
      href: "/levels/2",
    },
    {
      id: 3,
      title: "Aplicación Clínica",
      description: "Modifica la audiometría para ajustarse a condiciones patológicas",
      icon: Activity,
      progress: devMode ? 5 : progreso?.lvl3 || 0,
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
<header>
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      
      {/* Cuadro blanco solo para Fono al Día */}
      <div className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center space-x-2">
        <Volume2 className="h-8 w-8 text-indigo-600" />
        <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
      </div>

<div className="flex items-center space-x-4">
  <Link href="/profile">
    <Button
      variant="outline"
      size="sm"
      className="transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-md"
    >
      <Settings className="h-4 w-4 mr-2" />
      Perfil
    </Button>
  </Link>

  <Button
    variant="outline"
    size="sm"
    onClick={handleLogout}
    className="transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-md"
  >
    Cerrar sesión
  </Button>
</div>
    </div>
  </div>
</header>

<main className="container mx-auto px-4 py-8">
  {/* Sección de bienvenida con cuadro blanco */}
  <div className="bg-white p-6 rounded-xl shadow-md mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      ¡Bienvenid{user.gender === "femenino" ? "a" : user.gender === "masculino" ? "o" : "o/a"}, {user.name}!
    </h1>
    <p className="text-gray-600">
      Continúa tu aprendizaje en fonología. Elige un nivel para comenzar.
    </p>
  </div>
    {/* Estadísticas del usuario */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
              ? ((progreso?.lvl2 || 0) === 8
                  ? "Nivel 3"
                  : "Nivel 2")
              : "Nivel 1"}
          </p>
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
              <Button
                className="w-full mt-2"
                disabled={isLocked}
                variant={isCompleted ? "outline" : "default"}
              >
                {isLocked ? "Completa el nivel anterior" : isCompleted ? "Revisar" : "Continuar"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  })}

  {/* Tarjeta del Simulador fuera del map */}
  <div className="md:col-span-3">
    <Card className="w-full bg-white p-6 rounded-xl shadow-md mt-4">
      <CardHeader>
        <CardTitle className="text-2xl">Simulador de Audiómetro</CardTitle>
        <CardDescription className="text-gray-600 justify-center">
          Accede al simulador interactivo para practicar la audiometría clínica.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/simulator">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base py-2">
            Ir al Simulador
          </Button>
        </Link>
      </CardContent>
    </Card>
  </div>
</div>
</main>
    </div>
  )
}
