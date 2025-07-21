import { eventsData } from "./EventsData";
import servicesData, { engagementModels } from "./ServicesData";
import { communitiesData } from "./CommunityData";

// Create dynamic services dropdown from servicesData
const servicesDropdownList = servicesData.map(service => ({
    label: service.name,
    slug: `/services/${service.slug}`,
    category: service.category,
    subCompany: service.subCompany
}));

export const servicesDropdownData = {
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
};

// Enhanced communities dropdown with detailed information
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

// Group events by category for the dropdown
const eventsByCategory = eventsData.reduce((acc, event) => {
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

export const eventsDropdownData = {
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
