import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/common/Button";
import { Icon } from "@iconify/react";
import { team } from "@/src/data/aboutData";

export default function Team() {
  return (
    <Section className="!py-16 bg-white">
      <Container>
        <h2 className="text-3xl md:text-3xl font-medium text-brand-foreground mb-4 text-left">
          Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mb-8">
          {team.map((member, i) => (
            <div
              key={i}
              className="flex bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-32 object-cover rounded-lg m-4"
              />
              <div className="flex flex-col justify-center flex-1 px-2 py-4">
                <div className="text-2xl font-light underline mb-1 text-brand-foreground">
                  {member.name}
                </div>
                <div className="text-base text-brand-foreground mb-1">
                  {member.title}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {member.location}
                </div>
                <div className="flex gap-3">
                  <a
                    href={member.linkedin}
                    className="text-gray-700 hover:text-pink-500 transition"
                    aria-label="LinkedIn"
                  >
                    <Icon icon="mdi:linkedin" width="22" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="max-w-6xl">
          <Button text="Meet Our Team" type="primary" />
        </div> */}
      </Container>
    </Section>
  );
}
