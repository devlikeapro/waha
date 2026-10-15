import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exactRegex, makeIdFiltersToMatchWithQuery } from "@rolldown/pluginutils";
import { reactRefreshWrapperPlugin } from "vite/internal";
//#region ../common/refresh-utils.ts
const runtimePublicPath = "/@react-refresh";
const preambleCode = `import { injectIntoGlobalHook } from "__BASE__${runtimePublicPath.slice(1)}";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;`;
const getPreambleCode = (base) => preambleCode.replace("__BASE__", base);
function virtualPreamblePlugin({ name, isEnabled }) {
	return {
		name: "vite:react-virtual-preamble",
		resolveId: {
			order: "pre",
			filter: { id: exactRegex(name) },
			handler(source) {
				if (source === name) return "\0" + source;
			}
		},
		load: {
			filter: { id: exactRegex("\0" + name) },
			handler(id) {
				if (id === "\0" + name) {
					if (isEnabled()) return preambleCode.replace("__BASE__", "/");
					return "";
				}
			}
		}
	};
}
//#endregion
//#region ../common/warning.ts
const silenceUseClientWarning = (userConfig) => ({ rollupOptions: { onwarn(warning, defaultHandler) {
	if (warning.code === "MODULE_LEVEL_DIRECTIVE" && (warning.message.includes("use client") || warning.message.includes("use server"))) return;
	if (warning.code === "SOURCEMAP_ERROR" && warning.message.includes("resolve original location") && warning.pos === 0) return;
	if (userConfig.build?.rollupOptions?.onwarn) userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
	else defaultHandler(warning);
} } });
//#endregion
//#region src/reactCompilerPreset.ts
const defaultCodeFilter = /forwardRef|memo|\b(?:[A-Z]|use[A-Z0-9])/;
const reactCompilerPreset = (options = {}) => ({
	preset: () => ({ plugins: [[fileURLToPath(import.meta.resolve("babel-plugin-react-compiler")), options]] }),
	rolldown: {
		filter: { code: options.compilationMode === "annotation" ? /['"]use memo['"]/ : defaultCodeFilter },
		applyToEnvironmentHook: (env) => env.config.consumer === "client",
		optimizeDeps: { include: options.target === "17" || options.target === "18" ? ["react-compiler-runtime"] : ["react/compiler-runtime"] }
	}
});
//#endregion
//#region src/index.ts
const _dirname = dirname(fileURLToPath(import.meta.url));
const refreshRuntimePath = join(_dirname, "refresh-runtime.js");
const defaultIncludeRE = /\.[tj]sx?$/;
const defaultExcludeRE = /\/node_modules\//;
function viteReact(opts = {}) {
	const include = opts.include ?? defaultIncludeRE;
	const exclude = opts.exclude ?? defaultExcludeRE;
	const jsxImportSource = opts.jsxImportSource ?? "react";
	const jsxImportRuntime = `${jsxImportSource}/jsx-runtime`;
	const jsxImportDevRuntime = `${jsxImportSource}/jsx-dev-runtime`;
	let runningInVite = false;
	let skipFastRefresh = true;
	let base;
	let isBundledDev = false;
	function calculateSkipFastRefresh(isProduction, command, hmr) {
		return isProduction || command === "build" || hmr === false;
	}
	const viteBabel = {
		name: "vite:react-babel",
		enforce: "pre",
		config(_userConfig, { command }) {
			const refresh = command === "serve" && !opts.compiler;
			if (opts.jsxRuntime === "classic") return { oxc: {
				jsx: {
					runtime: "classic",
					refresh
				},
				jsxRefreshInclude: makeIdFiltersToMatchWithQuery(include),
				jsxRefreshExclude: makeIdFiltersToMatchWithQuery(exclude)
			} };
			else return {
				oxc: {
					jsx: {
						runtime: "automatic",
						importSource: opts.jsxImportSource,
						refresh
					},
					jsxRefreshInclude: makeIdFiltersToMatchWithQuery(include),
					jsxRefreshExclude: makeIdFiltersToMatchWithQuery(exclude)
				},
				optimizeDeps: { rolldownOptions: { transform: { jsx: { runtime: "automatic" } } } }
			};
		},
		configResolved(config) {
			runningInVite = true;
			base = config.base;
			if (config.experimental.bundledDev) isBundledDev = true;
			if (skipFastRefresh !== calculateSkipFastRefresh(config.isProduction, config.command, config.server?.hmr)) this.warn(`NODE_ENV (${JSON.stringify(process.env.NODE_ENV)}) or server.hmr was changed by plugins after the react plugin read the config. This may cause unexpected behavior.`);
		},
		options(options) {
			if (!runningInVite) {
				options.transform ??= {};
				options.transform.jsx = {
					runtime: opts.jsxRuntime,
					importSource: opts.jsxImportSource
				};
				return options;
			}
		}
	};
	const viteRefreshWrapper = {
		name: "vite:react:refresh-wrapper",
		apply: "serve",
		async applyToEnvironment(env) {
			if (env.config.consumer !== "client" || skipFastRefresh) return false;
			return reactRefreshWrapperPlugin({
				cwd: process.cwd(),
				include: makeIdFiltersToMatchWithQuery(include),
				exclude: makeIdFiltersToMatchWithQuery(exclude),
				jsxImportSource,
				reactRefreshHost: opts.reactRefreshHost ?? ""
			});
		}
	};
	const viteConfigPost = {
		name: "vite:react:config-post",
		enforce: "post",
		config(userConfig, { command }) {
			skipFastRefresh = calculateSkipFastRefresh(process.env.NODE_ENV === "production", command, userConfig.server?.hmr);
			if (skipFastRefresh) return { oxc: { jsx: { refresh: false } } };
		}
	};
	const viteReactRefreshBundledDevMode = {
		name: "vite:react-refresh-fbm",
		enforce: "pre",
		transformIndexHtml: {
			handler() {
				if (!skipFastRefresh && isBundledDev) return [{
					tag: "script",
					attrs: { type: "module" },
					children: getPreambleCode("/")
				}];
			},
			order: "pre"
		}
	};
	const dependencies = [
		"react",
		"react-dom",
		jsxImportDevRuntime,
		jsxImportRuntime
	];
	const plugins = [
		viteBabel,
		viteRefreshWrapper,
		viteConfigPost,
		viteReactRefreshBundledDevMode,
		{
			name: "vite:react-refresh",
			enforce: "pre",
			config: (userConfig) => ({
				build: silenceUseClientWarning(userConfig),
				optimizeDeps: { include: dependencies }
			}),
			resolveId: {
				filter: { id: exactRegex(runtimePublicPath) },
				handler(id) {
					if (id === "/@react-refresh") return id;
				}
			},
			load: {
				filter: { id: exactRegex(runtimePublicPath) },
				handler(id) {
					if (id === "/@react-refresh") return readFileSync(refreshRuntimePath, "utf-8").replace(/__README_URL__/g, "https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react");
				}
			},
			transformIndexHtml() {
				if (!skipFastRefresh && !isBundledDev) return [{
					tag: "script",
					attrs: { type: "module" },
					children: getPreambleCode(base)
				}];
			}
		},
		virtualPreamblePlugin({
			name: "@vitejs/plugin-react/preamble",
			isEnabled: () => !skipFastRefresh && !isBundledDev
		})
	];
	if (opts.compiler) plugins.unshift(createReactCompilerPlugin(opts.compiler === true ? {} : opts.compiler, include, exclude, opts, () => !skipFastRefresh));
	return plugins;
}
function createReactCompilerPlugin({ logDiagnostics, ...reactCompilerOptions }, include, exclude, reactOptions, isFastRefreshEnabled) {
	let jsxDevelopment = false;
	let compiler;
	const runtime = reactCompilerOptions.target === "17" || reactCompilerOptions.target === "18" ? "react-compiler-runtime" : "react/compiler-runtime";
	const loadCompiler = async (onError) => {
		if (compiler) return compiler;
		try {
			return compiler = await import("oxc-transform-react");
		} catch (error) {
			return onError(`React Compiler requires the optional \`oxc-transform-react\` package. Install it in your project before enabling \`react({ compiler: true })\`.${error instanceof Error ? `\n${error.message}` : ""}`);
		}
	};
	return {
		name: "vite:react-compiler",
		enforce: "pre",
		async config() {
			await loadCompiler((message) => this.error(message));
			return { optimizeDeps: { include: [runtime] } };
		},
		configResolved(config) {
			jsxDevelopment = !config.isProduction;
		},
		transform: {
			filter: { id: {
				include: makeIdFiltersToMatchWithQuery(include),
				exclude: makeIdFiltersToMatchWithQuery(exclude)
			} },
			async handler(code, id) {
				const isClient = this.environment?.config.consumer !== "server";
				const shouldCompile = isClient && (reactCompilerOptions.compilationMode === "annotation" ? /['"]use memo['"]/.test(code) : defaultCodeFilter.test(code));
				const { transform } = compiler ?? await loadCompiler((message) => this.error(message));
				const result = await transform(id.split("?")[0], code, {
					jsx: {
						runtime: reactOptions.jsxRuntime,
						development: jsxDevelopment,
						importSource: reactOptions.jsxImportSource,
						refresh: isClient && isFastRefreshEnabled()
					},
					reactCompiler: shouldCompile ? reactCompilerOptions : false,
					sourcemap: this.environment ? this.environment.config.command !== "build" || !!this.environment.config.build.sourcemap : true
				});
				const diagnostics = result.errors.map((error) => `${error.message}${error.codeframe ? `\n${error.codeframe}` : ""}`);
				if (result.fatal) this.error(diagnostics.join("\n\n") || "React Compiler transform failed.");
				if (logDiagnostics) for (const diagnostic of diagnostics) this.warn(diagnostic);
				return {
					code: result.code,
					map: result.map
				};
			}
		}
	};
}
viteReact.preambleCode = preambleCode;
function viteReactForCjs(options) {
	return viteReact.call(this, options);
}
Object.assign(viteReactForCjs, {
	default: viteReactForCjs,
	reactCompilerPreset
});
//#endregion
export { viteReact as default, viteReactForCjs as "module.exports", reactCompilerPreset };
