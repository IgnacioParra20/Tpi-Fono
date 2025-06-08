import { NextResponse } from "next/server"
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { userId, nuevoValor, nivel } = body

  // Log de los datos recibidos
  console.log("Datos recibidos:", body)

  if (!userId || nuevoValor === undefined || nuevoValor === null || !nivel) {
    console.error("Faltan campos:", { userId, nuevoValor, nivel })
    return NextResponse.json({ error: "Missing fields", received: { userId, nuevoValor, nivel } }, { status: 400 })
  }

  let error = null
  let res = null
  const valorInt = parseInt(nuevoValor, 10)
  try {
    switch (nivel) {
      case "lvl1":
        res = await supabase.from('Progresos').update({ lvl1: valorInt }).eq('usuario', String(userId))
        break
      case "lvl2":
        res = await supabase.from('Progresos').update({ lvl2: valorInt }).eq('usuario', String(userId))
        break
      case "lvl3":
        res = await supabase.from('Progresos').update({ lvl3: valorInt }).eq('usuario', String(userId))
        break
      default:
        console.error("Nivel inválido:", nivel)
        return NextResponse.json({ error: "Nivel inválido", nivel }, { status: 400 })
    }
    error = res.error
  } catch (e) {
    console.error("Excepción al actualizar progreso:", e)
    return NextResponse.json({ error: "Excepción en el servidor", details: e }, { status: 500 })
  }

  if (error) {
    console.error("Error de Supabase:", error, "Respuesta completa:", res)
    return NextResponse.json({ error: error.message, details: error, supabaseResponse: res }, { status: 500 })
  }

  if (!userId) {
    return NextResponse.json({ error: "No se encontró el usuario para actualizar" }, { status: 404 })
  }

  return NextResponse.json({ success: true, supabaseResponse: res })
}