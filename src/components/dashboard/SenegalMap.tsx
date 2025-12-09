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

// Senegal regions with accurate SVG paths based on real geography
const SENEGAL_REGIONS_MAP = [
  { 
    id: "saint_louis", 
    name: "Saint-Louis", 
    path: "M90,10 L180,5 L220,15 L250,10 L260,25 L240,50 L200,55 L160,70 L120,65 L100,55 L85,40 Z",
    cx: 170, cy: 35,
    defaultColor: "#8B5CF6" // Purple
  },
  { 
    id: "matam", 
    name: "Matam", 
    path: "M260,25 L320,15 L370,25 L380,50 L370,90 L340,110 L300,100 L260,85 L240,50 Z",
    cx: 310, cy: 60,
    defaultColor: "#0EA5E9" // Blue
  },
  { 
    id: "louga", 
    name: "Louga", 
    path: "M85,40 L100,55 L120,65 L160,70 L150,100 L120,110 L80,100 L60,70 Z",
    cx: 110, cy: 80,
    defaultColor: "#7C3AED" // Dark purple
  },
  { 
    id: "dakar", 
    name: "Dakar", 
    path: "M25,95 L40,90 L50,100 L45,115 L30,115 L20,105 Z",
    cx: 35, cy: 102,
    defaultColor: "#EF4444" // Red
  },
  { 
    id: "thies", 
    name: "Thiès", 
    path: "M40,90 L60,70 L80,100 L85,120 L70,135 L50,130 L45,115 L50,100 Z",
    cx: 65, cy: 105,
    defaultColor: "#22C55E" // Green
  },
  { 
    id: "diourbel", 
    name: "Diourbel", 
    path: "M80,100 L120,110 L130,130 L110,145 L85,140 L85,120 Z",
    cx: 105, cy: 125,
    defaultColor: "#3B82F6" // Blue
  },
  { 
    id: "fatick", 
    name: "Fatick", 
    path: "M50,130 L70,135 L85,140 L90,165 L70,180 L45,175 L40,150 Z",
    cx: 65, cy: 155,
    defaultColor: "#A855F7" // Purple/Magenta
  },
  { 
    id: "kaolack", 
    name: "Kaolack", 
    path: "M85,140 L110,145 L130,160 L120,185 L90,180 L90,165 Z",
    cx: 108, cy: 165,
    defaultColor: "#EC4899" // Pink
  },
  { 
    id: "kaffrine", 
    name: "Kaffrine", 
    path: "M130,130 L180,125 L200,150 L190,180 L150,185 L130,160 Z",
    cx: 165, cy: 155,
    defaultColor: "#10B981" // Green
  },
  { 
    id: "tambacounda", 
    name: "Tambacounda", 
    path: "M200,55 L260,85 L300,100 L340,110 L350,150 L340,190 L300,210 L250,200 L200,190 L190,180 L200,150 L180,125 L150,100 L160,70 Z",
    cx: 260, cy: 145,
    defaultColor: "#92400E" // Brown
  },
  { 
    id: "kedougou", 
    name: "Kédougou", 
    path: "M300,210 L340,190 L370,200 L380,240 L350,270 L300,260 L280,230 Z",
    cx: 335, cy: 235,
    defaultColor: "#FACC15" // Yellow
  },
  { 
    id: "kolda", 
    name: "Kolda", 
    path: "M180,230 L250,200 L300,210 L280,230 L300,260 L260,280 L200,280 L170,260 Z",
    cx: 235, cy: 250,
    defaultColor: "#A16207" // Brown/Tan
  },
  { 
    id: "sedhiou", 
    name: "Sédhiou", 
    path: "M100,250 L140,240 L170,260 L160,285 L120,295 L90,280 Z",
    cx: 130, cy: 270,
    defaultColor: "#16A34A" // Green
  },
  { 
    id: "ziguinchor", 
    name: "Ziguinchor", 
    path: "M30,260 L80,250 L100,250 L90,280 L70,300 L35,295 L20,275 Z",
    cx: 60, cy: 275,
    defaultColor: "#DB2777" // Magenta/Pink
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
      return `${region.defaultColor}CC`; // Add transparency on hover
    }
    
    return region.defaultColor;
  };

  const activeRegion = hoveredRegion || selectedRegion;
  const activeRegionData = SENEGAL_REGIONS_MAP.find(r => r.id === activeRegion);
  const activeProducers = activeRegion ? getRegionProducers(activeRegion) : 0;

  return (
    <div className="relative">
      <svg 
        viewBox="0 0 400 320" 
        className="w-full h-auto"
        style={{ maxHeight: "350px" }}
      >
        {/* Background */}
        <rect x="0" y="0" width="400" height="320" fill="hsl(var(--muted) / 0.2)" rx="8" />
        
        {/* Ocean/Atlantic effect on the left */}
        <ellipse cx="-20" cy="180" rx="60" ry="150" fill="hsl(210 100% 50% / 0.08)" />
        
        {/* Gambia river gap effect */}
        <path
          d="M30,220 Q80,215 130,220 Q160,225 180,230"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Regions */}
        {SENEGAL_REGIONS_MAP.map((region) => (
          <g key={region.id}>
            <path
              d={region.path}
              fill={getRegionColor(region)}
              stroke="hsl(var(--background))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              style={{
                filter: (hoveredRegion === region.id || selectedRegion === region.id) 
                  ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.3))" 
                  : "none",
                transform: (hoveredRegion === region.id || selectedRegion === region.id) 
                  ? "scale(1.02)" 
                  : "scale(1)",
                transformOrigin: `${region.cx}px ${region.cy}px`
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
              fontSize={region.id === "dakar" ? "6" : "8"}
              fontWeight="600"
              fill="white"
              className="pointer-events-none select-none"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              {region.name}
            </text>
          </g>
        ))}
        
        {/* Legend */}
        <g transform="translate(300, 290)">
          <rect x="0" y="0" width="90" height="25" fill="hsl(var(--background) / 0.8)" rx="4" />
          <text x="10" y="16" fontSize="9" fill="hsl(var(--foreground))">14 régions</text>
        </g>
      </svg>

      {/* Region Info Tooltip */}
      {activeRegion && activeRegionData && (
        <div className="absolute bottom-2 left-2 right-2 bg-background/95 backdrop-blur-sm rounded-lg p-3 border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{activeRegionData.name}</p>
              <p className="text-sm text-muted-foreground">
                {activeProducers > 0 ? `${activeProducers} producteurs actifs` : "Données en cours de collecte"}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="gap-1"
              style={{ backgroundColor: activeRegionData.defaultColor, color: "white" }}
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
