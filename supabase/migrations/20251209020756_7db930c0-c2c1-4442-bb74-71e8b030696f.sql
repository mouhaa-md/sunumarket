-- Ajouter le champ employees_count à seller_details
ALTER TABLE public.seller_details 
ADD COLUMN employees_count integer NOT NULL DEFAULT 1;

-- Mettre à jour le vendeur existant Gnatam GAYE avec 25 employés
UPDATE public.seller_details 
SET employees_count = 25 
WHERE user_id = '08a74360-b7a9-4699-bce5-6bf7df7fb6e7';