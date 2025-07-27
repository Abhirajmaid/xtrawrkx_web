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
            console.log(`Fetching all documents from collection: ${this.collectionName}`);

            // First try to get all documents without ordering to avoid index issues
            let querySnapshot;
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
            }

            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirestoreTimestampToDate(doc.data().createdAt),
                updatedAt: convertFirestoreTimestampToDate(doc.data().updatedAt),
                date: convertFirestoreTimestampToDate(doc.data().date),
                registrationDeadline: convertFirestoreTimestampToDate(doc.data().registrationDeadline)
            }));

            console.log(`Found ${results.length} documents in ${this.collectionName}`);
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
            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting document from ${this.collectionName}:`, error);
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }

    // Get documents by field
    async getByField(field, value, orderField = 'createdAt', orderDirection = 'desc') {
        try {
            const q = query(
                collection(db, this.collectionName),
                where(field, '==', value),
                orderBy(orderField, orderDirection)
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
            console.log(`Looking for event with slug: ${slug}`);
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
                console.log(`Found event:`, result);
                return result;
            }
            console.log(`No event found with slug: ${slug}`);
            return null;
        } catch (error) {
            console.error(`Error getting event by slug ${slug}:`, error);
            throw new Error(`Failed to fetch event: ${error.message}`);
        }
    }

    // Get upcoming events
    async getUpcomingEvents() {
        try {
            const now = new Date();
            const q = query(
                collection(db, this.collectionName),
                where('date', '>', now),
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
            }));
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
            console.log('Filtering past events before:', today);

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
                console.log('Past event found:', eventData.title, 'Date:', eventData.date);
                return eventData;
            });
            console.log(`Found ${pastEvents.length} past events`);
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
}

// Create singleton instances
export const eventService = new EventService();
export const resourceService = new ResourceService();
export const serviceService = new ServiceService();
export const galleryService = new GalleryService();
export const eventRegistrationService = new EventRegistrationService();

// Export for compatibility
export { EventService as default }; 