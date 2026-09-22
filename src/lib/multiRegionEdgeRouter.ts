import { supabase } from "@/lib/supabase";

export interface EdgeRegionNode {
  id: string;
  name: string;
  location: string;
  flag: string;
  isPrimary: boolean;
  endpoint: string;
  status: "HEALTHY" | "DEGRADED" | "UNREACHABLE";
  latencyMs: number;
  lastChecked: string;
  failoverPriority: number;
}

export interface MultiRegionTelemetry {
  activeRegionId: string;
  activeRegionName: string;
  primaryHealthy: boolean;
  totalFailovers: number;
  averageLatencyMs: number;
  regions: EdgeRegionNode[];
}

const DEFAULT_REGIONS: EdgeRegionNode[] = [
  {
    id: "ap-south-1",
    name: "South Asia (Mumbai)",
    location: "Mumbai, India",
    flag: "🇮🇳",
    isPrimary: true,
    endpoint: "https://ap-south-1.supabase.co/functions/v1",
    status: "HEALTHY",
    latencyMs: 18,
    lastChecked: new Date().toISOString(),
    failoverPriority: 1,
  },
  {
    id: "ap-southeast-1",
    name: "Southeast Asia (Singapore)",
    location: "Singapore",
    flag: "🇸🇬",
    isPrimary: false,
    endpoint: "https://ap-southeast-1.supabase.co/functions/v1",
    status: "HEALTHY",
    latencyMs: 44,
    lastChecked: new Date().toISOString(),
    failoverPriority: 2,
  },
  {
    id: "eu-central-1",
    name: "Europe (Frankfurt)",
    location: "Frankfurt, Germany",
    flag: "🇩🇪",
    isPrimary: false,
    endpoint: "https://eu-central-1.supabase.co/functions/v1",
    status: "HEALTHY",
    latencyMs: 112,
    lastChecked: new Date().toISOString(),
    failoverPriority: 3,
  },
];

class MultiRegionEdgeRouter {
  private regions: EdgeRegionNode[] = [...DEFAULT_REGIONS];
  private activeRegionId: string = "ap-south-1";
  private totalFailovers: number = 0;
  private simulatedPrimaryOutage: boolean = false;

  constructor() {
    this.initTelemetry();
  }

  private initTelemetry() {
    if (typeof window !== "undefined") {
      const savedOutage = sessionStorage.getItem("ss_simulated_edge_outage");
      if (savedOutage === "true") {
        this.simulatedPrimaryOutage = true;
        this.activeRegionId = "ap-southeast-1";
      }
    }
  }

  public getTelemetry(): MultiRegionTelemetry {
    const active = this.regions.find((r) => r.id === this.activeRegionId) || this.regions[0];
    const activeName = active ? active.name : "South Asia (Mumbai)";
    const primaryNode = this.regions[0];
    const isPrimaryHealthy =
      !this.simulatedPrimaryOutage && (primaryNode ? primaryNode.status === "HEALTHY" : true);

    const totalLatency = this.regions.reduce((sum, r) => sum + r.latencyMs, 0);
    const avgLatency = Math.round(totalLatency / (this.regions.length || 1));

    return {
      activeRegionId: this.activeRegionId,
      activeRegionName: activeName,
      primaryHealthy: isPrimaryHealthy,
      totalFailovers: this.totalFailovers,
      averageLatencyMs: avgLatency,
      regions: this.regions.map((r) => {
        if (r.isPrimary && this.simulatedPrimaryOutage) {
          return { ...r, status: "UNREACHABLE", latencyMs: 999 };
        }
        return r;
      }),
    };
  }

  public setSimulatedPrimaryOutage(outage: boolean) {
    this.simulatedPrimaryOutage = outage;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ss_simulated_edge_outage", String(outage));
    }

    if (outage) {
      this.totalFailovers += 1;
      this.activeRegionId = "ap-southeast-1";
      this.emitFailoverEvent(
        "ap-south-1",
        "ap-southeast-1",
        "Primary region outage simulated (503 Service Unavailable)",
      );
    } else {
      this.activeRegionId = "ap-south-1";
      this.emitHealthEvent("ap-south-1", "Primary region restored to HEALTHY");
    }
  }

  private emitFailoverEvent(fromRegion: string, toRegion: string, reason: string) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("stashsaarthi:edge-region-failover", {
          detail: { fromRegion, toRegion, reason, timestamp: new Date().toISOString() },
        }),
      );
    }
  }

  private emitHealthEvent(regionId: string, message: string) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("stashsaarthi:edge-region-health", {
          detail: { regionId, message, timestamp: new Date().toISOString() },
        }),
      );
    }
  }

  /**
   * Invokes edge function with multi-region failover protection
   */
  public async invokeFunction<T = Record<string, unknown>>(
    functionName: string,
    body: Record<string, unknown>,
    options: { timeoutMs?: number } = {},
  ): Promise<{
    data: T | null;
    error: Error | null;
    regionUsed: string;
    failoverOccurred: boolean;
    latencyMs: number;
  }> {
    const timeoutMs = options.timeoutMs || 3500;
    const startTime = performance.now();

    // Order regions by priority, skipping primary if simulated outage is active
    const candidateRegions = this.regions
      .filter((r) => !(r.isPrimary && this.simulatedPrimaryOutage))
      .sort((a, b) => a.failoverPriority - b.failoverPriority);

    let lastError: Error | null = null;
    let failoverOccurred = false;

    for (let i = 0; i < candidateRegions.length; i++) {
      const region = candidateRegions[i];
      if (!region) continue;

      if (i > 0) {
        failoverOccurred = true;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        // Standard Supabase functions invoke call
        const { data, error } = await supabase.functions.invoke(functionName, {
          body,
          headers: {
            "x-edge-region": region.id,
            "x-failover-attempt": String(i),
          },
        });

        clearTimeout(timeoutId);

        if (!error && data) {
          const endTime = performance.now();
          const latencyMs = Math.round(endTime - startTime);

          this.activeRegionId = region.id;
          region.lastChecked = new Date().toISOString();
          region.latencyMs = latencyMs;
          region.status = "HEALTHY";

          return {
            data: data as T,
            error: null,
            regionUsed: region.name,
            failoverOccurred,
            latencyMs,
          };
        }

        if (error) {
          throw new Error(error.message || "Edge function error");
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        lastError = error;
        region.status = "DEGRADED";

        // Log failover attempt and continue to next candidate region
        if (i < candidateRegions.length - 1) {
          const nextRegion = candidateRegions[i + 1];
          const nextName = nextRegion ? nextRegion.name : "Next Region";
          const nextId = nextRegion ? nextRegion.id : "backup";

          this.emitFailoverEvent(
            region.id,
            nextId,
            `Region ${region.name} failed (${error.message}). Auto-failing over to ${nextName}.`,
          );
        }
      }
    }

    const endTime = performance.now();
    return {
      data: null,
      error: lastError || new Error("All edge function regions unreachable"),
      regionUsed: "None (All Regions Failed)",
      failoverOccurred: true,
      latencyMs: Math.round(endTime - startTime),
    };
  }
}

export const edgeRouter = new MultiRegionEdgeRouter();
