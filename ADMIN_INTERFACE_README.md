# Admin Interface Documentation

## Overview

The Admin Interface provides a comprehensive dashboard for managing the MovieStream platform. It includes movie management, user management, analytics dashboard, and system settings.

## Features

### 1. Dashboard (`/admin`)
- **Key Metrics**: Total users, movies, views, and new users
- **Charts**: 
  - User growth over time (line chart)
  - Movie genre distribution (pie chart)
  - Most watched movies (bar chart)
- **Recent Activity**: Live feed of platform activities
- **Real-time Statistics**: Updated dashboard with mock data

### 2. Movie Management (`/admin/movies`)
- **Movie Listing**: Paginated table with search and filter capabilities
- **Movie CRUD Operations**:
  - Add new movies with complete metadata
  - Edit existing movie details
  - Delete movies with confirmation
- **Features**:
  - Image upload for posters
  - Genre multi-selection
  - Publication status (draft/published)
  - Release date management
  - Rating and popularity scoring

### 3. User Management (`/admin/users`)
- **User Listing**: Comprehensive user table with filters
- **User Operations**:
  - View user details and activity
  - Promote/demote admin roles
  - Activate/deactivate user accounts
  - Delete user accounts
- **User Analytics**:
  - Registration dates
  - Last login tracking
  - Purchase history
  - Watch time statistics

### 4. Settings (`/admin/settings`)
- **General Settings**:
  - Site name and description
  - Contact information
  - Default language
  - Maintenance mode toggle
- **Security Settings**:
  - Session timeout configuration
  - File upload limits
  - Security recommendations
- **Notification Settings**:
  - Email notifications
  - Push notifications
  - Event type preferences
- **System Settings**:
  - Analytics toggle
  - Backup frequency
  - Log retention policies
  - System health monitoring

## Authentication & Authorization

### Access Control
- **Authentication Required**: All admin routes require valid authentication
- **Role-based Access**: Only users with `admin` role can access admin interface
- **Session Management**: Automatic logout on session expiration
- **Redirect Handling**: Unauthorized users redirected to login with return URL

### Security Features
- **JWT Token Validation**: Server-side token verification
- **Role Checking**: Client and server-side admin role validation
- **Protected Routes**: Middleware protection for admin paths
- **Admin Link**: Admin navigation only visible to admin users

## Technical Implementation

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with dark theme
- **Components**: Modular React components with TypeScript
- **State Management**: React hooks and local state
- **Charts**: Recharts library for data visualization
- **Icons**: Heroicons for consistent iconography

### API Integration
- **REST APIs**: Comprehensive admin API endpoints
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Loading indicators for all async operations
- **Pagination**: Efficient data loading with pagination
- **Search & Filters**: Real-time search and filtering capabilities

### File Structure
```
src/
├── app/admin/                    # Admin route pages
│   ├── page.tsx                  # Dashboard
│   ├── movies/page.tsx           # Movie management
│   ├── users/page.tsx            # User management
│   └── settings/page.tsx         # Settings
├── components/admin/             # Admin components
│   ├── AdminLayout.tsx           # Main admin layout
│   ├── MovieForm.tsx             # Movie creation/edit form
│   └── index.ts                  # Component exports
├── apis/                         # API functions
│   └── admin.api.ts              # Admin-specific API calls
├── utils/                        # Utility functions
│   └── auth.util.ts              # Authentication helpers
└── middleware.ts                 # Route protection middleware
```

## Usage Guide

### Accessing Admin Interface
1. **Login**: Authenticate with admin credentials
2. **Navigation**: Access via `/admin` URL or header link
3. **Dashboard**: View platform overview and metrics
4. **Management**: Use sidebar navigation for different sections

### Movie Management Workflow
1. **View Movies**: Browse existing movies with search/filter
2. **Add Movie**: Click "Add Movie" → Fill form → Save
3. **Edit Movie**: Click edit icon → Modify details → Update
4. **Delete Movie**: Click delete icon → Confirm deletion

### User Management Workflow
1. **View Users**: Browse user list with role/status filters
2. **Manage Roles**: Use actions menu → Change role → Confirm
3. **User Status**: Activate/deactivate users as needed
4. **Remove Users**: Delete accounts with confirmation

### System Configuration
1. **General**: Configure site-wide settings
2. **Security**: Set timeout and file limits
3. **Notifications**: Enable/disable notification types
4. **System**: Configure backups and monitoring

## API Endpoints

### Movie Management
- `GET /api/movie/admin` - List movies with pagination
- `POST /api/movie/admin` - Create new movie
- `GET /api/movie/admin/:id` - Get movie details
- `PUT /api/movie/admin/:id` - Update movie
- `DELETE /api/movie/admin/:id` - Delete movie

### User Management
- `GET /api/user/admin` - List users with pagination
- `PUT /api/user/admin/:id` - Update user role/status
- `DELETE /api/user/admin/:id` - Delete user

### Dashboard
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/activity-logs` - Get recent activity
- `GET /api/admin/health` - System health check

### Settings
- `GET /api/admin/settings` - Get current settings
- `PUT /api/admin/settings` - Update settings

## Development Notes

### Mock Data
Currently using mock data for demonstration. Replace with actual API calls:
- Dashboard statistics
- Movie and user listings
- Activity logs
- System health data

### Environment Variables
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Required Dependencies
```json
{
  "recharts": "^2.x.x",
  "@radix-ui/react-dialog": "^1.x.x",
  "@radix-ui/react-select": "^1.x.x",
  "react-hook-form": "^7.x.x",
  "@heroicons/react": "^2.x.x"
}
```

## Future Enhancements

### Planned Features
- **Advanced Analytics**: More detailed charts and metrics
- **Bulk Operations**: Mass movie/user management
- **Export Functions**: Data export capabilities
- **Audit Logs**: Detailed activity tracking
- **Real-time Updates**: WebSocket integration for live updates
- **Content Moderation**: Automated content checking
- **Performance Monitoring**: System performance dashboards

### Security Improvements
- **Two-Factor Authentication**: Enhanced admin security
- **IP Whitelisting**: Restrict admin access by IP
- **Activity Monitoring**: Detailed admin action logging
- **Role Permissions**: Granular permission system

### UI/UX Enhancements
- **Dark/Light Theme**: Theme switching capability
- **Responsive Design**: Mobile-optimized admin interface
- **Keyboard Shortcuts**: Power user features
- **Advanced Filters**: More filtering options
- **Batch Actions**: Multiple item operations

## Support

For technical support or feature requests, contact the development team or create an issue in the project repository.
