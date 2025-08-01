import { useState, useEffect } from "react";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import { Icon } from "@iconify/react";
import { coreTeam, employees } from "@/src/data/teamData";
import { teamService } from "@/src/services/databaseService";
import SectionHeader from "../common/SectionHeader";

export default function TeamSection() {
  const [coreTeamMembers, setCoreTeamMembers] = useState(coreTeam);
  const [employeeMembers, setEmployeeMembers] = useState(employees);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load team members from Firebase
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both categories in parallel
        const [coreMembers, employeeMembers] = await Promise.all([
          teamService.getTeamMembersByCategory("core"),
          teamService.getTeamMembersByCategory("employee"),
        ]);

        // Only use Firebase data if we actually get results
        if (coreMembers.length > 0) {
          setCoreTeamMembers(coreMembers.filter((m) => m.isActive));
        }
        if (employeeMembers.length > 0) {
          setEmployeeMembers(employeeMembers.filter((m) => m.isActive));
        }
      } catch (error) {
        console.error("Error loading team members:", error);
        setError(error.message);

        // Keep using static data as fallback
        console.warn("Using static team data as fallback");
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  const TeamGrid = ({ members, title }) => (
    <div className="my-16">
      <h3 className="text-2xl md:text-3xl font-medium text-brand-foreground mb-8 text-left">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {members.map((member, i) => (
          <div
            key={i}
            className="flex bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-28 h-32 object-cover rounded-lg m-4"
            />
            <div className="flex flex-col justify-center flex-1 px-2 py-4">
              <div className="text-xl font-light underline mb-1 text-brand-foreground">
                {member.name}
              </div>
              <div className="text-base text-brand-foreground mb-1">
                {member.title}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {member.location}
              </div>
              {member.bio && (
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {member.bio}
                </div>
              )}
              <div className="flex gap-3">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    className="text-gray-700 hover:text-pink-500 transition"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon icon="mdi:linkedin" width="22" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-700 hover:text-pink-500 transition"
                    aria-label="Email"
                  >
                    <Icon icon="mdi:email" width="22" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Section className="!py-16 bg-white">
      <Container>
        <SectionHeader label="Team" title="Meet Our Team" />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <Icon
                icon="solar:danger-triangle-bold"
                width={20}
                className="text-yellow-600 mr-2"
              />
              <p className="text-sm text-yellow-800">
                Unable to load latest team data. Showing cached information.
              </p>
            </div>
          </div>
        )}

        {/* Team Content */}
        {!loading && (
          <>
            {/* Core Team */}
            <TeamGrid members={coreTeamMembers} title="Core Leadership Team" />

            {/* Employees */}
            <TeamGrid members={employeeMembers} title="Our Talented Team" />
          </>
        )}
      </Container>
    </Section>
  );
}
