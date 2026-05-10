-- Toyota Parts Inventory Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create the toyota_parts table
CREATE TABLE IF NOT EXISTS toyota_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  part_number VARCHAR(50) UNIQUE NOT NULL,
  part_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 5,
  compatible_models TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on part_number for faster searches
CREATE INDEX IF NOT EXISTS idx_part_number ON toyota_parts(part_number);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS idx_category ON toyota_parts(category);

-- Create an index on stock_quantity for low stock alerts
CREATE INDEX IF NOT EXISTS idx_stock_quantity ON toyota_parts(stock_quantity);

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
CREATE TRIGGER update_toyota_parts_updated_at
  BEFORE UPDATE ON toyota_parts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for common Toyota parts
INSERT INTO toyota_parts (part_number, part_name, category, description, price, stock_quantity, min_stock_level, compatible_models) VALUES
  ('04152-YZZA1', 'Oil Filter', 'Filters', 'High-quality oil filter for most Toyota engines', 8.99, 50, 10, 'Camry, Corolla, RAV4, Highlander'),
  ('90915-YZZF2', 'Cabin Air Filter', 'Filters', 'Premium cabin air filter for fresh interior air', 15.99, 35, 8, 'Camry, Corolla, RAV4'),
  ('17801-YZZ02', 'Engine Air Filter', 'Filters', 'OEM engine air filter for optimal performance', 18.99, 40, 10, 'Camry, Corolla, Avalon'),
  ('04465-02270', 'Brake Pads Front', 'Brake System', 'Ceramic front brake pads for smooth stopping', 65.99, 25, 5, 'Camry, Avalon'),
  ('04466-02140', 'Brake Pads Rear', 'Brake System', 'Ceramic rear brake pads', 55.99, 20, 5, 'Camry, Avalon'),
  ('43512-06130', 'Brake Rotor Front', 'Brake System', 'Front disc brake rotor', 89.99, 15, 4, 'Camry, Avalon'),
  ('90915-03003', 'Transmission Fluid', 'Fluids', 'Toyota ATF WS transmission fluid (quart)', 12.99, 60, 15, 'Most Toyota vehicles'),
  ('00279-1QT01', 'Engine Oil 0W-20', 'Fluids', 'Toyota Synthetic 0W-20 motor oil (quart)', 9.99, 100, 20, 'Most modern Toyota engines'),
  ('08826-00180', 'Super Long Life Coolant', 'Fluids', 'Toyota Pink coolant concentrate', 22.99, 30, 8, 'All Toyota vehicles'),
  ('90080-91068', 'Serpentine Belt', 'Belts & Hoses', 'Multi-rib serpentine drive belt', 34.99, 20, 5, 'Camry, Corolla, RAV4'),
  ('16613-31050', 'Fuel Filter', 'Filters', 'In-line fuel filter', 29.99, 18, 5, 'Tundra, Tacoma, 4Runner'),
  ('81210-02400', 'LED Headlight Bulb', 'Lighting', 'OEM LED headlight replacement bulb', 125.99, 12, 3, 'Camry, Corolla (select years)'),
  ('48820-06130', 'Shock Absorber Front', 'Suspension', 'Front strut shock absorber assembly', 189.99, 8, 2, 'Camry'),
  ('48531-69465', 'Shock Absorber Rear', 'Suspension', 'Rear shock absorber', 149.99, 10, 2, 'Camry, Avalon'),
  ('90099-06228', 'Spark Plugs (set of 4)', 'Engine Parts', 'Iridium spark plugs', 45.99, 30, 8, 'Camry, Corolla, RAV4')
ON CONFLICT (part_number) DO NOTHING;
