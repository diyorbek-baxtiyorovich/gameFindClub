import type L from 'leaflet'
import type { InjectionKey, ShallowRef } from 'vue'

export interface MapLayerContext {
  map: ShallowRef<L.Map | null>
  target: ShallowRef<L.Map | L.LayerGroup | null>
}

export const MAP_LAYER_CONTEXT: InjectionKey<MapLayerContext> = Symbol('venue-map-layer')
