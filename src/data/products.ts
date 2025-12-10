import panierOsier from "@/assets/product-panier-osier.jpg";
import huileArachide from "@/assets/product-huile-arachide.jpg";
import boubouBazin from "@/assets/product-boubou-bazin.jpg";
import savonKarite from "@/assets/product-savon-karite.jpg";
import bissap from "@/assets/product-bissap.jpg";
import djembe from "@/assets/product-djembe.jpg";
import sacCuir from "@/assets/product-sac-cuir.jpg";
import confitureMangue from "@/assets/product-confiture-mangue.jpg";
import collierPerles from "@/assets/product-collier-perles.jpg";
import miel from "@/assets/product-miel.jpg";
import echarpeNdopp from "@/assets/product-echarpe-ndopp.jpg";
import ceramique from "@/assets/product-ceramique.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  region: string;
  producer: string;
  image: string;
  certified: boolean;
  description: string;
  origin: string;
  slug?: string;
}

// Helper to generate consistent UUIDs for static products
const generateStaticUUID = (index: number) => {
  // Using a predictable format for static products
  return `00000000-0000-0000-0000-00000000000${index.toString().padStart(1, '0')}`;
};

export const products: Product[] = [
  {
    id: generateStaticUUID(1),
    slug: "panier-osier-traditionnel",
    name: "Panier en Osier Traditionnel",
    price: 15000,
    category: "Artisanat",
    region: "Thiès",
    producer: "Coopérative Artisanale de Thiès",
    image: panierOsier,
    certified: true,
    description: "Panier artisanal tissé à la main par des artisans de Thiès. Parfait pour vos courses ou comme décoration.",
    origin: "Fabriqué à Thiès avec des matériaux locaux"
  },
  {
    id: generateStaticUUID(2),
    slug: "huile-arachide-pure",
    name: "Huile d'Arachide Pure",
    price: 8000,
    category: "Agroalimentaire",
    region: "Kaolack",
    producer: "Les Huileries du Saloum",
    image: huileArachide,
    certified: true,
    description: "Huile d'arachide 100% naturelle, pressée à froid. Idéale pour la cuisine sénégalaise authentique.",
    origin: "Arachides cultivées et transformées à Kaolack"
  },
  {
    id: generateStaticUUID(3),
    slug: "boubou-bazin-brode",
    name: "Boubou Bazin Brodé",
    price: 45000,
    category: "Textile",
    region: "Dakar",
    producer: "Atelier Ndoye Fashion",
    image: boubouBazin,
    certified: true,
    description: "Boubou en bazin riche avec broderie artisanale. Élégance et tradition sénégalaise.",
    origin: "Confectionné à Dakar par des couturiers experts"
  },
  {
    id: generateStaticUUID(4),
    slug: "savon-beurre-karite",
    name: "Savon au Beurre de Karité",
    price: 2500,
    category: "Cosmétique",
    region: "Kédougou",
    producer: "Karité d'Or",
    image: savonKarite,
    certified: true,
    description: "Savon naturel enrichi au beurre de karité. Hydratant et apaisant pour la peau.",
    origin: "Beurre de karité de Kédougou, transformation locale"
  },
  {
    id: generateStaticUUID(5),
    slug: "bissap-seche-bio",
    name: "Bissap Séché Bio",
    price: 3000,
    category: "Agroalimentaire",
    region: "Casamance",
    producer: "Coopérative Bissap Casamance",
    image: bissap,
    certified: false,
    description: "Fleurs d'hibiscus séchées pour préparer le jus de bissap traditionnel. Riche en vitamine C.",
    origin: "Cultivé en Casamance sans pesticides"
  },
  {
    id: generateStaticUUID(6),
    slug: "djembe-artisanal",
    name: "Djembé Artisanal",
    price: 35000,
    category: "Artisanat",
    region: "Ziguinchor",
    producer: "Les Tambours de Casamance",
    image: djembe,
    certified: true,
    description: "Djembé authentique sculpté dans du bois massif avec peau de chèvre naturelle.",
    origin: "Fabriqué artisanalement à Ziguinchor"
  },
  {
    id: generateStaticUUID(7),
    slug: "sac-main-cuir",
    name: "Sac à Main en Cuir",
    price: 28000,
    category: "Maroquinerie",
    region: "Saint-Louis",
    producer: "Cuirs du Fleuve",
    image: sacCuir,
    certified: true,
    description: "Sac à main élégant en cuir véritable, tannage traditionnel et finitions modernes.",
    origin: "Cuir tanné et travaillé à Saint-Louis"
  },
  {
    id: generateStaticUUID(8),
    slug: "confiture-mangue",
    name: "Confiture de Mangue",
    price: 4500,
    category: "Agroalimentaire",
    region: "Fatick",
    producer: "Délices du Sine",
    image: confitureMangue,
    certified: false,
    description: "Confiture artisanale de mangues du Sénégal. Sans conservateurs ni colorants.",
    origin: "Mangues de Fatick, transformation locale"
  },
  {
    id: generateStaticUUID(9),
    slug: "collier-perles-africaines",
    name: "Collier en Perles Africaines",
    price: 12000,
    category: "Bijouterie",
    region: "Dakar",
    producer: "Bijoux d'Afrique",
    image: collierPerles,
    certified: true,
    description: "Collier unique fait de perles traditionnelles africaines. Pièce artisanale authentique.",
    origin: "Perles collectées et assemblées à Dakar"
  },
  {
    id: "00000000-0000-0000-0000-000000000010",
    slug: "miel-brousse",
    name: "Miel de Brousse",
    price: 6000,
    category: "Agroalimentaire",
    region: "Tambacounda",
    producer: "Ruches du Ferlo",
    image: miel,
    certified: true,
    description: "Miel pur récolté dans les zones sauvages du Ferlo. Goût unique et authentique.",
    origin: "Récolté à Tambacounda dans les zones naturelles"
  },
  {
    id: "00000000-0000-0000-0000-000000000011",
    slug: "echarpe-tissu-ndopp",
    name: "Écharpe en Tissu Ndopp",
    price: 18000,
    category: "Textile",
    region: "Diourbel",
    producer: "Tissage Touba",
    image: echarpeNdopp,
    certified: false,
    description: "Écharpe tissée dans le style Ndopp traditionnel. Motifs géométriques colorés.",
    origin: "Tissé à la main à Diourbel"
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    slug: "ceramique-decorative",
    name: "Céramique Décorative",
    price: 9000,
    category: "Artisanat",
    region: "Thiès",
    producer: "Poterie Sénégalaise",
    image: ceramique,
    certified: true,
    description: "Vase en céramique avec motifs traditionnels sénégalais. Pièce décorative unique.",
    origin: "Modelé et cuit à Thiès"
  }
];

// Helper to find product by ID or slug
export const findProduct = (idOrSlug: string): Product | undefined => {
  return products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
};

export const categories = [
  "Tous",
  "Artisanat",
  "Textile",
  "Agroalimentaire",
  "Cosmétique",
  "Maroquinerie",
  "Bijouterie"
];

export const regions = [
  "Toutes",
  "Dakar",
  "Thiès",
  "Kaolack",
  "Casamance",
  "Saint-Louis",
  "Fatick",
  "Tambacounda",
  "Diourbel",
  "Kédougou",
  "Ziguinchor"
];
