import { NextRequest, NextResponse } from "next/server";

interface ArticleGetProps{params:{id:string}}
export async function GET(_req: NextRequest, {params}:ArticleGetProps) {
    const {id} = params;
    return NextResponse.json({ message: `Get article ${id}` }, {status:200})
}