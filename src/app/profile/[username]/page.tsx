"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Profile } from "@/types/auth";
// import { Link } from "@/types/auth";
// Custom SVG Icons (no external icon dependency)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <rect x="3" y="6" width="18" height="12" rx="3" />
    <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M22 5.8c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.8-2.2 7.9 7.9 0 0 1-2.5 1 4 4 0 0 0-6.8 3.7A11.4 11.4 0 0 1 3 4.9a4 4 0 0 0 1.2 5.3 3.8 3.8 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.4.1-.9.2-1.3.2-.3 0-.6 0-.9-.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 19.5a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.3-6.1 11.3-11.3v-.5A8 8 0 0 0 22 5.8z" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18" />
    <path d="M12 3a15 15 0 0 0 0 18" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M14 3h7v7" />
    <path d="M10 14L21 3" />
    <path d="M21 14v7h-7" />
    <path d="M3 10v11h11" />
  </svg>
);

const iconMap: Record<string, any> = {
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  twitter: TwitterIcon,
  globe: GlobeIcon,
};
// Public Profile Page — Linktree-style using custom icons
export default function PublicProfilePage() {
  const params = useParams();

  const username = params.username;

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/profile/${username}`);

      const data = await res.json();

      setProfile(data);
    };

    fetchProfile();
  }, [username]);
  const links = profile?.links || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center mb-10"
        >
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-neutral-300 mb-4 overflow-hidden border-4 border-white shadow-md" />

          {/* Name */}
          <h1 className="text-2xl font-semibold text-neutral-900">
            {profile?.name}
          </h1>

          {/* Username */}
          <p className="text-neutral-500 text-sm mt-1">{profile?.username}</p>

          {/* Bio */}
          <p className="text-neutral-600 text-sm mt-4 max-w-md leading-relaxed">
            Building things on the internet. Sharing ideas, projects, and
            resources. Follow along for updates.
          </p>
        </motion.div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link, index) => {
            const Icon = iconMap[link.icon ?? "website"] || GlobeIcon;

            return (
              <motion.a
                key={link._id}
                href={link.url}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-neutral-300 transition group active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 transition">
                  <Icon className="h-5 w-5 text-neutral-700" />
                </div>

                <span className="text-sm font-medium text-neutral-800 flex-1 text-left">
                  {link.title}
                </span>

                <ExternalLinkIcon className="h-4 w-4 text-neutral-400" />
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-400 mt-12">
          Powered by YourApp
        </div>
      </div>
    </div>
  );
}
