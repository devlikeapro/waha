import { SessionHooks } from '@waha/core/abc/session.hooks';
import type { SessionPlugin } from '@waha/core/abc/session.plugin';
import {
  SyncBailHook,
  SyncHook,
  SyncLoopHook,
  SyncWaterfallHook,
} from 'tapable';

/**
 * Which tapable method the tap is registered with.
 */
export enum TapType {
  /** tap() for sync hooks, tapPromise() for async ones - the default */
  Auto = 'auto',
  /** tap() - the method runs synchronously, its return value is used as is */
  Sync = 'sync',
  /** tapPromise() - the method result is awaited (works for sync methods too) */
  Promise = 'promise',
}

/**
 * Tapable tap options (tapable does not export its TapOptions type) and the tap type.
 */
export interface HookTapOptions {
  before?: string;
  stage?: number;
  type?: TapType;
}

/**
 * The method signature a hook accepts, sync or async - inferred from the hook's tap() method.
 */
type HookFn<H> = H extends {
  tap(options: any, fn: (...args: infer A) => infer R): void;
}
  ? (...args: A) => R | Promise<R>
  : never;

type TapableHook = {
  tap(options: any, fn: any): void;
};

interface HookTapMetadata {
  selector: (hooks: SessionHooks) => TapableHook;
  propertyKey: string;
  options?: HookTapOptions;
}

const HOOK_TAPS = Symbol('PluginHookTaps');

function getOwnHookTaps(ctor: any): HookTapMetadata[] {
  if (!Object.prototype.hasOwnProperty.call(ctor, HOOK_TAPS)) {
    ctor[HOOK_TAPS] = [];
  }
  return ctor[HOOK_TAPS];
}

function collectHookTaps(ctor: any): HookTapMetadata[] {
  const taps: HookTapMetadata[] = [];
  let current = ctor;
  while (current) {
    if (Object.prototype.hasOwnProperty.call(current, HOOK_TAPS)) {
      taps.push(...current[HOOK_TAPS]);
    }
    current = Object.getPrototypeOf(current);
  }
  return taps;
}

// identity check, not instanceof - tapable reassigns hook.constructor while all hooks share the base Hook prototype
const SYNC_HOOK_CLASSES: any[] = [
  SyncHook,
  SyncBailHook,
  SyncLoopHook,
  SyncWaterfallHook,
];

function isSyncHook(hook: any): boolean {
  return SYNC_HOOK_CLASSES.includes(hook.constructor);
}

function useSyncTap(type: TapType, hook: any): boolean {
  if (type === TapType.Sync) {
    return true;
  }
  if (type === TapType.Promise) {
    return false;
  }
  return isSyncHook(hook);
}

/**
 * Taps the decorated (public) method into a session hook, stackable:
 * @PluginHook((hooks) => hooks.wid.chat, { stage: Stage.FIRST })
 */
export function PluginHook<H extends TapableHook>(
  selector: (hooks: SessionHooks) => H,
  options?: HookTapOptions,
) {
  return function <K extends string, T extends Record<K, HookFn<H>>>(
    target: T,
    propertyKey: K,
    descriptor: PropertyDescriptor,
  ): void {
    getOwnHookTaps(target.constructor).push({
      selector: selector,
      propertyKey: propertyKey,
      options: options,
    });
  };
}

/**
 * Applies all @PluginHook taps of the plugin's class to its session hooks, named after the plugin class.
 */
export function RegisterPluginHooks(plugin: SessionPlugin<any, any>) {
  for (const meta of collectHookTaps(plugin.constructor)) {
    const hook: any = meta.selector(plugin.session.hooks);
    const { type, ...tapOptions } = meta.options ?? {};
    const options = { name: plugin.constructor.name, ...tapOptions };
    const method = (plugin as any)[meta.propertyKey].bind(plugin);
    if (useSyncTap(type ?? TapType.Auto, hook)) {
      hook.tap(options, method);
    } else {
      hook.tapPromise(options, async (...args: any[]) => method(...args));
    }
  }
}
