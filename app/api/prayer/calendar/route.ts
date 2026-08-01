import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city') || 'Toshkent'
    const month = searchParams.get('month') || (new Date().getMonth() + 1).toString()
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    const url = `https://api.aladhan.com/v1/calendarByCity?city=${city}&country=Uzbekistan&method=2&month=${month}&year=${year}`

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
        error: 'Failed to fetch prayer calendar'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching prayer calendar:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
