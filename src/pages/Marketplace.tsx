import { useState, useEffect } from "react";
import { products as staticProducts, categories, regions, Product as StaticProduct } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Map database region to display region
const regionDisplayMap: Record<string, string> = {
  dakar: "Dakar",
  thies: "Thiès",
  saint_louis: "Saint-Louis",
  diourbel: "Diourbel",
  louga: "Louga",
  fatick: "Fatick",
  kaolack: "Kaolack",
  kolda: "Kolda",
  ziguinchor: "Ziguinchor",
  tambacounda: "Tambacounda",
  matam: "Matam",
  kaffrine: "Kaffrine",
  kedougou: "Kédougou",
  sedhiou: "Sédhiou",
};

// Map database category to display category
const categoryDisplayMap: Record<string, string> = {
  artisanat: "Artisanat",
  textile: "Textile",
  agroalimentaire: "Agroalimentaire",
  cosmetiques: "Cosmétique",
  autre: "Autre",
  maroquinerie: "Maroquinerie",
  bijouterie: "Bijouterie",
};

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedRegion, setSelectedRegion] = useState("Toutes");
  const [dbProducts, setDbProducts] = useState<StaticProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (!error && data) {
        const mappedProducts: StaticProduct[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: categoryDisplayMap[p.category] || p.category,
          region: p.origin_region ? regionDisplayMap[p.origin_region] || p.origin_region : "Dakar",
          producer: "Vendeur SunuMarket",
          image: p.images?.[0] || "/placeholder.svg",
          certified: p.is_certified || false,
          description: p.description || "",
          origin: p.origin_region ? regionDisplayMap[p.origin_region] || p.origin_region : "Sénégal",
        }));
        setDbProducts(mappedProducts);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Combine static products with database products
  const allProducts = [...staticProducts, ...dbProducts];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.producer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesRegion =
      selectedRegion === "Toutes" || product.region === selectedRegion;

    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-8 md:py-16">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                Marketplace SunuMarket
              </h1>
              <p className="text-base md:text-xl opacity-90">
                Découvrez l'excellence du Made in Senegal
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-card border-b border-border">
          <div className="section-container py-4 md:py-6">
            <div className="space-y-3 md:space-y-4">
              {/* Search */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-xs md:text-sm font-medium mb-1.5 md:mb-2">Catégories</h3>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs h-8"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <h3 className="text-xs md:text-sm font-medium mb-1.5 md:mb-2">Régions</h3>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {regions.map((region) => (
                    <Button
                      key={region}
                      variant={selectedRegion === region ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRegion(region)}
                      className="text-xs h-8"
                    >
                      {region}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="section-container py-6 md:py-8">
          <div className="mb-4 md:mb-6">
            <p className="text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Aucun produit trouvé. Essayez d'autres filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
