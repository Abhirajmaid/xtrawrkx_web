export class CloudinaryService {
    static cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    static apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    static apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    static uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Check if Cloudinary is properly configured
    static isConfigured() {
        return this.cloudName && this.apiKey && this.uploadPreset;
    }

    // Upload file with progress tracking
    static async uploadFile(file, folder = 'uploads', options = {}) {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not properly configured. Please check your environment variables.');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.uploadPreset);

            if (folder) {
                formData.append('folder', folder);
            }

            // Add additional options
            if (options.transformation) {
                formData.append('transformation', JSON.stringify(options.transformation));
            }
            if (options.tags) {
                formData.append('tags', options.tags.join(','));
            }
            if (options.context) {
                formData.append('context', Object.entries(options.context).map(([k, v]) => `${k}=${v}`).join('|'));
            }

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();

            return {
                url: result.secure_url,
                public_id: result.public_id,
                path: result.public_id,
                name: file.name,
                size: result.bytes,
                type: result.resource_type,
                format: result.format,
                width: result.width,
                height: result.height,
                created: result.created_at,
                tags: result.tags || [],
                folder: result.folder
            };
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    // Upload with progress tracking using XMLHttpRequest
    static async uploadFileWithProgress(file, folder = 'uploads', onProgress = null, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not properly configured. Please check your environment variables.');
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();

            formData.append('file', file);
            formData.append('upload_preset', this.uploadPreset);

            if (folder) {
                formData.append('folder', folder);
            }

            // Add additional options
            if (options.transformation) {
                formData.append('transformation', JSON.stringify(options.transformation));
            }
            if (options.tags) {
                formData.append('tags', options.tags.join(','));
            }

            // Track progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const progress = (e.loaded / e.total) * 100;
                        onProgress(progress);
                    }
                });
            }

            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        resolve({
                            url: result.secure_url,
                            public_id: result.public_id,
                            path: result.public_id,
                            name: file.name,
                            size: result.bytes,
                            type: result.resource_type,
                            format: result.format,
                            width: result.width,
                            height: result.height,
                            created: result.created_at,
                            tags: result.tags || [],
                            folder: result.folder
                        });
                    } catch (error) {
                        reject(new Error(`Failed to parse response: ${error.message}`));
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.statusText}`));
                }
            };

            xhr.onerror = function () {
                reject(new Error('Upload failed: Network error'));
            };

            xhr.open('POST', `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`);
            xhr.send(formData);
        });
    }

    // Upload multiple files
    static async uploadMultipleFiles(files, folder = 'uploads', onProgress = null, options = {}) {
        try {
            const uploads = files.map((file, index) => {
                const fileName = `${Date.now()}_${index}_${file.name}`;
                const fileOptions = {
                    ...options,
                    tags: [...(options.tags || []), `batch_${Date.now()}`]
                };

                return this.uploadFileWithProgress(file, folder, onProgress ? (progress) => {
                    onProgress(index, progress);
                } : null, fileOptions);
            });

            return await Promise.all(uploads);
        } catch (error) {
            throw new Error(`Multiple upload failed: ${error.message}`);
        }
    }

    // Delete file
    static async deleteFile(publicId) {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not properly configured. Please check your environment variables.');
        }

        try {
            const timestamp = Math.round(Date.now() / 1000);
            const signature = await this.generateSignature({
                public_id: publicId,
                timestamp: timestamp
            });

            const formData = new FormData();
            formData.append('public_id', publicId);
            formData.append('timestamp', timestamp);
            formData.append('api_key', this.apiKey);
            formData.append('signature', signature);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${this.cloudName}/destroy`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Delete failed: ${error.message}`);
        }
    }

    // Generate signature for authenticated requests
    static async generateSignature(params) {
        // This would typically be done on the server side for security
        // For now, we'll use the upload preset method which doesn't require signatures
        const crypto = require('crypto');
        const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
        return crypto.createHash('sha1').update(sortedParams + this.apiSecret).digest('hex');
    }

    // Get optimized image URL with transformations
    static getOptimizedImageUrl(publicId, transformations = {}) {
        if (!this.cloudName || !publicId) {
            return null;
        }

        const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;

        // Default transformations for optimization
        const defaultTransformations = {
            f_auto: '', // Auto format
            q_auto: '', // Auto quality
            w_auto: '', // Auto width
            dpr_auto: '' // Auto DPR
        };

        const allTransformations = { ...defaultTransformations, ...transformations };

        // Build transformation string
        const transformationString = Object.entries(allTransformations)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => value === '' ? key : `${key}_${value}`)
            .join(',');

        return `${baseUrl}${transformationString}/${publicId}`;
    }

    // List files in folder
    static async listFiles(folder = '', options = {}) {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not properly configured. Please check your environment variables.');
        }

        try {
            const timestamp = Math.round(Date.now() / 1000);
            const params = {
                timestamp: timestamp,
                folder: folder,
                ...options
            };

            const signature = await this.generateSignature(params);

            const queryParams = new URLSearchParams({
                ...params,
                api_key: this.apiKey,
                signature: signature
            });

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${this.cloudName}/resources/search?${queryParams}`,
                { method: 'GET' }
            );

            if (!response.ok) {
                throw new Error(`List failed: ${response.statusText}`);
            }

            const result = await response.json();

            return result.resources.map(resource => ({
                name: resource.public_id.split('/').pop(),
                path: resource.public_id,
                url: resource.secure_url,
                size: resource.bytes,
                type: resource.resource_type,
                format: resource.format,
                width: resource.width,
                height: resource.height,
                created: resource.created_at,
                tags: resource.tags || []
            }));
        } catch (error) {
            throw new Error(`Failed to list files: ${error.message}`);
        }
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

    // Generate unique filename
    static generateUniqueFileName(originalName) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = originalName.split('.').pop();
        const nameWithoutExtension = originalName.replace(`.${extension}`, '');

        return `${nameWithoutExtension}_${timestamp}_${randomString}`;
    }
}

