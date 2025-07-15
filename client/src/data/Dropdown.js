import { eventsData } from "./EventsData";
import servicesData, { engagementModels } from "./ServicesData";

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

export const communitiesDropdownData = {
    leftTitle: "Communities",
    description:
        "EY helps clients create long-term value for all stakeholders. Enabled by data and technology, our services and solutions provide trust through assurance and help clients transform, grow and operate.",
    middleTitle: "Our Communities",
    middleList: [
        { label: "Xtrawrkx Electric Vehicle Finance Network", slug: "/communities/ev-finance-network" },
        { label: "Xtrawrkx Entrepreneurship Network", slug: "/communities/entrepreneurship-network" },
        { label: "Xtrawrkx EV Talent Group", slug: "/communities/ev-talent-group" },
        { label: "Prototyping", slug: "/communities/prototyping" },
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
