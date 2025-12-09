import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface RegionData {
  id: string;
  name: string;
  producers: number;
}

interface SenegalMapProps {
  regionsData?: RegionData[];
  onRegionClick?: (regionId: string) => void;
  selectedRegion?: string | null;
  highlightedRegion?: string | null;
}

// Senegal regions with SVG path data and approximate centers
const SENEGAL_REGIONS_MAP = [
  { id: "saint_louis", name: "Saint-Louis", path: "M120,20 L180,15 L220,25 L210,60 L160,70 L120,55 Z", cx: 165, cy: 40 },
  { id: "matam", name: "Matam", path: "M220,25 L280,20 L320,35 L310,75 L260,85 L210,60 Z", cx: 265, cy: 50 },
  { id: "louga", name: "Louga", path: "M80,55 L120,55 L160,70 L150,110 L100,105 L70,80 Z", cx: 115, cy: 85 },
  { id: "dakar", name: "Dakar", path: "M30,90 L50,85 L60,100 L50,115 L30,110 Z", cx: 45, cy: 100 },
  { id: "thies", name: "Thiès", path: "M50,85 L80,75 L100,105 L90,130 L60,125 L50,115 Z", cx: 75, cy: 105 },
  { id: "diourbel", name: "Diourbel", path: "M100,105 L150,110 L145,145 L95,140 L90,130 Z", cx: 120, cy: 125 },
  { id: "fatick", name: "Fatick", path: "M60,125 L95,140 L100,175 L65,180 L45,155 Z", cx: 75, cy: 155 },
  { id: "kaolack", name: "Kaolack", path: "M95,140 L145,145 L155,180 L100,175 Z", cx: 125, cy: 160 },
  { id: "kaffrine", name: "Kaffrine", path: "M145,145 L210,140 L220,180 L155,180 Z", cx: 180, cy: 160 },
  { id: "tambacounda", name: "Tambacounda", path: "M210,60 L310,75 L330,140 L280,170 L220,180 L210,140 Z", cx: 265, cy: 120 },
  { id: "kedougou", name: "Kédougou", path: "M280,170 L330,140 L350,180 L340,220 L290,210 Z", cx: 315, cy: 180 },
  { id: "kolda", name: "Kolda", path: "M180,200 L220,180 L280,170 L290,210 L240,230 L180,220 Z", cx: 230, cy: 200 },
  { id: "sedhiou", name: "Sédhiou", path: "M120,200 L180,200 L180,220 L140,235 L110,220 Z", cx: 145, cy: 215 },
  { id: "ziguinchor", name: "Ziguinchor", path: "M50,200 L120,200 L110,220 L80,240 L40,230 Z", cx: 80, cy: 220 },
];

const SenegalMap = ({ regionsData = [], onRegionClick, selectedRegion, highlightedRegion }: SenegalMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionProducers = (regionId: string) => {
    const region = regionsData.find(r => r.id === regionId);
    return region?.producers || 0;
  };

  const getRegionColor = (regionId: string) => {
    const producers = getRegionProducers(regionId);
    const isSelected = selectedRegion === regionId;
    const isHovered = hoveredRegion === regionId;
    const isHighlighted = highlightedRegion === regionId;

    if (isSelected || isHighlighted) {
      return "hsl(var(--secondary))";
    }
    if (isHovered) {
      return "hsl(var(--secondary) / 0.7)";
    }
    
    // Color intensity based on producer count
    if (producers > 200) return "hsl(var(--primary))";
    if (producers > 100) return "hsl(var(--primary) / 0.7)";
    if (producers > 50) return "hsl(var(--primary) / 0.5)";
    if (producers > 0) return "hsl(var(--primary) / 0.3)";
    return "hsl(var(--muted))";
  };

  const activeRegion = hoveredRegion || selectedRegion;
  const activeRegionData = SENEGAL_REGIONS_MAP.find(r => r.id === activeRegion);
  const activeProducers = activeRegion ? getRegionProducers(activeRegion) : 0;

  return (
    <div className="relative">
      <svg 
        viewBox="0 0 380 260" 
        className="w-full h-auto"
        style={{ maxHeight: "300px" }}
      >
        {/* Background */}
        <rect x="0" y="0" width="380" height="260" fill="hsl(var(--muted) / 0.3)" rx="8" />
        
        {/* Ocean effect */}
        <ellipse cx="20" cy="150" rx="40" ry="80" fill="hsl(210 100% 50% / 0.1)" />
        
        {/* Regions */}
        {SENEGAL_REGIONS_MAP.map((region) => (
          <g key={region.id}>
            <path
              d={region.path}
              fill={getRegionColor(region.id)}
              stroke="hsl(var(--background))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onRegionClick?.(region.id)}
            />
            {/* Region center dot */}
            <circle
              cx={region.cx}
              cy={region.cy}
              r={getRegionProducers(region.id) > 100 ? 4 : 3}
              fill="hsl(var(--background))"
              className="pointer-events-none"
            />
          </g>
        ))}

        {/* Gambia river indication */}
        <path
          d="M50,190 Q100,195 150,190 Q180,185 200,195"
          fill="none"
          stroke="hsl(210 100% 50% / 0.3)"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
        
        {/* Legend */}
        <g transform="translate(280, 230)">
          <text x="0" y="0" fontSize="8" fill="hsl(var(--muted-foreground))">Producteurs</text>
          <rect x="0" y="5" width="12" height="8" fill="hsl(var(--primary))" rx="2" />
          <text x="16" y="12" fontSize="7" fill="hsl(var(--muted-foreground))">200+</text>
          <rect x="45" y="5" width="12" height="8" fill="hsl(var(--primary) / 0.5)" rx="2" />
          <text x="61" y="12" fontSize="7" fill="hsl(var(--muted-foreground))">50+</text>
        </g>
      </svg>

      {/* Region Info Tooltip */}
      {activeRegion && activeRegionData && (
        <div className="absolute bottom-2 left-2 right-2 bg-background/95 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{activeRegionData.name}</p>
              <p className="text-sm text-muted-foreground">
                {activeProducers} producteurs actifs
              </p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              {activeProducers > 0 ? "Active" : "En développement"}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default SenegalMap;
