import User from "@/models/user";
import { dbConnect } from "@/utils/dbConnect";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    console.log("register route hit!");

    try {
        //database connection
        await dbConnect();


        //information destructuring
        const body = await req.json();

        let { name, username, email, password } = body;
        console.log(name, email, username, password);

        //validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing credentials!" },
                { status: 401 }
            );
        }

        // username = username?.trim();
        email = email?.trim().toLowerCase();
        password = password?.trim();

        // const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        // if (!usernameRegex.test(username)) {
        //     return NextResponse.json(
        //         {
        //             error:
        //                 "Username must be 3-20 characters and contain only letters, numbers, or underscore",
        //         },
        //         { status: 400 }
        //     );
        // }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }


        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already registered" },
                { status: 409 }
            );
        }

        //user-creation
        const newUser = await User.create({
            name,
            username: null,
            email,
            password,
        });

        //success-response
        return NextResponse.json(
            {
                message: "User created successfully",
                userId: newUser._id,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );

    }

}