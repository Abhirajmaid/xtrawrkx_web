"use client";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

export class DatabaseService {
    // Generic CRUD operations

    // Create document
    static async create(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            throw new Error(`Failed to create document: ${error.message}`);
        }
    }

    // Read single document
    static async read(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error('Document not found');
            }
        } catch (error) {
            throw new Error(`Failed to read document: ${error.message}`);
        }
    }

    // Update document
    static async update(collectionName, docId, data) {
        try {
            const docRef = doc(db, collectionName, docId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            throw new Error(`Failed to update document: ${error.message}`);
        }
    }

    // Delete document
    static async delete(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId);
            await deleteDoc(docRef);
        } catch (error) {
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }

    // Get all documents from collection
    static async getAll(collectionName, orderByField = 'createdAt', orderDirection = 'desc') {
        try {
            const q = query(
                collection(db, collectionName),
                orderBy(orderByField, orderDirection)
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error(`Failed to get documents: ${error.message}`);
        }
    }

    // Get documents with pagination
    static async getPaginated(collectionName, pageSize = 10, lastDoc = null, orderByField = 'createdAt') {
        try {
            let q = query(
                collection(db, collectionName),
                orderBy(orderByField, 'desc'),
                limit(pageSize)
            );

            if (lastDoc) {
                q = query(q, startAfter(lastDoc));
            }

            const querySnapshot = await getDocs(q);
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return {
                documents,
                lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
                hasMore: querySnapshot.docs.length === pageSize
            };
        } catch (error) {
            throw new Error(`Failed to get paginated documents: ${error.message}`);
        }
    }

    // Query documents with filters
    static async query(collectionName, filters = [], orderByField = 'createdAt', orderDirection = 'desc') {
        try {
            let q = collection(db, collectionName);

            // Apply filters
            filters.forEach(filter => {
                q = query(q, where(filter.field, filter.operator, filter.value));
            });

            // Apply ordering
            q = query(q, orderBy(orderByField, orderDirection));

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error(`Failed to query documents: ${error.message}`);
        }
    }

    // Real-time listener
    static onSnapshot(collectionName, callback, filters = [], orderByField = 'createdAt') {
        try {
            let q = collection(db, collectionName);

            // Apply filters
            filters.forEach(filter => {
                q = query(q, where(filter.field, filter.operator, filter.value));
            });

            // Apply ordering
            q = query(q, orderBy(orderByField, 'desc'));

            return onSnapshot(q, (querySnapshot) => {
                const documents = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(documents);
            });
        } catch (error) {
            throw new Error(`Failed to set up real-time listener: ${error.message}`);
        }
    }

    // Batch operations
    static async batchWrite(operations) {
        try {
            const batch = writeBatch(db);

            operations.forEach(operation => {
                const docRef = doc(db, operation.collection, operation.id);

                switch (operation.type) {
                    case 'create':
                        batch.set(docRef, {
                            ...operation.data,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                        break;
                    case 'update':
                        batch.update(docRef, {
                            ...operation.data,
                            updatedAt: new Date().toISOString()
                        });
                        break;
                    case 'delete':
                        batch.delete(docRef);
                        break;
                }
            });

            await batch.commit();
        } catch (error) {
            throw new Error(`Failed to execute batch operation: ${error.message}`);
        }
    }

    // Search documents (simple text search)
    static async search(collectionName, searchField, searchTerm) {
        try {
            const q = query(
                collection(db, collectionName),
                where(searchField, '>=', searchTerm),
                where(searchField, '<=', searchTerm + '\uf8ff'),
                orderBy(searchField)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error(`Failed to search documents: ${error.message}`);
        }
    }

    // Get document count
    static async getCount(collectionName, filters = []) {
        try {
            let q = collection(db, collectionName);

            // Apply filters
            filters.forEach(filter => {
                q = query(q, where(filter.field, filter.operator, filter.value));
            });

            const querySnapshot = await getDocs(q);
            return querySnapshot.size;
        } catch (error) {
            throw new Error(`Failed to get document count: ${error.message}`);
        }
    }
}

// Collection-specific services
export class ResourceService extends DatabaseService {
    static collectionName = 'resources';

    static async createResource(resourceData) {
        return await this.create(this.collectionName, resourceData);
    }

    static async getResources() {
        return await this.getAll(this.collectionName, 'publishedDate', 'desc');
    }

    static async getResourceBySlug(slug) {
        const resources = await this.query(this.collectionName, [
            { field: 'slug', operator: '==', value: slug }
        ]);
        return resources[0] || null;
    }

    static async getFeaturedResources() {
        return await this.query(this.collectionName, [
            { field: 'featured', operator: '==', value: true }
        ]);
    }

    static async getResourcesByType(type) {
        return await this.query(this.collectionName, [
            { field: 'type', operator: '==', value: type }
        ]);
    }

    static async getResourcesByCategory(category) {
        return await this.query(this.collectionName, [
            { field: 'category', operator: '==', value: category }
        ]);
    }
}

export class ServiceService extends DatabaseService {
    static collectionName = 'services';

    static async createService(serviceData) {
        return await this.create(this.collectionName, serviceData);
    }

    static async getServices() {
        return await this.getAll(this.collectionName, 'name', 'asc');
    }

    static async getServiceBySlug(slug) {
        const services = await this.query(this.collectionName, [
            { field: 'slug', operator: '==', value: slug }
        ]);
        return services[0] || null;
    }

    static async getFeaturedServices() {
        return await this.query(this.collectionName, [
            { field: 'featured', operator: '==', value: true }
        ]);
    }
}

export class EventService extends DatabaseService {
    static collectionName = 'events';

    static async createEvent(eventData) {
        return await this.create(this.collectionName, {
            ...eventData,
            status: eventData.status || 'upcoming'
        });
    }

    static async getEvents() {
        return await this.getAll(this.collectionName, 'date', 'desc');
    }

    static async getEventBySlug(slug) {
        const events = await this.query(this.collectionName, [
            { field: 'slug', operator: '==', value: slug }
        ]);
        return events[0] || null;
    }

    static async getEventsByCategory(category) {
        return await this.query(this.collectionName, [
            { field: 'category', operator: '==', value: category }
        ], 'date', 'desc');
    }

    static async getEventsByStatus(status) {
        return await this.query(this.collectionName, [
            { field: 'status', operator: '==', value: status }
        ], 'date', 'desc');
    }

    static async getUpcomingEvents() {
        return await this.query(this.collectionName, [
            { field: 'status', operator: '==', value: 'upcoming' }
        ], 'date', 'asc');
    }

    static async getPastEvents() {
        return await this.query(this.collectionName, [
            { field: 'status', operator: '==', value: 'completed' }
        ], 'date', 'desc');
    }

    static async updateEventStatus(eventId, status) {
        return await this.update(this.collectionName, eventId, { status });
    }

    static async searchEvents(searchTerm) {
        // Get all events and filter client-side for search
        const allEvents = await this.getAll(this.collectionName, 'date', 'desc');
        return allEvents.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    static async getEventsByDateRange(startDate, endDate) {
        return await this.query(this.collectionName, [
            { field: 'date', operator: '>=', value: startDate },
            { field: 'date', operator: '<=', value: endDate }
        ], 'date', 'asc');
    }

    // Real-time listeners for events
    static subscribeToEvents(callback) {
        return this.onSnapshot(this.collectionName, callback, [], 'date');
    }

    static subscribeToUpcomingEvents(callback) {
        return this.onSnapshot(this.collectionName, callback, [
            { field: 'status', operator: '==', value: 'upcoming' }
        ], 'date');
    }
} 