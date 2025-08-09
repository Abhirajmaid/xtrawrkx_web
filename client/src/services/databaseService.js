import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    getCountFromServer
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Helper function to safely convert Firestore timestamps to Date objects
const convertFirestoreTimestampToDate = (timestamp) => {
    if (!timestamp) {
        return null;
    }

    // If it's already a Date object, return it
    if (timestamp instanceof Date) {
        return timestamp;
    }

    // If it's a Firestore Timestamp with toDate method
    if (timestamp && typeof timestamp.toDate === 'function') {
        try {
            return timestamp.toDate();
        } catch (error) {
            console.warn('Error converting Firestore timestamp:', error);
            return null;
        }
    }

    // If it's a string, try to parse it as a date
    if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
    }

    // If it's a number (Unix timestamp), convert it
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }

    // If it has seconds and nanoseconds (Firestore Timestamp-like object)
    if (timestamp && timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1000);
    }

    console.warn('Unknown timestamp format:', timestamp);
    return null;
};

// Base Database Service
class BaseDatabaseService {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    // Create a new document
    async create(data) {
        try {
            const docData = {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, this.collectionName), docData);
            return {
                id: docRef.id,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        } catch (error) {
            console.error(`Error creating document in ${this.collectionName}:`, error);
            throw new Error(`Failed to create ${this.collectionName.slice(0, -1)}: ${error.message}`);
        }
    }

