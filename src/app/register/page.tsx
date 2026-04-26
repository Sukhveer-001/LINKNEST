"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
// Matching Register Page — consistent with Login design system
export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { name, email, password } = formData;
      // Basic validation
      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }
      console.log("Sending register request...");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    if (!response.ok) {
  let errorMessage = "Registration failed";

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch (err) {
    // response was not JSON
  }

  alert(errorMessage);
  return;
}
      // alert("Registration successful! You can now sign in.");
      router.refresh();
      router.push('/login');
    } catch (error) {
      console.error("Registration error:", error);
        alert("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Branding */}
      <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-between p-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">YourApp</h1>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Create your account and get started.
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Join the platform and manage everything from one secure place.
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
            <h2 className="text-2xl font-semibold text-gray-900">
              Create account
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Fill in your details to get started
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  onChange={handleChange}
                  name="name"
                  value={formData.name}
                  className="text-black w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>

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
                  value={formData.email}
                  className="text-black w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  onChange={handleChange}
                  name="password"
                  value={formData.password}
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

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 mt-1" />
              <span>
                I agree to the{" "}
                <a href="#" className="text-black underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-black underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="font-medium text-black hover:underline"
            >
              Sign in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
