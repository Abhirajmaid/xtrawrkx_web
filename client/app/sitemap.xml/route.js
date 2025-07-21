import servicesData from "@/src/data/ServicesData";
import { eventsData } from "@/src/data/EventsData";
import { resourcesData } from "@/src/data/ResourcesData";
import { communitiesData } from "@/src/data/CommunityData";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://xtrawrkx.com';

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/services',
        '/communities',
        '/events',
        '/resources',
        '/gallery',
        '/contact-us',
        '/modals',
        '/sitemap',
        '/privacy-policy',
        '/terms-of-service',
    ];

    // Dynamic pages
    const servicePages = servicesData.map(service => `/services/${service.slug}`);
    const communityPages = communitiesData.map(community => `/communities/${community.slug}`);
    const eventPages = eventsData.map(event => `/events/${event.slug}`);
    const resourcePages = resourcesData.map(resource => `/resources/${resource.slug}`);

    // Combine all pages
    const allPages = [
        ...staticPages,
        ...servicePages,
        ...communityPages,
        ...eventPages,
        ...resourcePages,
    ];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${getChangeFreq(page)}</changefreq>
    <priority>${getPriority(page)}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
    });
}

function getChangeFreq(page) {
    if (page === '' || page === '/about' || page === '/contact-us') {
        return 'weekly';
    }
    if (page.startsWith('/events/')) {
        return 'weekly';
    }
    if (page.startsWith('/resources/')) {
        return 'monthly';
    }
    return 'monthly';
}

function getPriority(page) {
    if (page === '') return '1.0'; // Homepage
    if (page === '/about' || page === '/services' || page === '/contact-us') {
        return '0.9';
    }
    if (page === '/communities' || page === '/events' || page === '/resources') {
        return '0.8';
    }
    if (page.startsWith('/services/') || page.startsWith('/communities/')) {
        return '0.7';
    }
    if (page.startsWith('/events/') || page.startsWith('/resources/')) {
        return '0.6';
    }
    return '0.5';
} 