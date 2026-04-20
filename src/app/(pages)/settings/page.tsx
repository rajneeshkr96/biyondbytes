"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FiUser, FiSettings, FiBell, FiLogOut, FiEdit2, FiSave, FiShield } from "react-icons/fi";

const tabs = [
  { id: "profile", label: "Profile", icon: <FiUser /> },
  { id: "account", label: "Account", icon: <FiSettings /> },
  { id: "notifications", label: "Notifications", icon: <FiBell /> },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", about: "", email: "" });
  const [notifications, setNotifications] = useState({ emailNewPost: true, emailComments: true, emailFollowers: false, emailNewsletter: true });

  useEffect(() => {
    if (session?.user) {
      setFormData({ name: session.user.name || "", username: (session.user as any).userName || "", about: "", email: session.user.email || "" });
    }
  }, [session]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/user/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.name, username: formData.username, about: formData.about }) });
      if (res.ok) { toast.success("Profile updated!"); setIsEditing(false); } else toast.error("Failed to update profile");
    } catch { toast.error("Something went wrong"); } finally { setSaving(false); }
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><div className="corners"><div className="corner corner--1"/><div className="corner corner--2"/><div className="corner corner--3"/><div className="corner corner--4"/></div></div>;

  if (!session) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-[rgb(9,9,11)] mb-2">Access Denied</h2>
        <p className="text-[rgb(113,113,122)] mb-6">Please sign in to access settings.</p>
        <a href="/byAuthBtn" className="px-6 py-3 bg-[rgb(9,9,11)] text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">Sign In</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-16">
      <div className="bb-container max-w-[900px]">

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[rgb(9,9,11)]">Settings</h1>
          <p className="text-[rgb(113,113,122)] mt-1 text-sm">Manage your account preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-52 shrink-0">
            <nav className="flex md:flex-col gap-1 bg-white rounded-2xl border border-gray-100 p-2 overflow-x-auto md:overflow-visible">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-[rgb(9,9,11)] text-white" : "text-[rgb(113,113,122)] hover:bg-gray-50 hover:text-[rgb(9,9,11)]"}`}>
                  <span>{tab.icon}</span>{tab.label}
                </button>
              ))}
              <hr className="my-1 border-gray-100 hidden md:block" />
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                <FiLogOut /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-24 bg-[rgb(24,24,27)] relative">
                  <div className="absolute -bottom-10 left-6">
                    <Image src={session.user.image || "/user.png"} alt={session.user.name || "User"} width={80} height={80} className="w-20 h-20 rounded-full border-4 border-white object-cover" />
                  </div>
                  <button onClick={() => setIsEditing(!isEditing)} className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-xs font-medium hover:bg-white/20 transition-all">
                    <FiEdit2 /> {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
                <form onSubmit={handleSaveProfile} className="pt-14 px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[{ label: "Full Name", name: "name", type: "text" }, { label: "Username", name: "username", type: "text" }].map((f) => (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                        <input type={f.type} name={f.name} value={formData[f.name as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} disabled={!isEditing}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[rgb(9,9,11)] text-sm focus:ring-2 focus:ring-[rgb(9,9,11)]/10 focus:border-[rgb(9,9,11)] outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400" />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                      <input type="email" value={formData.email} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
                      <textarea name="about" value={formData.about} onChange={(e) => setFormData({ ...formData, about: e.target.value })} disabled={!isEditing} rows={4} placeholder="Tell us about yourself..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[rgb(9,9,11)] text-sm focus:ring-2 focus:ring-[rgb(9,9,11)]/10 focus:border-[rgb(9,9,11)] outline-none transition-all resize-none disabled:bg-gray-50 disabled:text-gray-400" />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[rgb(9,9,11)] text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-60">
                        <FiSave /> {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-serif text-lg font-bold text-[rgb(9,9,11)] mb-4 flex items-center gap-2"><FiShield /> Connected Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100">
                          <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        </div>
                        <div><p className="text-sm font-semibold text-[rgb(9,9,11)]">Google</p><p className="text-xs text-gray-400">{session.user.email}</p></div>
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Connected</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-6">
                  <h3 className="font-serif text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back.</p>
                  <button className="px-5 py-2 border border-red-200 text-red-500 rounded-full text-sm hover:bg-red-50 transition-colors">Delete Account</button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-serif text-lg font-bold text-[rgb(9,9,11)] mb-6">Email Notifications</h3>
                <div className="space-y-5">
                  {[
                    { key: "emailNewPost", label: "New posts from authors you follow", desc: "Get notified when your favorite authors publish" },
                    { key: "emailComments", label: "Comments on your posts", desc: "Receive updates when someone comments on your posts" },
                    { key: "emailFollowers", label: "New followers", desc: "Get notified when someone follows your profile" },
                    { key: "emailNewsletter", label: "Weekly newsletter", desc: "Curated content and platform updates weekly" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div><p className="text-sm font-semibold text-[rgb(9,9,11)]">{item.label}</p><p className="text-xs text-gray-400 mt-0.5">{item.desc}</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]} onChange={() => setNotifications((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[rgb(9,9,11)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => toast.success("Preferences saved!")} className="px-6 py-2.5 bg-[rgb(9,9,11)] text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all">Save Preferences</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
