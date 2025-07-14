import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import SectionHeader from "../common/SectionHeader";

export default function ContactInfo() {
  return (
    <Section className="bg-[#ffffff] !py-16 relative overflow-hidden">
      <img
        src="/images/ContactInfoBg.png"
        alt="Contact Info Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        aria-hidden="true"
      />
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <SectionHeader
              label="Contact Info"
              title="We are always happy to assist you"
              className="mb-0"
            />
          </div>
          <div>
            <div className="text-lg font-medium mb-5">Email Address</div>
            <div className="mb-1">help@info.com</div>
            <div className="text-lg text-gray-500">
              Assistance hours:
              <br />
              Monday - Friday 6 am to 8 pm EST
            </div>
          </div>
          <div>
            <div className="text-lg font-medium mb-5">Number</div>
            <div className="mb-1">(808) 998-34256</div>
            <div className="text-lg text-gray-500">
              Assistance hours:
              <br />
              Monday - Friday 6 am to 8 pm EST
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
