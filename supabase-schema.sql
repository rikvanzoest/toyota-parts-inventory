-- Toyota Used Parts Inventory Database Schema
-- Run this SQL in your Supabase SQL Editor

-- IMPORTANT: This will delete your existing table and all data!
-- Drop the old table structure
DROP TABLE IF EXISTS toyota_parts CASCADE;

-- Create the toyota_parts table for used car parts
CREATE TABLE IF NOT EXISTS toyota_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  part_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  
  -- Source Vehicle Information
  vehicle_year INTEGER NOT NULL,
  vehicle_make VARCHAR(50) NOT NULL DEFAULT 'Toyota',
  vehicle_model VARCHAR(100) NOT NULL,
  vehicle_trim VARCHAR(100),
  
  -- Part Condition
  condition VARCHAR(50) NOT NULL,
  condition_notes TEXT,
  
  -- Pricing and Availability (price can be numeric or "Call")
  price VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  
  -- Photos (stores URLs or base64 strings, max 2 photos)
  photo_1 TEXT,
  photo_2 TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_part_name ON toyota_parts(part_name);
CREATE INDEX IF NOT EXISTS idx_category ON toyota_parts(category);
CREATE INDEX IF NOT EXISTS idx_vehicle_model ON toyota_parts(vehicle_model);
CREATE INDEX IF NOT EXISTS idx_vehicle_year ON toyota_parts(vehicle_year);
CREATE INDEX IF NOT EXISTS idx_condition ON toyota_parts(condition);

-- Enable Row Level Security (RLS)
ALTER TABLE toyota_parts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can customize this later)
CREATE POLICY "Enable all operations for authenticated users" ON toyota_parts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_toyota_parts_updated_at ON toyota_parts;
CREATE TRIGGER update_toyota_parts_updated_at
  BEFORE UPDATE ON toyota_parts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for used Toyota parts
INSERT INTO toyota_parts (part_name, category, vehicle_year, vehicle_make, vehicle_model, vehicle_trim, condition, condition_notes, price, quantity) VALUES
  ('Front Bumper Cover', 'Body Parts', 2018, 'Toyota', 'Camry', 'SE', 'Good', 'Minor scratches on passenger side, paint is faded', '250.00', 1),
  ('Driver Side Door', 'Body Parts', 2019, 'Toyota', 'Corolla', 'LE', 'Excellent', 'No dents or scratches, includes interior panel', '350.00', 1),
  ('Headlight Assembly (Driver)', 'Lighting', 2020, 'Toyota', 'RAV4', 'XLE', 'Excellent', 'LED headlight, perfect working condition', '175.00', 1),
  ('Transmission (Automatic)', 'Engine & Drivetrain', 2017, 'Toyota', 'Camry', 'LE', 'Good', '95k miles, shifts smoothly, no leaks', 'Call', 1),
  ('Front Passenger Seat', 'Interior', 2019, 'Toyota', 'Highlander', 'Limited', 'Good', 'Leather, minor wear on bolster', '200.00', 1),
  ('Rear Bumper Cover', 'Body Parts', 2016, 'Toyota', 'Tacoma', 'SR5', 'Fair', 'Some scratches and dents, needs paint', '150.00', 1),
  ('Alternator', 'Electrical', 2018, 'Toyota', 'Corolla', 'SE', 'Excellent', 'Tested, works perfectly, 60k miles', '125.00', 1),
  ('Catalytic Converter', 'Exhaust', 2019, 'Toyota', 'Prius', 'Prime', 'Good', 'No check engine light, passes emissions', 'Call', 1),
  ('Dashboard', 'Interior', 2020, 'Toyota', 'Camry', 'XSE', 'Excellent', 'No cracks, includes vents and trim', '300.00', 1),
  ('Tail Light Assembly (Passenger)', 'Lighting', 2017, 'Toyota', '4Runner', 'SR5', 'Good', 'One small crack in lens, still functions', '85.00', 1),
  ('Hood', 'Body Parts', 2018, 'Toyota', 'Camry', 'LE', 'Fair', 'Several small dents, needs paint', '175.00', 1),
  ('Steering Wheel', 'Interior', 2021, 'Toyota', 'RAV4', 'TRD Off-Road', 'Excellent', 'Leather wrapped, includes controls', '150.00', 1),
  ('Radiator', 'Cooling System', 2016, 'Toyota', 'Tacoma', 'TRD Sport', 'Good', 'No leaks, holds pressure', '180.00', 1),
  ('Front Axle Assembly', 'Suspension', 2019, 'Toyota', 'Highlander', 'XLE', 'Good', 'Includes CV axles, boots intact', '250.00', 1),
  ('Engine (2.5L 4-Cylinder)', 'Engine & Drivetrain', 2020, 'Toyota', 'Camry', 'SE', 'Good', '45k miles, runs great, no issues', 'Call', 1)
ON CONFLICT DO NOTHING;
