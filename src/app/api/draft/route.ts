import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { client } from '@/lib/sanity'

const clientWithToken = client.withConfig({ 
  token: process.env.SANITY_API_WRITE_TOKEN 
})

export async function GET(request: Request) {
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    clientWithToken, 
    request.url
  )

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(redirectTo)
}
