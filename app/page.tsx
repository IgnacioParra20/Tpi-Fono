import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BookOpen, Users, Volume2 } from 'lucide-react'
import Link from "next/link"

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-100/80 to-indigo-200/80 bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo-textura.png')" }}
    >
      <header className="container mx-auto px-4 py-6">
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-2 w-fit opacity-0 animate-fade-in">
            <Volume2 className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Fono al Día</span>
          </div>

          {/* Botones responsivos */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 opacity-0 animate-fade-in delay-100">
            <Link href="/login">
              <Button
                variant="outline"
                className="transition-transform duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                className="transition-transform duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Empieza Hoy
              </Button>
            </Link>
          </div>
        </nav>
      </header>


      {/* Sección Principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center mb-16 transition-all duration-700 ease-out opacity-0 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Domina la Fonoaudiología con Aprendizaje Interactivo
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Mejora tus habilidades en Audiología y Fonoaudiología a través de niveles progresivos: desde conceptos básicos hasta análisis avanzados de audiometría. 
            Ideal para estudiantes de la carrera.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-3 transition-transform duration-200 hover:scale-105 active:scale-95">
              Comienza a Aprender Hoy
            </Button>
          </Link>
        </div>

        {/* Cuadrícula de Características */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 transition-all duration-700 ease-out opacity-0 animate-fade-in delay-200">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Aprendizaje Progresivo</CardTitle>
              <CardDescription>
                Tres niveles diseñados para avanzar gradualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comienza con preguntas fundamentales, continúa con identificación de audiómetro, 
                y domina modificaciones de audiometría orientadas a patologías.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Experiencia Personalizada</CardTitle>
              <CardDescription>
                Personaliza tu perfil y sigue tu progreso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Configura tu perfil académico y monitorea tu avance 
                a través de cada nivel de dificultad.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Habilidades Prácticas</CardTitle>
              <CardDescription>
                Aplicaciones reales y práctica guiada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Aprende con ejercicios interactivos que simulan 
                escenarios clínicos reales y requisitos profesionales.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Niveles de Aprendizaje */}
        <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-700 ease-out opacity-0 animate-fade-in delay-300">
          <h2 className="text-3xl font-bold text-center mb-8">Niveles de Aprendizaje</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Nivel Fundamentos</h3>
              <p className="text-gray-600">
                Completa 10 preguntas fundamentales de fonología para construir una base sólida
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-yellow-100 text-yellow-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Dominio del Equipamiento</h3>
              <p className="text-gray-600">
                Identifica y comprende las distintas partes del equipo audiométrico
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-red-100 text-red-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Aplicación Clínica</h3>
              <p className="text-gray-600">
                Modifica resultados de audiometría según condiciones patológicas específicas
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Fono al Día. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
