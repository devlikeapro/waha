import * as React from "react";
//#region src/QueryErrorResetBoundary.d.ts
type QueryErrorResetFunction = () => void;
type QueryErrorIsResetFunction = () => boolean;
type QueryErrorClearResetFunction = () => void;
interface QueryErrorResetBoundaryValue {
  clearReset: QueryErrorClearResetFunction;
  isReset: QueryErrorIsResetFunction;
  reset: QueryErrorResetFunction;
}
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
declare const useQueryErrorResetBoundary: () => QueryErrorResetBoundaryValue;
/**
 * A render-prop function usable as `children` on `QueryErrorResetBoundary`.
 *
 * @param value - The boundary's {@link QueryErrorResetBoundaryValue}.
 * @returns The children to render.
 */
type QueryErrorResetBoundaryFunction = (value: QueryErrorResetBoundaryValue) => React.ReactNode;
/**
 * The props accepted by `QueryErrorResetBoundary`.
 */
interface QueryErrorResetBoundaryProps {
  /**
   * Either a plain node, or a function that receives the boundary's {@link QueryErrorResetBoundaryValue} and
   * returns a node.
   */
  children: QueryErrorResetBoundaryFunction | React.ReactNode;
}
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
declare const QueryErrorResetBoundary: ({ children }: QueryErrorResetBoundaryProps) => import("react/jsx-runtime").JSX.Element;
//#endregion
export { QueryErrorClearResetFunction, QueryErrorIsResetFunction, QueryErrorResetBoundary, QueryErrorResetBoundaryFunction, QueryErrorResetBoundaryProps, QueryErrorResetBoundaryValue, QueryErrorResetFunction, useQueryErrorResetBoundary };
//# sourceMappingURL=QueryErrorResetBoundary.d.ts.map