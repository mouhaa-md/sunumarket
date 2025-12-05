-- Create member cards table
CREATE TABLE public.member_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  card_id text NOT NULL UNIQUE,
  qr_code_hash text,
  date_emission timestamp with time zone NOT NULL DEFAULT now(),
  date_expiration timestamp with time zone NOT NULL DEFAULT (now() + interval '2 years'),
  member_type text NOT NULL DEFAULT 'acheteur',
  certification_status text NOT NULL DEFAULT 'non_eligible',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create export requests table
CREATE TABLE public.export_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid NOT NULL,
  products jsonb NOT NULL DEFAULT '[]',
  destination_country text NOT NULL,
  quantity_total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'brouillon',
  step_current integer NOT NULL DEFAULT 1,
  step_statuses jsonb NOT NULL DEFAULT '{"step1": "pending", "step2": "pending", "step3": "pending", "step4": "pending", "step5": "pending"}',
  documents_generated jsonb DEFAULT '{}',
  transporter text,
  shipping_cost integer DEFAULT 0,
  insurance boolean DEFAULT false,
  tracking_number text,
  payment_method text,
  total_amount integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  finalized_at timestamp with time zone
);

-- Create export authorizations table
CREATE TABLE public.export_authorizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid NOT NULL,
  products_authorized jsonb NOT NULL DEFAULT '[]',
  countries_authorized text[] NOT NULL DEFAULT '{}',
  valid_until timestamp with time zone NOT NULL DEFAULT (now() + interval '1 year'),
  approved_by uuid,
  approval_date timestamp with time zone,
  status text NOT NULL DEFAULT 'en_attente',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_authorizations ENABLE ROW LEVEL SECURITY;

-- Member cards policies
CREATE POLICY "Users can view own member card" ON public.member_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own member card" ON public.member_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own member card" ON public.member_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Agents can view all member cards" ON public.member_cards
  FOR SELECT USING (has_role(auth.uid(), 'agent'::app_role));

CREATE POLICY "Agents can update member cards" ON public.member_cards
  FOR UPDATE USING (has_role(auth.uid(), 'agent'::app_role));

-- Export requests policies
CREATE POLICY "Sellers can manage own export requests" ON public.export_requests
  FOR ALL USING (auth.uid() = seller_id);

CREATE POLICY "Agents can view all export requests" ON public.export_requests
  FOR SELECT USING (has_role(auth.uid(), 'agent'::app_role));

CREATE POLICY "Agents can update export requests" ON public.export_requests
  FOR UPDATE USING (has_role(auth.uid(), 'agent'::app_role));

-- Export authorizations policies
CREATE POLICY "Sellers can view own authorizations" ON public.export_authorizations
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Agents can manage authorizations" ON public.export_authorizations
  FOR ALL USING (has_role(auth.uid(), 'agent'::app_role));

-- Function to generate unique card ID
CREATE OR REPLACE FUNCTION public.generate_card_id()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  year_part text;
  seq_num integer;
  new_id text;
BEGIN
  year_part := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(card_id FROM 14 FOR 4) AS integer)), 0) + 1
  INTO seq_num
  FROM public.member_cards
  WHERE card_id LIKE 'SM-' || year_part || '-%';
  
  new_id := 'SM-' || year_part || '-DKR-' || LPAD(seq_num::text, 4, '0');
  RETURN new_id;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_member_cards_updated_at
  BEFORE UPDATE ON public.member_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_export_requests_updated_at
  BEFORE UPDATE ON public.export_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();