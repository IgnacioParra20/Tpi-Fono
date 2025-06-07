import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  const { data: progreso, error } = await supabase
    .from('Progresos')
    .select('*')
    .eq('usuario', String(id))
    .single()
    console.log("progreso", id)
    if (error || !progreso) {
        return NextResponse.json({ error: 'Progreso no encontrado' }, { status: 404 })
    }

  return NextResponse.json({ progreso })
}
