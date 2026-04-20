import Link from "next/link";
import { IoIosSend } from "react-icons/io";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[rgb(9,9,11)] mb-2">Get in touch</h1>
        <p className="text-sm text-[rgb(113,113,122)]">Our friendly team would love to hear from you</p>
      </div>

      <form className="flex flex-col gap-4">
        {[
          { label: "Name", placeholder: "Your name", type: "text" },
          { label: "Email", placeholder: "your@email.com", type: "email" },
          { label: "Phone", placeholder: "+1 (555) 000-0000", type: "tel" },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
            <input type={f.type} placeholder={f.placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[rgb(9,9,11)] bg-white focus:outline-none focus:border-[rgb(9,9,11)] focus:ring-2 focus:ring-[rgb(9,9,11)]/5 transition-all placeholder:text-gray-300" />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
          <textarea placeholder="How can we help?" rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[rgb(9,9,11)] bg-white focus:outline-none focus:border-[rgb(9,9,11)] focus:ring-2 focus:ring-[rgb(9,9,11)]/5 transition-all resize-none placeholder:text-gray-300" />
        </div>

        <p className="text-xs text-gray-400">
          You agree to our{" "}
          <Link href="/privacy-policy" className="text-[rgb(9,9,11)] underline">privacy policy</Link>.
        </p>

        <button type="submit" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-[rgb(9,9,11)] text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all">
          Send Message <IoIosSend />
        </button>
      </form>
    </div>
  );
}
