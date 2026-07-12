import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// API routes are guarded individually in their handlers (requireSession /
// requireAdmin from @/lib/apiAuth), since several of them are intentionally
// partly public (e.g. /api/survey/[id]/results for the public /researches
// page). Middleware only needs to gate the page-level admin/user areas.
export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ((path.startsWith("/admin") || path.startsWith("/user")) && !token) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"],
};
