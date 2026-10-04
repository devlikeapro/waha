import * as React from 'react';
import { createIcon, useLightboxProps, useLightboxState, isImageSlide, IconButton, addToolbarButton } from '../../index.js';
import { PLUGIN_DOWNLOAD } from '../../types.js';

const defaultDownloadProps = {
    download: undefined,
};
const resolveDownloadProps = (download) => ({
    ...defaultDownloadProps,
    ...download,
});

function parseContentDispositionFilename(disposition) {
    if (!disposition) {
        return undefined;
    }
    const extended = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(disposition);
    if (extended) {
        try {
            const decoded = decodeURIComponent(extended[1].trim());
            if (decoded) {
                return decoded;
            }
        }
        catch (_) {
        }
    }
    const plain = /filename\s*=\s*("[^"]*"|[^;]+)/i.exec(disposition);
    return (plain === null || plain === void 0 ? void 0 : plain[1].trim().replace(/^"(.*)"$/, "$1")) || undefined;
}
function getContentDisposition(xhr) {
    var _a, _b;
    return (_b = (_a = /^content-disposition:(.*)$/im.exec(xhr.getAllResponseHeaders())) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null;
}
function download(url, name) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = () => {
        saveAs(xhr.response, name || parseContentDispositionFilename(getContentDisposition(xhr)));
    };
    xhr.onerror = () => {
        console.error("Failed to download file");
    };
    xhr.send();
}
function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
        xhr.send();
    }
    catch (_) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
}
function click(link) {
    try {
        link.dispatchEvent(new MouseEvent("click"));
    }
    catch (_) {
        const event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }
}
function saveAs(source, name) {
    const link = document.createElement("a");
    link.rel = "noopener";
    link.download = name || "";
    if (!link.download) {
        link.target = "_blank";
    }
    if (typeof source === "string") {
        link.href = source;
        if (link.origin !== window.location.origin) {
            if (corsEnabled(link.href)) {
                download(source, name);
            }
            else {
                link.target = "_blank";
                click(link);
            }
        }
        else {
            click(link);
        }
    }
    else {
        link.href = URL.createObjectURL(source);
        setTimeout(() => URL.revokeObjectURL(link.href), 30000);
        setTimeout(() => click(link), 0);
    }
}

const DownloadIcon = createIcon("DownloadIcon", React.createElement("path", { d: "M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z" }));
function DownloadButton() {
    const { render, on, download: downloadProps } = useLightboxProps();
    const { download: customDownload } = resolveDownloadProps(downloadProps);
    const { currentSlide, currentIndex } = useLightboxState();
    if (render.buttonDownload) {
        return React.createElement(React.Fragment, null, render.buttonDownload());
    }
    const downloadUrl = (currentSlide &&
        (currentSlide.downloadUrl ||
            (typeof currentSlide.download === "string" && currentSlide.download) ||
            (typeof currentSlide.download === "object" && currentSlide.download.url) ||
            (isImageSlide(currentSlide) && currentSlide.src))) ||
        undefined;
    const canDownload = customDownload ? (currentSlide === null || currentSlide === void 0 ? void 0 : currentSlide.download) !== false : Boolean(downloadUrl);
    const defaultDownload = () => {
        if (currentSlide && downloadUrl) {
            const downloadFilename = currentSlide.downloadFilename ||
                (typeof currentSlide.download === "object" && currentSlide.download.filename) ||
                undefined;
            saveAs(downloadUrl, downloadFilename);
        }
    };
    const handleDownload = () => {
        var _a;
        if (currentSlide) {
            (customDownload || defaultDownload)({ slide: currentSlide, saveAs });
            (_a = on.download) === null || _a === void 0 ? void 0 : _a.call(on, { index: currentIndex });
        }
    };
    return (React.createElement(IconButton, { label: "Download", icon: DownloadIcon, renderIcon: render.iconDownload, disabled: !canDownload, onClick: handleDownload }));
}

function Download({ augment }) {
    augment(({ toolbar, download, ...restProps }) => ({
        toolbar: addToolbarButton(toolbar, PLUGIN_DOWNLOAD, React.createElement(DownloadButton, null)),
        download: resolveDownloadProps(download),
        ...restProps,
    }));
}

export { Download as default };
