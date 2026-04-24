import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
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