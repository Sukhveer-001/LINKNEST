"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------
  // Loading Skeleton
  // -------------------------

  if (status === "loading") {
    return (
      <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />

          <div className="flex gap-3 items-center">
            <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  // Get initials safely
  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-gray-900 hover:opacity-80 transition"
        >
          LinkNest
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                className="
                  px-4 py-2
                  text-sm font-medium
                  text-gray-700
                  rounded-lg
                  hover:bg-gray-100
                  transition
                "
              >
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="
                    h-10 w-10
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-purple-600
                    text-white
                    font-semibold
                    flex items-center justify-center
                    shadow-md
                    hover:shadow-lg
                    active:scale-95
                    transition-all
                  "
                >
                  {initials}
                </button>

                {open && (
                  <div
                    className="
                      absolute
                      right-0
                      mt-3
                      w-48
                      bg-white
                      border
                      border-gray-200
                      rounded-xl
                      shadow-lg
                      overflow-hidden
                      animate-in
                      fade-in
                      zoom-in-95
                    "
                  >
                    <Link
                      href={`/profile/${session.user?.username || ""}`}
                      className="
                        block
                        px-4
                        py-2
                        text-sm
                        text-gray-700
                        hover:bg-gray-100
                        transition
                      "
                    >
                      View Profile
                    </Link>

                    <button
                      onClick={() =>
                        signOut({
                          callbackUrl: "/login",
                        })
                      }
                      className="
                        w-full
                        text-left
                        px-4
                        py-2
                        text-sm
                        text-red-600
                        hover:bg-red-50
                        transition
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="
                  px-4 py-2
                  text-sm font-medium
                  text-gray-700
                  rounded-lg
                  hover:bg-gray-100
                  transition
                "
              >
                Login
              </Link>

              <Link
                href="/register"
                className="
                  px-4 py-2
                  text-sm font-medium
                  text-white
                  rounded-lg
                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-600
                  hover:from-indigo-600
                  hover:to-purple-700
                  shadow-md
                  hover:shadow-lg
                  active:scale-95
                  transition-all
                "
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
