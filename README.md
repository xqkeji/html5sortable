# xq-html5sortable
使用原生 HTML5 拖放 API 的可排序列表和网格。VanillaJS sortable lists and grids using native HTML5 drag and drop API.

## 项目说明
原项目的作者：[Lukas Oppermann](https://github.com/lukasoppermann)
[原项目源代码地址](https://github.com/lukasoppermann/html5sortable.git)
[原项目演示地址](http://lukasoppermann.github.io/html5sortable/index.html)

由于原项目拖动前和拖动后无法获取鼠标的位置，不能应用于树状结构的拖放，因此对其进行简单的修改，并使用 unbuild 进行重新构建。

## 安装

```bash
npm i xq-html5sortable
```

在代码中引入xq-confirm

```ts

import sortable from 'xq-html5sortable';

```

## 使用

使用 `sortable` 方法创建拖动排序列表:

``` javascript
sortable('.sortable');
```

### 样式

使用 .sortable-placeholder CSS 选择器更改占位符的样式。 您可以通过在配置对象中设置 `placeholderClass` 选项来更改css类。

``` javascript
sortable('.sortable', {
  placeholderClass: '占位符的css类'
});
```

### 嵌套
您可以将 sortables 嵌套在彼此内部。 但是，请注意在项目周围添加一个包装器，一个可排序项目不能同时是一个 `sortable`。

```html
<div class="list"><!-- 可排序 -->
  <div class="item"> Item 1
    <div class="sublist"><!-- 嵌套排序的容器 -->
      <div class="subitem">Subitem 1</div>
      <div class="subitem">Subitem 2</div>
    </div>
  </div>
  <div class="item"> Item 2 </div>
</div>
```

## 事件
注意：可以在组中的任何元素上侦听事件（使用 `connectWith` 时），因为将在所有元素上分派相同的事件。

### sortstart

如果您想在拖动排序开始时执行某些操作，请使用 `sortstart` 事件：

``` javascript
sortable('.sortable')[0].addEventListener('sortstart', function(e) {
   /*
     当用户开始排序并且 DOM 位置尚未改变时触发此事件。

     e.detail.item - {HTMLElement} 拖动元素

     始发容器数据
     e.detail.origin.index - {Integer} 仅可排序项目中元素的索引
     e.detail.origin.elementIndex - {Integer} 该元素在 Sortable Container 中所有元素的索引
     e.detail.origin.container - {HTMLElement} 元素被移出（或从中复制）的可排序容器
     */
});
```

### sortstop

如果您想在拖动排序停止时执行某些操作，请使用 `sortstop` 事件：

``` javascript
sortable('.sortable')[0].addEventListener('sortstop', function(e) {
    /*
     当用户停止排序并且 DOM 位置还没有改变时触发该事件。

     e.detail.item - {HTMLElement} 拖动元素

     始发容器数据
     e.detail.origin.index - {Integer} 仅可排序项目中元素的索引
     e.detail.origin.elementIndex - {Integer} 该元素在 Sortable Container 中所有元素的索引
     e.detail.origin.container - {HTMLElement} 元素被移出（或从中复制）的可排序容器
     */
});
```

### sortupdate

如果您想拖动排序元素位置更新时执行某些操作，请使用 sortupdate 事件：

``` javascript
sortable('.sortable')[0].addEventListener('sortupdate', function(e) {

    console.log(e.detail);

    /*
     当用户停止排序并且 DOM 位置发生变化时会触发此事件。

     e.detail.item - {HTMLElement} 拖动元素

     始发容器数据
     e.detail.origin.index - {Integer} 仅可排序项目中元素的索引
     e.detail.origin.elementIndex - {Integer} 该元素在 Sortable Container 中所有元素的索引
     e.detail.origin.container - {HTMLElement} 元素被移出（或从中复制）的可排序容器
     e.detail.origin.itemsBeforeUpdate - {Array} 移动前的可排序项目
     e.detail.origin.items - {Array} 移动后可排序的项目

     目的地集装箱数据
     e.detail.destination.index - {Integer} 仅可排序项目中元素的索引
     e.detail.destination.elementIndex - {Integer} 该元素在 Sortable Container 中所有元素的索引
     e.detail.destination.container - {HTMLElement} 元素移动到（或复制到）中的可排序容器
     e.detail.destination.itemsBeforeUpdate - {Array} 移动前的可排序项目
     e.detail.destination.items - {Array} 移动后可排序的项目
     */
});
```

### sortenter 
如果您想在拖动元素进入可排序的容器时进行某些操作，请使用 sortenter 事件。 

### sortleave

如果您想在拖动元素离开可排序的容器时进行某些操作，请使用 sortenter 事件。 


## 配置

### items
使用 `items` 选项指定元素内的哪些项目应该是可排序的：

``` javascript
sortable('.sortable', {
    items: ':not(.disabled)'
});
```
### handle
使用 `handle` 选项将拖动开始限制到指定的元素：

``` javascript
sortable('.sortable', {
    handle: 'h2'
});
```
### forcePlaceholderSize
将 `forcePlaceholderSize` 选项设置为 true，强制占位符具有高度：

``` javascript
sortable('.sortable', {
    forcePlaceholderSize: true
});
```
### acceptFrom
使用 `acceptFrom` 选项来限制可排序项将被该可排序项接受。 `acceptFrom` 接受逗号分隔的选择器列表或 `false` 以禁用接受项目。 

``` javascript
sortable('.sortable', {
  acceptFrom: '.sortable, .anotherSortable' // Defaults to null
});
```
***注意：*** 使用 `acceptFrom` 也会影响 sortable 本身。 这意味着，如果您不将其包含在 `acceptFrom` 选项中，项目将无法在列表本身中排序。

在示例中，当前列表 .sortable 允许对其中的项目进行排序，并接受来自 .anotherSortable 的元素。

如果您希望能够在可排序项之间移动项目，则两者都必须存在 `acceptFrom` 选项。

### placeholder
使用 `placeholder` 选项指定占位符的标记：

``` javascript
sortable('.sortable', {
  items: 'tr' ,
  placeholder: '<tr><td colspan="7">&nbsp;</td></tr>'
});
```

### hoverClass
使用 `hoverClass` 选项将 css 类应用于悬停元素，而不是依赖于 `:hover`。 这可以消除一些潜在的拖放问题，即另一个元素认为它正在悬停。 禁用或销毁可排序元素时禁用。

``` javascript
sortable('.sortable', {
  hoverClass: 'is-hovered is-hovered-class' // Defaults to false
});
```

### dropTargetContainerClass
使用 `dropTargetContainerClass` 选项将 css 类应用于容器。 当拖动的项目进入容器时添加该类，并在它离开（或放下）时删除。
``` javascript
sortable('.sortable', {
  dropTargetContainerClass: 'is-drop-target' // Defaults to false
});
```

### maxItems
使用 `maxItems` 选项限制 sortable 的项目数。 `maxItems` 应始终与 `items` 选项结合使用。 确保 `items` 不匹配占位符和其他选项，这样它们就不会被计算在内。
``` javascript
sortable('.sortable', {
  maxItems: 3 // Defaults to 0 (no limit)
});
```
### copy
使用“复制”选项在拖动时复制元素。 原始元素将保留在相同位置。

``` javascript
sortable('.sortable', {
  copy: true // Defaults to false
});
```

### orientation
使用 `orientation` 选项指定列表的方向并修复不正确的悬停行为。 默认为“vertical”。
horizontal为水平，vertical垂直

``` javascript
sortable('.sortable', {
  orientation: 'horizontal' // Defaults to 'vertical'
});
```

### itemSerializer
您可以提供一个将应用于“项目”数组中的每个项目的“功能”（[参见序列化]（#serialize））。 该函数接收两个参数：`serializedItem: object`、`sortableContainer: Element`。 此函数可用于更改项目的输出。 默认为“未定义”。

``` javascript
sortable('.sortable', {
  itemSerializer: (serializedItem, sortableContainer) => {
    return {
      position:  serializedItem.index + 1,
      html: serializedItem.html
    }
  }
});
```

### containerSerializer
您可以提供将应用于“容器”对象的“函数”（[参见序列化](#serialize)）。 该函数接收一个参数：`serializedContainer: object`。 此函数可用于更改容器的输出。 默认为“未定义”。

``` javascript
sortable('.sortable', {
  containerSerializer: (serializedContainer) => {
    return {
      length: container.itemCount
    }
  }
});
```

### customDragImage
您可以在选项对象上提供一个函数作为 `customDragImage` 属性，该对象将用于创建拖动图像的项目和位置（拖动元素时您看到的半透明项目）。

该函数获取三个参数，被拖动的元素，一个具有项目偏移量的偏移量对象和“dragstart”事件。 函数**必须**返回一个对象，该对象具有 `element` 属性和 html 元素以及 `posX` 和 `posY` 属性，具有 dragImage 的 x 和 y 偏移量。

``` javascript
sortable('.sortable', {
  customDragImage: (draggedElement, elementOffset, event) => {
    return {
      element: draggedElement,
      posX: event.pageX - elementOffset.left,
      posY: event.pageY - elementOffset.top
    }
  }
});

// elementOffset object that is received in the customDragImage function
{
  left: rect.left + window.scrollX,
  right: rect.right + window.scrollX,
  top: rect.top + window.scrollY,
  bottom: rect.bottom + window.scrollY
}
```

## 方法

### destroy
要完全删除可排序功能：

``` javascript
sortable('.sortable', 'destroy');
```

### disable
暂时禁用可排序：

``` javascript
sortable('.sortable', 'disable');
```

### enable
要启用可排序：

``` javascript
sortable('.sortable', 'enable');
```

### serialize
您可以使用 `serialize` 命令轻松序列化可排序对象。 如果您在选项对象中提供了 [`itemSerializer`](#itemSerializer) 或 [`containerSerializer`](#containerSerializer) 函数，它们将在返回之前应用于 `container` 对象和 `items` 对象。

``` javascript
sortable('.sortable', 'serialize');

// You will receive an object in the following format
[{
  container: {
    node: sortableContainer,
    itemCount: items.length
  }
  items: [{
    parent: sortableContainer,
    node: item,
    html: item.outerHTML,
    index: index(item, items)
  }, …]
}, …]
```

### reload
当您向 sortable 添加新项目时，它不会自动成为可拖动项目，因此您需要重新初始化 sortable。 您之前添加的选项将被保留。
``` javascript
sortable('.sortable');
```

## html表格排序

* 在 `tbody` 元素上初始化插件（如果您不这样做，浏览器会自动添加 `tbody`）
* 请记住，不同的浏览器可能会在拖动操作期间显示不同的行拖动图像。 如果 `td` 中有任何内联元素，Webkit 浏览器似乎会隐藏 `td` 单元格的全部内容。 这可能会也可能不会通过将 `td` 设置为 `position: relative;` 来解决。
* 如果您添加自定义的“占位符”，您必须使用“tr”，例如 `placeholder: "<tr><td colspan="3">该行将出现在这里</td></tr>"`，否则您只能在悬停第一列时放下项目。

