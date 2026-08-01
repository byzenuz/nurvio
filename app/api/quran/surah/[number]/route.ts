import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number } = await params
    const searchParams = request.nextUrl.searchParams
    const editions = searchParams.get('editions') || 'quran-uthmani,quran-uzbek'

    const url = `https://api.alquran.cloud/v1/surah/${number}/editions/${editions}`

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
        error: 'Failed to fetch surah'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching surah:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
