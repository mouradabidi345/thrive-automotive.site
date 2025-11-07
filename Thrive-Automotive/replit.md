# Thrive Automotive - Car Detailing Website

## Overview

Thrive Automotive is a static marketing website for a car detailing business located in Midvale, UT. The site serves as an online presence to showcase services, display customer reviews, and provide contact information. This is a single-page application (SPA) with smooth scrolling navigation between sections, built with vanilla HTML, CSS, and JavaScript without any frameworks or build tools.

**Current Status**: Website completed on November 5, 2025. All sections functional with Google Maps integration, real customer reviews, and appointment booking calendar.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single-Page Static Website**
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript
- **Rationale**: Given the simple nature of a local business landing page, a framework-free approach minimizes complexity, reduces load times, and eliminates build dependencies
- **Structure**: Single-page layout with anchor-based navigation to different sections (Home, About, Reviews, Services, Contact)

**Component Organization**
- **Separation of Concerns**: Three-file structure (index.html, styles.css, script.js) provides clear separation between content, presentation, and behavior
- **Sections**: Modular content sections include hero, about, reviews, services, booking (appointment calendar), and contact

**Navigation System**
- **Fixed Navigation Bar**: Sticky header that remains visible during scroll
- **Smooth Scrolling**: JavaScript-powered smooth scroll behavior with offset calculations to account for fixed navbar height
- **Active State Management**: Dynamic highlighting of current section in navigation based on scroll position using Intersection Observer pattern

**Design Patterns**
- **Mobile-First Responsive Design**: CSS uses responsive units and flexible layouts
- **Visual Hierarchy**: Hero section with overlay effects, star ratings, and call-to-action buttons
- **Progressive Enhancement**: Core content accessible even without JavaScript, with enhanced UX when enabled

**Performance Optimizations**
- **No Build Process**: Direct serving of static files for minimal deployment complexity
- **Lightweight Dependencies**: Zero external libraries or frameworks
- **Backdrop Blur Effects**: Modern CSS features for visual polish (navbar transparency with blur)

**Appointment Booking System**
- **Interactive Calendar**: Client-side calendar widget with month navigation
- **Date Selection**: Users can select future dates (past dates and Sundays automatically disabled based on business hours)
- **Booking Form**: Collects customer information (name, phone, email), preferred time slot, service type, and vehicle details
- **Confirmation Modal**: Displays appointment summary after form submission
- **Smart Validation**: Form validates required fields and ensures a date is selected before submission
- **Business Hours Integration**: Time slots align with actual business hours (10:00 AM - 5:30 PM, Monday-Saturday)

### Backend Architecture

**Flask Backend Server**
- **Technology**: Python Flask with PostgreSQL database
- **Purpose**: Handles appointment booking submissions and provides admin interface
- **API Endpoints**:
  - POST `/api/appointments` - Create new appointment
  - GET `/api/appointments` - Retrieve all appointments
  - DELETE `/api/appointments/:id` - Delete specific appointment
- **Database**: PostgreSQL with `appointments` table storing customer bookings
- **CORS**: Enabled for frontend-backend communication

**Data Persistence**
- All appointment bookings are saved to PostgreSQL database
- Data includes: date, time, service type, customer info (name, phone, email), vehicle details
- Admin interface available at `/admin.html` to view and manage appointments

**Hosting Considerations**
- Requires Python runtime environment with Flask
- PostgreSQL database required
- Environment variables needed: DATABASE_URL (and related PG* variables)

## External Dependencies

**None Currently Implemented**

The website is completely self-contained with no external dependencies. However, potential integrations for full functionality would include:

**Recommended Future Integrations**
- **Contact Form Service**: FormSpree, Netlify Forms, or Google Forms for handling contact submissions
- **Analytics**: Google Analytics or Plausible for tracking visitor behavior
- **Review Platform Integration**: Google Business API for displaying live reviews
- **Email Service**: EmailJS or similar for contact form email delivery

**Assets**
- All styling and functionality are self-contained
- No external CSS frameworks (Bootstrap, Tailwind, etc.)
- No JavaScript libraries (jQuery, React, etc.)
- Hero background images and other media assets would be served locally