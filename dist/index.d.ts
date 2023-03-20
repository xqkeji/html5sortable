/*!
 * xq-html5sortable v1.0.3 (https://xqkeji.cn/)
 * Author xqkeji.cn
 * LICENSE MIT
 * Copyright 2023 xqkeji.cn
 */
 /**
 * Get or set data on element
 * @param {HTMLElement} element
 * @param {string} key
 * @param {any} value
 * @return {*}
 */
declare function addData(element: HTMLElement, key: string, value?: any): HTMLElement | configuration | string | void;

/**
 * Public sortable object
 * @param {Array|NodeList} sortableElements
 * @param {object|string} options|method
 */
declare function sortable(sortableElements: any, options: configuration | object | string | undefined): sortable;
declare namespace sortable {
    var destroy: (sortableElement: any) => void;
    var enable: (sortableElement: any) => void;
    var disable: (sortableElement: any) => void;
    var __testing: {
        data: typeof addData;
        removeItemEvents: (items: any) => void;
        removeItemData: (items: any) => void;
        removeSortableData: (sortable: any) => void;
        removeContainerEvents: (originContainer: any, previousContainer: any) => void;
    };
}

export { sortable as default };
