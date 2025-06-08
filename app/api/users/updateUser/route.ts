import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, password, age, gender } = body

    // Validar que todos los campos estén presentes
    if (!id || !name || !email || !password || !age || !gender) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Actualizar usuario en la base de datos
    const { data, error } = await supabase
      .from('users')
      .update({ name, email, password, age, gender })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'Usuario no encontrado o no actualizado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (err) {
    return NextResponse.json({ error: 'Error inesperado en el servidor' }, { status: 500 })
  }
}
