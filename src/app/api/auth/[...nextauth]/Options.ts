import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/utils/dbConnect";
import User from "@/models/user";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                // console.log("AUTHORIZE STARTED");
                await dbConnect();
                try {

                    const identifier = credentials?.email || credentials?.username;
                    const password = credentials?.password;

                    if (!identifier || !password) {
                        throw new Error("Missing credentials");
                    }

                    const user = await User.findOne({
                        $or: [
                            { email: identifier.toLowerCase() },
                            { username: identifier.toLowerCase() },
                        ]
                    }).select("+password");

                    // console.log("USER FOUND:", user);
                    if (!user) throw new Error("User not found!");

                    // if (!user.isVerified) throw new Error("Please verify your email before logging in!");

                    const isPasswordCorrect = await user.comparePassword(credentials.password);
                    // console.log("PASSWORD OK:", isPasswordCorrect);
                    if (isPasswordCorrect) return user;

                    else throw new Error("Incorrect password!");
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }

                    throw new Error("Something went wrong");
                }
            }
        })
    ],
    pages: {
        // signIn: '/sign-in'

    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            // Dev-only logging
            if (process.env.NODE_ENV === "development") {
                // console.log("JWT HIT");
                // console.log("trigger:", trigger);
            }

            /*
              Initial login
              user exists only on sign-in
            */
            if (user) {
                token.id = user._id?.toString();
                token.username = user.username;
                token.email = user.email;
            }

            /*
              Session update trigger
              Runs after session.update()
            */
            if (trigger === "update") {
                try {
                    if (!token?.id) {
                        if (process.env.NODE_ENV === "development") {
                            console.warn("JWT update: missing token.id");
                        }
                        return token;
                    }

                    await dbConnect();

                    const dbUser = await User
                        .findById(token.id)
                        .select("username")
                        .lean();

                    if (!dbUser) {
                        if (process.env.NODE_ENV === "development") {
                            console.warn("JWT update: user not found");
                        }
                        return token;
                    }

                    /*
                      Sync token with database
                    */
                    token.username = dbUser.username ?? undefined;

                } catch (error) {
                    console.error("JWT update error:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            // console.log("SESSION CALLBACK");
            // console.log("session before:", session);
            // console.log("token:", token);

            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    username: token.username as string,
                    email: token.email as string
                };

            }
            // console.log("session after:", session);
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}