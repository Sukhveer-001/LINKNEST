"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleStart = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
     

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-bold mb-6">
          One Link. Infinite Presence.
        </h1>

        <p className="text-lg text-white/70 max-w-xl mb-8">
          Build your personal link hub. Share everything from one place.
        </p>

        <button
          onClick={handleStart}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium"
        >
          Get Started
        </button>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Custom Links"
            desc="Add and manage unlimited links easily."
          />

          <FeatureCard
            title="Public Profile"
            desc="Share your personal page anywhere."
          />

          <FeatureCard
            title="Fast & Secure"
            desc="Built with modern authentication."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 border-t border-white/10">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to build your link hub?
        </h2>

        <button
          onClick={handleStart}
          className="px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition font-medium"
        >
          Start Now
        </button>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-white/70 text-sm">{desc}</p>
    </div>
  );
}
