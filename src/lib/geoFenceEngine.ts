/**
 * Geo-Fenced Host Check-in Engine — StashSaarthi Autonomous System
 *
 * Enforces strict 50-meter geo-fence radius lock on student pickup/drop-off verification
 * to prevent fake or remote drop-offs at host nodes across Kanpur campus locations.
 */

export const MAX_GEOFENCE_RADIUS_METERS = 50.0;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CampusHostNode {
  id: string;
  name: string;
  area: string;
  coords: Coordinates;
}

export const PRESET_CAMPUS_HOST_NODES: Record<string, CampusHostNode> = {
  "Kakadeo PW Hub": {
    id: "node-kakadeo-pw",
    name: "Kakadeo PW Hub",
    area: "Kakadeo Coaching Belt, Kanpur",
    coords: { lat: 26.4784, lng: 80.3015 },
  },
  "IIT Kanpur Nankari Gate": {
    id: "node-iitk-nankari",
    name: "IIT Kanpur Nankari Gate",
    area: "Kalyanpur, Kanpur",
    coords: { lat: 26.5123, lng: 80.2325 },
  },
  "CSJMU Kalyanpur Hub": {
    id: "node-csjmu-kalyanpur",
    name: "CSJMU Kalyanpur Hub",
    area: "CSJM University Belt, Kanpur",
    coords: { lat: 26.495, lng: 80.258 },
  },
  "HBTI Nawabganj Hub": {
    id: "node-hbti-nawabganj",
    name: "HBTI Nawabganj Hub",
    area: "Nawabganj, Kanpur",
    coords: { lat: 26.482, lng: 80.315 },
  },
};

export interface GeoFenceResult {
  inRange: boolean;
  distanceMeters: number;
  allowedRadiusMeters: number;
  status: "unlocked" | "locked";
  message: string;
  timestamp: string;
  deviceCoords: Coordinates;
  targetCoords: Coordinates;
  nodeName: string;
  overrideActive?: boolean;
}

/**
 * Calculates Great-Circle Haversine distance in meters between two lat/lng coordinates
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

/**
 * Verifies if device coordinates are within the strict 50m radius of host node
 */
export function verifyGeoFenceLocation(
  deviceCoords: Coordinates,
  targetCoords: Coordinates = PRESET_CAMPUS_HOST_NODES["Kakadeo PW Hub"]!.coords,
  nodeName: string = "Kakadeo PW Hub",
  allowedRadiusMeters: number = MAX_GEOFENCE_RADIUS_METERS,
  overrideActive: boolean = false,
): GeoFenceResult {
  const distanceMeters = calculateDistanceMeters(
    deviceCoords.lat,
    deviceCoords.lng,
    targetCoords.lat,
    targetCoords.lng,
  );

  const inRange = overrideActive || distanceMeters <= allowedRadiusMeters;
  const status = inRange ? "unlocked" : "locked";

  let message = "";
  if (overrideActive) {
    message = `[DEMO OVERRIDE] Geo-fence unlocked for node '${nodeName}'. Distance: ${distanceMeters}m.`;
  } else if (inRange) {
    message = `Location verified! Device is ${distanceMeters}m from '${nodeName}' (Within strict ${allowedRadiusMeters}m limit).`;
  } else {
    message = `Geo-fence Locked! Device is ${distanceMeters}m away from '${nodeName}'. Must be within ${allowedRadiusMeters}m to verify check-in.`;
  }

  return {
    inRange,
    distanceMeters,
    allowedRadiusMeters,
    status,
    message,
    timestamp: new Date().toISOString(),
    deviceCoords,
    targetCoords,
    nodeName,
    overrideActive,
  };
}

/**
 * Returns mock device coordinates for simulated node proximity testing
 */
export function getSimulatedDeviceLocation(
  nodeName: string = "Kakadeo PW Hub",
  mode: "at_node" | "near_node" | "far_away" = "at_node",
): Coordinates {
  const defaultNode = PRESET_CAMPUS_HOST_NODES["Kakadeo PW Hub"]!;
  const node = PRESET_CAMPUS_HOST_NODES[nodeName] ?? defaultNode;

  if (mode === "at_node") {
    // ~12 meters away
    return {
      lat: node.coords.lat + 0.0001,
      lng: node.coords.lng + 0.00005,
    };
  } else if (mode === "near_node") {
    // ~35 meters away (pass)
    return {
      lat: node.coords.lat + 0.00028,
      lng: node.coords.lng + 0.0002,
    };
  } else {
    // ~185 meters away (fail/locked)
    return {
      lat: node.coords.lat + 0.0015,
      lng: node.coords.lng + 0.0012,
    };
  }
}
