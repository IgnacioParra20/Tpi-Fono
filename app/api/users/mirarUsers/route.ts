import { NextResponse } from 'next/server'
import { userDB } from '@/lib/userDB'

export async function GET() {
  return NextResponse.json(userDB)
}