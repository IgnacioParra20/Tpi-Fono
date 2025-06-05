
// app/api/signup/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, age, career, gender } = body

    if (!name || !email || !password || !age || !career || !gender) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Verificar si ya existe el usuario
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 })
    }

    // Crear el nuevo usuario
    const { data, error } = await supabase.from('users').insert([
      {
        name,
        email,
        password,
        age: parseInt(age),
        career,
        gender,
        progress: { level1: 0, level2: 0, level3: 0 },
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true, message: "Usuario registrado", user: data })
  } catch (error) {
  console.error("Error al registrar usuario:", error) 
  return NextResponse.json({ error: "Error al registrar el usuario" }, { status: 500 })

  }
}
