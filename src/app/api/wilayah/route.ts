import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") ?? "provinces";

  try {
    const res = await fetch(`https://wilayah.id/api/${path}.json`, {
      next: { revalidate: 86400 }, // cache 24 jam
    });
    if (!res.ok) return NextResponse.json({ data: [] }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
