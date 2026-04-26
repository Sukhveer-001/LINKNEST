import Link from "@/models/link";
import User from "@/models/user";
import { dbConnect } from "@/utils/dbConnect";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token?.id) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        await dbConnect();

        const links = await Link.find({
            userId: token.id
        });
        const user = await User.findById(token.id).select("name username");;

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        
        const { name, username } = user;
        return NextResponse.json({

            links,
            name,
            username
        });

    } catch (error) {
        console.error("GET LINKS ERROR:", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}