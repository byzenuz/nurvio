import { NextResponse } from 'next/server'
import { UMAH_API_BASE, UMAH_API_KEY } from '@/config/api'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    const response = await fetch(`${UMAH_API_BASE}/api/duas/category/${category}?apikey=${UMAH_API_KEY}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText)
      throw new Error(`Failed to fetch duas for category: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching category duas:', error)
    // Return empty data instead of error to prevent 500 errors
    return NextResponse.json(
      { 
        success: false, 
        data: [],
        error: 'Failed to fetch duas from API' 
      },
      { status: 200 }
    )
  }
}
