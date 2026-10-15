'use client';

import { shallow, useSelector } from "@tanstack/react-store";

//#region src/Subscribe.ts
function Subscribe(props) {
	const selected = useSelector(props.source, props.selector, { compare: shallow });
	return typeof props.children === "function" ? props.children(selected) : props.children;
}

//#endregion
export { Subscribe };