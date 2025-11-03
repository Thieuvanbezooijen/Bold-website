/**
 * Studievereniging BOLD - Main JavaScript
 * Handles navigation, interactions, and dynamic content
 */

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.allLinks = document.querySelectorAll('a[href]');
        this.transitionOverlay = document.getElementById('page-transition-overlay');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
        
        // Handle page transitions for internal links
        this.allLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Only handle internal links (same domain)
            if (href && this.isInternalLink(href)) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handlePageTransition(href);
                });
            }
        });
        
        // Handle page load - fade in
        this.handlePageLoad();
    }
    
    isInternalLink(href) {
        // Check if it's an internal link (not external, not anchor, not special protocols)
        return href && 
               !href.startsWith('http') && 
               !href.startsWith('//') && 
               !href.startsWith('mailto:') && 
               !href.startsWith('tel:') &&
               !href.startsWith('#') &&
               href !== 'javascript:void(0)';
    }
    
    handlePageTransition(href) {
        // Swipe overlay from right to left (one continuous motion)
        if (this.transitionOverlay) {
            // Mark that we're transitioning (for next page)
            sessionStorage.setItem('pageTransitioning', 'true');
            
            // Hide body content to prevent flash
            document.body.classList.add('page-transitioning');
            document.body.style.overflow = 'hidden';
            
            // Reset any previous state and ensure overlay starts from right
            this.transitionOverlay.classList.remove('swipe-continue', 'pending', 'swipe-in');
            // Ensure overlay is visible and interactive during transition
            this.transitionOverlay.style.pointerEvents = 'all';
            this.transitionOverlay.style.opacity = '1';
            this.transitionOverlay.style.visibility = 'visible';
            // Clear any inline styles
            this.transitionOverlay.style.transform = '';
            this.transitionOverlay.style.transition = '';
            // Force reflow to ensure browser processes class removal
            void this.transitionOverlay.offsetHeight;
            // Set overlay to start position (off-screen right) without transition
            this.transitionOverlay.style.transform = 'translateX(100%)';
            this.transitionOverlay.style.transition = 'none';
            
            // Wait for next frame to ensure reset is applied, then start swipe animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (this.transitionOverlay) {
                        // Clear inline styles to allow CSS transition (but keep pointer-events)
                        this.transitionOverlay.style.transform = '';
                        this.transitionOverlay.style.transition = '';
                        // Start swipe from right (100%) to center (0%)
                        this.transitionOverlay.classList.add('swipe-in');
                    }
                });
            });
            
            // Navigate after reaching center (250ms), then continue to left
            setTimeout(() => {
                window.location.href = href;
            }, 450); // 250ms swipe-in + 200ms pause, then navigate
        }
    }
    
    handlePageLoad() {
        // Check if we're transitioning from a previous page
        const isTransitioning = sessionStorage.getItem('pageTransitioning') === 'true';
        
        if (this.transitionOverlay) {
            if (isTransitioning) {
                // Page is transitioning: overlay is already at center (0%) from previous page
                // Overlay was already set up in IIFE, just ensure it stays stable
                // Keep body hidden to prevent flash
                if (document.body) {
                    document.body.style.visibility = 'hidden';
                    document.body.style.overflow = 'hidden';
                }
                document.documentElement.style.overflow = 'hidden';
                
                // Don't reset overlay - it's already positioned correctly by IIFE
                // The IIFE set transform to translateX(0) with transition: none
                // Just remove the pending class - don't touch transform or other styles
                this.transitionOverlay.classList.remove('pending');
                // Overlay should already have all styles set correctly by IIFE, don't modify them
                
                // Wait for page to be fully loaded (including images and resources)
                let transitionCompleted = false;
                const completeTransition = () => {
                    if (transitionCompleted) return; // Prevent multiple calls
                    transitionCompleted = true;
                    
                    // Brief pause in middle (200ms), then continue swipe to left
                    setTimeout(() => {
                        if (this.transitionOverlay) {
                            // Show body content NOW (before swipe-out starts) so it's ready when overlay moves
                            if (document.body) {
                                document.body.style.visibility = 'visible';
                            }
                            document.documentElement.style.visibility = 'visible';
                            
                            // Ensure overlay stays visible during swipe-out
                            this.transitionOverlay.style.opacity = '1';
                            this.transitionOverlay.style.visibility = 'visible';
                            this.transitionOverlay.style.pointerEvents = 'all';
                            this.transitionOverlay.style.zIndex = '10000';
                            
                            // Use requestAnimationFrame to ensure smooth transition start
                            requestAnimationFrame(() => {
                                // Overlay is at translateX(0) via inline style from IIFE
                                // Step 1: Enable CSS transitions first
                                this.transitionOverlay.style.transition = '';
                                // Force reflow
                                void this.transitionOverlay.offsetHeight;
                                
                                // Step 2: Add swipe-in class to maintain position via CSS (not inline)
                                // This creates a CSS-based position that we can then transition from
                                this.transitionOverlay.classList.add('swipe-in');
                                // Force reflow to apply swipe-in
                                void this.transitionOverlay.offsetHeight;
                                
                                // Step 3: Clear inline transform - swipe-in class now maintains position at 0%
                                this.transitionOverlay.style.transform = '';
                                // Force reflow to ensure swipe-in is fully controlling position
                                void this.transitionOverlay.offsetHeight;
                                
                                // Step 4: Atomically replace swipe-in with swipe-continue
                                // Do both operations synchronously to prevent any gap
                                this.transitionOverlay.classList.remove('swipe-in');
                                this.transitionOverlay.classList.add('swipe-continue');
                                // Since transitions are enabled and overlay is at 0% (from swipe-in),
                                // it will smoothly animate to -100% (swipe-continue)
                            });
                            
                            // Clean up after animation completes
                            setTimeout(() => {
                                if (this.transitionOverlay) {
                                    // Remove class and set overlay to stay off-screen left (no animation)
                                    this.transitionOverlay.classList.remove('swipe-continue');
                                    this.transitionOverlay.style.transform = 'translateX(-100%)';
                                    this.transitionOverlay.style.transition = 'none';
                                }
                                // Restore body overflow (visibility already restored above)
                                if (document.body) {
                                    document.body.classList.remove('page-transitioning');
                                    document.body.style.overflow = '';
                                }
                                document.documentElement.style.overflow = '';
                                document.documentElement.style.visibility = 'visible';
                                sessionStorage.removeItem('pageTransitioning');
                            }, 300); // 250ms animation + 50ms buffer to ensure completion
                        }
                    }, 200); // Brief pause
                };
                
                // Wait for window to fully load (including all resources)
                // Always set up a guaranteed fallback timeout
                const fallbackTimeout = setTimeout(() => {
                    if (!transitionCompleted) {
                        completeTransition();
                    }
                }, 1200); // Max 1.2 seconds wait - guaranteed completion
                
                // Check immediately - the load event might have already fired
                if (document.readyState === 'complete') {
                    // Page already fully loaded, complete transition after brief delay
                    clearTimeout(fallbackTimeout);
                    setTimeout(completeTransition, 200);
                } else {
                    // Wait for load event using requestAnimationFrame to ensure DOM is ready
                    requestAnimationFrame(() => {
                        // Double-check - load might have fired between checks
                        if (document.readyState === 'complete') {
                            clearTimeout(fallbackTimeout);
                            setTimeout(completeTransition, 200);
                        } else {
                            // Attach load listener
                            window.addEventListener('load', () => {
                                clearTimeout(fallbackTimeout);
                                setTimeout(completeTransition, 200);
                            }, { once: true });
                        }
                    });
                }
            } else {
                // Normal page load: reset overlay to off-screen right (no animation)
                this.transitionOverlay.classList.remove('swipe-in', 'swipe-continue', 'pending', 'active');
                this.transitionOverlay.style.transform = '';
                this.transitionOverlay.style.transition = '';
            }
        }
    }
    
    toggleMobileMenu() {
        const isActive = this.hamburger.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.hamburger.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== SCROLL EFFECTS =====
class ScrollEffects {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.heroGrid = document.querySelector('.hero-grid');
        
        this.init();
    }
    
    init() {
        // Navbar background on scroll
        window.addEventListener('scroll', () => this.handleNavbarScroll());
        
        // Parallax effect for hero grid
        window.addEventListener('scroll', () => this.handleParallax());
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }
    
    handleNavbarScroll() {
        // Navbar scroll effect removed - keeping static black background
    }
    
    handleParallax() {
        if (this.heroGrid) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            this.heroGrid.style.transform = `rotate(5deg) translateY(${rate}px)`;
        }
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.quick-link-card, .stat-item, .about-text');
        animateElements.forEach(el => observer.observe(el));
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            // Check if this is the contact form with Web3Forms
            if (form.action && form.action.includes('web3forms.com')) {
                // For Web3Forms, combine firstName and lastName into name field before submit
                form.addEventListener('submit', (e) => this.handleWeb3FormsSubmit(e));
            } else {
                // For other forms, use default handler
                form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
        });
    }
    
    handleWeb3FormsSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const firstName = form.querySelector('#firstName')?.value || '';
        const lastName = form.querySelector('#lastName')?.value || '';
        const fullNameField = form.querySelector('#fullName');
        
        // Combine firstName and lastName into fullName for Web3Forms
        if (fullNameField && firstName && lastName) {
            fullNameField.value = `${firstName} ${lastName}`.trim();
        } else if (fullNameField && firstName) {
            fullNameField.value = firstName;
        } else if (fullNameField && lastName) {
            fullNameField.value = lastName;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Verzenden...';
        submitBtn.disabled = true;
        
        // Submit form data to Web3Forms using fetch
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showSuccessMessage(form);
                form.reset();
            } else {
                alert('Er is een fout opgetreden. Probeer het later opnieuw.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Verzenden...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showSuccessMessage(form);
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = 'Bedankt! Je bericht is verzonden.';
        successDiv.style.cssText = `
            background-color: #000;
            color: #fff;
            padding: 1rem;
            margin-top: 1rem;
            text-align: center;
            border-radius: 4px;
        `;
        
        form.appendChild(successDiv);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// ===== GALLERY FUNCTIONALITY =====
class Gallery {
    constructor() {
        this.galleryContainer = document.querySelector('.gallery-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn, .filter-tab');
        this.images = document.querySelectorAll('.gallery-item');
        this.modal = document.getElementById('photo-modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalTitle = document.getElementById('modal-title');
        this.modalDescription = document.getElementById('modal-description');
        this.modalDate = document.getElementById('modal-date');
        this.modalClose = document.getElementById('modal-close');
        this.modalBackdrop = document.getElementById('modal-backdrop');
        this.modalPrev = document.getElementById('modal-prev');
        this.modalNext = document.getElementById('modal-next');
        this.currentImageIndex = 0;
        this.visibleImages = [];
        this.currentFilter = 'all';
        
        // Photo Album System Integration
        this.albumManager = null;
        this.albumRenderer = null;
        this.apiClient = null;
        this.isDynamic = false;
        
        if (this.galleryContainer) {
            this.init();
        }
    }
    
    init() {
        // Check if dynamic albums are enabled
        if (typeof PhotoAlbumConfig !== 'undefined' && PhotoAlbumConfig.USE_DYNAMIC_ALBUMS) {
            this.initDynamicGallery();
        } else {
            this.initStaticGallery();
        }
    }
    
    /**
     * Initialize dynamic gallery with API integration
     */
    async initDynamicGallery() {
        this.isDynamic = true;
        
        // Initialize photo album system
        if (typeof PhotoAlbumAPI !== 'undefined' && typeof PhotoAlbumManager !== 'undefined' && typeof PhotoAlbumRenderer !== 'undefined') {
            this.apiClient = new PhotoAlbumAPI(PhotoAlbumConfig);
            this.albumManager = new PhotoAlbumManager(this.apiClient);
            this.albumRenderer = new PhotoAlbumRenderer('gallery-grid', PhotoAlbumConfig);
            
            // Load initial photos
            await this.loadDynamicPhotos();
        } else {
            console.warn('Photo Album system not loaded. Falling back to static gallery.');
            this.initStaticGallery();
        }
        
        // Setup modal and filters (same for both static and dynamic)
        this.setupModal();
        this.setupFilters();
    }
    
    /**
     * Initialize static gallery from HTML
     */
    initStaticGallery() {
        this.isDynamic = false;
        
        // If dynamic system is available, extract static photos for compatibility
        if (typeof PhotoAlbumManager !== 'undefined') {
            // Create a dummy API client for static mode
            const dummyApi = {
                config: { USE_DYNAMIC_ALBUMS: false },
                normalizeData: (data) => data
            };
            this.albumManager = new PhotoAlbumManager(dummyApi);
            const staticPhotos = this.albumManager.extractStaticPhotos();
            this.allPhotos = staticPhotos;
        }
        
        // Setup event listeners
        this.setupModal();
        this.setupFilters();
        
        // Setup gallery item clicks
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => this.openModal(index));
        });
        
        // Initial filter state
        this.currentFilter = 'all';
        this.updateVisibleImages();
    }
    
    /**
     * Setup modal functionality
     */
    setupModal() {
        if (!this.modal) return;
        
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalBackdrop.addEventListener('click', () => this.closeModal());
        this.modalPrev.addEventListener('click', () => this.previousImage());
        this.modalNext.addEventListener('click', () => this.nextImage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }
    
    /**
     * Setup filter functionality
     */
    setupFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterImages(e));
        });
    }
    
    /**
     * Load photos dynamically from API
     */
    async loadDynamicPhotos(filters = {}, append = false) {
        if (!this.albumManager || !this.albumRenderer) return;
        
        this.albumRenderer.showLoading();
        
        try {
            const photos = await this.albumManager.loadPhotos(filters, 1);
            this.allPhotos = photos;
            
            this.albumRenderer.renderPhotos(photos, append);
            
            // Setup click handlers for dynamically rendered items
            this.setupDynamicClickHandlers();
            
            // Update visible images for filtering
            this.updateVisibleImages();
            
            // Show load more if there are more photos
            if (this.albumManager.hasMore) {
                this.albumRenderer.showLoadMore(() => this.loadMorePhotos(filters));
            }
        } catch (error) {
            console.error('Error loading photos:', error);
        } finally {
            this.albumRenderer.hideLoading();
        }
    }
    
    /**
     * Load more photos (pagination)
     */
    async loadMorePhotos(filters = {}) {
        if (!this.albumManager || !this.albumRenderer) return;
        
        this.albumManager.currentPage++;
        const photos = await this.albumManager.loadPhotos(filters, this.albumManager.currentPage);
        
        if (photos.length > 0) {
            this.allPhotos = [...this.allPhotos, ...photos];
            this.albumRenderer.renderPhotos(photos, true);
            this.setupDynamicClickHandlers();
            this.updateVisibleImages();
            
            if (!this.albumManager.hasMore) {
                this.albumRenderer.hideLoadMore();
            }
        } else {
            this.albumRenderer.hideLoadMore();
        }
    }
    
    /**
     * Setup click handlers for dynamically rendered gallery items
     */
    setupDynamicClickHandlers() {
        if (!this.isDynamic) return;
        
        const items = this.galleryContainer.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            // Remove existing listeners (if any)
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add click listener
            newItem.addEventListener('click', () => {
                const photoIndex = this.allPhotos.findIndex(p => p.id === newItem.dataset.photoId);
                this.openModal(photoIndex >= 0 ? photoIndex : index);
            });
        });
    }
    
    filterImages(e) {
        const filter = e.target.dataset.filter;
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update current filter
        this.currentFilter = filter;
        
        if (this.isDynamic) {
            // Load filtered photos from API
            const filters = {};
            if (filter !== 'all') {
                if (['2024', '2023'].includes(filter)) {
                    filters.year = filter;
                } else {
                    filters.category = filter;
                }
            }
            this.loadDynamicPhotos(filters, false);
        } else {
            // Filter static images
            this.updateVisibleImages();
        }
    }
    
    /**
     * Update visible images based on current filter
     */
    updateVisibleImages() {
        this.visibleImages = [];
        this.images = document.querySelectorAll('.gallery-item');
        
        this.images.forEach((img, index) => {
            const categories = (img.dataset.category || '').split(' ').filter(c => c);
            const year = img.dataset.year;
            
            if (this.currentFilter === 'all' || 
                categories.includes(this.currentFilter) || 
                year === this.currentFilter) {
                img.classList.remove('hidden');
                this.visibleImages.push(index);
            } else {
                img.classList.add('hidden');
            }
        });
    }
    
    openModal(index) {
        this.currentImageIndex = this.visibleImages.indexOf(index);
        if (this.currentImageIndex === -1) {
            this.currentImageIndex = 0;
        }
        this.updateModalContent();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    previousImage() {
        if (this.visibleImages.length === 0) return;
        
        this.currentImageIndex = (this.currentImageIndex - 1 + this.visibleImages.length) % this.visibleImages.length;
        this.updateModalContent();
    }
    
    nextImage() {
        if (this.visibleImages.length === 0) return;
        
        this.currentImageIndex = (this.currentImageIndex + 1) % this.visibleImages.length;
        this.updateModalContent();
    }
    
    updateModalContent() {
        if (this.visibleImages.length === 0) return;
        
        const imageIndex = this.visibleImages[this.currentImageIndex];
        const image = this.images[imageIndex];
        
        if (!image) return;
        
        const img = image.querySelector('.gallery-image');
        const overlay = image.querySelector('.gallery-overlay');
        
        if (!img || !overlay) return;
        
        // Use full resolution image in modal if available
        const fullUrl = img.dataset.fullUrl || img.src.replace('thumbnail', 'full') || img.src;
        this.modalImage.src = fullUrl;
        this.modalImage.alt = img.alt;
        
        const titleEl = overlay.querySelector('.gallery-title');
        const descEl = overlay.querySelector('.gallery-description');
        const dateEl = overlay.querySelector('.gallery-date');
        
        this.modalTitle.textContent = titleEl ? titleEl.textContent : '';
        this.modalDescription.textContent = descEl ? descEl.textContent : '';
        this.modalDate.textContent = dateEl ? dateEl.textContent : '';
        
        // Update navigation buttons
        this.modalPrev.disabled = this.visibleImages.length <= 1;
        this.modalNext.disabled = this.visibleImages.length <= 1;
    }
}

