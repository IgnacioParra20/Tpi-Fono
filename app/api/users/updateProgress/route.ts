import { NextResponse } from "next/server"
import { updateUserProgress } from "@/lib/userDB"

export async function POST(req: Request) {
  const { email, progress } = await req.json()

  if (!email || !progress) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  updateUserProgress(email, progress)
  return NextResponse.json({ success: true })
}