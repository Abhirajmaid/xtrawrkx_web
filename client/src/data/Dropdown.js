"use client";
import { serviceService, eventService } from "@/src/services/databaseService";
import { communitiesData } from "./CommunityData";

// Function to fetch and create dynamic services dropdown
export const getServicesDropdownData = async () => {
    try {
        const services = await serviceService.getServices();

        const servicesDropdownList = services.map(service => ({
            label: service.name,
            slug: `/services/${service.slug}`,
            category: service.category,
            subCompany: service.subCompany
        }));

        return {
            description:
                "Comprehensive business solutions from funding and manufacturing to consulting and product development. Accelerate your growth with our expert services across multiple domains.",
            leftTitle: "Services",
            middleTitle: "What we do",
            middleList: servicesDropdownList,
            rightTitle: "How we work",
            rightList: [
                { label: "Complementary Support", slug: "/modals/complementary-support", price: "$0", subtitle: "Best for starting up" },
                { label: "Membership Advisory", slug: "/modals/membership-advisory", price: "Rs. 31lac", subtitle: "Best for growing use" },
                { label: "Consulting", slug: "/modals/consulting", price: "Rs. 24lac", subtitle: "Best for enterprise use" },
            ],
            exploreModalsButton: {
                text: "Explore models",
                link: "/modals"
            }
        };
    } catch (error) {
        console.error("Error fetching services for dropdown:", error);
        // Return empty structure on error
        return {
            description: "Comprehensive business solutions from funding and manufacturing to consulting and product development.",
            leftTitle: "Services",
            middleTitle: "What we do",
            middleList: [],
            rightTitle: "How we work",
            rightList: [
                { label: "Complementary Support", slug: "/modals/complementary-support", price: "$0", subtitle: "Best for starting up" },
                { label: "Membership Advisory", slug: "/modals/membership-advisory", price: "Rs. 31lac", subtitle: "Best for growing use" },
                { label: "Consulting", slug: "/modals/consulting", price: "Rs. 24lac", subtitle: "Best for enterprise use" },
            ],
            exploreModalsButton: {
                text: "Explore modals",
                link: "/modals"
            }
        };
    }
};

// Enhanced communities dropdown with detailed information (keeping static as it's not in Firebase)
const enhancedCommunitiesDropdownList = communitiesData.map(community => ({
    label: community.fullName,
    shortName: community.name,
    slug: `/communities/${community.slug}`,
    category: community.category,
    members: community.members,
    description: community.description,
    icon: community.icon,
    color: community.color,
    primaryFeature: community.features[0] // Get the first/main feature
}));

export const communitiesDropdownData = {
    leftTitle: "Communities",
    description:
        "Join specialized communities designed for the EV ecosystem. From hardware startups to finance networks, connect with industry experts and accelerate your growth.",
    middleTitle: "Our Communities",
    middleList: enhancedCommunitiesDropdownList,
    rightTitle: "Quick Stats",
    rightList: [
        {
            label: "Total Members",
            value: "2500+",
            subtitle: "Active professionals across all communities"
        },
        {
            label: "Expert Consultants",
            value: "40+",
            subtitle: "Available for XEN members"
        },
        {
            label: "Investment Network",
            value: "250+",
            subtitle: "Angel investors & VCs in XEV.FiN"
        },
        {
            label: "Success Rate",
            value: "88%",
            subtitle: "XEVTG job placement rate"
        }
    ],
};

// Function to fetch and create dynamic events dropdown
export const getEventsDropdownData = async () => {
    try {
        const events = await eventService.getEvents();

        // Group events by category for the dropdown
        const eventsByCategory = events.reduce((acc, event) => {
            if (!acc[event.category]) {
                acc[event.category] = [];
            }
            acc[event.category].push({
                label: event.title,
                slug: `/events/${event.slug}`,
                date: event.date,
                location: event.location
            });
            return acc;
        }, {});

        return {
            leftTitle: "Events",
            description:
                "Join us for exciting events, workshops, and summits. Connect with industry leaders, learn from experts, and be part of the electric vehicle and sustainable finance revolution.",
            middleTitle: "Event Categories",
            middleList: Object.keys(eventsByCategory).map(category => ({
                label: category,
                slug: `/events?category=${category.toLowerCase()}`,
                count: eventsByCategory[category].length
            })),
            rightTitle: "Upcoming Events",
            eventsByCategory: eventsByCategory,
        };
    } catch (error) {
        console.error("Error fetching events for dropdown:", error);
        // Return empty structure on error
        return {
            leftTitle: "Events",
            description:
                "Join us for exciting events, workshops, and summits. Connect with industry leaders, learn from experts, and be part of the electric vehicle and sustainable finance revolution.",
            middleTitle: "Event Categories",
            middleList: [],
            rightTitle: "Upcoming Events",
            eventsByCategory: {},
        };
    }
};
