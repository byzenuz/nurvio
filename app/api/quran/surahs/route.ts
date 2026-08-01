import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah')
    const data = await response.json()

    if (data.code === 200) {
      return NextResponse.json({
        success: true,
        data: data.data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch surahs'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching surahs:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
