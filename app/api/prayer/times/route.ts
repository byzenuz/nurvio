import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city') || 'Toshkent'
    const date = searchParams.get('date')

    const url = date
      ? `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=Uzbekistan&method=2`
      : `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uzbekistan&method=2`

    const response = await fetch(url)
    const data = await response.json()

    if (data.code === 200) {
      return NextResponse.json({
        success: true,
        data: data.data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch prayer times'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
