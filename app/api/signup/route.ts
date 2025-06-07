// app/api/signup/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, age, gender } = body

    if (!name || !email || !password || !age || !gender) {
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

    // Crear usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{ email, password, name, age, gender }])
      .select()
      .single();

    if (userError) {
      console.error("Error al crear usuario:", userError);
      return NextResponse.json({ error: "Error al crear usuario", details: userError.message }, { status: 500 });
    }
    if (!user || !user.id) {
      console.error("No se obtuvo el id del usuario creado:", user);
      return NextResponse.json({ error: "No se pudo obtener el id del usuario creado" }, { status: 500 });
    }
    
    // Crear progreso asociado
    return NextResponse.json({ success: true, message: "Usuario registrado", user: { ...user } });
  } catch (error) {

    console.error("Error al registrar usuario:", error)
    return NextResponse.json({
      error: "Error al registrar el usuario",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })

  }
}