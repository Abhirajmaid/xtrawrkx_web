"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/common/SectionHeader";
import Button from "../common/Button";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <Section>
      <Container>
        <div className="mb-10">
          <SectionHeader
            label="Get Started"
            title={
              <>
                Get in touch with us.
                <br />
                We're here to assist you.
              </>
            }
          />
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="border-b border-gray-300 focus:border-brand-primary outline-none py-3 px-2 bg-transparent col-span-1"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="border-b border-gray-300 focus:border-brand-primary outline-none py-3 px-2 bg-transparent col-span-1"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number (optional)"
            className="border-b border-gray-300 focus:border-brand-primary outline-none py-3 px-2 bg-transparent col-span-1"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            className="border-b border-gray-300 focus:border-brand-primary outline-none py-3 px-2 bg-transparent col-span-3 min-h-[100px] resize-none"
          />
          <div className="col-span-3 flex justify-start mt-4">
            <Button type="primary" text="Submit" />
          </div>
        </form>
      </Container>
    </Section>
  );
}