// ===== MEMBER MODAL =====
class MemberModal {
    constructor() {
        this.modal = document.getElementById('member-modal');
        this.modalPhoto = document.getElementById('member-modal-photo');
        this.modalName = document.getElementById('member-modal-title');
        this.closeBtn = document.getElementById('member-modal-close');
        this.modalBackdrop = document.getElementById('member-modal-backdrop');
        this.memberCards = document.querySelectorAll('.member-card');
        
        // Get modal elements - query within modal for safety
        if (this.modal) {
            this.modalYear = this.modal.querySelector('.modal-member-year');
            this.modalRole = this.modal.querySelector('.modal-member-role');
            
            // Debug: check if elements exist
            if (!this.modalYear) {
                console.warn('Modal year element not found');
            }
            if (!this.modalRole) {
                console.warn('Modal role element not found');
            }
            
            this.init();
        }
    }
    
    init() {
        this.memberCards.forEach(card => {
            card.addEventListener('click', (e) => this.openModal(e));
        });
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => this.closeModal());
        }
        
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal(e) {
        const card = e.currentTarget;
        const photo = card.querySelector('.member-photo');
        const nameEl = card.querySelector('.member-name');
        const yearEl = card.querySelector('.member-year');
        const roleEl = card.querySelector('.member-role');
        
        if (!photo || !nameEl || !yearEl || !roleEl) {
            console.error('Member card missing required elements');
            return;
        }
        
        const name = nameEl.textContent.trim();
        const year = yearEl.textContent.trim();
        const role = roleEl.textContent.trim();
        
        console.log('Opening modal for:', name, 'Role:', role); // Debug
        
        // Populate modal with member data
        this.modalPhoto.src = photo.src;
        this.modalPhoto.alt = photo.alt || name;
        this.modalName.textContent = name;
        
        // Populate year
        if (this.modalYear) {
            this.modalYear.textContent = year;
        } else {
            console.error('Modal year element not found when trying to populate');
        }
        
        // Populate role - ensure element exists
        if (this.modalRole) {
            this.modalRole.textContent = role;
            console.log('Role set to:', this.modalRole.textContent); // Debug
        } else {
            console.error('Modal role element not found when trying to populate');
            // Try to find it again
            this.modalRole = this.modal.querySelector('.modal-member-role');
            if (this.modalRole) {
                this.modalRole.textContent = role;
                console.log('Role element found on retry, set to:', role);
            }
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== MEMBER FILTERING =====
class MemberFiltering {
    constructor() {
        this.memberCards = document.querySelectorAll('.member-card');
        this.yearFilter = document.getElementById('year-filter');
        this.specializationFilter = document.getElementById('specialization-filter');
        this.searchInput = document.getElementById('search-input');
        
        // Only initialize if we have member cards and at least one filter element
        if (this.memberCards.length > 0 && (this.yearFilter || this.specializationFilter || this.searchInput)) {
            this.init();
        }
    }
    
    init() {
        if (this.yearFilter) {
            this.yearFilter.addEventListener('change', () => this.filterMembers());
        }
        
        if (this.specializationFilter) {
            this.specializationFilter.addEventListener('change', () => this.filterMembers());
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', Utils.debounce(() => this.filterMembers(), 300));
        }
    }
    
    filterMembers() {
        const yearFilter = this.yearFilter ? this.yearFilter.value : 'all';
        const specializationFilter = this.specializationFilter ? this.specializationFilter.value : 'all';
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
        
        this.memberCards.forEach(card => {
            // Extract data from HTML content instead of data attributes
            const yearEl = card.querySelector('.member-year');
            const roleEl = card.querySelector('.member-role');
            const nameEl = card.querySelector('.member-name');
            
            const year = yearEl ? yearEl.textContent.trim().replace('Jaar ', '') : '';
            const role = roleEl ? roleEl.textContent.trim().toLowerCase() : '';
            const name = nameEl ? nameEl.textContent.trim().toLowerCase() : '';
            
            const yearMatch = yearFilter === 'all' || year === yearFilter;
            const specializationMatch = specializationFilter === 'all' || role.includes(specializationFilter.toLowerCase());
            const searchMatch = searchTerm === '' || 
                name.includes(searchTerm) || 
                (role && role.includes(searchTerm));
            
            if (yearMatch && specializationMatch && searchMatch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

// ===== DONATION FORM FUNCTIONALITY =====
class DonationForm {
    constructor() {
        this.amountButtons = document.querySelectorAll('.amount-btn');
        this.customAmountInput = document.getElementById('custom-amount');
        this.totalAmountDisplay = document.getElementById('total-amount');
        this.donationForm = document.getElementById('donation-form');
        this.selectedAmount = 0;
        
        if (this.amountButtons.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Amount button clicks
        this.amountButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAmount(e));
        });
        
        // Custom amount input
        if (this.customAmountInput) {
            this.customAmountInput.addEventListener('input', () => this.updateCustomAmount());
        }
        
        // Form submission
        if (this.donationForm) {
            this.donationForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    selectAmount(e) {
        // Remove active class from all buttons
        this.amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Update selected amount
        this.selectedAmount = parseInt(e.target.dataset.amount);
        this.updateTotal();
        
        // Clear custom amount input
        if (this.customAmountInput) {
            this.customAmountInput.value = '';
        }
    }
    
    updateCustomAmount() {
        const customAmount = parseInt(this.customAmountInput.value) || 0;
        
        if (customAmount > 0) {
            // Remove active class from amount buttons
            this.amountButtons.forEach(btn => btn.classList.remove('active'));
            
            this.selectedAmount = customAmount;
            this.updateTotal();
        }
    }
    
    updateTotal() {
        if (this.totalAmountDisplay) {
            this.totalAmountDisplay.textContent = `€${this.selectedAmount}`;
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.selectedAmount === 0) {
            alert('Selecteer een bedrag om te doneren.');
            return;
        }
        
        // Show loading state
        const submitBtn = this.donationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Donatie verwerken...';
        submitBtn.disabled = true;
        
        // Simulate donation processing (replace with actual payment integration)
        setTimeout(() => {
            this.showSuccessMessage();
            this.donationForm.reset();
            this.selectedAmount = 0;
            this.updateTotal();
            this.amountButtons.forEach(btn => btn.classList.remove('active'));
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'donation-success';
        successDiv.innerHTML = `
            <h3>Bedankt voor je donatie!</h3>
            <p>Je donatie van €${this.selectedAmount} is succesvol verwerkt. Je ontvangt een bevestiging per e-mail.</p>
        `;
        successDiv.style.cssText = `
            background-color: #000;
            color: #fff;
            padding: 2rem;
            margin-top: 2rem;
            text-align: center;
            border-radius: 8px;
        `;
        
        this.donationForm.appendChild(successDiv);
        
        // Remove success message after 10 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 10000);
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// ===== FAQ FUNCTIONALITY =====
class FAQ {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => this.toggleFAQ(item, question, answer));
            }
        });
    }
    
    toggleFAQ(item, question, answer) {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                
                if (otherQuestion && otherAnswer) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('active');
                }
            }
        });
        
        // Toggle current FAQ item
        if (isExpanded) {
            question.setAttribute('aria-expanded', 'false');
            answer.classList.remove('active');
        } else {
            question.setAttribute('aria-expanded', 'true');
            answer.classList.add('active');
        }
    }
}

// ===== PLANNING PAGE FUNCTIONALITY =====
class PlanningPage {
    constructor() {
        this.timelineContainer = document.getElementById('timeline-container');
        this.eventsGrid = document.getElementById('events-grid');
        this.calendarGrid = document.getElementById('calendar-grid');
        this.currentMonthEl = document.getElementById('current-month');
        this.prevMonthBtn = document.getElementById('prev-month');
        this.nextMonthBtn = document.getElementById('next-month');
        this.events = typeof EVENTS_DATA !== 'undefined' ? EVENTS_DATA : [];
        
        // Always initialize
        this.init();
    }
    
    init() {
        // Render events
        this.renderTimeline();
        this.renderUpcomingEvents();
        
        // Calendar functionality
        if (this.calendarGrid) {
            this.currentDate = new Date();
            this.renderCalendar();
            
            if (this.prevMonthBtn) {
                this.prevMonthBtn.addEventListener('click', () => this.previousMonth());
            }
            
            if (this.nextMonthBtn) {
                this.nextMonthBtn.addEventListener('click', () => this.nextMonth());
            }
        }
    }
    
    getMonthAbbr(monthIndex) {
        const months = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
        return months[monthIndex];
    }
    
    sortEventsByDate(events) {
        return [...events].sort((a, b) => {
            const dateA = new Date(a.year, a.month, a.day);
            const dateB = new Date(b.year, b.month, b.day);
            return dateA - dateB;
        });
    }
    
    renderTimeline() {
        if (!this.timelineContainer) return;
        
        this.timelineContainer.innerHTML = '';
        
        const sortedEvents = this.sortEventsByDate(this.events);
        
        sortedEvents.forEach(event => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            item.innerHTML = `
                <div class="timeline-date">
                    <span class="date-day">${event.day}</span>
                    <span class="date-month">${this.getMonthAbbr(event.month)}</span>
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${event.title}</h3>
                    <p class="timeline-description">${event.description}</p>
                    <div class="timeline-meta">
                        <span class="timeline-location">📍 ${event.location}</span>
                        <span class="timeline-time">${event.time}</span>
                    </div>
                    ${event.link ? `<a href="${event.link}" class="timeline-link">Meer informatie</a>` : ''}
                </div>
            `;
            
            this.timelineContainer.appendChild(item);
        });
    }
    
    renderUpcomingEvents() {
        if (!this.eventsGrid) return;
        
        this.eventsGrid.innerHTML = '';
        
        const today = new Date();
        const upcomingEvents = this.sortEventsByDate(this.events)
            .filter(event => {
                const eventDate = new Date(event.year, event.month, event.day);
                return eventDate >= today;
            })
            .slice(0, 3); // Show only first 3 upcoming events
        
        if (upcomingEvents.length === 0) {
            this.eventsGrid.innerHTML = '<p style="color: #999; grid-column: 1 / -1; text-align: center;">Geen aankomende evenementen</p>';
            return;
        }
        
        upcomingEvents.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            
            card.innerHTML = `
                <div class="event-date">
                    <span class="event-day">${event.day}</span>
                    <span class="event-month">${this.getMonthAbbr(event.month)}</span>
                </div>
                <div class="event-info">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span class="event-location">📍 ${event.location}</span>
                        <span class="event-time">${event.time}</span>
                    </div>
                    ${event.link ? `<a href="${event.link}" class="event-link">${event.link.includes('introkamp') ? 'Aanmelden' : 'Meer informatie'}</a>` : ''}
                </div>
            `;
            
            this.eventsGrid.appendChild(card);
        });
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        if (this.currentMonthEl) {
            const monthNames = [
                'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
            ];
            this.currentMonthEl.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Clear calendar
        if (this.calendarGrid) {
            this.calendarGrid.innerHTML = '';
            
            // Add day headers
            const dayHeaders = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
            dayHeaders.forEach(day => {
                const header = document.createElement('div');
                header.className = 'calendar-day-header';
                header.textContent = day;
                this.calendarGrid.appendChild(header);
            });
            
            // Get first day of month and number of days
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
            
            // Add empty cells for days before month starts
            for (let i = 0; i < startingDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day';
                this.calendarGrid.appendChild(emptyDay);
            }
            
            // Add days of month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day';
                
                const dayNumber = document.createElement('div');
                dayNumber.className = 'calendar-day-number';
                dayNumber.textContent = day;
                dayEl.appendChild(dayNumber);
                
                // Check if there's an event on this day
                if (this.hasEventOnDay(day, month, year)) {
                    dayEl.classList.add('has-event');
                    const event = document.createElement('div');
                    event.className = 'calendar-event';
                    event.textContent = 'BOLD Event';
                    dayEl.appendChild(event);
                }
                
                this.calendarGrid.appendChild(dayEl);
            }
        }
    }
    
    hasEventOnDay(day, month, year) {
        return this.events.some(event => 
            event.day === day && 
            event.month === month && 
            event.year === year
        );
    }
    
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }
}

