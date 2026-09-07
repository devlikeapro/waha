import type { WhatsappSession } from './session.abc';
import { PluginOptions, SessionPlugin } from './session.plugin';
import { RegisterPluginEvents } from './session.plugin.events';
import { RegisterPluginHooks } from './session.plugin.hooks';

interface PluginEntry {
  id: string | null;
  plugin: SessionPlugin<any, any>;
}

export class PluginRegistry {
  private entries: PluginEntry[] = [];

  constructor(private readonly session: WhatsappSession) {}

  /**
   * Construct the plugin with the session and a child logger, and store it. Hooks and events are registered later, in attach().
   * id distinguishes multiple instances of the same plugin class (e.g. apps pass their app id) and enables get(Class, id).
   */
  add<Plugin extends SessionPlugin<Config, Deps>, Config, Deps = null>(
    options: PluginOptions<Plugin, Config, Deps>,
    id?: string,
  ): Plugin {
    const PluginClass = options.plugin;
    const logger = this.session.loggerBuilder.child({
      plugin: PluginClass.name,
    });
    const plugin = new PluginClass(
      this.session,
      logger,
      options.config,
      options.deps,
    );
    this.entries.push({ id: id ?? null, plugin: plugin });
    return plugin;
  }

  /**
   * The first plugin matching the class (instanceof), and the id when provided.
   */
  get<Plugin extends SessionPlugin<any, any>>(
    PluginClass: abstract new (...args: any[]) => Plugin,
    id?: string,
  ): Plugin | null {
    for (const entry of this.entries) {
      if (!(entry.plugin instanceof PluginClass)) {
        continue;
      }
      if (id != null && entry.id !== id) {
        continue;
      }
      return entry.plugin;
    }
    return null;
  }

  /**
   * Register @PluginHook and @PluginEvent handlers for all plugins and run their attach().
   * Deferred until all plugins (core, engine, apps) are added.
   */
  attach(): void {
    for (const entry of this.entries) {
      RegisterPluginHooks(entry.plugin);
      RegisterPluginEvents(entry.plugin);
      entry.plugin.attach();
    }
  }
}
