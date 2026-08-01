import { NextResponse } from 'next/server'
import { UMAH_API_BASE, UMAH_API_KEY } from '@/config/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const response = await fetch(`${UMAH_API_BASE}/api/duas/random?apikey=${UMAH_API_KEY}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch random dua')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching random dua:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dua' },
      { status: 500 }
    )
  }
}
