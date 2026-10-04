"use client";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
//#region src/QueryErrorResetBoundary.tsx
/**
* Resets any query errors within the boundary, so queries know they can try again.
*/
function createValue() {
	let isReset = false;
	return {
		/**
		* Clears the reset state, so queries know not to try again until the boundary is reset again.
		*/
		clearReset: () => {
			isReset = false;
		},
		/**
		* Resets any query errors within the boundary, so queries know they can try again.
		*/
		reset: () => {
			isReset = true;
		},
		/**
		* Returns whether the boundary has been reset and not yet cleared.
		*/
		isReset: () => {
			return isReset;
		}
	};
}
const QueryErrorResetBoundaryContext = React.createContext(createValue());
/**
* This hook will reset any query errors within the closest `QueryErrorResetBoundary`. If there is no boundary
* defined it will reset them globally.
*
* @returns The boundary's {@link QueryErrorResetBoundaryValue}.
*
* @example
* ```tsx
* import { ErrorBoundary } from 'react-error-boundary'
* import { useQueryErrorResetBoundary } from '@tanstack/react-query'
*
* function App({ children }: { children: React.ReactNode }) {
*   const { reset } = useQueryErrorResetBoundary()
*
*   return (
*     <ErrorBoundary
*       onReset={reset}
*       fallbackRender={({ resetErrorBoundary }) => (
*         <div>
*           There was an error!
*           <button onClick={() => resetErrorBoundary()}>Try again</button>
*         </div>
*       )}
*     >
*       {children}
*     </ErrorBoundary>
*   )
* }
* ```
*/
const useQueryErrorResetBoundary = () => React.useContext(QueryErrorResetBoundaryContext);
/**
* When using `suspense` or `throwOnError` in your queries, you need a way to let queries know that you want to
* try again when re-rendering after some error occurred. With the `QueryErrorResetBoundary` component you can
* reset any query errors within the boundaries of the component.
*
* @returns The `children`, rendered as-is, or called with the boundary's {@link QueryErrorResetBoundaryValue}
* if `children` is a function.
*
* @example
* ```tsx
* import { ErrorBoundary } from 'react-error-boundary'
* import { QueryErrorResetBoundary } from '@tanstack/react-query'
*
* function App() {
*   return (
*     <QueryErrorResetBoundary>
*       {({ reset }) => (
*         <ErrorBoundary
*           onReset={reset}
*           fallbackRender={({ resetErrorBoundary }) => (
*             <div>
*               There was an error!
*               <button onClick={() => resetErrorBoundary()}>Try again</button>
*             </div>
*           )}
*         >
*           <Page />
*         </ErrorBoundary>
*       )}
*     </QueryErrorResetBoundary>
*   )
* }
* ```
*/
const QueryErrorResetBoundary = ({ children }) => {
	const [value] = React.useState(() => createValue());
	return /* @__PURE__ */ jsx(QueryErrorResetBoundaryContext.Provider, {
		value,
		children: typeof children === "function" ? children(value) : children
	});
};
//#endregion
export { QueryErrorResetBoundary, useQueryErrorResetBoundary };

//# sourceMappingURL=QueryErrorResetBoundary.js.map