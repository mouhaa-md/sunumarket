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
}

export const products: Product[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "6",
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
    id: "7",
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
    id: "8",
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
    id: "9",
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
    id: "10",
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
    id: "11",
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
    id: "12",
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
