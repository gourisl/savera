"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, KeyRound, Save, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhoneNumber(profile.phone_number || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshProfile();
      setProfileMsg("Profile updated successfully!");
    } catch (err: any) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg("");
    setPassError("");

    if (newPassword !== confirmPassword) {
      setPassError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setPassError("Password must be at least 6 characters.");
      return;
    }

    setSavingPass(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPassError(error.message);
      } else {
        setPassMsg("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPassError(err.message);
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-3xl">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-gold)] transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <h1 className="text-3xl font-serif text-[var(--color-text-main)] mb-2">Account Settings</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">Update your personal details and security preferences</p>

        <div className="space-y-8">
          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
              <User size={20} className="text-[var(--color-primary-gold)]" /> Personal Information
            </h2>

            {profileMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center gap-2">
                <CheckCircle2 size={18} /> {profileMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-[var(--color-text-main)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Profile
              </button>
            </div>
          </form>

          {/* Password Form */}
          <form id="security" onSubmit={handleChangePassword} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
              <KeyRound size={20} className="text-[var(--color-primary-gold)]" /> Security & Password
            </h2>

            {passMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center gap-2">
                <CheckCircle2 size={18} /> {passMsg}
              </div>
            )}

            {passError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {passError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingPass}
                className="bg-[var(--color-text-main)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {savingPass ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
