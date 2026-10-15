"use client";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
//#region src/QueryClientProvider.tsx
/**
* The context that `useQueryClient` reads from. `QueryClientProvider` is the normal way to set it.
*/
const QueryClientContext = React.createContext(void 0);
/**
* The `useQueryClient` hook returns the current `QueryClient` instance.
*
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns The current `QueryClient` instance.
* @throws If no `queryClient` argument is passed and no `QueryClientProvider` is found in the component tree.
*/
const useQueryClient = (queryClient) => {
	const client = React.useContext(QueryClientContext);
	if (queryClient) return queryClient;
	if (!client) throw new Error("No QueryClient set, use QueryClientProvider to set one");
	return client;
};
/**
* Use the `QueryClientProvider` component to connect and provide a `QueryClient` to your application. Also
* calls `client.mount()`/`client.unmount()` as this component mounts/unmounts, which subscribes the client to
* focus/online events (resuming any paused mutations and refetching as needed when the app regains focus or
* comes back online).
*
* @returns The provided `children`, wrapped so they can read the `QueryClient` via `useQueryClient`.
*
* @example
* ```tsx
* import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
*
* const queryClient = new QueryClient()
*
* function App() {
*   return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
* }
* ```
*/
const QueryClientProvider = ({ client, children }) => {
	React.useEffect(() => {
		client.mount();
		return () => {
			client.unmount();
		};
	}, [client]);
	return /* @__PURE__ */ jsx(QueryClientContext.Provider, {
		value: client,
		children
	});
};
//#endregion
export { QueryClientContext, QueryClientProvider, useQueryClient };

//# sourceMappingURL=QueryClientProvider.js.map