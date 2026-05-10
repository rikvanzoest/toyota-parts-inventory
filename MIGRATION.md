# Database Migration Guide - Used Parts Update

## If You Already Have Data in Your Database

If you've already been using the previous schema, you'll need to update your database. Here are your options:

### Option 1: Fresh Start (Recommended if you don't have important data)

1. Go to Supabase SQL Editor
2. Run this to delete the old table:
   ```sql
   DROP TABLE IF EXISTS toyota_parts;
   ```
3. Run the entire new `supabase-schema.sql` file

### Option 2: Migrate Existing Data

If you want to keep some existing data, you'll need to manually migrate. Contact me for a custom migration script based on what data you want to preserve.

## What Changed

### Removed Fields:
- `part_number` - No longer needed for used parts
- `stock_quantity` & `min_stock_level` - Replaced with simple `quantity`
- `compatible_models` - Replaced with specific vehicle info
- `description` - Replaced with `condition_notes`

### Added Fields:
- `vehicle_year` - Year of source vehicle
- `vehicle_make` - Make (defaults to Toyota)
- `vehicle_model` - Model (Camry, Corolla, etc.)
- `vehicle_trim` - Trim level (LE, SE, XLE, etc.)
- `condition` - Part condition (Excellent, Good, Fair, Poor, For Parts Only)
- `condition_notes` - Specific notes about condition
- `quantity` - Simple quantity field

## After Running the New Schema

You'll have 15 sample used parts with realistic data for salvage parts including:
- Body parts (bumpers, doors, hoods)
- Engine components (transmissions, alternators)
- Interior parts (seats, dashboards, steering wheels)
- Lighting (headlights, tail lights)
- And more!

Each part has:
- Specific vehicle information (Year/Model/Trim)
- Condition rating
- Detailed condition notes
- Realistic pricing for used parts

## Need Help?

If you have existing data you want to preserve, let me know what data you have and I can create a custom migration script.
