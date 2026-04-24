import User from "@/models/user";
import { dbConnect } from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export async function POST(req: NextRequest) {

    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        await dbConnect();

        const { username } = await req.json();
        const email = token.email;
        // 1 — Required checks
        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        // 2 — Username format validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                {
                    error:
                        "Username must be 3-20 characters and contain only letters, numbers, or underscore",
                },
                { status: 400 }
            );
        }

        // 3 — Check if username already taken
        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        // 4 — Find user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 5 — Prevent overwriting existing username
        if (user.username) {
            return NextResponse.json(
                { error: "Username already set" },
                { status: 400 }
            );
        }

        // 6 — Save username (triggers hooks if needed)
        user.username = username;

        await user.save();

        return NextResponse.json(
            {
                message: "Username set successfully",
                user: {
                    id: user._id,
                    username: user.username,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}