// Specialized image service using Cloudinary
export class CloudinaryImageService extends CloudinaryService {
    static allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    static maxSizeInMB = 10;

    static async uploadImage(file, folder = 'images', options = {}) {
        // Validate file type
        if (!this.validateFileType(file, this.allowedTypes)) {
            throw new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are allowed.');
        }

        // Validate file size
        if (!this.validateFileSize(file, this.maxSizeInMB)) {
            throw new Error(`File size must be less than ${this.maxSizeInMB}MB`);
        }

        // Default image transformations
        const defaultTransformations = {
            quality: 'auto',
            fetch_format: 'auto',
            width: 'auto',
            dpr: 'auto'
        };

        const uploadOptions = {
            ...options,
            transformation: { ...defaultTransformations, ...options.transformation },
            tags: [...(options.tags || []), 'image', file.type.split('/')[1]]
        };

        return await this.uploadFile(file, folder, uploadOptions);
    }

    static async uploadImageWithProgress(file, folder = 'images', onProgress = null, options = {}) {
        // Validate file type
        if (!this.validateFileType(file, this.allowedTypes)) {
            throw new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are allowed.');
        }

        // Validate file size
        if (!this.validateFileSize(file, this.maxSizeInMB)) {
            throw new Error(`File size must be less than ${this.maxSizeInMB}MB`);
        }

        // Default image transformations
        const defaultTransformations = {
            quality: 'auto',
            fetch_format: 'auto',
            width: 'auto',
            dpr: 'auto'
        };

        const uploadOptions = {
            ...options,
            transformation: { ...defaultTransformations, ...options.transformation },
            tags: [...(options.tags || []), 'image', file.type.split('/')[1]]
        };

        return await this.uploadFileWithProgress(file, folder, onProgress, uploadOptions);
    }

    static async uploadMultipleImages(files, folder = 'images', onProgress = null, options = {}) {
        const validFiles = files.filter(file => {
            const isValidType = this.validateFileType(file, this.allowedTypes);
            const isValidSize = this.validateFileSize(file, this.maxSizeInMB);
            return isValidType && isValidSize;
        });

        if (validFiles.length === 0) {
            throw new Error('No valid image files found');
        }

        const uploadOptions = {
            ...options,
            tags: [...(options.tags || []), 'image', 'batch']
        };

        return await this.uploadMultipleFiles(validFiles, folder, onProgress, uploadOptions);
    }

    // Get thumbnail URL
    static getThumbnailUrl(publicId, width = 200, height = 200) {
        return this.getOptimizedImageUrl(publicId, {
            w: width,
            h: height,
            c: 'fill',
            g: 'auto'
        });
    }

    // Get responsive image URLs
    static getResponsiveImageUrls(publicId, sizes = [400, 800, 1200, 1600]) {
        return sizes.map(size => ({
            size,
            url: this.getOptimizedImageUrl(publicId, {
                w: size,
                c: 'scale'
            })
        }));
    }
}

// Specialized document service using Cloudinary
export class CloudinaryDocumentService extends CloudinaryService {
    static allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
    ];
    static maxSizeInMB = 10;

    static async uploadDocument(file, folder = 'documents', options = {}) {
        // Validate file type
        if (!this.validateFileType(file, this.allowedTypes)) {
            throw new Error('Invalid file type. Only PDF, Word, Excel, and text files are allowed.');
        }

        // Validate file size
        if (!this.validateFileSize(file, this.maxSizeInMB)) {
            throw new Error(`File size must be less than ${this.maxSizeInMB}MB`);
        }

        const uploadOptions = {
            ...options,
            tags: [...(options.tags || []), 'document', file.type.split('/')[1]]
        };

        return await this.uploadFile(file, folder, uploadOptions);
    }

    static async uploadDocumentWithProgress(file, folder = 'documents', onProgress = null, options = {}) {
        // Validate file type
        if (!this.validateFileType(file, this.allowedTypes)) {
            throw new Error('Invalid file type. Only PDF, Word, Excel, and text files are allowed.');
        }

        // Validate file size
        if (!this.validateFileSize(file, this.maxSizeInMB)) {
            throw new Error(`File size must be less than ${this.maxSizeInMB}MB`);
        }

        const uploadOptions = {
            ...options,
            tags: [...(options.tags || []), 'document', file.type.split('/')[1]]
        };

        return await this.uploadFileWithProgress(file, folder, onProgress, uploadOptions);
    }
} 