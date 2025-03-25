"use client"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

const USMap = ({ selectedStates, onStateClick }) => {
    return (
      <div className="w-full aspect-[4/3] max-w-3xl mx-auto">
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={selectedStates.includes(geo.properties.name) ? "#4299e1" : "#d1d5db"}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#93c5fd" },
                    pressed: { outline: "none", fill: "#3b82f6" },
                  }}
                  onClick={() => onStateClick(geo.properties.name)}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    );
  };
  
export default USMap