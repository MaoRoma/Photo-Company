-- Create photo_purchases table for tracking customer purchases
CREATE TABLE IF NOT EXISTS photo_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_path TEXT NOT NULL,
  photo_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  transaction_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_url TEXT,
  download_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_photo_purchases_customer_email ON photo_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_photo_purchases_transaction_id ON photo_purchases(transaction_id);
CREATE INDEX IF NOT EXISTS idx_photo_purchases_purchase_date ON photo_purchases(purchase_date);

-- Enable RLS
ALTER TABLE photo_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for photo_purchases
CREATE POLICY "Users can view their own purchases" ON photo_purchases
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can insert purchases" ON photo_purchases
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_photo_purchases_updated_at
  BEFORE UPDATE ON photo_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