// ===== GRID ITEM IMAGE MODAL =====
class GridItemModal {
    constructor() {
        this.modal = document.getElementById('grid-item-modal');
        this.modalImage = document.getElementById('grid-item-modal-image');
        this.modalBackdrop = document.getElementById('grid-item-modal-backdrop');
        this.gridItems = document.querySelectorAll('.hero-grid .grid-item img');
        
        if (this.modal && this.gridItems.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Add click listeners to all grid item images
        this.gridItems.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal(img.src, img.alt);
            });
        });
        
        // Close modal when clicking backdrop (outside the image)
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                // Only close if clicking directly on the backdrop, not on the image
                if (e.target === this.modal || e.target === this.modalBackdrop) {
                    this.closeModal();
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal(imageSrc, imageAlt) {
        if (this.modalImage) {
            this.modalImage.src = imageSrc;
            this.modalImage.alt = imageAlt || 'Image';
        }
        
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
}

// ===== INITIALIZATION =====
// Set overlay state on page load (before DOMContentLoaded)
(function() {
    const isTransitioning = sessionStorage.getItem('pageTransitioning') === 'true';
    const overlay = document.getElementById('page-transition-overlay');
    
    if (overlay) {
        if (isTransitioning) {
            // Page is transitioning: overlay is already at center (0%) from previous page's swipe-in
            // Set it without animation to prevent any visual glitch and ensure it covers screen
            overlay.style.transform = 'translateX(0)';
            overlay.style.transition = 'none';
            overlay.style.pointerEvents = 'all';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            overlay.style.zIndex = '10000';
            overlay.classList.add('pending');
            
            // Make documentElement visible (was hidden by inline script in head)
            // But keep body hidden until overlay is ready
            document.documentElement.style.visibility = 'visible';
            if (document.body) {
                document.body.style.visibility = 'hidden';
                document.body.style.overflow = 'hidden';
            }
        } else {
            // Normal load: overlay off-screen right
            overlay.style.transform = 'translateX(100%)';
            overlay.style.transition = 'none';
            overlay.classList.add('pending');
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation first (which handles page transitions)
    const navigation = new Navigation();
    
    // Initialize all other components
    new ScrollEffects();
    new FormHandler();
    new Gallery();
    new MemberModal();
    new MemberFiltering();
    new DonationForm();
    new FAQ();
    new PlanningPage();
    new GridItemModal();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
        const imageLoader = new Image();
        imageLoader.src = img.dataset.src || img.src;
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    // Log performance metrics in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});
