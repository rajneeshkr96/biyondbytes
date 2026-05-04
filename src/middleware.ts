import authConfig from "@/backend/auth/auth.config"
import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server";
const { auth } = NextAuth(authConfig);



export default async function middleware(request: NextRequest) {
	const isAuthenticated = await auth()

  if (request.nextUrl.pathname.startsWith('/write/') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  } else if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/byAuthBtn', request.url))
  } else if (request.nextUrl.pathname.startsWith('/login') && !!isAuthenticated){
    return NextResponse.redirect(new URL('/', request.url))
  } else if (request.nextUrl.pathname.startsWith('/register') && !!isAuthenticated){
    return NextResponse.redirect(new URL('/', request.url))
  } else if (request.nextUrl.pathname.startsWith('/byAuthBtn') && !!isAuthenticated){
    return NextResponse.redirect(new URL('/', request.url))
  } else if (request.nextUrl.pathname.startsWith('/profile/' ) && !isAuthenticated){
    return NextResponse.redirect(new URL('/', request.url))
  } else if (request.nextUrl.pathname.startsWith('/me/') && !isAuthenticated){
    return NextResponse.redirect(new URL('/', request.url))
  } else {
    // Allow authenticated or unauthenticated users for other routes
    return NextResponse.next();
  }

}



export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}