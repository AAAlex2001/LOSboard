import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === "/" && !searchParams.get("urgent")) {
    const cat = searchParams.get("cat");
    if (cat) {
      const sub = searchParams.get("sub");
      const target = sub
        ? `/category/${cat}/${sub}`
        : `/category/${cat}`;
      return NextResponse.redirect(new URL(target, req.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
