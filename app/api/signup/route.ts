import { NextResponse } from 'next/server'
import { userDB } from '@/lib/userDB'

export async function POST(request: Request) {
  const newUser = await request.json()
  const exists = userDB.find(user => user.email === newUser.email)

  if (exists) {
    return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 })
  }

  userDB.push(newUser)
  console.log("Usuarios actuales:", userDB)
  return NextResponse.json({ success: true, message: "User registered" })
}