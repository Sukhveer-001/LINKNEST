import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      isSetupComplete?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    email: string;
  }
}

interface Link {
  _id: string;
  title: string;
  url: string;
  icon?: string;
}

interface Profile {
  name: string;
  username: string;
  links: Link[];
}

export interface IUser extends Document {
    name: string;
    username?: string | null;
    email: string;
    password: string;

    bio?: string;

    createdAt: Date;
    updatedAt: Date;

    isSetupComplete: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ILink extends Document {
    userId: Types.ObjectId;
    title: string;
    url: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
