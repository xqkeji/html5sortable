/*!
 * xq-html5sortable v1.0.3 (https://xqkeji.cn/)
 * Author xqkeji.cn
 * LICENSE MIT
 * Copyright 2023 xqkeji.cn
 */
 function addData(element, key, value) {
  if (value === void 0) {
    return element && element.h5s && element.h5s.data && element.h5s.data[key];
  } else {
    element.h5s = element.h5s || {};
    element.h5s.data = element.h5s.data || {};
    element.h5s.data[key] = value;
  }
}
function removeData(element) {
  if (element.h5s) {
    delete element.h5s.data;
  }
}

const filter = (nodes, selector) => {
  if (!(nodes instanceof NodeList || nodes instanceof HTMLCollection || nodes instanceof Array)) {
    throw new Error("You must provide a nodeList/HTMLCollection/Array of elements to be filtered.");
  }
  if (typeof selector !== "string") {
    return Array.from(nodes);
  }
  return Array.from(nodes).filter((item) => item.nodeType === 1 && item.matches(selector));
};

const stores = /* @__PURE__ */ new Map();
class Store {
  constructor() {
    this._config = /* @__PURE__ */ new Map();
    this._placeholder = void 0;
    this._data = /* @__PURE__ */ new Map();
  }
  set config(config) {
    if (typeof config !== "object") {
      throw new Error("You must provide a valid configuration object to the config setter.");
    }
    const mergedConfig = Object.assign({}, config);
    this._config = new Map(Object.entries(mergedConfig));
  }
  get config() {
    const config = {};
    this._config.forEach((value, key) => {
      config[key] = value;
    });
    return config;
  }
  setConfig(key, value) {
    if (!this._config.has(key)) {
      throw new Error(`Trying to set invalid configuration item: ${key}`);
    }
    this._config.set(key, value);
  }
  getConfig(key) {
    if (!this._config.has(key)) {
      throw new Error(`Invalid configuration item requested: ${key}`);
    }
    return this._config.get(key);
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(placeholder) {
    if (!(placeholder instanceof HTMLElement) && placeholder !== null) {
      throw new Error("A placeholder must be an html element or null.");
    }
    this._placeholder = placeholder;
  }
  setData(key, value) {
    if (typeof key !== "string") {
      throw new Error("The key must be a string.");
    }
    this._data.set(key, value);
  }
  getData(key) {
    if (typeof key !== "string") {
      throw new Error("The key must be a string.");
    }
    return this._data.get(key);
  }
  deleteData(key) {
    if (typeof key !== "string") {
      throw new Error("The key must be a string.");
    }
    return this._data.delete(key);
  }
}
const store = (sortableElement) => {
  if (!(sortableElement instanceof HTMLElement)) {
    throw new Error("Please provide a sortable to the store function.");
  }
  if (!stores.has(sortableElement)) {
    stores.set(sortableElement, new Store());
  }
  return stores.get(sortableElement);
};

function addEventListener(element, eventName, callback) {
  if (element instanceof Array) {
    for (let i = 0; i < element.length; ++i) {
      addEventListener(element[i], eventName, callback);
    }
    return;
  }
  element.addEventListener(eventName, callback);
  store(element).setData(`event${eventName}`, callback);
}
function removeEventListener(element, eventName) {
  if (element instanceof Array) {
    for (let i = 0; i < element.length; ++i) {
      removeEventListener(element[i], eventName);
    }
    return;
  }
  element.removeEventListener(eventName, store(element).getData(`event${eventName}`));
  store(element).deleteData(`event${eventName}`);
}

function addAttribute(element, attribute, value) {
  if (element instanceof Array) {
    for (let i = 0; i < element.length; ++i) {
      addAttribute(element[i], attribute, value);
    }
    return;
  }
  element.setAttribute(attribute, value);
}
function removeAttribute(element, attribute) {
  if (element instanceof Array) {
    for (let i = 0; i < element.length; ++i) {
      removeAttribute(element[i], attribute);
    }
    return;
  }
  element.removeAttribute(attribute);
}

const offset = (element) => {
  if (!element.parentElement || element.getClientRects().length === 0) {
    throw new Error("target element must be part of the dom");
  }
  const rect = element.getClientRects()[0];
  return {
    left: rect.left + window.pageXOffset,
    right: rect.right + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    bottom: rect.bottom + window.pageYOffset
  };
};

const debounce = (func, wait = 0) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

const getIndex = (element, elementList) => {
  if (!(element instanceof HTMLElement) || !(elementList instanceof NodeList || elementList instanceof HTMLCollection || elementList instanceof Array)) {
    throw new Error("You must provide an element and a list of elements.");
  }
  return Array.from(elementList).indexOf(element);
};

const isInDom = (element) => {
  if (!(element instanceof HTMLElement)) {
    throw new Error("Element is not a node element.");
  }
  return element.parentNode !== null;
};

const insertNode = (referenceNode, newElement, position) => {
  if (!(referenceNode instanceof HTMLElement) || !(referenceNode.parentElement instanceof HTMLElement)) {
    throw new Error("target and element must be a node");
  }
  referenceNode.parentElement.insertBefore(
    newElement,
    position === "before" ? referenceNode : referenceNode.nextElementSibling
  );
};
const insertBefore = (target, element) => insertNode(target, element, "before");
const insertAfter = (target, element) => insertNode(target, element, "after");

const serialize = (sortableContainer, customItemSerializer = (serializedItem, sortableContainer2) => serializedItem, customContainerSerializer = (serializedContainer) => serializedContainer) => {
  if (!(sortableContainer instanceof HTMLElement) || !sortableContainer.isSortable === true) {
    throw new Error("You need to provide a sortableContainer to be serialized.");
  }
  if (typeof customItemSerializer !== "function" || typeof customContainerSerializer !== "function") {
    throw new Error("You need to provide a valid serializer for items and the container.");
  }
  const options = addData(sortableContainer, "opts");
  const item = options.items;
  const items = filter(sortableContainer.children, item);
  const serializedItems = items.map((item2) => {
    return {
      parent: sortableContainer,
      node: item2,
      html: item2.outerHTML,
      index: getIndex(item2, items)
    };
  });
  const container = {
    node: sortableContainer,
    itemCount: serializedItems.length
  };
  return {
    container: customContainerSerializer(container),
    items: serializedItems.map((item2) => customItemSerializer(item2, sortableContainer))
  };
};

const makePlaceholder = (sortableElement, placeholder, placeholderClass = "sortable-placeholder") => {
  if (!(sortableElement instanceof HTMLElement)) {
    throw new Error("You must provide a valid element as a sortable.");
  }
  if (!(placeholder instanceof HTMLElement) && placeholder !== void 0) {
    throw new Error("You must provide a valid element as a placeholder or set ot to undefined.");
  }
  if (placeholder === void 0) {
    if (["UL", "OL"].includes(sortableElement.tagName)) {
      placeholder = document.createElement("li");
    } else if (["TABLE", "TBODY"].includes(sortableElement.tagName)) {
      placeholder = document.createElement("tr");
      placeholder.innerHTML = '<td colspan="100"></td>';
    } else {
      placeholder = document.createElement("div");
    }
  }
  if (typeof placeholderClass === "string") {
    placeholder.classList.add(...placeholderClass.split(" "));
  }
  return placeholder;
};

const getElementHeight = (element) => {
  if (!(element instanceof HTMLElement)) {
    throw new Error("You must provide a valid dom element");
  }
  const style = window.getComputedStyle(element);
  if (style.getPropertyValue("box-sizing") === "border-box") {
    return parseInt(style.getPropertyValue("height"), 10);
  }
  return ["height", "padding-top", "padding-bottom"].map((key) => {
    const int = parseInt(style.getPropertyValue(key), 10);
    return isNaN(int) ? 0 : int;
  }).reduce((sum, value) => sum + value);
};

const getElementWidth = (element) => {
  if (!(element instanceof HTMLElement)) {
    throw new Error("You must provide a valid dom element");
  }
  const style = window.getComputedStyle(element);
  return ["width", "padding-left", "padding-right"].map((key) => {
    const int = parseInt(style.getPropertyValue(key), 10);
    return isNaN(int) ? 0 : int;
  }).reduce((sum, value) => sum + value);
};

const getHandles = (items, selector) => {
  if (!(items instanceof Array)) {
    throw new Error("You must provide a Array of HTMLElements to be filtered.");
  }
  if (typeof selector !== "string") {
    return items;
  }
  return items.filter((item) => {
    return item.querySelector(selector) instanceof HTMLElement || item.shadowRoot && item.shadowRoot.querySelector(selector) instanceof HTMLElement;
  }).map((item) => {
    return item.querySelector(selector) || item.shadowRoot && item.shadowRoot.querySelector(selector);
  });
};

const getEventTarget = (event) => {
  return event.composedPath && event.composedPath()[0] || event.target;
};

const defaultDragImage = (draggedElement, elementOffset, event) => {
  return {
    element: draggedElement,
    posX: event.pageX - elementOffset.left,
    posY: event.pageY - elementOffset.top
  };
};
const setDragImage = (event, draggedElement, customDragImage) => {
  if (!(event instanceof Event)) {
    throw new Error("setDragImage requires a DragEvent as the first argument.");
  }
  if (!(draggedElement instanceof HTMLElement)) {
    throw new Error("setDragImage requires the dragged element as the second argument.");
  }
  if (!customDragImage) {
    customDragImage = defaultDragImage;
  }
  if (event.dataTransfer && event.dataTransfer.setDragImage) {
    const elementOffset = offset(draggedElement);
    const dragImage = customDragImage(draggedElement, elementOffset, event);
    if (!(dragImage.element instanceof HTMLElement) || typeof dragImage.posX !== "number" || typeof dragImage.posY !== "number") {
      throw new Error("The customDragImage function you provided must return and object with the properties element[string], posX[integer], posY[integer].");
    }
    event.dataTransfer.effectAllowed = "copyMove";
    event.dataTransfer.setData("text/plain", getEventTarget(event).id);
    event.dataTransfer.setDragImage(dragImage.element, dragImage.posX, dragImage.posY);
  }
};

const listsConnected = (destination, origin) => {
  if (destination.isSortable === true) {
    const acceptFrom = store(destination).getConfig("acceptFrom");
    if (acceptFrom !== null && acceptFrom !== false && typeof acceptFrom !== "string") {
      throw new Error('HTML5Sortable: Wrong argument, "acceptFrom" must be "null", "false", or a valid selector string.');
    }
    if (acceptFrom !== null) {
      return acceptFrom !== false && acceptFrom.split(",").filter(function(sel) {
        return sel.length > 0 && origin.matches(sel);
      }).length > 0;
    }
    if (destination === origin) {
      return true;
    }
    if (store(destination).getConfig("connectWith") !== void 0 && store(destination).getConfig("connectWith") !== null) {
      return store(destination).getConfig("connectWith") === store(origin).getConfig("connectWith");
    }
  }
  return false;
};

const defaultConfiguration = {
  items: null,
  connectWith: null,
  disableIEFix: null,
  acceptFrom: null,
  copy: false,
  placeholder: null,
  placeholderClass: "sortable-placeholder",
  draggingClass: "sortable-dragging",
  hoverClass: false,
  dropTargetContainerClass: false,
  debounce: 0,
  throttleTime: 100,
  maxItems: 0,
  itemSerializer: void 0,
  containerSerializer: void 0,
  customDragImage: null,
  orientation: "vertical"
};

function throttle(fn, threshold = 250) {
  if (typeof fn !== "function") {
    throw new Error("You must provide a function as the first argument for throttle.");
  }
  if (typeof threshold !== "number") {
    throw new Error("You must provide a number as the second argument for throttle.");
  }
  let lastEventTimestamp = null;
  return (...args) => {
    const now = Date.now();
    if (lastEventTimestamp === null || now - lastEventTimestamp >= threshold) {
      lastEventTimestamp = now;
      fn.apply(this, args);
    }
  };
}

const enableHoverClass = (sortableContainer, enable) => {
  if (typeof store(sortableContainer).getConfig("hoverClass") === "string") {
    const hoverClasses = store(sortableContainer).getConfig("hoverClass").split(" ");
    if (enable === true) {
      addEventListener(sortableContainer, "mousemove", throttle((event) => {
        if (event.buttons === 0) {
          filter(sortableContainer.children, store(sortableContainer).getConfig("items")).forEach((item) => {
            if (item === event.target || item.contains(event.target)) {
              item.classList.add(...hoverClasses);
            } else {
              item.classList.remove(...hoverClasses);
            }
          });
        }
      }, store(sortableContainer).getConfig("throttleTime")));
      addEventListener(sortableContainer, "mouseleave", () => {
        filter(sortableContainer.children, store(sortableContainer).getConfig("items")).forEach((item) => {
          item.classList.remove(...hoverClasses);
        });
      });
    } else {
      removeEventListener(sortableContainer, "mousemove");
      removeEventListener(sortableContainer, "mouseleave");
    }
  }
};

let dragging;
let draggingHeight;
let draggingWidth;
let originContainer;
let originIndex;
let originElementIndex;
let originItemsBeforeUpdate;
let previousContainer;
let destinationItemsBeforeUpdate;
const removeItemEvents = function(items) {
  removeEventListener(items, "dragstart");
  removeEventListener(items, "dragend");
  removeEventListener(items, "dragover");
  removeEventListener(items, "dragenter");
  removeEventListener(items, "drop");
  removeEventListener(items, "mouseenter");
  removeEventListener(items, "mouseleave");
};
const removeContainerEvents = function(originContainer2, previousContainer2) {
  if (originContainer2) {
    removeEventListener(originContainer2, "dragleave");
  }
  if (previousContainer2 && previousContainer2 !== originContainer2) {
    removeEventListener(previousContainer2, "dragleave");
  }
};
const getDragging = function(draggedItem, sortable2) {
  let ditem = draggedItem;
  if (store(sortable2).getConfig("copy") === true) {
    ditem = draggedItem.cloneNode(true);
    addAttribute(ditem, "aria-copied", "true");
    draggedItem.parentElement.appendChild(ditem);
    ditem.style.display = "none";
    ditem.oldDisplay = draggedItem.style.display;
  }
  return ditem;
};
const removeSortableData = function(sortable2) {
  removeData(sortable2);
  removeAttribute(sortable2, "aria-dropeffect");
};
const removeItemData = function(items) {
  removeAttribute(items, "aria-grabbed");
  removeAttribute(items, "aria-copied");
  removeAttribute(items, "draggable");
  removeAttribute(items, "role");
};
function findSortable(element, event) {
  if (event.composedPath) {
    return event.composedPath().find((el) => el.isSortable);
  }
  while (element.isSortable !== true) {
    element = element.parentElement;
  }
  return element;
}
function findDragElement(sortableElement, element) {
  const options = addData(sortableElement, "opts");
  const items = filter(sortableElement.children, options.items);
  const itemlist = items.filter(function(ele) {
    return ele.contains(element) || ele.shadowRoot && ele.shadowRoot.contains(element);
  });
  return itemlist.length > 0 ? itemlist[0] : element;
}
const destroySortable = function(sortableElement) {
  const opts = addData(sortableElement, "opts") || {};
  const items = filter(sortableElement.children, opts.items);
  const handles = getHandles(items, opts.handle);
  enableHoverClass(sortableElement, false);
  removeEventListener(sortableElement, "dragover");
  removeEventListener(sortableElement, "dragenter");
  removeEventListener(sortableElement, "dragstart");
  removeEventListener(sortableElement, "dragend");
  removeEventListener(sortableElement, "drop");
  removeSortableData(sortableElement);
  removeEventListener(handles, "mousedown");
  removeItemEvents(items);
  removeItemData(items);
  removeContainerEvents(originContainer, previousContainer);
  sortableElement.isSortable = false;
};
const enableSortable = function(sortableElement) {
  const opts = addData(sortableElement, "opts");
  const items = filter(sortableElement.children, opts.items);
  const handles = getHandles(items, opts.handle);
  addAttribute(sortableElement, "aria-dropeffect", "move");
  addData(sortableElement, "_disabled", "false");
  addAttribute(handles, "draggable", "true");
  enableHoverClass(sortableElement, true);
  if (opts.disableIEFix === false) {
    const spanEl = (document || window.document).createElement("span");
    if (typeof spanEl.dragDrop === "function") {
      addEventListener(handles, "mousedown", function() {
        if (items.indexOf(this) !== -1) {
          this.dragDrop();
        } else {
          let parent = this.parentElement;
          while (items.indexOf(parent) === -1) {
            parent = parent.parentElement;
          }
          parent.dragDrop();
        }
      });
    }
  }
};
const disableSortable = function(sortableElement) {
  const opts = addData(sortableElement, "opts");
  const items = filter(sortableElement.children, opts.items);
  const handles = getHandles(items, opts.handle);
  addAttribute(sortableElement, "aria-dropeffect", "none");
  addData(sortableElement, "_disabled", "true");
  addAttribute(handles, "draggable", "false");
  removeEventListener(handles, "mousedown");
  enableHoverClass(sortableElement, false);
};
const reloadSortable = function(sortableElement) {
  const opts = addData(sortableElement, "opts");
  const items = filter(sortableElement.children, opts.items);
  const handles = getHandles(items, opts.handle);
  addData(sortableElement, "_disabled", "false");
  removeItemEvents(items);
  removeContainerEvents(originContainer, previousContainer);
  removeEventListener(handles, "mousedown");
  removeEventListener(sortableElement, "dragover");
  removeEventListener(sortableElement, "dragenter");
  removeEventListener(sortableElement, "drop");
};
function sortable(sortableElements, options) {
  const method = String(options);
  options = options || {};
  if (typeof sortableElements === "string") {
    sortableElements = document.querySelectorAll(sortableElements);
  }
  if (sortableElements instanceof HTMLElement) {
    sortableElements = [sortableElements];
  }
  sortableElements = Array.prototype.slice.call(sortableElements);
  if (/serialize/.test(method)) {
    return sortableElements.map((sortableContainer) => {
      const opts = addData(sortableContainer, "opts");
      return serialize(sortableContainer, opts.itemSerializer, opts.containerSerializer);
    });
  }
  sortableElements.forEach(function(sortableElement) {
    if (/enable|disable|destroy/.test(method)) {
      return sortable[method](sortableElement);
    }
    ["connectWith", "disableIEFix"].forEach((configKey) => {
      if (Object.prototype.hasOwnProperty.call(options, configKey) && options[configKey] !== null) {
        console.warn(`HTML5Sortable: You are using the deprecated configuration "${configKey}". This will be removed in an upcoming version, make sure to migrate to the new options when updating.`);
      }
    });
    options = Object.assign({}, defaultConfiguration, store(sortableElement).config, options);
    store(sortableElement).config = options;
    addData(sortableElement, "opts", options);
    sortableElement.isSortable = true;
    reloadSortable(sortableElement);
    const listItems = filter(sortableElement.children, options.items);
    let customPlaceholder;
    if (options.placeholder !== null && options.placeholder !== void 0) {
      const tempContainer = document.createElement(sortableElement.tagName);
      if (options.placeholder instanceof HTMLElement) {
        tempContainer.appendChild(options.placeholder);
      } else {
        tempContainer.innerHTML = options.placeholder;
      }
      customPlaceholder = tempContainer.children[0];
    }
    store(sortableElement).placeholder = makePlaceholder(sortableElement, customPlaceholder, options.placeholderClass);
    addData(sortableElement, "items", options.items);
    if (options.acceptFrom) {
      addData(sortableElement, "acceptFrom", options.acceptFrom);
    } else if (options.connectWith) {
      addData(sortableElement, "connectWith", options.connectWith);
    }
    enableSortable(sortableElement);
    addAttribute(listItems, "role", "option");
    addAttribute(listItems, "aria-grabbed", "false");
    addEventListener(sortableElement, "dragstart", function(e) {
      const target = getEventTarget(e);
      if (target.isSortable === true) {
        return;
      }
      e.stopImmediatePropagation();
      if (options.handle && !target.matches(options.handle) || target.getAttribute("draggable") === "false") {
        return;
      }
      const sortableContainer = findSortable(target, e);
      const dragItem = findDragElement(sortableContainer, target);
      originItemsBeforeUpdate = filter(sortableContainer.children, options.items);
      originIndex = originItemsBeforeUpdate.indexOf(dragItem);
      originElementIndex = getIndex(dragItem, sortableContainer.children);
      originContainer = sortableContainer;
      setDragImage(e, dragItem, options.customDragImage);
      draggingHeight = getElementHeight(dragItem);
      draggingWidth = getElementWidth(dragItem);
      dragItem.classList.add(options.draggingClass);
      dragging = getDragging(dragItem, sortableContainer);
      addAttribute(dragging, "aria-grabbed", "true");
      sortableContainer.dispatchEvent(new CustomEvent("sortstart", {
        detail: {
          origin: {
            elementIndex: originElementIndex,
            index: originIndex,
            container: originContainer
          },
          item: dragging,
          originalTarget: target,
          dragEvent: e
        }
      }));
    });
    addEventListener(sortableElement, "dragenter", (e) => {
      const target = getEventTarget(e);
      const sortableContainer = findSortable(target, e);
      if (sortableContainer && sortableContainer !== previousContainer) {
        destinationItemsBeforeUpdate = filter(sortableContainer.children, addData(sortableContainer, "items")).filter((item) => item !== store(sortableElement).placeholder);
        if (options.dropTargetContainerClass) {
          sortableContainer.classList.add(options.dropTargetContainerClass);
        }
        sortableContainer.dispatchEvent(new CustomEvent("sortenter", {
          detail: {
            origin: {
              elementIndex: originElementIndex,
              index: originIndex,
              container: originContainer
            },
            destination: {
              container: sortableContainer,
              itemsBeforeUpdate: destinationItemsBeforeUpdate
            },
            item: dragging,
            originalTarget: target
          }
        }));
        addEventListener(sortableContainer, "dragleave", function(e2) {
          const outTarget = e2.relatedTarget || e2.fromElement;
          if (!e2.currentTarget.contains(outTarget)) {
            if (options.dropTargetContainerClass) {
              sortableContainer.classList.remove(options.dropTargetContainerClass);
            }
            sortableContainer.dispatchEvent(new CustomEvent("sortleave", {
              detail: {
                origin: {
                  elementIndex: originElementIndex,
                  index: originIndex,
                  container: sortableContainer
                },
                item: dragging,
                originalTarget: target
              }
            }));
          }
        });
      }
      previousContainer = sortableContainer;
    });
    addEventListener(sortableElement, "dragend", function(e) {
      if (!dragging) {
        return;
      }
      dragging.classList.remove(options.draggingClass);
      addAttribute(dragging, "aria-grabbed", "false");
      if (dragging.getAttribute("aria-copied") === "true" && addData(dragging, "dropped") !== "true") {
        dragging.remove();
      }
      if (dragging.oldDisplay !== void 0) {
        dragging.style.display = dragging.oldDisplay;
        delete dragging.oldDisplay;
      }
      const visiblePlaceholder = Array.from(stores.values()).map((data2) => data2.placeholder).filter((placeholder) => placeholder instanceof HTMLElement).filter(isInDom)[0];
      if (visiblePlaceholder) {
        visiblePlaceholder.remove();
      }
      sortableElement.dispatchEvent(new CustomEvent("sortstop", {
        detail: {
          origin: {
            elementIndex: originElementIndex,
            index: originIndex,
            container: originContainer
          },
          item: dragging,
          dragEvent: e
        }
      }));
      previousContainer = null;
      dragging = null;
      draggingHeight = null;
      draggingWidth = null;
    });
    addEventListener(sortableElement, "drop", function(e) {
      if (!listsConnected(sortableElement, dragging.parentElement)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      addData(dragging, "dropped", "true");
      const visiblePlaceholder = Array.from(stores.values()).map((data2) => {
        return data2.placeholder;
      }).filter((placeholder2) => placeholder2 instanceof HTMLElement).filter(isInDom)[0];
      if (visiblePlaceholder) {
        visiblePlaceholder.replaceWith(dragging);
        if (dragging.oldDisplay !== void 0) {
          dragging.style.display = dragging.oldDisplay;
          delete dragging.oldDisplay;
        }
      } else {
        addData(dragging, "dropped", "false");
        return;
      }
      const placeholder = store(sortableElement).placeholder;
      const originItems = filter(originContainer.children, options.items).filter((item) => item !== placeholder);
      const destinationContainer = this.isSortable === true ? this : this.parentElement;
      const destinationItems = filter(destinationContainer.children, addData(destinationContainer, "items")).filter((item) => item !== placeholder);
      const destinationElementIndex = getIndex(dragging, Array.from(dragging.parentElement.children).filter((item) => item !== placeholder));
      const destinationIndex = getIndex(dragging, destinationItems);
      if (options.dropTargetContainerClass) {
        destinationContainer.classList.remove(options.dropTargetContainerClass);
      }
      sortableElement.dispatchEvent(new CustomEvent("sortstop", {
        detail: {
          origin: {
            elementIndex: originElementIndex,
            index: originIndex,
            container: originContainer
          },
          item: dragging,
          destination: {
            index: destinationIndex,
            elementIndex: destinationElementIndex,
            container: destinationContainer,
            itemsBeforeUpdate: destinationItemsBeforeUpdate,
            items: destinationItems
          },
          dragEvent: e
        }
      }));
      if (originElementIndex !== destinationElementIndex || originContainer !== destinationContainer) {
        sortableElement.dispatchEvent(new CustomEvent("sortupdate", {
          detail: {
            origin: {
              elementIndex: originElementIndex,
              index: originIndex,
              container: originContainer,
              itemsBeforeUpdate: originItemsBeforeUpdate,
              items: originItems
            },
            destination: {
              index: destinationIndex,
              elementIndex: destinationElementIndex,
              container: destinationContainer,
              itemsBeforeUpdate: destinationItemsBeforeUpdate,
              items: destinationItems
            },
            item: dragging,
            dragEvent: e
          }
        }));
      }
    });
    const debouncedDragOverEnter = debounce(
      (sortableElement2, element, pageX, pageY) => {
        if (!dragging) {
          return;
        }
        if (options.forcePlaceholderSize) {
          store(sortableElement2).placeholder.style.height = draggingHeight + "px";
          store(sortableElement2).placeholder.style.width = draggingWidth + "px";
        }
        if (Array.from(sortableElement2.children).indexOf(element) > -1) {
          const thisHeight = getElementHeight(element);
          const thisWidth = getElementWidth(element);
          const placeholderIndex = getIndex(store(sortableElement2).placeholder, element.parentElement.children);
          const thisIndex = getIndex(element, element.parentElement.children);
          if (thisHeight > draggingHeight || thisWidth > draggingWidth) {
            const deadZoneVertical = thisHeight - draggingHeight;
            const deadZoneHorizontal = thisWidth - draggingWidth;
            const offsetTop = offset(element).top;
            const offsetLeft = offset(element).left;
            if (placeholderIndex < thisIndex && (options.orientation === "vertical" && pageY < offsetTop || options.orientation === "horizontal" && pageX < offsetLeft)) {
              return;
            }
            if (placeholderIndex > thisIndex && (options.orientation === "vertical" && pageY > offsetTop + thisHeight - deadZoneVertical || options.orientation === "horizontal" && pageX > offsetLeft + thisWidth - deadZoneHorizontal)) {
              return;
            }
          }
          if (dragging.oldDisplay === void 0) {
            dragging.oldDisplay = dragging.style.display;
          }
          if (dragging.style.display !== "none") {
            dragging.style.display = "none";
          }
          let placeAfter = false;
          try {
            const elementMiddleVertical = offset(element).top + element.offsetHeight / 2;
            const elementMiddleHorizontal = offset(element).left + element.offsetWidth / 2;
            placeAfter = options.orientation === "vertical" && pageY >= elementMiddleVertical || options.orientation === "horizontal" && pageX >= elementMiddleHorizontal;
          } catch (e) {
            placeAfter = placeholderIndex < thisIndex;
          }
          if (placeAfter) {
            insertAfter(element, store(sortableElement2).placeholder);
          } else {
            insertBefore(element, store(sortableElement2).placeholder);
          }
          Array.from(stores.values()).filter((data2) => data2.placeholder !== void 0).forEach((data2) => {
            if (data2.placeholder !== store(sortableElement2).placeholder) {
              data2.placeholder.remove();
            }
          });
        } else {
          const placeholders = Array.from(stores.values()).filter((data2) => data2.placeholder !== void 0).map((data2) => {
            return data2.placeholder;
          });
          if (placeholders.indexOf(element) === -1 && sortableElement2 === element && !filter(element.children, options.items).length) {
            placeholders.forEach((element2) => element2.remove());
            element.appendChild(store(sortableElement2).placeholder);
          }
        }
      },
      options.debounce
    );
    const onDragOverEnter = function(e) {
      let element = e.target;
      const sortableElement2 = element.isSortable === true ? element : findSortable(element, e);
      element = findDragElement(sortableElement2, element);
      if (!dragging || !listsConnected(sortableElement2, dragging.parentElement) || addData(sortableElement2, "_disabled") === "true") {
        return;
      }
      const options2 = addData(sortableElement2, "opts");
      if (parseInt(options2.maxItems) && filter(sortableElement2.children, addData(sortableElement2, "items")).length >= parseInt(options2.maxItems) && dragging.parentElement !== sortableElement2) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = store(sortableElement2).getConfig("copy") === true ? "copy" : "move";
      debouncedDragOverEnter(sortableElement2, element, e.pageX, e.pageY);
    };
    addEventListener(listItems.concat(sortableElement), "dragover", onDragOverEnter);
    addEventListener(listItems.concat(sortableElement), "dragenter", onDragOverEnter);
  });
  return sortableElements;
}
sortable.destroy = function(sortableElement) {
  destroySortable(sortableElement);
};
sortable.enable = function(sortableElement) {
  enableSortable(sortableElement);
};
sortable.disable = function(sortableElement) {
  disableSortable(sortableElement);
};
sortable.__testing = {
  data: addData,
  removeItemEvents,
  removeItemData,
  removeSortableData,
  removeContainerEvents
};

export { sortable as default };
