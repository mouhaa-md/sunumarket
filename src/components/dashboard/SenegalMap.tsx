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

// Accurate SVG paths for Senegal regions based on actual geography
const SENEGAL_REGIONS_MAP = [
  { 
    id: "saint_louis", 
    name: "Saint-Louis", 
    path: "M95 25 L130 15 L175 12 L210 18 L230 35 L215 65 L175 75 L140 80 L110 72 L90 55 L80 40 Z",
    cx: 155, cy: 45,
    defaultColor: "#8B5CF6"
  },
  { 
    id: "matam", 
    name: "Matam", 
    path: "M230 35 L275 25 L320 30 L345 50 L335 90 L305 105 L265 95 L235 80 L215 65 Z",
    cx: 280, cy: 65,
    defaultColor: "#0EA5E9"
  },
  { 
    id: "louga", 
    name: "Louga", 
    path: "M65 55 L90 55 L110 72 L140 80 L130 115 L95 120 L65 105 L55 75 Z",
    cx: 95, cy: 90,
    defaultColor: "#7C3AED"
  },
  { 
    id: "dakar", 
    name: "Dakar", 
    path: "M18 105 L35 95 L48 100 L50 115 L42 125 L25 122 L15 112 Z",
    cx: 33, cy: 110,
    defaultColor: "#EF4444"
  },
  { 
    id: "thies", 
    name: "Thiès", 
    path: "M35 95 L55 75 L65 105 L72 130 L55 145 L42 140 L42 125 L50 115 L48 100 Z",
    cx: 55, cy: 115,
    defaultColor: "#22C55E"
  },
  { 
    id: "diourbel", 
    name: "Diourbel", 
    path: "M65 105 L95 120 L105 140 L85 155 L72 150 L72 130 Z",
    cx: 85, cy: 132,
    defaultColor: "#3B82F6"
  },
  { 
    id: "fatick", 
    name: "Fatick", 
    path: "M42 140 L55 145 L72 150 L75 175 L55 190 L35 185 L30 160 Z",
    cx: 52, cy: 165,
    defaultColor: "#A855F7"
  },
  { 
    id: "kaolack", 
    name: "Kaolack", 
    path: "M72 150 L85 155 L105 140 L120 155 L110 180 L85 185 L75 175 Z",
    cx: 95, cy: 165,
    defaultColor: "#EC4899"
  },
  { 
    id: "kaffrine", 
    name: "Kaffrine", 
    path: "M105 140 L150 130 L175 150 L165 180 L130 190 L110 180 L120 155 Z",
    cx: 140, cy: 160,
    defaultColor: "#10B981"
  },
  { 
    id: "tambacounda", 
    name: "Tambacounda", 
    path: "M175 75 L215 65 L235 80 L265 95 L305 105 L320 140 L310 180 L275 200 L230 195 L190 185 L165 180 L175 150 L150 130 L140 80 Z",
    cx: 235, cy: 140,
    defaultColor: "#92400E"
  },
  { 
    id: "kedougou", 
    name: "Kédougou", 
    path: "M275 200 L310 180 L340 190 L355 220 L340 255 L300 250 L270 230 Z",
    cx: 310, cy: 220,
    defaultColor: "#FACC15"
  },
  { 
    id: "kolda", 
    name: "Kolda", 
    path: "M160 235 L210 220 L270 230 L300 250 L275 275 L220 280 L175 270 L150 250 Z",
    cx: 220, cy: 252,
    defaultColor: "#78716C"
  },
  { 
    id: "sedhiou", 
    name: "Sédhiou", 
    path: "M90 250 L130 240 L150 250 L145 275 L115 285 L85 275 Z",
    cx: 118, cy: 262,
    defaultColor: "#16A34A"
  },
  { 
    id: "ziguinchor", 
    name: "Ziguinchor", 
    path: "M25 255 L70 245 L90 250 L85 275 L60 290 L30 285 L15 270 Z",
    cx: 55, cy: 268,
    defaultColor: "#DB2777"
  },
];

const SenegalMap = ({ regionsData = [], onRegionClick, selectedRegion, highlightedRegion }: SenegalMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionProducers = (regionId: string) => {
    const region = regionsData.find(r => r.id === regionId);
    return region?.producers || 0;
  };

  const getRegionColor = (region: typeof SENEGAL_REGIONS_MAP[0]) => {
    const isSelected = selectedRegion === region.id;
    const isHovered = hoveredRegion === region.id;
    const isHighlighted = highlightedRegion === region.id;

    if (isSelected || isHighlighted) {
      return "hsl(var(--secondary))";
    }
    if (isHovered) {
      return `${region.defaultColor}DD`;
    }
    
    return region.defaultColor;
  };

  const activeRegion = hoveredRegion || selectedRegion;
  const activeRegionData = SENEGAL_REGIONS_MAP.find(r => r.id === activeRegion);
  const activeProducers = activeRegion ? getRegionProducers(activeRegion) : 0;

  return (
    <div className="relative">
      <svg 
        viewBox="0 0 370 310" 
        className="w-full h-auto"
        style={{ maxHeight: "320px" }}
      >
        {/* Background with subtle gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210 100% 95%)" />
            <stop offset="100%" stopColor="hsl(210 50% 90%)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="370" height="310" fill="url(#bgGradient)" rx="12" />
        
        {/* Atlantic Ocean indication */}
        <text x="8" y="200" fontSize="10" fill="hsl(210 80% 60%)" fontStyle="italic" opacity="0.7">
          Océan
        </text>
        <text x="8" y="212" fontSize="10" fill="hsl(210 80% 60%)" fontStyle="italic" opacity="0.7">
          Atlantique
        </text>
        
        {/* Gambia gap - white separation */}
        <path
          d="M25 210 Q70 205 120 210 Q150 215 175 220 L175 230 Q150 225 120 220 Q70 215 25 220 Z"
          fill="hsl(var(--background))"
          stroke="hsl(210 50% 80%)"
          strokeWidth="1"
        />
        <text x="80" y="218" fontSize="8" fill="hsl(210 50% 50%)" fontStyle="italic">
          Gambie
        </text>

        {/* Regions */}
        {SENEGAL_REGIONS_MAP.map((region) => (
          <g key={region.id}>
            <path
              d={region.path}
              fill={getRegionColor(region)}
              stroke="white"
              strokeWidth="1.5"
              className="cursor-pointer transition-all duration-200"
              style={{
                filter: (hoveredRegion === region.id || selectedRegion === region.id) 
                  ? "brightness(1.15) drop-shadow(0 3px 6px rgba(0,0,0,0.25))" 
                  : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
              }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onRegionClick?.(region.id)}
            />
            {/* Region label */}
            <text
              x={region.cx}
              y={region.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={region.id === "dakar" ? "5" : region.id === "tambacounda" ? "9" : "7"}
              fontWeight="600"
              fill="white"
              className="pointer-events-none select-none"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
            >
              {region.name}
            </text>
          </g>
        ))}

        {/* Title */}
        <text x="185" y="300" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">
          Carte du Sénégal - 14 Régions
        </text>
      </svg>

      {/* Region Info Tooltip */}
      {activeRegion && activeRegionData && (
        <div className="absolute bottom-0 left-2 right-2 bg-background/95 backdrop-blur-sm rounded-lg p-3 border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{activeRegionData.name}</p>
              <p className="text-sm text-muted-foreground">
                {activeProducers > 0 ? `${activeProducers} producteurs actifs` : "Données en cours de collecte"}
              </p>
            </div>
            <Badge 
              className="gap-1 text-white"
              style={{ backgroundColor: activeRegionData.defaultColor }}
            >
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
