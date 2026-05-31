import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('sanity-preview-secret')
  const redirectTo = searchParams.get('sanity-preview-pathname') ?? '/'

  if (!secret) {
    return new Response('Missing preview secret', { status: 401 })
  }

  draftMode().enable()
  redirect(redirectTo)
}
