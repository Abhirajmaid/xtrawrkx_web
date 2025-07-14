import Section from "../layout/Section";
import Container from "../layout/Container";
import Button from "./Button";

const stats = [
  { value: "₹95M+", label: "Total Transactions" },
  { value: "80%", label: "Success Rate" },
  { value: "200+", label: "Advised Transactions" },
];

export default function CTASection() {
  return (
    <Section className="bg-gradient-to-b from-brand-secondary to-brand-primary py-16 text-center">
      <Container>
        <h2 className="text-white text-4xl md:text-5xl font-bold mb-10">
          Proven success.
        </h2>
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
        <Button text="Book A Meet" type="secondary" className="mx-auto" />
      </Container>
    </Section>
  );
}
