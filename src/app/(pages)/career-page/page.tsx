"use client";
import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { RiHomeOfficeLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { FiSend, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setSending(false);
  };

  const contactInfo = [
    {
      icon: <FiMapPin className="w-5 h-5" />,
      title: "Our Location",
      detail: "Maharani Enclave, Hastsal, Uttam Nagar, New Delhi, Delhi 110059",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: <FiPhone className="w-5 h-5" />,
      title: "Phone Number",
      detail: "+91 9625110498",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <FiMail className="w-5 h-5" />,
      title: "Email Address",
      detail: "beyondbazaarofficial@gmail.com",
      href: "mailto:beyondbazaarofficial@gmail.com",
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#495E57]/10 text-[#495E57] text-sm font-medium rounded-full mb-4">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Have questions or need assistance? Connect with our team. We&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-gray-500 hover:text-[#495E57] transition-colors">
                      {item.detail}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">{item.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#495E57]/20 focus:border-[#495E57] ${errors.name ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#495E57]/20 focus:border-[#495E57] ${errors.email ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#495E57]/20 focus:border-[#495E57]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className={`w-full px-4 py-2.5 border rounded-lg text-gray-800 outline-none transition-all resize-none focus:ring-2 focus:ring-[#495E57]/20 focus:border-[#495E57] ${errors.message ? "border-red-300" : "border-gray-200"}`}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#495E57] text-white rounded-xl font-medium hover:bg-[#3a4b45] transition-all disabled:opacity-60 shadow-sm"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <FiSend className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
