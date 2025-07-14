import React from "react";
import Marquee from "@/src/components/common/Marquee";

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <section className="w-full bg-gradient-to-b from-brand-primary to-brand-secondary py-16 mb-8 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Please read these Terms of Service carefully before using our
            website and services.
          </p>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 py-8 text-brand-foreground text-base md:text-lg leading-relaxed space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website and services, you agree to be
            bound by these Terms of Service and all applicable laws and
            regulations.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">2. Use of Services</h2>
          <p>
            You agree to use our services only for lawful purposes and in
            accordance with these Terms. You are responsible for your conduct
            and any data, text, files, or other content you submit.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">3. Intellectual Property</h2>
          <p>
            All content, trademarks, and data on this website are the property
            of their respective owners. You may not use, reproduce, or
            distribute any content without permission.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            4. Limitation of Liability
          </h2>
          <p>
            We are not liable for any damages or losses resulting from your use
            of our website or services. Use at your own risk.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">5. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to our
            services at any time, without notice, for any reason.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">6. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Changes will
            be posted on this page with an updated effective date.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at support@xtrawrkx.com.
          </p>
        </div>
      </section>
      <Marquee />
    </div>
  );
}
