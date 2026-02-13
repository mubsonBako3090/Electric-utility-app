export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/doctor/:path*",
    "/receptionist/:path*",
    "/patient/:path*",
    "/api/:path*",
  ]
}
