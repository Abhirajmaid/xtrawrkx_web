// Data Provider - Switch between static data and Firebase CMS data
import { ResourceService, EventService, ServiceService } from '../services/databaseService';
import { resourcesData } from '../data/ResourcesData';
import { eventsData } from '../data/EventsData';
import servicesData from '../data/ServicesData';
import { CMS_CONFIG } from '../config/cms';

// Configuration - Set to true to use Firebase CMS data, false for static data
const USE_CMS_DATA = CMS_CONFIG.USE_CMS_DATA;

export class DataProvider {
    // Resources
    static async getResources() {
        if (USE_CMS_DATA) {
            try {
                return await ResourceService.getResources();
            } catch (error) {
                console.error('Error fetching resources from CMS:', error);
                return resourcesData; // Fallback to static data
            }
        }
        return resourcesData;
    }

    static async getResourceBySlug(slug) {
        if (USE_CMS_DATA) {
            try {
                return await ResourceService.getResourceBySlug(slug);
            } catch (error) {
                console.error('Error fetching resource from CMS:', error);
                return resourcesData.find(r => r.slug === slug); // Fallback to static data
            }
        }
        return resourcesData.find(r => r.slug === slug);
    }

    static async getResourcesByType(type) {
        if (USE_CMS_DATA) {
            try {
                return await ResourceService.getResourcesByType(type);
            } catch (error) {
                console.error('Error fetching resources by type from CMS:', error);
                return resourcesData.filter(r => r.type === type); // Fallback to static data
            }
        }
        return resourcesData.filter(r => r.type === type);
    }

    static async getFeaturedResources() {
        if (USE_CMS_DATA) {
            try {
                return await ResourceService.getFeaturedResources();
            } catch (error) {
                console.error('Error fetching featured resources from CMS:', error);
                return resourcesData.filter(r => r.featured); // Fallback to static data
            }
        }
        return resourcesData.filter(r => r.featured);
    }

