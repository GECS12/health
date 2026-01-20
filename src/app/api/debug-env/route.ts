import { NextResponse } from 'next/server'

export async function GET() {
  const hasWriteToken = !!process.env.SANITY_API_WRITE_TOKEN
  const hasReadToken = !!process.env.SANITY_API_READ_TOKEN
  const hasToken = !!process.env.SANITY_API_TOKEN
  
  // Only show first/last 4 characters for security
  const maskToken = (token: string | undefined) => {
    if (!token) return 'NOT SET'
    if (token.length < 10) return 'INVALID (too short)'
    return `${token.slice(0, 4)}...${token.slice(-4)}`
  }

  return NextResponse.json({
    env_check: {
      SANITY_API_WRITE_TOKEN: hasWriteToken ? maskToken(process.env.SANITY_API_WRITE_TOKEN) : 'NOT SET',
      SANITY_API_READ_TOKEN: hasReadToken ? maskToken(process.env.SANITY_API_READ_TOKEN) : 'NOT SET',
      SANITY_API_TOKEN: hasToken ? maskToken(process.env.SANITY_API_TOKEN) : 'NOT SET',
    },
    node_env: process.env.NODE_ENV,
    message: hasWriteToken || hasReadToken ? 'Token(s) found!' : 'WARNING: No Sanity tokens found!'
  })
}
