import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const isAdmin =
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/api/admin')

  if (!isAdmin) return NextResponse.next()

  const auth = req.headers.get('authorization') ?? ''
  const [type, encoded] = auth.split(' ')

  if (type === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString()
    const password = decoded.split(':').slice(1).join(':')
    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Zugang verweigert', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Skipper Admin"' },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
