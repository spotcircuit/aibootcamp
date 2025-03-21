# AI Bootcamp Application

A Next.js application for an AI Bootcamp, featuring event registration, curriculum information, and admin functionality.

## Features

- Home page with curriculum overview
- Event calendar and registration
- Registration form for users
- Admin dashboard with events, users, and email management
- Dark mode support with system preference detection
- Responsive design for all devices
- PostgreSQL database integration with Supabase

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database (local or cloud-based)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/aibootcamp.git
cd aibootcamp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL credentials.

5. Run the database migrations:

```bash
npm run db:migrate
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Options

This application can be used with different PostgreSQL providers:

- **Neon**: Recommended for serverless deployments
- **Supabase**: Good if you need additional backend features
- **Upstash**: Consider if you also need Redis

See `DB_PROVIDER_COMPARISON.md` for detailed information.

## Deployment

This application is ready to deploy on Vercel. See `DEPLOYMENT.md` for detailed instructions.

## Project Structure

```
/
├── components/        # React components
├── lib/               # Utility functions and database client
├── pages/             # Next.js pages and API routes
│   ├── api/           # API endpoints
│   ├── admin/         # Admin dashboard and management pages
│   └── ...            # Page components
├── public/            # Static assets
├── scripts/           # Utility scripts like migrations
├── database/          # SQL schema and database utilities
├── styles/            # CSS styles
└── ...                # Configuration files
```

## Database Schema

The application uses PostgreSQL with the following tables:

- `profiles`: User profiles with admin status
- `events`: Bootcamp events schedule
- `event_registrations`: User registrations for events
- `email_logs`: Logs of emails sent by admins

## Admin Features

The application includes a comprehensive admin panel with the following features:

### Events Management
- Add, edit, and delete events
- View registration status for each event

### User Management
- View all registered users
- Edit user details
- Grant or revoke admin privileges

### Email Communication
- Send targeted emails to specific users
- Use email templates for common communications
- View history of sent emails

## Setting Up Admin Access

To set up the first admin user:

1. Register a normal user account
2. Run the admin initialization script with the user's email:

```bash
node database/initialize_admin.js user@example.com
```

This will grant admin privileges to the specified user.

## Dark Mode

The application supports dark mode through:

- System preference detection
- Manual toggle in the navigation bar
- Persistent user preference storage

## License

ISC
