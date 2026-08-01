import { NextResponse } from 'next/server'
import { UMAH_API_BASE, UMAH_API_KEY } from '@/config/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const response = await fetch(`${UMAH_API_BASE}/api/hadith/random?apikey=${UMAH_API_KEY}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText)
      throw new Error(`Failed to fetch random hadith: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching random hadith:', error)
    // Return empty data instead of error to prevent 500 errors
    return NextResponse.json(
      { 
        success: false, 
        data: null,
        error: 'Failed to fetch hadith from API' 
      },
      { status: 200 }
    )
  }
}
