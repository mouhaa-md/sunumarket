import { useState } from "react";
import { products, categories, regions } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedRegion, setSelectedRegion] = useState("Toutes");

  const filteredProducts = products.filter((product) => {
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

          {filteredProducts.length === 0 ? (
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
