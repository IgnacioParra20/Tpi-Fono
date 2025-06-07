
import { supabase } from '@/lib/supabase'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId, nuevoValor, nivel } = await req.json()
  
  if (!userId || !nuevoValor || !nivel) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  let error = null
  const valorInt = parseInt(nuevoValor, 10)
  switch (nivel) {
    case "lvl1": {
      const res = await supabase.from('Progresos').update({ lvl1: valorInt }).eq('usuario', String(userId))
      error = res.error
      break
    }
    case "lvl2": {
      const res = await supabase.from('Progresos').update({ lvl2: valorInt}).eq('usuario', userId)
      error = res.error
      break
    }
    case "lvl3": {
      const res = await supabase.from('Progresos').update({ lvl3: valorInt }).eq('usuario', userId)
      error = res.error
      break
    }
    default:
      return NextResponse.json({ error: "Nivel inválido" }, { status: 400 })
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!userId) {
    return NextResponse.json({ error: "No se encontró el usuario para actualizar" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}