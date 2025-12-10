import { useEffect } from "react";
import { Product } from "@/data/products";

interface ProductSEOProps {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
}

const ProductSEO = ({ product, averageRating = 0, reviewCount = 0 }: ProductSEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${product.name} - ${product.producer} | SunuMarket`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 
      `${product.description.substring(0, 150)}... Achetez ${product.name} de ${product.producer} à ${product.price.toLocaleString()} FCFA sur SunuMarket.`
    );

    // Update Open Graph tags
    updateMetaTag('og:title', `${product.name} | SunuMarket`);
    updateMetaTag('og:description', product.description.substring(0, 200));
    updateMetaTag('og:image', product.image);
    updateMetaTag('og:url', `https://sunumarket.sn/produit/${product.slug || product.id}`);
    updateMetaTag('og:type', 'product');

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${product.name} | SunuMarket`);
    updateMetaTag('twitter:description', product.description.substring(0, 200));
    updateMetaTag('twitter:image', product.image);

    // Add JSON-LD structured data
    const existingScript = document.getElementById('product-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": product.producer
      },
      "manufacturer": {
        "@type": "Organization",
        "name": product.producer,
        "address": {
          "@type": "PostalAddress",
          "addressRegion": product.region,
          "addressCountry": "SN"
        }
      },
      "offers": {
        "@type": "Offer",
        "url": `https://sunumarket.sn/produit/${product.slug || product.id}`,
        "priceCurrency": "XOF",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": product.producer
        }
      },
      "category": product.category,
      "countryOfOrigin": {
        "@type": "Country",
        "name": "Sénégal"
      },
      ...(product.certified && {
        "award": "Certification SunuMark - Made in Senegal"
      }),
      ...(reviewCount > 0 && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": averageRating.toFixed(1),
          "reviewCount": reviewCount,
          "bestRating": "5",
          "worstRating": "1"
        }
      })
    };

    const script = document.createElement('script');
    script.id = 'product-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.title = "SunuMarket - Made in Senegal";
      const jsonLdScript = document.getElementById('product-jsonld');
      if (jsonLdScript) jsonLdScript.remove();
    };
  }, [product, averageRating, reviewCount]);

  return null;
};

// Helper to update or create meta tags
const updateMetaTag = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) || 
             document.querySelector(`meta[name="${property}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export default ProductSEO;
