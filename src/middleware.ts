import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const isAdminRoute = pathname.startsWith("/admin");
    const isVerificationPendingPage = pathname === "/verificacion-pendiente";

    // Allow access to verification pending page
    if (isVerificationPendingPage) {
      return NextResponse.next();
    }

    // Check email verification for dashboard routes
    if (pathname.startsWith("/dashboard") && !token?.emailVerified) {
      return NextResponse.redirect(new URL("/verificacion-pendiente", req.url));
    }

    // Check admin access
    if (isAdminRoute) {
      if (token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Admins also need verified email
      if (!token?.emailVerified) {
        return NextResponse.redirect(new URL("/verificacion-pendiente", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/verificacion-pendiente"],
};
