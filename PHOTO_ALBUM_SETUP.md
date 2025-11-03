# Photo Album System - Setup Guide

This document explains how to use and configure the scalable photo album system for the fotoboek page.

## Overview

The photo album system is designed to work seamlessly with both static HTML content (current setup) and dynamic API-driven content (when backend is ready). The front-end structure remains unchanged - only the data source changes.

## Architecture

The system consists of four main components:

1. **photo-album-config.js** - Configuration file for API endpoints and feature flags
2. **photo-album-api.js** - API client with placeholder methods for backend integration
3. **photo-album-manager.js** - Data management layer with caching
4. **photo-album-renderer.js** - Rendering engine for albums and photos

## Current Status

**Dynamic Albums: DISABLED** (`USE_DYNAMIC_ALBUMS: false`)

The system currently works with static HTML content. The gallery extracts photos from existing HTML elements and maintains full backward compatibility.

## Enabling Dynamic Albums

When your backend is ready, follow these steps:

### 1. Update Configuration

Edit `photo-album-config.js`:

```javascript
const PhotoAlbumConfig = {
    USE_DYNAMIC_ALBUMS: true,  // Change to true
    API_BASE_URL: 'https://your-api-url.com',  // Set your API URL
    
    ENDPOINTS: {
        ALBUMS: '/api/albums',
        PHOTOS: '/api/photos',
        UPLOAD: '/api/upload',
        SEARCH: '/api/search'
    },
    
    // ... rest of config
};
```

### 2. Backend API Requirements

Your backend should implement the following endpoints:

#### GET `/api/albums`
Fetch albums with pagination.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `year` (string, optional) - Filter by year

**Response:**
```json
{
    "albums": [
        {
            "id": 1,
            "title": "Introkamp 2024",
            "year": "2024",
            "cover_url": "https://...",
            "description": "Album description",
            "created_at": "2024-09-15T00:00:00Z"
        }
    ],
    "total": 10,
    "page": 1
}
```

#### GET `/api/photos`
Fetch photos with filters.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `album_id` (number, optional) - Filter by album
- `category` (string, optional) - Filter by category
- `year` (string, optional) - Filter by year
- `tags` (string, optional) - Filter by tags

**Response:**
```json
{
    "photos": [
        {
            "id": 1,
            "album_id": 1,
            "url": "https://.../full.jpg",
            "thumbnail_url": "https://.../thumb.jpg",
            "uploader": "John Doe",
            "created_at": "2024-09-15T00:00:00Z",
            "tags": ["introkamp", "workshop"],
            "alt": "Photo description"
        }
    ],
    "total": 50,
    "page": 1
}
```

#### GET `/api/search`
Search albums and photos.

**Query Parameters:**
- `q` (string) - Search query
- `page` (number) - Page number

**Response:**
```json
{
    "albums": [...],
    "photos": [...],
    "total": 25
}
```

#### POST `/api/upload`
Upload photos (admin only - requires authentication).

**Request:** `multipart/form-data`
- `files[]` - Array of image files
- `album_id` (number) - Target album ID
- `album_name` (string, optional) - Create new album with this name
- `tags` (string, optional) - Comma-separated tags

**Response:**
```json
{
    "success": true,
    "photos": [...]
}
```

### 3. Database Schema

The system expects the following database structure:

#### `albums` table:
```sql
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year VARCHAR(4),
    cover_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `photos` table:
```sql
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    uploader VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    tags TEXT[],
    alt TEXT
);
```

### 4. Field Mapping

If your database uses different field names, update `FIELD_MAPPING` in `photo-album-config.js`:

```javascript
FIELD_MAPPING: {
    album: {
        id: 'id',              // Your DB field: 'Internal name'
        title: 'title',
        year: 'year',
        coverUrl: 'cover_url',  // Maps 'cover_url' DB field to 'coverUrl' internal
        // ...
    },
    photo: {
        // ...
    }
}
```

## Features

### Lazy Loading
Images are lazy-loaded using Intersection Observer API. Configure threshold in config:
```javascript
LAZY_LOAD_THRESHOLD: 0.1  // Start loading when 10% visible
```

### Pagination
Photos are loaded in pages. Configure page size:
```javascript
PHOTOS_PER_PAGE: 20
```

### Caching
The PhotoAlbumManager caches responses to reduce API calls. Cache is cleared when filters change.

### Filtering
The existing filter buttons work with both static and dynamic content. Filters are automatically mapped to API parameters.

## Customization

### Adding Custom Fields

To add custom fields to photos or albums:

1. Update the API response normalization in `photo-album-api.js`
2. Update the renderer in `photo-album-renderer.js` to display the new fields
3. Update the field mapping in `photo-album-config.js` if needed

### Styling

All gallery styles are in `styles.css`. Key classes:
- `.gallery-item` - Individual photo item
- `.gallery-loader` - Loading indicator
- `.load-more-btn` - Load more button
- `.album-card` - Album card (for future albums overview)

### Admin Upload Interface

To add an admin upload interface:

1. Create an admin page with file upload form
2. Use `PhotoAlbumAPI.uploadPhotos()` method
3. Implement authentication/authorization as needed

Example:
```javascript
const api = new PhotoAlbumAPI(PhotoAlbumConfig);
const formData = new FormData();
formData.append('files[]', fileInput.files[0]);
formData.append('album_id', albumId);

const result = await api.uploadPhotos(formData);
```

## Troubleshooting

### Photos not loading
- Check browser console for API errors
- Verify `USE_DYNAMIC_ALBUMS` is set correctly
- Ensure API endpoints are accessible
- Check CORS settings on backend

### Filters not working
- Verify filter buttons have `data-filter` attributes
- Check that API returns filtered results correctly
- Ensure category/year fields match filter values

### Images not lazy loading
- Verify `LAZY_LOAD_ENABLED` is `true` in config
- Check browser support for Intersection Observer
- Ensure images have `data-src` attribute

## Migration Path

1. **Phase 1 (Current)**: Static HTML works as-is
2. **Phase 2**: Enable dynamic albums, keep static as fallback
3. **Phase 3**: Fully migrate to dynamic system
4. **Phase 4**: Add admin upload interface
5. **Phase 5**: Add albums overview page

## Support

For questions or issues, check:
- Browser console for JavaScript errors
- Network tab for API request/response details
- Configuration file for correct settings

