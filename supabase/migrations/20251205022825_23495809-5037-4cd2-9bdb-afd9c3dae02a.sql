-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('acheteur', 'vendeur', 'agent');

-- Create enum for business types
CREATE TYPE public.business_type AS ENUM ('artisan_individuel', 'pme', 'cooperative');

-- Create enum for activity sectors
CREATE TYPE public.activity_sector AS ENUM ('artisanat', 'textile', 'agroalimentaire', 'cosmetiques', 'autre');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee');

-- Create enum for certification status
CREATE TYPE public.certification_status AS ENUM ('en_attente', 'approuvee', 'refusee');

-- Create enum for seller validation status
CREATE TYPE public.seller_status AS ENUM ('en_attente', 'valide', 'refuse');

-- Senegal regions
CREATE TYPE public.senegal_region AS ENUM (
  'dakar', 'thies', 'saint_louis', 'diourbel', 'louga', 'fatick', 
  'kaolack', 'kolda', 'ziguinchor', 'tambacounda', 'matam', 
  'kaffrine', 'kedougou', 'sedhiou'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Buyer details table
CREATE TABLE public.buyer_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  delivery_address TEXT,
  city TEXT,
  product_preferences TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Seller details table
CREATE TABLE public.seller_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_type business_type NOT NULL,
  business_name TEXT NOT NULL,
  region senegal_region NOT NULL,
  activity_sector activity_sector NOT NULL,
  ninea TEXT,
  photos TEXT[],
  validation_status seller_status DEFAULT 'en_attente' NOT NULL,
  validated_by UUID REFERENCES auth.users(id),
  validation_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  is_certified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Agent (Ministry) details table
CREATE TABLE public.agent_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  matricule TEXT NOT NULL,
  direction TEXT NOT NULL,
  assigned_region senegal_region,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  images TEXT[],
  origin_region senegal_region,
  is_certified BOOLEAN DEFAULT false,
  certification_id UUID,
  qr_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Certifications table (SunuMark)
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  status certification_status DEFAULT 'en_attente' NOT NULL,
  qr_code TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  review_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  total_amount INTEGER NOT NULL,
  status order_status DEFAULT 'en_attente' NOT NULL,
  delivery_address TEXT,
  delivery_city TEXT,
  payment_method TEXT,
  tracking_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, product_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Agents can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'agent'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Buyer details policies
CREATE POLICY "Buyers can manage own details" ON public.buyer_details FOR ALL USING (auth.uid() = user_id);

-- Seller details policies
CREATE POLICY "Sellers can manage own details" ON public.seller_details FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Agents can view all seller details" ON public.seller_details FOR SELECT USING (public.has_role(auth.uid(), 'agent'));
CREATE POLICY "Agents can update seller details" ON public.seller_details FOR UPDATE USING (public.has_role(auth.uid(), 'agent'));

-- Agent details policies
CREATE POLICY "Agents can manage own details" ON public.agent_details FOR ALL USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (auth.uid() = seller_id);
CREATE POLICY "Agents can view all products" ON public.products FOR SELECT USING (public.has_role(auth.uid(), 'agent'));

-- Certifications policies
CREATE POLICY "Sellers can view own certifications" ON public.certifications FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can request certifications" ON public.certifications FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Agents can manage all certifications" ON public.certifications FOR ALL USING (public.has_role(auth.uid(), 'agent'));

-- Orders policies
CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view orders for their products" ON public.orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can update order status" ON public.orders FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Agents can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'agent'));

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buyer_details_updated_at BEFORE UPDATE ON public.buyer_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seller_details_updated_at BEFORE UPDATE ON public.seller_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agent_details_updated_at BEFORE UPDATE ON public.agent_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();