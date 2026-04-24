'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil, Plus, GripVertical, Sparkles } from "lucide-react";

// Utility to generate soft random colors per card
function getColor(index) {
  const colors = [
    "from-purple-500 to-indigo-500",
    "from-rose-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-cyan-500",
    "from-fuchsia-500 to-pink-500",
  ];
  return colors[index % colors.length];
}

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchLinks() {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data.links || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !url) return;

    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";

      await fetch("/api/links", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title, url }),
      });

      setTitle("");
      setUrl("");
      setEditingId(null);
      fetchLinks();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      await fetch("/api/links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(link) {
    setTitle(link.title);
    setUrl(link.url);
    setEditingId(link._id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/5 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <Sparkles size={18} />
            Creator Control
          </div>

          <div className="text-xs text-gray-400">
            {links.length} links active
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Floating Add Panel */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col gap-4 md:flex-row"
        >
          <input
            type="text"
            placeholder="Link title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-white/30 transition"
          />

          <input
            type="text"
            placeholder="https://your-link.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-white/30 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-medium hover:scale-105 active:scale-95 transition"
          >
            <Plus size={16} />
            {editingId ? "Update" : "Add"}
          </button>
        </motion.form>

        {/* Links */}
        <div className="flex flex-col gap-5">
          {links.map((link, index) => (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`relative group overflow-hidden rounded-3xl bg-gradient-to-r ${getColor(
                index
              )} p-[1px] shadow-lg`}
            >
              <div className="flex items-center justify-between bg-black rounded-3xl px-5 py-5">
                <div className="flex items-center gap-4">
                  <div className="opacity-40 group-hover:opacity-80 transition cursor-grab">
                    <GripVertical size={18} />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium text-base tracking-tight">
                      {link.title}
                    </span>
                    <span className="text-sm text-gray-400 truncate max-w-[260px]">
                      {link.url}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 rounded-xl hover:bg-white/10 transition"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-2 rounded-xl hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {links.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-16">
              Your canvas is empty. Add the first link.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}