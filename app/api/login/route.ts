import { NextRequest, NextResponse } from 'next/server'
import { userDB } from '@/lib/userDB'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = userDB.find(u => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  console.log("Usuarios actuales:", userDB)
  return NextResponse.json({ success: true, user })
}