import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Secret token to validate the webhook (set this in Netlify env vars)
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET

export async function POST(request: NextRequest) {
  try {
    // Check for secret to confirm this is a valid request
    const secret = request.nextUrl.searchParams.get('secret')
    
    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Parse the Sanity webhook payload
    const body = await request.json()
    
    // The webhook sends the document type and slug
    const { _type, slug } = body
    
    console.log(`Revalidating: type=${_type}, slug=${slug?.current || slug}`)

    // Revalidate specific paths based on content type
    if (_type === 'post') {
      // Revalidate the specific article page
      if (slug?.current || slug) {
        revalidatePath(`/${slug?.current || slug}`)
      }
      // Also revalidate the home page (article list)
      revalidatePath('/')
    } else if (_type === 'section') {
      // Sections affect navigation, revalidate everything
      revalidatePath('/', 'layout')
    }

    // Revalidate all content tagged with 'content'
    revalidateTag('content')

    return NextResponse.json({ 
      revalidated: true, 
      message: `Revalidated ${_type}`,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}

// Also allow GET for testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }
  
  // Revalidate everything
  revalidatePath('/', 'layout')
  revalidateTag('content')
  
  return NextResponse.json({ 
    revalidated: true, 
    message: 'Full site revalidated',
    timestamp: new Date().toISOString()
  })
}
