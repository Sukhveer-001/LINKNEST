import Link from "@/models/link";
import { dbConnect } from "@/utils/dbConnect";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        await dbConnect();
        const userId = token.id;
        const { title, url } = await req.json();
        if (!title || !url) return NextResponse.json({ message: "Fields required" }, { status: 400 });
        const lastLink = await Link
            .findOne({ userId })
            .sort({ order: -1 });
        const order =
            lastLink
                ? lastLink.order + 1
                : 1;
        const link = await Link.create({
            userId,
            title,
            url,
            order,
        })
        return NextResponse.json({ message: "success", link }, {
            status: 201
        })
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }

}

export async function GET(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        await dbConnect();
        const userId = token.id;
        const links = await Link
            .find({ userId })
            .sort({ order: 1 });
        return NextResponse.json({ message: "success", links }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }

}

export async function DELETE(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        await dbConnect();
        const userId = token.id;
        const { id } = await req.json();
        if (!id) return NextResponse.json({ message: "Link ID required" }, { status: 400 });
        const link = await Link.findOneAndDelete({ _id: id, userId });
        if (!link) return NextResponse.json({ message: "Link not found" }, { status: 404 });
        return NextResponse.json({ message: "success" }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }

}

export async function PUT(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        await dbConnect();
        const userId = token.id;
        const { id, title, url } = await req.json();
        if (!id || !title || !url) return NextResponse.json({ message: "Fields required" }, { status: 400 });
        const link = await Link.findOneAndUpdate(
            { _id: id, userId },
            { title, url },
            { new: true }
        );
        if (!link) return NextResponse.json({ message: "Link not found" }, { status: 404 });
        return NextResponse.json({ message: "success", link }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }

}

