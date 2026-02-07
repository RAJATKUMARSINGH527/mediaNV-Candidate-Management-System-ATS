import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Trash2,
  Plus,
  Search,
  Mail,
  Briefcase,
  User,
  Calendar,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000";

export default function CandidateDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    appliedPosition: "",
  });

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/candidates`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Prevent multiple rapid clicks
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 2. Data formatting to match Zod & SQL requirements
      const payload = {
        ...formData,
        age: parseInt(formData.age) || 0,
        // Null ya NaN ko 0 mein convert karna zaroori hai
        experience: formData.experience ? parseInt(formData.experience) : 0,
        phone: formData.phone || "", // Empty string handle karna
      };

      console.log("🚀 Sending Payload to Render:", payload);

      const response = await axios.post(`${API_URL}/api/candidates`, payload);

      // 3. Success handling
      if (response.status === 201) {
        setShowModal(false);
        setFormData({
          name: "",
          age: "",
          email: "",
          phone: "",
          skills: "",
          experience: "",
          appliedPosition: "",
        });
        fetchCandidates(); // Table refresh karna
        alert("Candidate added successfully! 🎉");
      }
    } catch (err) {
      console.error("Submit error details:", err.response?.data || err.message);

      // 4. Specific error message for Duplicate Email
      if (err.response?.data?.error?.includes("unique constraint")) {
        alert("⚠️ Error: This email is already registered in our database.");
      } else {
        alert(
          `Error: ${err.response?.data?.error || "Connection failed. Check console."}`,
        );
      }
    } finally {
      setIsSubmitting(false); // Button ko wapas enable karna
    }
  };

  const deleteCandidate = async (id) => {
    if (window.confirm("Delete this candidate permanently?")) {
      await axios.delete(`${API_URL}/api/candidates/${id}`);
      fetchCandidates();
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.applied_position?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-widest text-xs uppercase mb-2">
              <span className="w-8 h-0.5 bg-indigo-400" /> Recruitment Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Candidate{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                Hub
              </span>
            </h1>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Add New Talent
          </button>
        </motion.header>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-3 relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
              size={22}
            />
            <input
              type="text"
              placeholder="Search by name, skills or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-500 backdrop-blur-md"
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 py-5 px-6 backdrop-blur-md">
            <Filter size={18} className="text-indigo-400" />
            <span className="text-sm font-semibold">
              Total: {candidates.length}
            </span>
          </div>
        </div>

        {/* Responsive Table / Card Grid with Loading State */}
        <div className="bg-white/5 border border-white/10 rounded-4xl overflow-hidden backdrop-blur-xl shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">
                Syncing Database...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-200">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                      Candidate Info
                    </th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                      Position & Skills
                    </th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredCandidates.length > 0 ? (
                      filteredCandidates.map((c) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={c.id}
                          className="hover:bg-white/3 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                                {c.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                                  {c.name}
                                </div>
                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                  <Mail size={14} /> {c.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-indigo-100 font-semibold">
                              {c.applied_position}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {c.skills || "No skills listed"}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                c.status === "Hired"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              }`}
                            >
                              ● {c.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => deleteCandidate(c.id)}
                              className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-8 py-20 text-center text-slate-500 font-medium"
                        >
                          No candidates found matching your search.
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Advanced Glassmorphism */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-white">
                  Add Candidate
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Applied Position
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appliedPosition: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Age
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                    Skills (Comma Separated)
                  </label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-32 outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                  />
                </div>

                {/* Button with Loading State */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    "Onboard Candidate"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
