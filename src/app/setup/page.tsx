"use client";

import { useState, useEffect } from "react";
import { User, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UsernameSetupPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sanitize input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    setUsername(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      setError("Username is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      console.log("STEP 2 — fetch done");
      const data = await response.json();
      console.log("STEP 3 — response parsed", data);
      if (!response.ok) {
        console.log("STEP 4 — response not OK");
        setError(data?.message || "Failed to set username");
        return;
      }
      console.log("STEP 5 — before update");

      // Update session
      await update({
        username,
        isSetupComplete: true,
      });
      router.refresh();
      console.log("STEP 6 — after update");
      console.log("NAVIGATING...");
      router.replace("/dashboard");
      // // IMPORTANT: wait for session sync
      // await new Promise((resolve) => setTimeout(resolve, 300));

      // router.replace("/dashboard");
    } catch (err) {
      console.error("Username setup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.isSetupComplete) {
      console.log("Redirecting to dashboard...");
      router.replace("/dashboard");
    }
  }, [session, status, router]);
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left */}
      <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-between p-12">
        <h1 className="text-3xl font-semibold tracking-tight">YourApp</h1>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Choose your unique username.
          </h2>

          <p className="text-gray-300 mt-4 text-lg">
            This will be your public identity on the platform.
          </p>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Your Company
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Set your username
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Pick something simple and memorable
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <input
                  type="text"
                  value={username}
                  onChange={handleChange}
                  placeholder="yourname"
                  disabled={loading}
                  required
                  className="text-black w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:opacity-60"
                />

                {username.length > 0 && !error && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>

              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

              <p className="text-xs text-gray-500 mt-2">
                This will be used in your public profile URL.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            You can change this later from settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
