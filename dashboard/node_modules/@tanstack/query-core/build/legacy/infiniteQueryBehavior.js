import { addConsumeAwareSignal, addToEnd, addToStart, ensureQueryFn } from "./utils.js";
//#region src/infiniteQueryBehavior.ts
function infiniteQueryBehavior(pages) {
	return { onFetch: (context, query) => {
		var _context$fetchOptions, _context$state$data, _context$state$data2;
		const options = context.options;
		const direction = (_context$fetchOptions = context.fetchOptions) === null || _context$fetchOptions === void 0 || (_context$fetchOptions = _context$fetchOptions.meta) === null || _context$fetchOptions === void 0 || (_context$fetchOptions = _context$fetchOptions.fetchMore) === null || _context$fetchOptions === void 0 ? void 0 : _context$fetchOptions.direction;
		const oldPages = ((_context$state$data = context.state.data) === null || _context$state$data === void 0 ? void 0 : _context$state$data.pages) || [];
		const oldPageParams = ((_context$state$data2 = context.state.data) === null || _context$state$data2 === void 0 ? void 0 : _context$state$data2.pageParams) || [];
		let result = {
			pages: [],
			pageParams: []
		};
		let currentPage = 0;
		const fetchFn = async () => {
			let cancelled = false;
			const addSignalProperty = (object) => {
				addConsumeAwareSignal(object, () => context.signal, () => cancelled = true);
			};
			const queryFn = ensureQueryFn(context.options, context.fetchOptions);
			const fetchPage = async (data, param, previous) => {
				if (cancelled) return Promise.reject(context.signal.reason);
				if (param == null && data.pages.length) return Promise.resolve(data);
				const createQueryFnContext = () => {
					const queryFnContext = {
						client: context.client,
						queryKey: context.queryKey,
						pageParam: param,
						direction: previous ? "backward" : "forward",
						meta: context.options.meta
					};
					addSignalProperty(queryFnContext);
					return queryFnContext;
				};
				const queryFnContext = createQueryFnContext();
				const page = await queryFn(queryFnContext);
				const { maxPages } = context.options;
				const addTo = previous ? addToStart : addToEnd;
				return {
					pages: addTo(data.pages, page, maxPages),
					pageParams: addTo(data.pageParams, param, maxPages)
				};
			};
			if (direction && oldPages.length) {
				const previous = direction === "backward";
				const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
				const oldData = {
					pages: oldPages,
					pageParams: oldPageParams
				};
				result = await fetchPage(oldData, pageParamFn(options, oldData), previous);
			} else {
				const remainingPages = pages ?? oldPages.length;
				do {
					const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
					if (currentPage > 0 && param == null) break;
					result = await fetchPage(result, param);
					currentPage++;
				} while (currentPage < remainingPages);
			}
			return result;
		};
		if (context.options.persister) context.fetchFn = () => {
			var _context$options$pers, _context$options;
			return (_context$options$pers = (_context$options = context.options).persister) === null || _context$options$pers === void 0 ? void 0 : _context$options$pers.call(_context$options, fetchFn, {
				client: context.client,
				queryKey: context.queryKey,
				meta: context.options.meta,
				signal: context.signal
			}, query);
		};
		else context.fetchFn = fetchFn;
	} };
}
function getNextPageParam(options, { pages, pageParams }) {
	const lastIndex = pages.length - 1;
	return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
	var _options$getPreviousP;
	return pages.length > 0 ? (_options$getPreviousP = options.getPreviousPageParam) === null || _options$getPreviousP === void 0 ? void 0 : _options$getPreviousP.call(options, pages[0], pages, pageParams[0], pageParams) : void 0;
}
/**
* Checks if there is a next page.
*/
function hasNextPage(options, data) {
	if (!data) return false;
	return getNextPageParam(options, data) != null;
}
/**
* Checks if there is a previous page.
*/
function hasPreviousPage(options, data) {
	if (!data || !options.getPreviousPageParam) return false;
	return getPreviousPageParam(options, data) != null;
}
//#endregion
export { hasNextPage, hasPreviousPage, infiniteQueryBehavior };

//# sourceMappingURL=infiniteQueryBehavior.js.map