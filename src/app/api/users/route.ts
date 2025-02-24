import { getAllUsers } from "@/services/userService";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() : Promise<NextResponse<User[] | {error: string}>> {
    try{
        const users = await getAllUsers();
        return NextResponse.json(users, {status: 200});
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'Failed to fetch users'}, {status: 500});
    }
}
