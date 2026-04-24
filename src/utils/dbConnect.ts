import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URL;


declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
        | undefined;
}

if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined in environment variables");
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = {
        conn: null,
        promise: null,
    }
}

export const dbConnect = async () => {
    if (cached!.conn) {
        return cached.conn;
    }
    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGO_URL, opts);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}