"use client";
import React from "react";

const sections = [
  { id: "info-collect", title: "1. Information We Collect" },
  { id: "info-process", title: "2. How We Process" },
  { id: "info-share", title: "3. Sharing Information" },
  { id: "cookies", title: "4. Cookies & Tracking" },
  { id: "social", title: "5. Social Logins" },
  { id: "international", title: "6. International Transfer" },
  { id: "retention", title: "7. Data Retention" },
  { id: "minors", title: "8. Minors" },
  { id: "rights", title: "9. Privacy Rights" },
  { id: "dnt", title: "10. Do-Not-Track" },
  { id: "updates", title: "11. Updates" },
  { id: "contact", title: "12. Contact Us" },
  { id: "review", title: "13. Review Data" },
  { id: "ads", title: "14. Advertisements" },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
      <div className="bb-container max-w-[1100px]">

        {/* Header */}
        <div className="max-w-[860px] mb-12">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-6 h-px bg-bb-accent" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-bb-accent">Legal · Last updated 04/04/2024</span>
          </div>
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[rgb(9,9,11)] leading-tight mb-4">Privacy Policy</h1>
          <p className="text-[rgb(113,113,122)] leading-relaxed">
            This privacy notice for BiyondBytes describes how and why we might collect, store, use, and/or share your information when you use our services.
          </p>
        </div>

        <div className="flex gap-12 items-start">
          {/* Sticky TOC */}
          <aside className="hidden lg:block w-[200px] shrink-0 sticky top-24 self-start">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Contents</p>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="text-[13px] text-[rgb(113,113,122)] hover:text-[rgb(9,9,11)] py-1 transition-colors leading-snug">
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 space-y-10">
            {[
              { id: "info-collect", title: "1. What Information Do We Collect?", body: "We collect personal information that you voluntarily provide when you register, express interest in our products, participate in activities, or contact us. We do not process sensitive information. Information automatically collected includes your IP address and browser/device characteristics for security and analytics purposes." },
              { id: "info-process", title: "2. How Do We Process Your Information?", body: "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent." },
              { id: "info-share", title: "3. When and With Whom Do We Share Your Personal Information?", body: "We may share information during business transfers, with affiliates who honor this privacy notice, and with business partners to offer certain products or promotions." },
              { id: "cookies", title: "4. Do We Use Cookies and Other Tracking Technologies?", body: "We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice." },
              { id: "social", title: "5. How Do We Handle Your Social Logins?", body: "Our Services offer you the ability to register and log in using your third-party social media account details (like Google or GitHub). We will use the information we receive only for the purposes described in this privacy notice." },
              { id: "international", title: "6. Is Your Information Transferred Internationally?", body: "If you are a resident in the EEA, UK, or Switzerland, we will take all necessary measures to protect your personal information in accordance with this privacy notice and applicable law." },
              { id: "retention", title: "7. How Long Do We Keep Your Information?", body: "We will only keep your personal information for as long as necessary for the purposes set out in this privacy notice, unless a longer retention period is required by law." },
              { id: "minors", title: "8. Do We Collect Information From Minors?", body: "We do not knowingly solicit data from or market to children under 18 years of age. If you become aware of any data we may have collected from children under age 18, please contact us at biyondbytes@gmail.com." },
              { id: "rights", title: "9. What Are Your Privacy Rights?", body: "You may review, change, or terminate your account at any time. You have the right to withdraw your consent to processing at any time by contacting us." },
              { id: "dnt", title: "10. Controls for Do-Not-Track Features", body: "Most web browsers include a Do-Not-Track feature. As no uniform technology standard for recognizing DNT signals has been finalized, we do not currently respond to DNT browser signals." },
              { id: "updates", title: "11. Do We Make Updates to This Notice?", body: "We may update this privacy notice from time to time. The updated version will be indicated by an updated Revised date. We encourage you to review this notice frequently." },
              { id: "contact", title: "12. How Can You Contact Us About This Notice?", body: "If you have questions or comments about this notice, you may contact us at www.biyondbytes.com/contact-us." },
              { id: "review", title: "13. How Can You Review, Update, or Delete the Data We Collect?", body: "Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it." },
              { id: "ads", title: "14. Advertisements", body: "Ads appearing on our website may be delivered to users by advertising partners, who may set cookies. This Privacy Policy covers the use of cookies by BiyondBytes and does not cover the use of cookies by any advertisers." },
            ].map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-serif text-xl font-bold text-[rgb(9,9,11)] mb-3 pb-3 border-b border-gray-100">{s.title}</h2>
                <p className="text-[rgb(113,113,122)] leading-relaxed text-[15px]">{s.body}</p>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
