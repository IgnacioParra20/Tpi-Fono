// app/api/login/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle() // <--- Aquí el cambio

    if (error || !data) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (data.password !== password) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        career: data.career,
        progress: data.progress || {},
      },
    })
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
