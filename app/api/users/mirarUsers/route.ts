import { userDB } from '@/lib/userDB'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(userDB)
}