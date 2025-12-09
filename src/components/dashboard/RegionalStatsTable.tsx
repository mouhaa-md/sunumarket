import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Users, ArrowUp, ArrowDown } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RegionData {
  id: string;
  name: string;
  producers: number;
}

interface RegionalStatsTableProps {
  regionsData?: RegionData[];
  onRegionClick?: (regionId: string) => void;
  selectedRegion?: string | null;
  isGlobalView?: boolean;
}

// Default region data with stats
const DEFAULT_REGIONS_DATA = [
  { id: "dakar", name: "Dakar", producers: 245, growth: 12, products: 1250, revenue: 45000000 },
  { id: "thies", name: "Thiès", producers: 189, growth: 8, products: 890, revenue: 32000000 },
  { id: "saint_louis", name: "Saint-Louis", producers: 134, growth: 15, products: 620, revenue: 28000000 },
  { id: "kaolack", name: "Kaolack", producers: 156, growth: 5, products: 780, revenue: 25000000 },
  { id: "ziguinchor", name: "Ziguinchor", producers: 123, growth: 18, products: 540, revenue: 22000000 },
  { id: "diourbel", name: "Diourbel", producers: 98, growth: -2, products: 450, revenue: 18000000 },
  { id: "fatick", name: "Fatick", producers: 87, growth: 10, products: 380, revenue: 15000000 },
  { id: "kolda", name: "Kolda", producers: 89, growth: 22, products: 420, revenue: 17000000 },
  { id: "louga", name: "Louga", producers: 76, growth: 3, products: 320, revenue: 12000000 },
  { id: "kaffrine", name: "Kaffrine", producers: 78, growth: 7, products: 350, revenue: 14000000 },
  { id: "tambacounda", name: "Tambacounda", producers: 67, growth: 25, products: 290, revenue: 11000000 },
  { id: "sedhiou", name: "Sédhiou", producers: 56, growth: 14, products: 240, revenue: 9000000 },
  { id: "matam", name: "Matam", producers: 45, growth: 6, products: 180, revenue: 7000000 },
  { id: "kedougou", name: "Kédougou", producers: 34, growth: 30, products: 150, revenue: 6000000 },
];

// Color palette for regions
const REGION_COLORS: Record<string, string> = {
  dakar: "#EF4444",
  thies: "#22C55E",
  saint_louis: "#8B5CF6",
  kaolack: "#EC4899",
  ziguinchor: "#DB2777",
  diourbel: "#3B82F6",
  fatick: "#A855F7",
  kolda: "#78716C",
  louga: "#7C3AED",
  kaffrine: "#10B981",
  tambacounda: "#92400E",
  sedhiou: "#16A34A",
  matam: "#0EA5E9",
  kedougou: "#FACC15",
};

const RegionalStatsTable = ({ 
  regionsData = [], 
  onRegionClick, 
  selectedRegion,
  isGlobalView = false 
}: RegionalStatsTableProps) => {
  const [sortBy, setSortBy] = useState<"producers" | "growth" | "products" | "revenue">("producers");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Merge provided data with defaults
  const mergedData = DEFAULT_REGIONS_DATA.map(defaultRegion => {
    const providedRegion = regionsData.find(r => r.id === defaultRegion.id);
    return {
      ...defaultRegion,
      producers: providedRegion?.producers || defaultRegion.producers,
    };
  });

  // Sort data
  const sortedData = [...mergedData].sort((a, b) => {
    const multiplier = sortOrder === "desc" ? -1 : 1;
    return (a[sortBy] - b[sortBy]) * multiplier;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const totals = mergedData.reduce((acc, region) => ({
    producers: acc.producers + region.producers,
    products: acc.products + region.products,
    revenue: acc.revenue + region.revenue,
  }), { producers: 0, products: 0, revenue: 0 });

  const formatRevenue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const SortIcon = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) return null;
    return sortOrder === "desc" ? 
      <ArrowDown className="h-3 w-3 ml-1 inline" /> : 
      <ArrowUp className="h-3 w-3 ml-1 inline" />;
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
          <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
          <p className="text-xl font-bold text-primary">{totals.producers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Producteurs</p>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 text-center">
          <MapPin className="h-5 w-5 mx-auto mb-1 text-secondary" />
          <p className="text-xl font-bold text-secondary">14</p>
          <p className="text-xs text-muted-foreground">Régions</p>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 text-center">
          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
          <p className="text-xl font-bold text-green-600">{formatRevenue(totals.revenue)}</p>
          <p className="text-xs text-muted-foreground">FCFA Total</p>
        </div>
      </div>

      {/* Stats Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Région</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("producers")}
              >
                Producteurs <SortIcon column="producers" />
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors hidden sm:table-cell"
                onClick={() => handleSort("growth")}
              >
                Croissance <SortIcon column="growth" />
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors hidden md:table-cell"
                onClick={() => handleSort("products")}
              >
                Produits <SortIcon column="products" />
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("revenue")}
              >
                Revenus <SortIcon column="revenue" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((region, index) => (
              <TableRow 
                key={region.id}
                className={`cursor-pointer transition-colors ${
                  selectedRegion === region.id ? "bg-secondary/10" : "hover:bg-muted/30"
                }`}
                onClick={() => onRegionClick?.(region.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: REGION_COLORS[region.id] || "#888" }}
                    />
                    <span className="font-medium">{region.name}</span>
                    {index < 3 && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                        Top {index + 1}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {region.producers}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  <span className={`inline-flex items-center gap-0.5 font-medium ${
                    region.growth >= 0 ? "text-green-600" : "text-red-500"
                  }`}>
                    {region.growth >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(region.growth)}%
                  </span>
                </TableCell>
                <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                  {region.products}
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium text-secondary">
                    {formatRevenue(region.revenue)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>Cliquez sur les en-têtes pour trier</span>
        <span>Données actualisées en temps réel</span>
      </div>
    </div>
  );
};

export default RegionalStatsTable;
