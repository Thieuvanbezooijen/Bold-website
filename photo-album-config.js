/**
 * Photo Album Configuration
 * Configure API endpoints and feature flags here
 */

const PhotoAlbumConfig = {
    // API Configuration
    // Set to true when backend is ready, false to use static HTML
    USE_DYNAMIC_ALBUMS: false,
    
    // API Base URL (to be configured when backend is ready)
    API_BASE_URL: 'https://api.example.com',
    
    // API Endpoints
    ENDPOINTS: {
        ALBUMS: '/api/albums',
        PHOTOS: '/api/photos',
        UPLOAD: '/api/upload',
        SEARCH: '/api/search'
    },
    
    // Pagination Settings
    PHOTOS_PER_PAGE: 20,
    ALBUMS_PER_PAGE: 12,
    
    // Lazy Loading Settings
    LAZY_LOAD_ENABLED: true,
    LAZY_LOAD_THRESHOLD: 0.1, // Intersection Observer threshold
    
    // Image Optimization
    THUMBNAIL_SIZE: '300x300',
    FULL_SIZE: '1200x1200',
    
    // Data Structure Mapping
    // Maps database fields to frontend data structure
    FIELD_MAPPING: {
        album: {
            id: 'id',
            title: 'title',
            year: 'year',
            coverUrl: 'cover_url',
            description: 'description',
            createdAt: 'created_at'
        },
        photo: {
            id: 'id',
            albumId: 'album_id',
            url: 'url',
            thumbnailUrl: 'thumbnail_url',
            uploader: 'uploader',
            createdAt: 'created_at',
            tags: 'tags',
            alt: 'alt'
        }
    }
};