    static async searchResources(searchTerm) {
        if (USE_CMS_DATA) {
            try {
                return await ResourceService.searchResources(searchTerm);
            } catch (error) {
                console.error('Error searching resources in CMS:', error);
                // Fallback to static data search
                return resourcesData.filter(resource =>
                    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
        }
        return resourcesData.filter(resource =>
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    static async updateResourceViews(resourceId) {
        if (USE_CMS_DATA) {
            try {
                const resource = await ResourceService.getResourceById(resourceId);
                if (resource) {
                    await ResourceService.updateResourceViews(resourceId, (resource.views || 0) + 1);
                }
            } catch (error) {
                console.error('Error updating resource views:', error);
            }
        }
        // For static data, we don't update views
    }

    static async updateResourceDownloads(resourceId) {
        if (USE_CMS_DATA) {
            try {
                const resource = await ResourceService.getResourceById(resourceId);
                if (resource) {
                    await ResourceService.updateResourceDownloads(resourceId, (resource.downloads || 0) + 1);
                }
            } catch (error) {
                console.error('Error updating resource downloads:', error);
            }
        }
        // For static data, we don't update downloads
    }

    // Events
    static async getEvents() {
        if (USE_CMS_DATA) {
            try {
                return await EventService.getEvents();
            } catch (error) {
                console.error('Error fetching events from CMS:', error);
                return eventsData; // Fallback to static data
            }
        }
        return eventsData;
    }

    static async getEventBySlug(slug) {
        if (USE_CMS_DATA) {
            try {
                return await EventService.getEventBySlug(slug);
            } catch (error) {
                console.error('Error fetching event from CMS:', error);
                return eventsData.find(e => e.slug === slug); // Fallback to static data
            }
        }
        return eventsData.find(e => e.slug === slug);
    }

    static async getUpcomingEvents() {
        if (USE_CMS_DATA) {
            try {
                return await EventService.getUpcomingEvents();
            } catch (error) {
                console.error('Error fetching upcoming events from CMS:', error);
                // Fallback to static data logic
                return eventsData.filter(event => {
                    const eventDate = new Date(event.date.replace(/(\d+)(st|nd|rd|th)/, '$1').replace(' 2025', ', 2025'));
                    return eventDate > new Date();
                });
            }
        }
        return eventsData.filter(event => {
            const eventDate = new Date(event.date.replace(/(\d+)(st|nd|rd|th)/, '$1').replace(' 2025', ', 2025'));
            return eventDate > new Date();
        });
    }

    static async getPastEvents() {
        if (USE_CMS_DATA) {
            try {
                return await EventService.getPastEvents();
            } catch (error) {
                console.error('Error fetching past events from CMS:', error);
                // Fallback to static data logic
                return eventsData.filter(event => {
                    const eventDate = new Date(event.date.replace(/(\d+)(st|nd|rd|th)/, '$1').replace(' 2025', ', 2025'));
                    return eventDate <= new Date();
                });
            }
        }
        return eventsData.filter(event => {
            const eventDate = new Date(event.date.replace(/(\d+)(st|nd|rd|th)/, '$1').replace(' 2025', ', 2025'));
            return eventDate <= new Date();
        });
    }

    static async getEventsByCategory(category) {
        if (USE_CMS_DATA) {
            try {
                return await EventService.getEventsByCategory(category);
            } catch (error) {
                console.error('Error fetching events by category from CMS:', error);
                return eventsData.filter(e => e.category === category); // Fallback to static data
            }
        }
        return eventsData.filter(e => e.category === category);
    }

    static async searchEvents(searchTerm) {
        if (USE_CMS_DATA) {
            try {
                return await EventService.searchEvents(searchTerm);
            } catch (error) {
                console.error('Error searching events in CMS:', error);
                // Fallback to static data search
                return eventsData.filter(event =>
                    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
        }
        return eventsData.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Services
    static async getServices() {
        if (USE_CMS_DATA) {
            try {
                return await ServiceService.getServices();
            } catch (error) {
                console.error('Error fetching services from CMS:', error);
                return servicesData; // Fallback to static data
            }
        }
        return servicesData;
    }

    static async getServiceBySlug(slug) {
        if (USE_CMS_DATA) {
            try {
                return await ServiceService.getServiceBySlug(slug);
            } catch (error) {
                console.error('Error fetching service from CMS:', error);
                return servicesData.find(s => s.slug === slug); // Fallback to static data
            }
        }
        return servicesData.find(s => s.slug === slug);
    }

    static async getFeaturedServices() {
        if (USE_CMS_DATA) {
            try {
                return await ServiceService.getFeaturedServices();
            } catch (error) {
                console.error('Error fetching featured services from CMS:', error);
                return servicesData.filter(s => s.featured); // Fallback to static data
            }
        }
        return servicesData.filter(s => s.featured);
    }

    static async getServicesByCategory(category) {
        if (USE_CMS_DATA) {
            try {
                const allServices = await ServiceService.getServices();
                return allServices.filter(s => s.category === category);
            } catch (error) {
                console.error('Error fetching services by category from CMS:', error);
                return servicesData.filter(s => s.category === category); // Fallback to static data
            }
        }
        return servicesData.filter(s => s.category === category);
    }

    // Utility methods
    static isUsingCMSData() {
        return USE_CMS_DATA;
    }

    static async getResourceStats() {
        if (USE_CMS_DATA) {
            try {
                const resources = await ResourceService.getResources();
                const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
                const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
                const byType = resources.reduce((acc, r) => {
                    acc[r.type] = (acc[r.type] || 0) + 1;
                    return acc;
                }, {});

                return {
                    total: resources.length,
                    totalViews,
                    totalDownloads,
                    byType
                };
            } catch (error) {
                console.error('Error fetching resource stats from CMS:', error);
                return this.getStaticResourceStats();
            }
        }
        return this.getStaticResourceStats();
    }

    static getStaticResourceStats() {
        const totalViews = resourcesData.reduce((sum, r) => sum + (r.views || 0), 0);
        const totalDownloads = resourcesData.reduce((sum, r) => sum + (r.downloads || 0), 0);
        const byType = resourcesData.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
        }, {});

        return {
            total: resourcesData.length,
            totalViews,
            totalDownloads,
            byType
        };
    }

    static async getEventStats() {
        if (USE_CMS_DATA) {
            try {
                const events = await EventService.getEvents();
                const upcoming = events.filter(e => e.status === 'upcoming').length;
                const completed = events.filter(e => e.status === 'completed').length;
                const byCategory = events.reduce((acc, e) => {
                    acc[e.category] = (acc[e.category] || 0) + 1;
                    return acc;
                }, {});

                return {
                    total: events.length,
                    upcoming,
                    completed,
                    byCategory
                };
            } catch (error) {
                console.error('Error fetching event stats from CMS:', error);
                return this.getStaticEventStats();
            }
        }
        return this.getStaticEventStats();
    }

    static getStaticEventStats() {
        const upcoming = eventsData.filter(event => {
            const eventDate = new Date(event.date.replace(/(\d+)(st|nd|rd|th)/, '$1').replace(' 2025', ', 2025'));
            return eventDate > new Date();
        }).length;

        const completed = eventsData.filter(event => {
            const eventDate = new Date(event.date.replace(/(\d+)(st|nd|rd|th)/, '$1').replace(' 2025', ', 2025'));
            return eventDate <= new Date();
        }).length;

        const byCategory = eventsData.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + 1;
            return acc;
        }, {});

        return {
            total: eventsData.length,
            upcoming,
            completed,
            byCategory
        };
    }

    static async getServiceStats() {
        if (USE_CMS_DATA) {
            try {
                const services = await ServiceService.getServices();
                const featured = services.filter(s => s.featured).length;
                const byCategory = services.reduce((acc, s) => {
                    acc[s.category] = (acc[s.category] || 0) + 1;
                    return acc;
                }, {});
                const bySubCompany = services.reduce((acc, s) => {
                    acc[s.subCompany] = (acc[s.subCompany] || 0) + 1;
                    return acc;
                }, {});

                return {
                    total: services.length,
                    featured,
                    byCategory,
                    bySubCompany
                };
            } catch (error) {
                console.error('Error fetching service stats from CMS:', error);
                return this.getStaticServiceStats();
            }
        }
        return this.getStaticServiceStats();
    }

    static getStaticServiceStats() {
        const featured = servicesData.filter(s => s.featured).length;
        const byCategory = servicesData.reduce((acc, s) => {
            acc[s.category] = (acc[s.category] || 0) + 1;
            return acc;
        }, {});
        const bySubCompany = servicesData.reduce((acc, s) => {
            acc[s.subCompany] = (acc[s.subCompany] || 0) + 1;
            return acc;
        }, {});

        return {
            total: servicesData.length,
            featured,
            byCategory,
            bySubCompany
        };
    }
} 