    // Get all documents
    async getAll(orderField = 'createdAt', orderDirection = 'desc') {
        try {


            // First try to get all documents with ordering
            let querySnapshot;
            let needsInMemorySort = false;
            try {
                const q = query(
                    collection(db, this.collectionName),
                    orderBy(orderField, orderDirection)
                );
                querySnapshot = await getDocs(q);
            } catch (orderError) {
                console.warn(`Ordering by ${orderField} failed, fetching without order:`, orderError);
                // Fallback: get all documents without ordering
                querySnapshot = await getDocs(collection(db, this.collectionName));
                needsInMemorySort = true;
            }

            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                date: convertFirestoreTimestampToDate(doc.data().date),
                registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
            }));

            // If we had to fall back to no ordering, sort in memory
            if (needsInMemorySort && orderField && results.length > 0) {
                results.sort((a, b) => {
                    let aValue = a[orderField];
                    let bValue = b[orderField];

                    // Handle different data types
                    if (aValue instanceof Date && bValue instanceof Date) {
                        // Date comparison
                        aValue = aValue.getTime();
                        bValue = bValue.getTime();
                    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                        // String comparison (case insensitive)
                        aValue = aValue.toLowerCase();
                        bValue = bValue.toLowerCase();
                    }

                    if (orderDirection === 'asc') {
                        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                    } else {
                        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                    }
                });
            }


            return results;
        } catch (error) {
            console.error(`Error getting documents from ${this.collectionName}:`, error);
            throw new Error(`Failed to fetch ${this.collectionName}: ${error.message}`);
        }
    }

    // Get document by ID
    async getById(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: convertFirestoreTimestampToDate(docSnap.data().createdAt),
                    updatedAt: convertFirestoreTimestampToDate(docSnap.data().updatedAt),
                    date: convertFirestoreTimestampToDate(docSnap.data().date),
                    registrationDeadline: convertFirestoreTimestampToDate(docSnap.data().registrationDeadline)
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error getting document from ${this.collectionName}:`, error);
            throw new Error(`Failed to fetch ${this.collectionName.slice(0, -1)}: ${error.message}`);
        }
    }

    // Update document
    async update(id, data) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const updateData = {
                ...data,
                updatedAt: serverTimestamp()
            };
            await updateDoc(docRef, updateData);
            return {
                id,
                ...data,
                updatedAt: new Date()
            };
        } catch (error) {
            console.error(`Error updating document in ${this.collectionName}:`, error);
            throw new Error(`Failed to update ${this.collectionName.slice(0, -1)}: ${error.message}`);
        }
    }

    // Delete a document
    async delete(id) {
        try {
            if (!id) {
                throw new Error('Document ID is required for deletion');
            }

            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error(`Error deleting document from ${this.collectionName}:`, error);
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }

    // Get documents by field
    async getByField(field, value, orderField = 'createdAt', orderDirection = 'desc') {
        try {
            // First try with ordering (requires composite index if orderField != field)
            let querySnapshot;
            try {
                const q = query(
                    collection(db, this.collectionName),
                    where(field, '==', value),
                    orderBy(orderField, orderDirection)
                );
                querySnapshot = await getDocs(q);
            } catch (orderError) {
                console.warn(`Ordering by ${orderField} failed for ${field} query, fetching without order:`, orderError);
                // Fallback: query without ordering
                const q = query(
                    collection(db, this.collectionName),
                    where(field, '==', value)
                );
                querySnapshot = await getDocs(q);
            }

            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                date: convertFirestoreTimestampToDate(doc.data().date),
                registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
            }));

            // If we had to fall back to no ordering, sort in memory
            if (orderField && results.length > 0) {
                results.sort((a, b) => {
                    let aValue = a[orderField];
                    let bValue = b[orderField];

                    // Handle different data types
                    if (aValue instanceof Date && bValue instanceof Date) {
                        // Date comparison
                        aValue = aValue.getTime();
                        bValue = bValue.getTime();
                    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                        // String comparison (case insensitive)
                        aValue = aValue.toLowerCase();
                        bValue = bValue.toLowerCase();
                    }

                    if (orderDirection === 'asc') {
                        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                    } else {
                        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                    }
                });
            }

            return results;
        } catch (error) {
            console.error(`Error getting documents by ${field} from ${this.collectionName}:`, error);
            throw new Error(`Failed to fetch ${this.collectionName}: ${error.message}`);
        }
    }

    // Get count of documents
    async getCount() {
        try {
            const q = query(collection(db, this.collectionName));
            const snapshot = await getCountFromServer(q);
            return snapshot.data().count;
        } catch (error) {
            console.error(`Error getting count from ${this.collectionName}:`, error);
            return 0;
        }
    }

    // Get documents with limit
    async getWithLimit(limitCount = 10, orderField = 'createdAt', orderDirection = 'desc') {
        try {
            const q = query(
                collection(db, this.collectionName),
                orderBy(orderField, orderDirection),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                date: convertFirestoreTimestampToDate(doc.data().date),
                registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
            }));
        } catch (error) {
            console.error(`Error getting limited documents from ${this.collectionName}:`, error);
            throw new Error(`Failed to fetch ${this.collectionName}: ${error.message}`);
        }
    }
}

// Event Service
export class EventService extends BaseDatabaseService {
    constructor() {
        super('events');
    }

    // Create event
    async createEvent(eventData) {
        return this.create(eventData);
    }

    // Get all events
    async getEvents() {
        return this.getAll('date', 'desc');
    }

    // Get event by slug
    async getEventBySlug(slug) {
        try {

            const q = query(
                collection(db, this.collectionName),
                where('slug', '==', slug)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const result = {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                    updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                    date: convertFirestoreTimestampToDate(doc.data().date),
                    registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
                };

                return result;
            }

            return null;
        } catch (error) {
            console.error(`Error getting event by slug ${slug}:`, error);
            throw new Error(`Failed to fetch event: ${error.message}`);
        }
    }

    // Get upcoming events
    async getUpcomingEvents() {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('status', '==', 'upcoming'),
                orderBy('date', 'asc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                date: convertFirestoreTimestampToDate(doc.data().date),
                registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
            })).filter((event) => {
                return event.status && event.status.toLowerCase() === "upcoming";
            });
        } catch (error) {
            console.error('Error getting upcoming events:', error);
            throw new Error(`Failed to fetch upcoming events: ${error.message}`);
        }
    }

    // Get past events
    async getPastEvents() {
        try {
            // Set to start of today to exclude today's events
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Start of today


            const q = query(
                collection(db, this.collectionName),
                where('date', '<', today),
                orderBy('date', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const pastEvents = querySnapshot.docs.map(doc => {
                const eventData = {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                    updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                    date: convertFirestoreTimestampToDate(doc.data().date),
                    registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
                };

                return eventData;
            });

            return pastEvents;
        } catch (error) {
            console.error('Error getting past events:', error);
            throw new Error(`Failed to fetch past events: ${error.message}`);
        }
    }

    // Update event status
    async updateEventStatus(id, status) {
        return this.update(id, { status });
    }

    // Get events by category
    async getEventsByCategory(category) {
        return this.getByField('category', category, 'date', 'desc');
    }

    // Get featured events
    async getFeaturedEvents() {
        return this.getByField('featured', true, 'date', 'desc');
    }

    // Get events by season
    async getEventsBySeason(season) {
        try {


            // Use the most basic query possible - just filter by season
            const q = query(
                collection(db, this.collectionName),
                where('season', '==', season)
            );
            const querySnapshot = await getDocs(q);

            const events = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                date: convertFirestoreTimestampToDate(doc.data().date),
                registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
            }));

            // Sort by date in JavaScript to avoid index issues
            events.sort((a, b) => {
                const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
                const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);
                return dateA - dateB; // ascending order
            });


            return events;
        } catch (error) {
            console.error('Error getting events by season:', error);
            // Fallback: get all events and filter in JavaScript
            try {

                const allEvents = await this.getAll();
                const seasonEvents = allEvents.filter(event => event.season === season);

                return seasonEvents;
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                throw new Error(`Failed to fetch events for season ${season}: ${error.message}`);
            }
        }
    }

    // Get upcoming events by season
    async getUpcomingEventsBySeason(season) {
        try {


            // Get all events for the season first
            const seasonEvents = await this.getEventsBySeason(season);

            // Filter for upcoming events in JavaScript
            const upcomingEvents = seasonEvents.filter(event =>
                event.status && event.status.toLowerCase() === 'upcoming'
            );


            return upcomingEvents;
        } catch (error) {
            console.error('Error getting upcoming events by season:', error);
            throw new Error(`Failed to fetch upcoming events for season ${season}: ${error.message}`);
        }
    }


}

// Resource Service
export class ResourceService extends BaseDatabaseService {
    constructor() {
        super('resources');
    }

    // Create resource
    async createResource(resourceData) {
        return this.create(resourceData);
    }

    // Get all resources
    async getResources() {
        return this.getAll('createdAt', 'desc');
    }

    // Get resource by slug
    async getResourceBySlug(slug) {
        const resources = await this.getByField('slug', slug);
        return resources.length > 0 ? resources[0] : null;
    }

    // Get resources by type
    async getResourcesByType(type) {
        return this.getByField('type', type, 'createdAt', 'desc');
    }

    // Get resources by category
    async getResourcesByCategory(category) {
        return this.getByField('category', category, 'createdAt', 'desc');
    }

    // Get featured resources
    async getFeaturedResources() {
        return this.getByField('featured', true, 'createdAt', 'desc');
    }
}

// Service Service (for business services)
export class ServiceService extends BaseDatabaseService {
    constructor() {
        super('services');
    }

    // Create service
    async createService(serviceData) {
        return this.create(serviceData);
    }

    // Get all services
    async getServices() {
        return this.getAll('name', 'asc');
    }

    // Get service by slug
    async getServiceBySlug(slug) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('slug', '==', slug)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                    updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                    date: convertFirestoreTimestampToDate(doc.data().date),
                    registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
                };
            }
            return null;
        } catch (error) {
            console.error(`Error getting service by slug ${slug}:`, error);
            throw new Error(`Failed to fetch service: ${error.message}`);
        }
    }

    // Get services by category
    async getServicesByCategory(category) {
        return this.getByField('category', category, 'name', 'asc');
    }

    // Get services by sub-company
    async getServicesBySubCompany(subCompany) {
        return this.getByField('subCompany', subCompany, 'name', 'asc');
    }

    // Get featured services
    async getFeaturedServices() {
        return this.getByField('featured', true, 'name', 'asc');
    }
}

// Gallery Service
export class GalleryService extends BaseDatabaseService {
    constructor() {
        super('gallery');
    }

    // Create gallery item
    async createGalleryItem(galleryData) {
        return this.create(galleryData);
    }

    // Get all gallery items
    async getGalleryItems() {
        return this.getAll('date', 'desc');
    }

    // Get gallery item by ID
    async getGalleryItemById(id) {
        return this.getById(id);
    }

    // Get gallery items by category
    async getGalleryItemsByCategory(category) {
        return this.getByField('category', category, 'date', 'desc');
    }

    // Get featured gallery items
    async getFeaturedGalleryItems() {
        return this.getByField('featured', true, 'date', 'desc');
    }

    // Update gallery item
    async updateGalleryItem(id, updateData) {
        return this.update(id, updateData);
    }

    // Delete gallery item
    async deleteGalleryItem(id) {
        return this.delete(id);
    }

    // Get gallery items by event
    async getGalleryItemsByEvent(eventId) {
        return this.getByField('eventId', eventId, 'date', 'desc');
    }

    // Get gallery items by event slug
    async getGalleryItemsByEventSlug(eventSlug) {
        try {
            // First get the event by slug to get its ID
            const eventService = new EventService();
            const event = await eventService.getEventBySlug(eventSlug);
            if (!event) {
                return [];
            }
            return this.getGalleryItemsByEvent(event.id);
        } catch (error) {
            console.error('Error getting gallery items by event slug:', error);
            throw error;
        }
    }

    // Search gallery items
    async searchGalleryItems(searchTerm) {
        try {
            const allItems = await this.getGalleryItems();
            return allItems.filter(item =>
                item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } catch (error) {
            console.error('Error searching gallery items:', error);
            throw error;
        }
    }
}

// Event Registration Service
export class EventRegistrationService extends BaseDatabaseService {
    constructor() {
        super('event_registrations');
    }

    // Create registration
    async createRegistration(registrationData) {
        return this.create(registrationData);
    }

    // Get all registrations
    async getRegistrations() {
        return this.getAll('createdAt', 'desc');
    }

    // Get registrations by event ID
    async getRegistrationsByEventId(eventId) {
        return this.getByField('eventId', eventId, 'createdAt', 'desc');
    }

    // Get registration by email and event ID
    async getRegistrationByEmailAndEvent(email, eventId) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('email', '==', email),
                where('eventId', '==', eventId)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                    updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                    date: convertFirestoreTimestampToDate(doc.data().date),
                    registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting registration by email and event:', error);
            throw new Error(`Failed to fetch registration: ${error.message}`);
        }
    }

    // Update registration status
    async updateRegistrationStatus(id, status) {
        return this.update(id, { status });
    }

    // Create season registration
    async createSeasonRegistration(registrationData) {
        return this.create(registrationData);
    }

    // Get registrations by season
    async getRegistrationsBySeason(season) {
        return this.getByField('season', season, 'createdAt', 'desc');
    }

    // Get registration by company email and season
    async getRegistrationByCompanyAndSeason(companyEmail, season) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('companyEmail', '==', companyEmail),
                where('season', '==', season)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                    updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt)
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting registration by company and season:', error);
            throw new Error(`Failed to fetch registration: ${error.message}`);
        }
    }

    // Update season registration (MISSING METHOD - CRITICAL FIX)
    async updateSeasonRegistration(id, updateData) {
        try {
            return await this.update(id, updateData);
        } catch (error) {
            console.error('Error updating season registration:', error);
            throw new Error(`Failed to update season registration: ${error.message}`);
        }
    }
}

// Team Service
export class TeamService extends BaseDatabaseService {
    constructor() {
        super('team');
    }

    // Create a new team member
    async createTeamMember(memberData) {
        try {


            const docData = {
                ...memberData,
                isActive: memberData.isActive ?? true,
                joinDate: memberData.joinDate || new Date().toISOString().split('T')[0],
            };

            return await this.create(docData);
        } catch (error) {
            console.error('Error creating team member:', error);
            throw new Error(`Failed to create team member: ${error.message}`);
        }
    }

    // Get all team members
    async getAllTeamMembers() {
        try {


            const members = await this.getAll('name', 'asc');

            return members.map(member => ({
                ...member,
                joinDate: member.joinDate || new Date().toISOString().split('T')[0],
                isActive: member.isActive ?? true
            }));
        } catch (error) {
            console.error('Error fetching team members:', error);
            // Try without ordering as fallback
            try {
                const members = await this.getAll();
                return members.map(member => ({
                    ...member,
                    joinDate: member.joinDate || new Date().toISOString().split('T')[0],
                    isActive: member.isActive ?? true
                }));
            } catch (fallbackError) {
                throw new Error(`Failed to fetch team members: ${fallbackError.message}`);
            }
        }
    }

    // Get team members by category
    async getTeamMembersByCategory(category) {
        try {


            const members = await this.getByField('category', category, 'name', 'asc');

            return members.map(member => ({
                ...member,
                joinDate: member.joinDate || new Date().toISOString().split('T')[0],
                isActive: member.isActive ?? true
            }));
        } catch (error) {
            console.error(`Error fetching ${category} team members:`, error);
            // Try without ordering as fallback
            try {
                const members = await this.getByField('category', category);
                return members.map(member => ({
                    ...member,
                    joinDate: member.joinDate || new Date().toISOString().split('T')[0],
                    isActive: member.isActive ?? true
                }));
            } catch (fallbackError) {
                throw new Error(`Failed to fetch ${category} team members: ${fallbackError.message}`);
            }
        }
    }

    // Get active team members
    async getActiveTeamMembers() {
        try {
            const members = await this.getByField('isActive', true);

            return members.map(member => ({
                ...member,
                joinDate: member.joinDate || new Date().toISOString().split('T')[0]
            }));
        } catch (error) {
            console.error('Error fetching active team members:', error);
            throw new Error(`Failed to fetch active team members: ${error.message}`);
        }
    }

    // Get team member by ID
    async getTeamMemberById(id) {
        try {
            const member = await this.getById(id);

            if (member) {
                return {
                    ...member,
                    joinDate: member.joinDate || new Date().toISOString().split('T')[0],
                    isActive: member.isActive ?? true
                };
            } else {
                throw new Error('Team member not found');
            }
        } catch (error) {
            console.error('Error fetching team member by ID:', error);
            throw new Error(`Failed to fetch team member: ${error.message}`);
        }
    }

    // Update team member
    async updateTeamMember(id, memberData) {
        try {


            return await this.update(id, memberData);
        } catch (error) {
            console.error('Error updating team member:', error);
            throw new Error(`Failed to update team member: ${error.message}`);
        }
    }

    // Delete team member
    async deleteTeamMember(id) {
        try {


            await this.delete(id);
            return { id, deleted: true };
        } catch (error) {
            console.error('Error deleting team member:', error);
            throw new Error(`Failed to delete team member: ${error.message}`);
        }
    }

    // Toggle team member active status
    async toggleTeamMemberStatus(id, isActive) {
        try {


            const updateData = {
                isActive: !isActive
            };

            const result = await this.update(id, updateData);

            return {
                ...result,
                isActive: !isActive
            };
        } catch (error) {
            console.error('Error toggling team member status:', error);
            throw new Error(`Failed to update team member status: ${error.message}`);
        }
    }

    // Get team statistics
    async getTeamStats() {
        try {
            const members = await this.getAllTeamMembers();

            return {
                total: members.length,
                core: members.filter(m => m.category === 'core').length,
                employees: members.filter(m => m.category === 'employee').length,
                active: members.filter(m => m.isActive).length,
                inactive: members.filter(m => !m.isActive).length
            };
        } catch (error) {
            console.error('Error fetching team stats:', error);
            throw new Error(`Failed to fetch team statistics: ${error.message}`);
        }
    }

    // Search team members
    async searchTeamMembers(searchTerm) {
        try {
            const allMembers = await this.getAllTeamMembers();

            const searchLower = searchTerm.toLowerCase();
            return allMembers.filter(member =>
                member.name?.toLowerCase().includes(searchLower) ||
                member.title?.toLowerCase().includes(searchLower) ||
                member.location?.toLowerCase().includes(searchLower) ||
                member.bio?.toLowerCase().includes(searchLower)
            );
        } catch (error) {
            console.error('Error searching team members:', error);
            throw new Error(`Failed to search team members: ${error.message}`);
        }
    }
}

// Create singleton instances
export const eventService = new EventService();
export const resourceService = new ResourceService();
export const serviceService = new ServiceService();
export const galleryService = new GalleryService();
export const eventRegistrationService = new EventRegistrationService();
export const teamService = new TeamService();

// Export for compatibility
export { EventService as default }; 