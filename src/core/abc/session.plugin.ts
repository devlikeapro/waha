import type { WhatsappSession } from '@waha/core/abc/session.abc';
import { Logger } from 'pino';

/**
 * Constructor contract for session plugins - SessionPlugin (and any subclass) conforms to it: (session, logger, config, deps).
 * deps holds extra plugin-specific dependencies (e.g. { repository }); plugins without dependencies just omit the parameter.
 */
export interface SessionPluginConstructor<
  Plugin extends SessionPlugin<Config, Deps>,
  Config,
  Deps = null,
> {
  new (
    session: WhatsappSession,
    logger: Logger,
    config: Config,
    deps: Deps,
  ): Plugin;
}

/**
 * A plugin class with its config and deps bound, ready to be constructed with a session and logger -
 * build it with Plugin.with(config, deps). config and deps are always explicit - pass null when the plugin has none.
 */
export interface PluginOptions<
  Plugin extends SessionPlugin<Config, Deps> = SessionPlugin<any, any>,
  Config = any,
  Deps = any,
> {
  plugin: SessionPluginConstructor<Plugin, Config, Deps>;
  config: NoInfer<Config>;
  deps: NoInfer<Deps>;
}

export abstract class SessionPlugin<Config = null, Deps = null> {
  constructor(
    public readonly session: WhatsappSession,
    protected logger: Logger,
    protected config: Config,
    protected deps: Deps,
  ) {}

  /**
   * Override for custom wiring (event subscriptions, extra hooks); keep constructors construction-only.
   */
  attach(): void {}

  /**
   * Bind config and deps to the plugin class, type-checked against its constructor.
   * Whoever registers the plugin supplies session and logger.
   */
  static with<Plugin extends SessionPlugin<Config, Deps>, Config, Deps = null>(
    this: SessionPluginConstructor<Plugin, Config, Deps>,
    config: NoInfer<Config>,
    deps: NoInfer<Deps>,
  ): PluginOptions<Plugin, Config, Deps> {
    return { plugin: this, config: config, deps: deps };
  }
}
