"use client";
import React from "react";
import Link from "next/link";

const sections = [
  { id: "website", title: "Website Disclaimer" },
  { id: "external", title: "External Links" },
  { id: "affiliates", title: "Affiliates" },
  { id: "testimonials", title: "Testimonials" },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
              Legal
            </span>
            <span className="text-sm text-gray-400">Last updated April 04, 2024</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
          <p className="text-gray-500">Please read this disclaimer carefully before using the site.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar TOC */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="sticky top-24 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">On this page</p>
              <ul className="space-y-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#495E57] transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
              <section id="website">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Website Disclaimer
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  The information provided by Art creations (&apos;we&apos;, &apos;us&apos;, or &apos;our&apos;) on{" "}
                  <a href="https://www.biyondbytes.com" className="text-[#495E57] hover:underline">
                    biyondbytes.com
                  </a>{" "}
                  (the &apos;Site&apos;) is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site. Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Site or reliance on any information provided on the Site. Your use of the Site and your reliance on any information on the Site is solely at your own risk.
                </p>
              </section>

              <section id="external">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  External Links Disclaimer
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site or any website or feature linked in any banner or other advertising.
                </p>
              </section>

              <section id="affiliates">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Affiliates Disclaimer
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px] mb-4">
                  The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. Our affiliates include:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {["FlexOffers", "eBay Partner Network", "Flipkart", "Myntra", "Meesho", "BiyondBazaar"].map((a) => (
                    <span key={a} className="px-3 py-2 bg-gray-50 text-gray-600 text-sm rounded-lg text-center">
                      {a}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn advertising fees by linking to Amazon.com and affiliated websites.
                </p>
              </section>

              <section id="testimonials">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Testimonials Disclaimer
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px] mb-3">
                  The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.
                </p>
                <p className="text-gray-600 leading-relaxed text-[15px] mb-3">
                  The testimonials on the Site are submitted in various forms such as text, audio and/or video, and are reviewed by us before being posted. They appear on the Site verbatim as given by the users, except for the correction of grammar or typing errors.
                </p>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  The views and opinions contained in the testimonials belong solely to the individual user and do not reflect our views and opinions. We are not affiliated with users who provide testimonials, and users are not paid or otherwise compensated for their testimonials.
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;