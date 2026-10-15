import { cloneState, makeObjectMap } from "../../utils.js";
import { column_getSize, header_getSize, table_setColumnSizing } from "../column-sizing/columnSizingFeature.utils.js";

//#region src/features/column-resizing/columnResizingFeature.utils.ts
/**
* Creates the default transient column resizing state.
*
* The feature default represents no active drag interaction. Reset APIs use
* this value when `defaultState` is `true`.
*
* @example
* ```ts
* const resizeInfo = getDefaultColumnResizingState()
* ```
*/
function getDefaultColumnResizingState() {
	return {
		startOffset: null,
		startSize: null,
		deltaOffset: null,
		deltaPercentage: null,
		isResizingColumn: false,
		columnSizingStart: []
	};
}
/**
* Checks whether this column can start a resize interaction.
*
* Both `columnDef.enableResizing` and table `enableColumnResizing` default to
* `true`.
*
* @example
* ```ts
* const canResize = column_getCanResize(column)
* ```
*/
function column_getCanResize(column) {
	return (column.columnDef.enableResizing ?? true) && (column.table.options.enableColumnResizing ?? true);
}
/**
* Checks whether this column is the active column resize target.
*
* The value is read from `state.columnResizing.isResizingColumn`.
*
* @example
* ```ts
* const isResizing = column_getIsResizing(column)
* ```
*/
function column_getIsResizing(column) {
	return column.table.atoms.columnResizing?.get()?.isResizingColumn === column.id;
}
/**
* Creates the pointer/touch start handler for resizing a header.
*
* The handler records starting sizes for all leaf headers, tracks drag deltas,
* writes transient resize info, and commits column sizes on change or drag end
* depending on `columnResizeMode`.
*
* @example
* ```ts
* const onMouseDown = header_getResizeHandler(header)
* ```
*/
function header_getResizeHandler(header, _contextDocument) {
	const column = header.table.getColumn(header.column.id);
	const canResize = column_getCanResize(column);
	return (event) => {
		if (!canResize) return;
		if (isTouchStartEvent(event)) {
			if (event.touches.length > 1) return;
		}
		const startSize = header_getSize(header);
		const columnSizingStart = header.getLeafHeaders().map((leafHeader) => [leafHeader.column.id, column_getSize(leafHeader.column)]);
		const clientX = isTouchStartEvent(event) ? Math.round(event.touches[0].clientX) : event.clientX;
		const newColumnSizing = makeObjectMap();
		const updateOffset = (eventType, clientXPos) => {
			if (typeof clientXPos !== "number") return;
			const table = column.table;
			const isCommit = table.options.columnResizeMode === "onChange" || eventType === "end";
			table._reactivity.batch(() => {
				table_setColumnResizing(table, (old) => {
					const deltaDirection = table.options.columnResizeDirection === "rtl" ? -1 : 1;
					const deltaOffset = (clientXPos - (old.startOffset ?? 0)) * deltaDirection;
					const startSize = old.startSize ?? 0;
					const deltaPercentage = Math.max(startSize > 0 ? deltaOffset / startSize : 0, -.999999);
					if (isCommit) {
						const columnSizingStart = old.columnSizingStart;
						for (let i = 0; i < columnSizingStart.length; i++) {
							const entry = columnSizingStart[i];
							const headerSize = entry[1];
							newColumnSizing[entry[0]] = Math.round(Math.max(headerSize > 0 ? headerSize + headerSize * deltaPercentage : deltaOffset / columnSizingStart.length, 0) * 100) / 100;
						}
					}
					return {
						...old,
						deltaOffset,
						deltaPercentage
					};
				});
				if (isCommit) table_setColumnSizing(table, (old) => Object.assign(makeObjectMap(), old, newColumnSizing));
			});
		};
		let moveRafId = null;
		let hasPendingMove = false;
		let latestMoveX;
		const flushMove = () => {
			if (hasPendingMove) {
				hasPendingMove = false;
				updateOffset("move", latestMoveX);
				moveRafId = requestAnimationFrame(flushMove);
			} else moveRafId = null;
		};
		const onMove = (clientXPos) => {
			latestMoveX = clientXPos;
			if (typeof requestAnimationFrame !== "function") {
				updateOffset("move", clientXPos);
				return;
			}
			if (moveRafId !== null) {
				hasPendingMove = true;
				return;
			}
			updateOffset("move", clientXPos);
			moveRafId = requestAnimationFrame(flushMove);
		};
		const onEnd = (clientXPos) => {
			if (moveRafId !== null) {
				cancelAnimationFrame(moveRafId);
				moveRafId = null;
				hasPendingMove = false;
			}
			column.table._reactivity.batch(() => {
				updateOffset("end", clientXPos ?? latestMoveX);
				table_setColumnResizing(column.table, (old) => ({
					...old,
					isResizingColumn: false,
					startOffset: null,
					startSize: null,
					deltaOffset: null,
					deltaPercentage: null,
					columnSizingStart: []
				}));
			});
		};
		const contextDocument = _contextDocument || (typeof document !== "undefined" ? document : null);
		const mouseEvents = {
			moveHandler: (e) => onMove(e.clientX),
			upHandler: (e) => {
				contextDocument?.removeEventListener("mousemove", mouseEvents.moveHandler);
				contextDocument?.removeEventListener("mouseup", mouseEvents.upHandler);
				onEnd(e.clientX);
			}
		};
		const touchEvents = {
			moveHandler: (touchEvent) => {
				if (touchEvent.cancelable) {
					touchEvent.preventDefault();
					touchEvent.stopPropagation();
				}
				onMove(touchEvent.touches[0].clientX);
				return false;
			},
			upHandler: (e) => {
				removeTouchEvents();
				if (e.cancelable) {
					e.preventDefault();
					e.stopPropagation();
				}
				onEnd(e.touches[0]?.clientX);
			},
			cancelHandler: () => {
				removeTouchEvents();
				onEnd();
			}
		};
		const removeTouchEvents = () => {
			contextDocument?.removeEventListener("touchmove", touchEvents.moveHandler);
			contextDocument?.removeEventListener("touchend", touchEvents.upHandler);
			contextDocument?.removeEventListener("touchcancel", touchEvents.cancelHandler);
		};
		const passiveIfSupported = passiveEventSupported() ? { passive: false } : false;
		if (isTouchStartEvent(event)) {
			contextDocument?.addEventListener("touchmove", touchEvents.moveHandler, passiveIfSupported);
			contextDocument?.addEventListener("touchend", touchEvents.upHandler, passiveIfSupported);
			contextDocument?.addEventListener("touchcancel", touchEvents.cancelHandler, passiveIfSupported);
		} else {
			contextDocument?.addEventListener("mousemove", mouseEvents.moveHandler, passiveIfSupported);
			contextDocument?.addEventListener("mouseup", mouseEvents.upHandler, passiveIfSupported);
		}
		table_setColumnResizing(column.table, (old) => ({
			...old,
			startOffset: clientX,
			startSize,
			deltaOffset: 0,
			deltaPercentage: 0,
			columnSizingStart,
			isResizingColumn: column.id
		}));
	};
}
/**
* Routes a transient column resizing updater through the table's resize handler.
*
* This state tracks the active drag interaction; committed widths live in
* `columnSizing`.
*
* @example
* ```ts
* table_setColumnResizing(table, (old) => ({ ...old, deltaOffset: 12 }))
* ```
*/
function table_setColumnResizing(table, updater) {
	table.options.onColumnResizingChange?.(updater);
}
/**
* Resets `columnResizing` to the configured initial state or feature default.
*
* With no argument, the reset clones `table.initialState.columnResizing` when
* it exists. Passing `true` ignores initial state and resets to the no-drag
* default state.
*
* @example
* ```ts
* table_resetHeaderSizeInfo(table)
* table_resetHeaderSizeInfo(table, true)
* ```
*/
function table_resetHeaderSizeInfo(table, defaultState) {
	table_setColumnResizing(table, defaultState ? getDefaultColumnResizingState() : cloneState(table.initialState.columnResizing ?? getDefaultColumnResizingState()));
}
let passiveSupported = null;
/**
* Detects whether the current environment supports passive event listeners.
*
* Column resizing uses this to register pointer and touch listeners with
* `passive: false` only when the environment understands passive options.
*
* @example
* ```ts
* const canUsePassiveListeners = passiveEventSupported()
* ```
*/
function passiveEventSupported() {
	if (typeof passiveSupported === "boolean") return passiveSupported;
	let supported = false;
	try {
		const options = { get passive() {
			supported = true;
			return false;
		} };
		const noop = () => {};
		window.addEventListener("test", noop, options);
		window.removeEventListener("test", noop);
	} catch (err) {
		supported = false;
	}
	passiveSupported = supported;
	return passiveSupported;
}
/**
* Narrows an unknown event to a `touchstart` event.
*
* Column resizing uses this before reading touch coordinates and installing
* touch-specific listeners.
*
* @example
* ```ts
* const isTouch = isTouchStartEvent(event)
* ```
*/
function isTouchStartEvent(e) {
	return e.type === "touchstart";
}

//#endregion
export { column_getCanResize, column_getIsResizing, getDefaultColumnResizingState, header_getResizeHandler, isTouchStartEvent, passiveEventSupported, table_resetHeaderSizeInfo, table_setColumnResizing };