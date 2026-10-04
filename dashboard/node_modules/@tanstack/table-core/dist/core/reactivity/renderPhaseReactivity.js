//#region src/core/reactivity/renderPhaseReactivity.ts
/**
* Creates reactivity bindings for render-phase adapters (React, Preact, Lit):
* frameworks with plain, non-reactive options that are re-synchronized during
* component render, where store notifications must not fire until the host
* commits.
*
* Readonly atoms are exposed as live facades. `get()` re-evaluates the
* resolver against the options of the render in progress — a normal computed
* cannot know that plain `options.state` changed — and caches the result
* through the configured comparator so external-store consumers (e.g. React's
* `useSyncExternalStore`) see referentially stable snapshots. `subscribe()`
* goes through a hidden computed that tracks the resolver's real atom
* dependencies plus a commit version, so subscribers are invalidated by
* actual reactive writes and by the adapter's post-commit publication.
*
* @example
* ```ts
* import { batch, createAtom } from '@tanstack/react-store'
*
* export const reactReactivity = () =>
*   renderPhaseReactivity({ createAtom, batch })
* ```
*/
function renderPhaseReactivity(primitives) {
	const { createAtom, batch } = primitives;
	const commitAtom = createAtom(0);
	return {
		createOptionsStore: false,
		wrapExternalAtoms: false,
		addSubscription: () => {
			throw new Error("Feature not supported in current reactivity implementation");
		},
		unmount: () => {
			throw new Error("Feature not supported in current reactivity implementation");
		},
		schedule: primitives.schedule ?? ((fn) => queueMicrotask(fn)),
		batch,
		untrack: (fn) => fn(),
		createReadonlyAtom: (fn, atomOptions) => {
			const compare = atomOptions?.compare ?? Object.is;
			let hasSnapshot = false;
			let snapshot;
			const getSnapshot = () => {
				const nextSnapshot = fn();
				if (!hasSnapshot || !compare(snapshot, nextSnapshot)) {
					snapshot = nextSnapshot;
					hasSnapshot = true;
				}
				return snapshot;
			};
			const reactiveAtom = createAtom(() => {
				commitAtom.get();
				return getSnapshot();
			}, { compare });
			return {
				get: getSnapshot,
				subscribe: reactiveAtom.subscribe.bind(reactiveAtom)
			};
		},
		createWritableAtom: (value, atomOptions) => {
			return createAtom(value, { compare: atomOptions?.compare });
		},
		commit: () => {
			commitAtom.set((version) => version + 1);
		}
	};
}
/**
* Creates a render-phase source with an explicit commit baseline.
*
* Render-phase adapters publish controlled state after the host framework
* commits so isolated subscribers update, but the component that owns the
* table already rendered that exact snapshot — forwarding the notification to
* its root subscription would produce a redundant render. Unlike a last-read
* filter, speculative reads do not change notification behavior: only
* `markCommitted()` advances the baseline.
*/
function createRenderPhaseSource(source, compare = Object.is) {
	let hasCommittedSnapshot = false;
	let committedSnapshot;
	return {
		get: source.get,
		markCommitted: (snapshot) => {
			committedSnapshot = snapshot;
			hasCommittedSnapshot = true;
		},
		subscribe: (listener) => source.subscribe((value) => {
			if (!hasCommittedSnapshot || !compare(committedSnapshot, value)) listener(value);
		})
	};
}

//#endregion
export { createRenderPhaseSource, renderPhaseReactivity };