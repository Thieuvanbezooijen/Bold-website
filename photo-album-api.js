/**
 * Photo Album API Client
 * Handles all API communication for albums and photos
 * Replace fetch calls with actual backend implementation when ready
 */

class PhotoAlbumAPI {
    constructor(config) {
        this.config = config;
        this.baseURL = config.API_BASE_URL;
    }

    /**
     * Fetch all albums with pagination
     * @param {number} page - Page number (default: 1)
     * @param {number} limit - Items per page
     * @param {string} year - Optional year filter
     * @returns {Promise<{albums: Array, total: number, page: number}>}
     */
    async fetchAlbums(page = 1, limit = null, year = null) {
        if (!this.config.USE_DYNAMIC_ALBUMS) {
            // Return empty array when dynamic albums are disabled
            return { albums: [], total: 0, page: 1 };
        }

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: (limit || this.config.ALBUMS_PER_PAGE).toString()
            });
            
            if (year) {
                params.append('year', year);
            }

            const response = await fetch(`${this.baseURL}${this.config.ENDPOINTS.ALBUMS}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                albums: data.albums || [],
                total: data.total || 0,
                page: data.page || page
            };
        } catch (error) {
            console.error('Error fetching albums:', error);
            // Return empty result on error to prevent breaking the UI
            return { albums: [], total: 0, page: 1 };
        }
    }

    /**
     * Fetch photos for a specific album
     * @param {number|string} albumId - Album ID
     * @param {number} page - Page number (default: 1)
     * @param {number} limit - Items per page
     * @returns {Promise<{photos: Array, total: number, page: number}>}
     */
    async fetchPhotosByAlbum(albumId, page = 1, limit = null) {
        if (!this.config.USE_DYNAMIC_ALBUMS) {
            return { photos: [], total: 0, page: 1 };
        }

        try {
            const params = new URLSearchParams({
                album_id: albumId.toString(),
                page: page.toString(),
                limit: (limit || this.config.PHOTOS_PER_PAGE).toString()
            });

            const response = await fetch(`${this.baseURL}${this.config.ENDPOINTS.PHOTOS}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                photos: data.photos || [],
                total: data.total || 0,
                page: data.page || page
            };
        } catch (error) {
            console.error('Error fetching photos:', error);
            return { photos: [], total: 0, page: 1 };
        }
    }

    /**
     * Fetch all photos with filters
     * @param {Object} filters - Filter options (category, year, tags)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise<{photos: Array, total: number, page: number}>}
     */
    async fetchPhotos(filters = {}, page = 1, limit = null) {
        if (!this.config.USE_DYNAMIC_ALBUMS) {
            return { photos: [], total: 0, page: 1 };
        }

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: (limit || this.config.PHOTOS_PER_PAGE).toString()
            });

            if (filters.category) params.append('category', filters.category);
            if (filters.year) params.append('year', filters.year);
            if (filters.tags) params.append('tags', filters.tags);
            if (filters.albumId) params.append('album_id', filters.albumId);

            const response = await fetch(`${this.baseURL}${this.config.ENDPOINTS.PHOTOS}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                photos: data.photos || [],
                total: data.total || 0,
                page: data.page || page
            };
        } catch (error) {
            console.error('Error fetching photos:', error);
            return { photos: [], total: 0, page: 1 };
        }
    }

    /**
     * Search albums and photos
     * @param {string} query - Search query
     * @param {number} page - Page number
     * @returns {Promise<{albums: Array, photos: Array, total: number}>}
     */
    async search(query, page = 1) {
        if (!this.config.USE_DYNAMIC_ALBUMS) {
            return { albums: [], photos: [], total: 0 };
        }

        try {
            const params = new URLSearchParams({
                q: query,
                page: page.toString()
            });

            const response = await fetch(`${this.baseURL}${this.config.ENDPOINTS.SEARCH}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                albums: data.albums || [],
                photos: data.photos || [],
                total: data.total || 0
            };
        } catch (error) {
            console.error('Error searching:', error);
            return { albums: [], photos: [], total: 0 };
        }
    }

    /**
     * Upload photos (admin only)
     * @param {FormData} formData - Form data with photos and metadata
     * @returns {Promise<{success: boolean, photos: Array}>}
     */
    async uploadPhotos(formData) {
        if (!this.config.USE_DYNAMIC_ALBUMS) {
            console.warn('Dynamic albums are disabled. Upload not available.');
            return { success: false, photos: [] };
        }

        try {
            const response = await fetch(`${this.baseURL}${this.config.ENDPOINTS.UPLOAD}`, {
                method: 'POST',
                body: formData
                // Note: Don't set Content-Type header, browser will set it with boundary for FormData
            });

            if (!response.ok) {
                throw new Error(`Upload Error: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                photos: data.photos || []
            };
        } catch (error) {
            console.error('Error uploading photos:', error);
            return { success: false, photos: [] };
        }
    }

    /**
     * Normalize API response to internal data structure
     * @param {Object} apiData - Raw API data
     * @param {string} type - 'album' or 'photo'
     * @returns {Object} Normalized data
     */
    normalizeData(apiData, type) {
        const mapping = this.config.FIELD_MAPPING[type];
        if (!mapping) return apiData;

        const normalized = {};
        for (const [internalKey, apiKey] of Object.entries(mapping)) {
            if (apiData[apiKey] !== undefined) {
                normalized[internalKey] = apiData[apiKey];
            }
        }
        return normalized;
    }
}

