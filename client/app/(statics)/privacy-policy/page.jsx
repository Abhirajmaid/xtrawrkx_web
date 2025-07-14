import React from "react";
import Marquee from "@/src/components/common/Marquee";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <section className="w-full bg-gradient-to-b from-brand-primary to-brand-secondary py-16 mb-8 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your information.
          </p>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 py-8 text-brand-foreground text-base md:text-lg leading-relaxed space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email
            address, phone number, and other details you provide when you use
            our services or contact us.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            2. How We Use Your Information
          </h2>
          <p>
            Your information is used to provide and improve our services,
            communicate with you, and comply with legal obligations. We do not
            sell your personal information to third parties.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">3. Cookies & Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience,
            analyze usage, and deliver relevant content. You can control cookies
            through your browser settings.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            information. However, no method of transmission over the Internet is
            100% secure.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal
            information. Contact us if you wish to exercise these rights.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated effective date.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@xtrawrkx.com.
          </p>
        </div>
      </section>
      <Marquee />
    </div>
  );
}
