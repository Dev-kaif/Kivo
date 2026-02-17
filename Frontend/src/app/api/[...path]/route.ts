import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL + "/api";

async function handler(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;

    const url = `${BACKEND}/${path.join("/")}`;

    const response = await fetch(url, {
        method: req.method,
        headers: {
            "Content-Type": req.headers.get("content-type") || "application/json",
            Cookie: req.headers.get("cookie") || "",
        },
        body: req.method !== "GET" ? await req.text() : undefined,
    });

    const data = await response.text();

    const res = new NextResponse(data, {
        status: response.status,
    });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
        res.headers.set("set-cookie", setCookie);
    }

    return res;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
