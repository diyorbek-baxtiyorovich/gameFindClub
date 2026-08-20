export interface MapBounds { north: number; south: number; east: number; west: number }
export interface MapViewport { center: { latitude: number; longitude: number }; zoom: number; bounds: MapBounds }
