import {NextRequest, NextResponse} from 'next/server'
import {writeClient} from '@/lib/sanityWriteClient'
import {sendSubmissionNotificationEmail} from '@/lib/email'

type SubmitPayload = {
  // Honeypot: real visitors never fill this (it's visually hidden). Any
  // value here means a bot filled every field on the page, so we quietly
  // pretend to succeed instead of writing anything or tipping the bot off.
  company?: string
  name?: string
  email?: string
  phone?: string
  services?: string[]
  propertyType?: string
  postcode?: string
  houseNumber?: string
  address?: string
  location?: string
  timeline?: string
  budget?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: NextRequest) {
  let payload: SubmitPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid JSON'}, {status: 400})
  }

  // Honeypot tripped: respond as if everything is fine, write nothing.
  if (cleanString(payload.company)) {
    return NextResponse.json({ok: true}, {status: 201})
  }

  const name = cleanString(payload.name)
  const email = cleanString(payload.email)
  const phone = cleanString(payload.phone)
  const services = Array.isArray(payload.services) ? payload.services.filter((s) => typeof s === 'string' && s.trim()) : []
  const propertyType = cleanString(payload.propertyType)
  const timeline = cleanString(payload.timeline)
  const budget = cleanString(payload.budget)

  const missing: string[] = []
  if (!name) missing.push('name')
  if (!email || !EMAIL_RE.test(email)) missing.push('email')
  if (!phone) missing.push('phone')
  if (!services.length) missing.push('services')
  if (!propertyType) missing.push('propertyType')
  if (!timeline) missing.push('timeline')
  if (!budget) missing.push('budget')

  if (missing.length) {
    return NextResponse.json({error: 'Missing or invalid fields', fields: missing}, {status: 400})
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({error: 'Write token not configured'}, {status: 500})
  }

  const postcode = cleanString(payload.postcode)
  const houseNumber = cleanString(payload.houseNumber)
  const address = cleanString(payload.address)
  const location = cleanString(payload.location)
  const message = cleanString(payload.message)
  const submittedAt = new Date().toISOString()

  try {
    await writeClient.create({
      _type: 'iamexpatSubmission',
      name,
      email,
      phone,
      services,
      propertyType,
      postcode,
      houseNumber,
      address,
      location,
      timeline,
      budget,
      message,
      source: 'iamexpat',
      submittedAt,
    })
  } catch (err) {
    console.error('iamexpatSubmission create failed:', err)
    return NextResponse.json({error: 'Failed to save submission'}, {status: 500})
  }

  // Notify admin by email. The submission is already saved, so a failure
  // here must not turn into an error response for the visitor.
  try {
    await sendSubmissionNotificationEmail({
      formTitle: 'IamExpat Campaign Funnel',
      submittedAt,
      entries: [
        {fieldKey: 'name', label: 'Name', value: name},
        {fieldKey: 'email', label: 'Email', value: email},
        {fieldKey: 'phone', label: 'Phone', value: phone},
        {fieldKey: 'services', label: 'Services', value: services.join(', ')},
        {fieldKey: 'propertyType', label: 'Property type', value: propertyType},
        {fieldKey: 'address', label: 'Address', value: address || `${postcode} ${houseNumber}`.trim()},
        {fieldKey: 'location', label: 'City', value: location},
        {fieldKey: 'timeline', label: 'Timeline', value: timeline},
        {fieldKey: 'budget', label: 'Budget', value: budget},
        {fieldKey: 'message', label: 'Message', value: message},
      ],
    })
  } catch (err) {
    console.error('IamExpat admin notification email failed:', err)
  }

  return NextResponse.json({ok: true}, {status: 201})
}
