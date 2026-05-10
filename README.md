# Toyota Parts Inventory System

A modern web application for managing Toyota car parts inventory, built with Vite.js, React, Tailwind CSS, and Supabase. Designed to track commonly purchased Toyota parts with real-time stock levels and low inventory alerts.

## Features

- ✅ **Full CRUD Operations** - Add, edit, delete, and view parts
- 📊 **Dashboard Statistics** - Total parts, low stock alerts, category counts
- 🔍 **Real-time Search** - Search by part number, name, or category
- 📦 **Stock Management** - Track quantities and set minimum stock levels
- 🚨 **Low Stock Alerts** - Visual indicators for parts below minimum stock
- 🏷️ **Category Organization** - Organized by common part categories
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Toyota Branding** - Red color scheme matching Toyota's brand

## Common Toyota Parts Included

The system comes pre-configured with categories for the most commonly purchased Toyota parts:

- **Filters** (Oil, Air, Cabin, Fuel)
- **Brake System** (Pads, Rotors, Calipers)
- **Fluids** (Oil, Transmission, Coolant)
- **Engine Parts** (Spark Plugs, Belts, Sensors)
- **Suspension** (Shocks, Struts)
- **Electrical** (Batteries, Alternators)
- **Lighting** (Bulbs, Assemblies)
- **Body Parts** (Bumpers, Mirrors)
- **Interior** (Mats, Trim)

## Tech Stack

- **Frontend**: React + Vite.js
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- A Vercel account (for deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
cd toyota-parts-inventory
npm install
\`\`\`

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to the SQL Editor
3. Copy the contents of `supabase-schema.sql` and run it in the SQL Editor
4. This will create the `toyota_parts` table with sample data

### 3. Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** > **API**
2. Copy your **Project URL** and **anon/public** key
3. Create a `.env` file in the project root:

\`\`\`bash
cp .env.example .env
\`\`\`

4. Edit `.env` and add your credentials:

\`\`\`
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### 4. Run Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your app running!

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables when prompted, or add them in the Vercel dashboard
\`\`\`

## Database Schema

The `toyota_parts` table includes:

- `id` - Unique identifier (UUID)
- `part_number` - Unique part number (e.g., "04152-YZZA1")
- `part_name` - Human-readable part name
- `category` - Part category
- `description` - Detailed description
- `price` - Part price (decimal)
- `stock_quantity` - Current stock level
- `min_stock_level` - Minimum stock threshold for alerts
- `compatible_models` - Compatible Toyota models (comma-separated)
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

## Usage

### Adding a New Part

1. Click the "Add Part" button
2. Fill in the part details:
   - Part Number (unique identifier)
   - Part Name
   - Category
   - Price
   - Stock Quantity
   - Minimum Stock Level
   - Compatible Models (optional)
3. Click "Add Part"

### Editing a Part

1. Click the edit icon (pencil) next to any part
2. Update the information
3. Click "Update Part"

### Deleting a Part

1. Click the delete icon (trash) next to any part
2. Confirm the deletion

### Searching

Use the search bar to filter parts by:
- Part number
- Part name
- Category

## Customization

### Adding New Categories

Edit the `categories` array in `src/App.jsx`:

\`\`\`javascript
const categories = [
  'Engine Parts',
  'Brake System',
  'Your New Category',
  // ... more categories
]
\`\`\`

### Changing the Color Scheme

The app uses Tailwind CSS. To change from Toyota red to another color:

1. Edit `src/App.jsx`
2. Find all instances of `red-600`, `red-700`, etc.
3. Replace with your desired color (e.g., `blue-600`, `green-600`)

## Project Structure

\`\`\`
toyota-parts-inventory/
├── public/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Additional styles
│   ├── main.jsx         # Application entry point
│   ├── index.css        # Tailwind CSS imports
│   └── supabaseClient.js # Supabase configuration
├── .env.example         # Environment variables template
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
├── supabase-schema.sql  # Database schema
└── README.md           # This file
\`\`\`

## Sample Parts Included

The database comes pre-populated with 15 commonly purchased Toyota parts:

- Oil Filters
- Air Filters
- Brake Pads & Rotors
- Fluids (Oil, Transmission, Coolant)
- Belts & Filters
- Spark Plugs
- Shock Absorbers
- Headlight Bulbs

## Security Notes

- The current setup allows all operations for testing
- For production, configure proper Row Level Security (RLS) policies in Supabase
- Never commit your `.env` file to version control
- Use environment variables for all sensitive data

## Support

For issues or questions:
1. Check the Supabase documentation: https://supabase.com/docs
2. Check the Vite documentation: https://vitejs.dev
3. Check the React documentation: https://react.dev

## License

MIT License - feel free to use this project for your business!

---

Built with ❤️ for Toyota parts management
\`\`\`
