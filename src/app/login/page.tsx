"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = userInfo;
      if (!email || !password) {
        alert("Please fill in all fields.");
        return;
      }
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (response?.error) {
        alert(response.error);
      } else {
        // alert("Login successful!");
        router.refresh();
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Branding / Visual */}
      <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-between p-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">YourApp</h1>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Build something people rely on.
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Secure access to your dashboard. Fast. Reliable. No friction.
          </p>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Your Company
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  onChange={handleChange}
                  name="email"
                  value={userInfo.email}
                  className="text-black w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-gray-500 hover:text-black">
                  Forgot?
                </a>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  name="password"
                  value={userInfo.password}
                  className="text-black w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="h-4 w-4" />
              Keep me signed in
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition"
            >
              Continue
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{" "}
            <a href="#" className="font-medium text-black hover:underline">
              Create an account
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
