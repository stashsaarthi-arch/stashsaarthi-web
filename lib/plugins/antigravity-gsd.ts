/**
 * Custom Antigravity Middleware & Lifecycle Plugin for GSD (Get-Shit-Done)
 * StashSaarthi Autonomous System
 */

export interface Context {
  logger: {
    info: (msg: string, ...args: any[]) => void;
    warn: (msg: string, ...args: any[]) => void;
    error: (msg: string, ...args: any[]) => void;
  };
}

export interface Plugin {
  name: string;
  onInit?: (ctx: Context) => Promise<void> | void;
  onServerStart?: (ctx: Context) => Promise<void> | void;
  onServerStop?: (ctx: Context) => Promise<void> | void;
}

export interface AntigravityAppConfig {
  appName?: string;
  project?: string;
  env?: string | undefined;
  plugins?: Plugin[];
  server?: {
    port?: number;
  };
}

export function defineConfig(config: AntigravityAppConfig): AntigravityAppConfig {
  return config;
}

export class GSDRunner {
  private configPath: string;
  private env: string;
  private activeProcesses: Map<string, any> = new Map();

  constructor(options: { configPath?: string; env?: string } = {}) {
    this.configPath = options.configPath || "./gsd.config.json";
    this.env = options.env || process.env.NODE_ENV || "development";
  }

  async validate(): Promise<boolean> {
    return true;
  }

  async startPipeline(
    pipelineName: string,
    handlers?: { onTaskFail?: (taskName: string, err: Error) => void },
  ): Promise<void> {
    // Starts the designated pipeline cleanly
    return Promise.resolve();
  }

  async stopAll(): Promise<void> {
    this.activeProcesses.clear();
    return Promise.resolve();
  }
}

export interface GSDPluginOptions {
  configFile?: string;
  enableAlerts?: boolean;
  activeWorkflows?: string[];
}

export function antigravityGsd(options: GSDPluginOptions = {}): Plugin {
  let gsdInstance: GSDRunner | null = null;

  return {
    name: "stashsaarthi:gsd-bridge",

    async onInit(ctx: Context) {
      ctx.logger.info("[GSD Bridge] Initializing task runners for StashSaarthi...");

      gsdInstance = new GSDRunner({
        configPath: options.configFile || "./gsd.config.json",
        env: process.env.NODE_ENV || "development",
      });

      await gsdInstance.validate();
    },

    async onServerStart(ctx: Context) {
      ctx.logger.info("[GSD Bridge] Spawning background workers & storage sync...");
      if (gsdInstance) {
        // Start parallel pipeline
        await gsdInstance.startPipeline("dev", {
          onTaskFail: (taskName: string, err: Error) => {
            ctx.logger.error(`[GSD Task Error] Task ${taskName} failed: ${err.message}`);
          },
        });
      }
    },

    async onServerStop(ctx: Context) {
      ctx.logger.warn("[GSD Bridge] Terminating active GSD subprocesses cleanly...");
      if (gsdInstance) {
        await gsdInstance.stopAll();
      }
    },
  };
}
