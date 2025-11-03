/**
 * Photo Album Renderer
 * Handles rendering of albums and photos in the gallery
 */

class PhotoAlbumRenderer {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.lazyLoadObserver = null;
        this.setupLazyLoading();
    }

    /**
     * Setup Intersection Observer for lazy loading
     */
    setupLazyLoading() {
        if (!this.config.LAZY_LOAD_ENABLED) return;

        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        this.lazyLoadObserver.unobserve(img);
                    }
                }
            });
        }, {
            threshold: this.config.LAZY_LOAD_THRESHOLD,
            rootMargin: '50px'
        });
    }

    /**
     * Render photos in the gallery
     * @param {Array} photos - Array of photo objects
     * @param {boolean} append - Whether to append to existing items or replace
     */
    renderPhotos(photos, append = false) {
        if (!this.container) return;

        if (!append) {
            this.container.innerHTML = '';
        }

        photos.forEach((photo, index) => {
            const photoElement = this.createPhotoElement(photo, index);
            this.container.appendChild(photoElement);
        });
    }

    /**
     * Create a photo gallery item element
     * @param {Object} photo - Photo data object
     * @param {number} index - Photo index
     * @returns {HTMLElement} Gallery item element
     */
    createPhotoElement(photo, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.category = photo.category || '';
        item.dataset.year = photo.year || '';
        item.dataset.photoId = photo.id || `photo_${index}`;
        item.setAttribute('data-index', index.toString());

        // Image element
        const img = document.createElement('img');
        img.className = 'gallery-image';
        img.alt = photo.alt || photo.title || 'Foto';
        
        if (this.config.LAZY_LOAD_ENABLED) {
            // Use placeholder initially, load actual image on scroll
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250"%3E%3Crect width="300" height="250" fill="%23111"/%3E%3C/svg%3E';
            img.dataset.src = photo.thumbnailUrl || photo.url;
            img.loading = 'lazy';
        } else {
            img.src = photo.thumbnailUrl || photo.url;
        }

        // Overlay element
        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';

        const title = document.createElement('h3');
        title.className = 'gallery-title';
        title.textContent = photo.title || '';

        const description = document.createElement('p');
        description.className = 'gallery-description';
        description.textContent = photo.description || '';

        const date = document.createElement('span');
        date.className = 'gallery-date';
        date.textContent = photo.date || this.formatDate(photo.createdAt);

        overlay.appendChild(title);
        overlay.appendChild(description);
        overlay.appendChild(date);

        item.appendChild(img);
        item.appendChild(overlay);

        // Setup lazy loading observer
        if (this.lazyLoadObserver && img.dataset.src) {
            this.lazyLoadObserver.observe(img);
        }

        // Add fade-in animation
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
        }, index * 50);

        return item;
    }

    /**
     * Render albums grid (for future albums overview page)
     * @param {Array} albums - Array of album objects
     * @param {boolean} append - Whether to append or replace
     */
    renderAlbums(albums, append = false) {
        if (!this.container) return;

        if (!append) {
            this.container.innerHTML = '';
        }

        albums.forEach((album, index) => {
            const albumElement = this.createAlbumElement(album, index);
            this.container.appendChild(albumElement);
        });
    }

    /**
     * Create an album card element
     * @param {Object} album - Album data object
     * @param {number} index - Album index
     * @returns {HTMLElement} Album card element
     */
    createAlbumElement(album, index) {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.dataset.albumId = album.id;
        card.setAttribute('data-index', index.toString());

        const img = document.createElement('img');
        img.className = 'album-cover';
        img.alt = `${album.title} - ${album.year}`;
        img.src = album.coverUrl || 'img/placeholder1.PNG';
        img.loading = 'lazy';

        const info = document.createElement('div');
        info.className = 'album-info';

        const title = document.createElement('h3');
        title.className = 'album-title';
        title.textContent = album.title || '';

        const year = document.createElement('span');
        year.className = 'album-year';
        year.textContent = album.year || '';

        info.appendChild(title);
        info.appendChild(year);
        card.appendChild(img);
        card.appendChild(info);

        // Add fade-in animation
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
        }, index * 50);

        return card;
    }

    /**
     * Format date string for display
     * @param {string} dateStr - ISO date string
     * @returns {string} Formatted date string
     */
    formatDate(dateStr) {
        if (!dateStr) return '';
        
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        if (!this.container) return;

        const loader = document.createElement('div');
        loader.className = 'gallery-loader';
        loader.id = 'gallery-loader';
        loader.innerHTML = '<div class="loader-spinner"></div><p>Foto\'s laden...</p>';
        this.container.appendChild(loader);
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loader = document.getElementById('gallery-loader');
        if (loader) {
            loader.remove();
        }
    }

    /**
     * Show "load more" button
     * @param {Function} callback - Callback function when button is clicked
     */
    showLoadMore(callback) {
        if (!this.container) return;

        // Remove existing load more button
        const existing = this.container.querySelector('.load-more-btn');
        if (existing) existing.remove();

        const button = document.createElement('button');
        button.className = 'load-more-btn btn btn-secondary';
        button.textContent = 'Meer foto\'s laden';
        button.addEventListener('click', callback);

        this.container.appendChild(button);
    }

    /**
     * Hide "load more" button
     */
    hideLoadMore() {
        const button = this.container.querySelector('.load-more-btn');
        if (button) button.remove();
    }
}

