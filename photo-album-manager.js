/**
 * Photo Album Manager
 * Manages albums and photos data, handles caching and state
 */

class PhotoAlbumManager {
    constructor(apiClient) {
        this.api = apiClient;
        this.albums = new Map(); // Cache of loaded albums
        this.photos = new Map(); // Cache of loaded photos
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.hasMore = true;
    }

    /**
     * Load albums with caching
     * @param {number} page - Page number
     * @param {string} year - Optional year filter
     * @returns {Promise<Array>}
     */
    async loadAlbums(page = 1, year = null) {
        const cacheKey = `albums_${page}_${year || 'all'}`;
        
        // Return cached data if available
        if (this.albums.has(cacheKey)) {
            return this.albums.get(cacheKey);
        }

        const result = await this.api.fetchAlbums(page, null, year);
        const normalizedAlbums = result.albums.map(album => 
            this.api.normalizeData(album, 'album')
        );

        // Cache the result
        this.albums.set(cacheKey, normalizedAlbums);
        this.hasMore = normalizedAlbums.length === this.api.config.ALBUMS_PER_PAGE;

        return normalizedAlbums;
    }

    /**
     * Load photos with caching
     * @param {Object} filters - Filter options
     * @param {number} page - Page number
     * @returns {Promise<Array>}
     */
    async loadPhotos(filters = {}, page = 1) {
        const filterKey = JSON.stringify(filters);
        const cacheKey = `photos_${filterKey}_${page}`;
        
        // Return cached data if available
        if (this.photos.has(cacheKey)) {
            return this.photos.get(cacheKey);
        }

        const result = await this.api.fetchPhotos(filters, page);
        const normalizedPhotos = result.photos.map(photo => 
            this.api.normalizeData(photo, 'photo')
        );

        // Cache the result
        this.photos.set(cacheKey, normalizedPhotos);
        this.hasMore = normalizedPhotos.length === this.api.config.PHOTOS_PER_PAGE;

        return normalizedPhotos;
    }

    /**
     * Load photos for a specific album
     * @param {number|string} albumId - Album ID
     * @param {number} page - Page number
     * @returns {Promise<Array>}
     */
    async loadAlbumPhotos(albumId, page = 1) {
        const cacheKey = `album_${albumId}_photos_${page}`;
        
        if (this.photos.has(cacheKey)) {
            return this.photos.get(cacheKey);
        }

        const result = await this.api.fetchPhotosByAlbum(albumId, page);
        const normalizedPhotos = result.photos.map(photo => 
            this.api.normalizeData(photo, 'photo')
        );

        this.photos.set(cacheKey, normalizedPhotos);
        this.hasMore = normalizedPhotos.length === this.api.config.PHOTOS_PER_PAGE;

        return normalizedPhotos;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.albums.clear();
        this.photos.clear();
    }

    /**
     * Clear cache for specific filter
     * @param {string} filterKey - Filter key to clear
     */
    clearFilterCache(filterKey) {
        const keysToDelete = [];
        for (const key of this.photos.keys()) {
            if (key.includes(filterKey)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.photos.delete(key));
    }

    /**
     * Convert static HTML gallery items to data structure
     * Used for backward compatibility with existing static HTML
     * @returns {Array} Array of photo objects
     */
    extractStaticPhotos() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const photos = [];

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('.gallery-image');
            const overlay = item.querySelector('.gallery-overlay');
            
            if (!img || !overlay) return;

            const titleEl = overlay.querySelector('.gallery-title');
            const descEl = overlay.querySelector('.gallery-description');
            const dateEl = overlay.querySelector('.gallery-date');

            photos.push({
                id: `static_${index}`,
                albumId: null,
                url: img.src,
                thumbnailUrl: img.src,
                title: titleEl ? titleEl.textContent : '',
                description: descEl ? descEl.textContent : '',
                date: dateEl ? dateEl.textContent : '',
                alt: img.alt || '',
                category: item.dataset.category || '',
                year: item.dataset.year || '',
                tags: [],
                createdAt: dateEl ? this.parseDate(dateEl.textContent) : new Date().toISOString()
            });
        });

        return photos;
    }

    /**
     * Parse date string to ISO format
     * @param {string} dateStr - Date string
     * @returns {string} ISO date string
     */
    parseDate(dateStr) {
        // Simple date parser - can be enhanced
        try {
            const date = new Date(dateStr);
            return date.toISOString();
        } catch (e) {
            return new Date().toISOString();
        }
    }
}

