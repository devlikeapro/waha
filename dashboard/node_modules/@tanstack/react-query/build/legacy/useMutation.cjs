"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
let react = require("react");
react = require_rolldown_runtime.__toESM(react, 1);
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useMutation.ts
/**
* Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects.
* `useMutation` is the hook for that.
*
* @see {@link mutationOptions} to share these options across multiple `useMutation` call sites, or to look
* the mutation up elsewhere via its `mutationKey` (e.g. with `useMutationState`).
* @param options - The {@link UseMutationOptions} to use — everything you can pass to `useMutation`.
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns `mutate`/`mutateAsync` also accept per-call `onSuccess`/`onError`/`onSettled` callbacks as a second
* argument, useful for triggering call-site side effects (e.g. navigation) without coupling them to the shared
* mutation definition. Hook-level callbacks (passed to `options`) fire for every mutation; per-call callbacks
* fire only for the latest call you've made, and only while the component is still mounted — unmounting before
* the mutation settles removes the subscription and prevents them from firing.
*
* @example
* ```tsx
* import { useMutation, useQueryClient } from '@tanstack/react-query'
*
* function AddTodo() {
*   const queryClient = useQueryClient()
*
*   const addMutation = useMutation({
*     mutationFn: addTodo,
*     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
*   })
*
*   return (
*     <button
*       onClick={() =>
*         addMutation.mutate('Item', {
*           onError: (error) => console.error('Failed to add item:', error),
*         })
*       }
*     >
*       Add
*     </button>
*   )
* }
* ```
*
* @example
* Rendering the mutation's own state, rather than just firing it off:
* ```tsx
* import { useMutation, useQueryClient } from '@tanstack/react-query'
*
* function AddTodo() {
*   const queryClient = useQueryClient()
*
*   const addMutation = useMutation({
*     mutationFn: addTodo,
*     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
*   })
*
*   return (
*     <div>
*       {addMutation.isPending ? (
*         'Adding todo...'
*       ) : (
*         <>
*           {addMutation.isError ? (
*             <div>An error occurred: {addMutation.error.message}</div>
*           ) : null}
*           <button onClick={() => addMutation.mutate('Item')}>Add</button>
*         </>
*       )}
*     </div>
*   )
* }
* ```
*
* @example
* Optimistic update via `onMutate`, rolling back on `onError`:
* ```tsx
* import { useMutation, useQueryClient } from '@tanstack/react-query'
*
* function AddTodo() {
*   const queryClient = useQueryClient()
*
*   const addMutation = useMutation({
*     mutationFn: addTodo,
*     onMutate: async (newTodo) => {
*       await queryClient.cancelQueries({ queryKey: ['todos'] })
*       const previousTodos = queryClient.getQueryData<Array<string>>(['todos'])
*
*       queryClient.setQueryData<Array<string>>(['todos'], (old) => [
*         ...(old ?? []),
*         newTodo,
*       ])
*
*       // Passed to `onError` as `onMutateResult` if the mutation fails.
*       return { previousTodos }
*     },
*     onError: (_err, _newTodo, onMutateResult) => {
*       queryClient.setQueryData(['todos'], onMutateResult?.previousTodos)
*     },
*     onSettled: () => {
*       queryClient.invalidateQueries({ queryKey: ['todos'] })
*     },
*   })
*
*   return (
*     <button onClick={() => addMutation.mutate('Item')}>Add</button>
*   )
* }
* ```
*
* @example
* Callbacks passed per call to `mutate` only fire for the last call — `mutateAsync` gives you a
* promise per call instead, so you can wait for all of them when they succeed:
* ```tsx
* import { useMutation, useQueryClient } from '@tanstack/react-query'
*
* function AddTodos() {
*   const queryClient = useQueryClient()
*
*   const addMutation = useMutation({
*     mutationFn: addTodo,
*     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
*   })
*
*   async function handleAddAll(todos: Array<string>) {
*     try {
*       await Promise.all(todos.map((todo) => addMutation.mutateAsync(todo)))
*     } catch (error) {
*       console.error('Failed to add todos:', error)
*     }
*   }
*
*   return (
*     <button onClick={() => handleAddAll(['Todo 1', 'Todo 2', 'Todo 3'])}>
*       Add all
*     </button>
*   )
* }
* ```
*
* @example
* If some of the mutations above can fail independently of the others, and you want to know which ones
* did — rather than losing that information the moment the first one rejects — swap `Promise.all` for
* `Promise.allSettled`:
* ```tsx
* import { useMutation, useQueryClient } from '@tanstack/react-query'
*
* function AddTodos() {
*   const queryClient = useQueryClient()
*
*   const addMutation = useMutation({
*     mutationFn: addTodo,
*     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
*   })
*
*   async function handleAddAll(todos: Array<string>) {
*     const addResults = await Promise.allSettled(
*       todos.map((todo) => addMutation.mutateAsync(todo)),
*     )
*
*     addResults.forEach((addResult, index) => {
*       if (addResult.status === 'rejected') {
*         console.error(`Failed to add "${todos[index]}":`, addResult.reason)
*       }
*     })
*   }
*
*   return (
*     <button onClick={() => handleAddAll(['Todo 1', 'Todo 2', 'Todo 3'])}>
*       Add all
*     </button>
*   )
* }
* ```
*/
function useMutation(options, queryClient) {
	const client = require_QueryClientProvider.useQueryClient(queryClient);
	const [observer] = react.useState(() => new _tanstack_query_core.MutationObserver(client, options));
	react.useEffect(() => {
		observer.setOptions(options);
	}, [observer, options]);
	const result = react.useSyncExternalStore(react.useCallback((onStoreChange) => observer.subscribe(_tanstack_query_core.notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	const mutate = react.useCallback((...args) => {
		observer.mutate(args[0], args[1]).catch(_tanstack_query_core.noop);
	}, [observer]);
	if (result.error && (0, _tanstack_query_core.shouldThrowError)(observer.options.throwOnError, [result.error])) throw result.error;
	return {
		...result,
		mutate,
		mutateAsync: result.mutate
	};
}
//#endregion
exports.useMutation = useMutation;

//# sourceMappingURL=useMutation.cjs.map