"use client";
import Section from "../layout/Section";
import Container from "../layout/Container";
import Button from "./Button";
import { useBookMeetModal } from "../../hooks/useBookMeetModal";

// Component for the Book A Meet button
const BookConsultationButton = () => {
  const { openModal } = useBookMeetModal();

  return (
    <Button
      text="Book Free Consultation"
      type="secondary"
      className="mx-auto"
      onClick={openModal}
    />
  );
};

const stats = [
  { value: "₹95M+", label: "Total Transactions" },
  { value: "80%", label: "Success Rate" },
  { value: "200+", label: "Advised Transactions" },
];

export default function CTASection() {
  return (
    <Section className="bg-gradient-to-b from-brand-secondary to-brand-primary py-16 text-center">
      <Container>
        <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">
          Proven success.
        </h2>
        <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
          Ready to discuss your project? Schedule a free consultation call to
          explore how we can help you achieve your goals.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center min-w-[180px]"
            >
              <span className="text-white text-5xl md:text-6xl font-normal mb-2">
                {stat.value}
              </span>
              <span className="text-white text-xl font-medium opacity-100">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <BookConsultationButton />
      </Container>
    </Section>
  );
}
