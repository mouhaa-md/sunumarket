import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, MapPin, User, ArrowLeft, Package } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";
import NotFound from "./NotFound";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        <div className="section-container py-6 md:py-8">
          <Link to="/marketplace">
            <Button variant="ghost" className="mb-4 md:mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 animate-fade-in">
            {/* Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border-2 border-secondary/20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                {product.certified && (
                  <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground gap-1 shadow-lg text-sm px-3 py-1">
                    <ShieldCheck className="h-4 w-4" />
                    Certifié SunuMark
                  </Badge>
                )}
              </div>

              {/* QR Code */}
              {product.certified && (
                <Card className="border-2 border-secondary/20">
                  <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <QRCodeSVG
                        value={`https://sunumarket.sn/verify/${product.id}`}
                        size={80}
                        level="H"
                        includeMargin
                        className="md:w-[100px] md:h-[100px]"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-sm md:text-base mb-1">QR Code SunuMark</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Scannez pour vérifier l'authenticité
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl md:text-3xl font-bold text-secondary mb-3 md:mb-4">
                  {product.price.toLocaleString()} FCFA
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  <Package className="h-3 w-3" />
                  {product.category}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {product.region}
                </Badge>
              </div>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-sm">Producteur</h3>
                      <p className="text-sm">{product.producer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Description</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Origine</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {product.origin}
                </p>
              </div>

              <Button
                size="lg"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Acheter maintenant
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé via Wave ou Orange Money
              </p>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/produit/${relatedProduct.id}`}>
                    <Card className="group overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">{relatedProduct.name}</h3>
                        <p className="text-secondary font-bold">{relatedProduct.price.toLocaleString()} FCFA</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        productName={product.name}
        amount={product.price}
      />
    </div>
  );
};

export default ProductDetail;
