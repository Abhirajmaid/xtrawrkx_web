import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    listAll,
    getMetadata
} from 'firebase/storage';
import { storage } from '../config/firebase';

export class StorageService {
    // Check if storage provider is configured
    static isConfigured() {
        return typeof window !== 'undefined' && storage !== null;
    }

    // Get current provider
    static getProvider() {
        return 'firebase';
    }

    // Upload file with progress tracking
    static async uploadFile(file, path, onProgress = null) {
        try {
            const storageRef = ref(storage, path);

            if (onProgress) {
                const uploadTask = uploadBytesResumable(storageRef, file);

                return new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            onProgress(progress);
                        },
                        (error) => {
                            reject(new Error(`Upload failed: ${error.message}`));
                        },
                        async () => {
                            try {
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                resolve({
                                    url: downloadURL,
                                    path: path,
                                    name: file.name,
                                    size: file.size,
                                    type: file.type
                                });
                            } catch (error) {
                                reject(new Error(`Failed to get download URL: ${error.message}`));
                            }
                        }
                    );
                });
            } else {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                return {
                    url: downloadURL,
                    path: path,
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
            }
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    // Upload multiple files
    static async uploadMultipleFiles(files, basePath, onProgress = null) {
        try {
            const uploads = files.map((file, index) => {
                const fileName = `${Date.now()}_${index}_${file.name}`;
                const path = `${basePath}/${fileName}`;

                return this.uploadFile(file, path, onProgress ? (progress) => {
                    onProgress(index, progress);
                } : null);
            });

            return await Promise.all(uploads);
        } catch (error) {
            throw new Error(`Multiple upload failed: ${error.message}`);
        }
    }

    // Delete file
    static async deleteFile(path) {
        try {
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
        } catch (error) {
            throw new Error(`Delete failed: ${error.message}`);
        }
    }

    // Get file metadata
    static async getFileMetadata(path) {
        try {
            const storageRef = ref(storage, path);
            const metadata = await getMetadata(storageRef);
            return metadata;
        } catch (error) {
            throw new Error(`Failed to get metadata: ${error.message}`);
        }
    }

    // List files in directory
    static async listFiles(path) {
        try {
            const storageRef = ref(storage, path);
            const result = await listAll(storageRef);

            const files = await Promise.all(
                result.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    const metadata = await getMetadata(itemRef);

                    return {
                        name: itemRef.name,
                        path: itemRef.fullPath,
                        url: url,
                        size: metadata.size,
                        type: metadata.contentType,
                        created: metadata.timeCreated,
                        updated: metadata.updated
                    };
                })
            );

            return files;
        } catch (error) {
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }

    // Generate unique filename
    static generateUniqueFileName(originalName) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = originalName.split('.').pop();
        const nameWithoutExtension = originalName.replace(`.${extension}`, '');

        return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
    }

    // Validate file type
    static validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    }

    // Validate file size
    static validateFileSize(file, maxSizeInMB) {
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        return file.size <= maxSizeInBytes;
    }

    // Resize image (client-side)
    static async resizeImage(file, maxWidth, maxHeight, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(resolve, file.type, quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }
}

// Specialized storage services
export class ImageService extends StorageService {
    static allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    static maxSizeInMB = 5;

    static async uploadImage(file, folder = 'images', resize = true) {
        // Validate file type
        if (!this.validateFileType(file, this.allowedTypes)) {
            throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
        }

        // Validate file size
        if (!this.validateFileSize(file, this.maxSizeInMB)) {
            throw new Error(`File size must be less than ${this.maxSizeInMB}MB`);
        }

        // Resize if needed
        let processedFile = file;
        if (resize && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            processedFile = await this.resizeImage(file, 1920, 1080, 0.8);
        }

        // Generate unique filename
        const fileName = this.generateUniqueFileName(file.name);
        const path = `${folder}/${fileName}`;

        return await this.uploadFile(processedFile, path);
    }

    static async uploadMultipleImages(files, folder = 'images') {
        const validFiles = files.filter(file => {
            const isValidType = this.validateFileType(file, this.allowedTypes);
            const isValidSize = this.validateFileSize(file, this.maxSizeInMB);
            return isValidType && isValidSize;
        });

        if (validFiles.length === 0) {
            throw new Error('No valid image files found');
        }

        const uploads = validFiles.map(async (file) => {
            const processedFile = await this.resizeImage(file, 1920, 1080, 0.8);
            const fileName = this.generateUniqueFileName(file.name);
            const path = `${folder}/${fileName}`;

            return await this.uploadFile(processedFile, path);
        });

        return await Promise.all(uploads);
    }
}

export class DocumentService extends StorageService {
    static allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
    ];
    static maxSizeInMB = 10;

    static async uploadDocument(file, folder = 'documents') {
        // Validate file type
        if (!this.validateFileType(file, this.allowedTypes)) {
            throw new Error('Invalid file type. Only PDF, Word, Excel, and text files are allowed.');
        }

        // Validate file size
        if (!this.validateFileSize(file, this.maxSizeInMB)) {
            throw new Error(`File size must be less than ${this.maxSizeInMB}MB`);
        }

        // Generate unique filename
        const fileName = this.generateUniqueFileName(file.name);
        const path = `${folder}/${fileName}`;

        return await this.uploadFile(file, path);
    }
}

// Export convenient wrapper function
export const uploadFile = (file, path, onProgress) => {
    return StorageService.uploadFile(file, path, onProgress);
}; 