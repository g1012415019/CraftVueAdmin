### **组件拆解与分层**
在TableLowcode 目录下
整个低代码表格组件可以被拆解为以下几个核心子组件，通过 Props 和 Emits 进行通信，并使用 Pinia 进行全局状态管理。

  * **`DataTable.vue`（核心组件）**

      * **职责：** 封装 Naive UI 的 `NDataTable`，接收 `columns`、`data`、`pagination` 等核心 Props，负责表格的渲染。
      * **数据流：**
          * **Props：** 接收 `viewConfig`、`tableConfig`、`columnsConfig`、`actionsConfig`、`dataSourceConfig` 等配置对象。
          * **Emits：** 向上层组件抛出事件，如 `update:pagination`、`sort-change`、`filter-change`、`row-click`。

  * **`ConfigPanel.vue`（配置面板）**

      * **职责：** 作为侧边栏或模态框，负责渲染所有配置项，包括视图、通用设置、列配置等。
      * **子组件：** 内部可以再拆分出 `ViewConfigForm.vue`、`ColumnConfigForm.vue`、`GeneralConfigForm.vue` 等，每个表单负责特定配置项的渲染和验证。
      * **数据流：** 通过 `v-model` 或 Props/Emits 接收和更新配置数据。

  * **`DataService.ts`（数据服务层）**

      * **职责：** 封装所有数据请求逻辑，根据 `dataSourceConfig` 的 `mode` 来选择不同的数据获取方式。
      * **功能：**
          * `fetchData()`：通用方法，负责处理 `apiUrl`、`apiMethod`、`requestMap` 和 `responseMap`。
          * `transformStaticData()`：处理 `static` 模式下的数据。
          * `runFunction()`：处理 `function` 模式下的自定义函数调用。
          * 利用 Pinia 管理数据缓存，并处理 `loading` 状态。

  * **`Toolbar.vue`（工具栏）**

      * **职责：** 渲染表格上方的工具栏，包括刷新、导入、导出、搜索等按钮。
      * **数据流：** 通过 Props 接收 `toolbar` 配置，并根据配置渲染按钮，通过 Emits 触发父组件的相应操作。

-----

### **核心功能点实现思路**

  * **视图配置**

      * **数据结构：** `viewConfig` 对象应采用 Pinia Store 存储，便于在不同组件间共享。
      * **动态渲染：** 使用 `v-for` 遍历 `viewConfig.fields` 数组，动态生成表格列。
      * **JSON Schema 导入/导出：**
          * **导出：** 将当前活跃的 `viewConfig` 对象序列化为 JSON 字符串，并使用 `a` 标签的 `download` 属性提供下载。
          * **导入：** 使用 `input[type="file"]` 读取 JSON 文件，并通过 `JSON.parse()` 解析，然后更新 Pinia Store 中的 `viewConfig`。

  * **列配置**

      * **动态列：** 核心是利用 Vue 3 的动态组件 `<component :is="..."></component>` 来渲染不同 `type` 的列内容。
      * **类型映射：** 创建一个 `type-to-component` 的映射对象，例如 `const cellComponents = { text: TextCell, image: ImageCell, ... }`。
      * **自定义渲染：** 对于 `customRender`，可以设计一个插槽或传入一个渲染函数，由组件内部调用。
      * **列宽调整与排序：** 依赖 Naive UI 的内置功能，只需在 `columnsConfig` 中设置 `resizable: true` 或 `sortable: true`。对于列顺序调整，可使用 `vuedraggable` 等库实现拖拽排序，并更新 `viewConfig.order`。

  * **数据源配置**

      * **通用 Hook：** 创建一个 `useTableData()` 的 `composition API`，接收 `dataSourceConfig` 作为参数。
      * **逻辑：**
        1.  `watch` `dataSourceConfig` 的变化，当配置改变时重新请求数据。
        2.  内部维护 `data`、`loading`、`error` 等响应式状态。
        3.  根据 `dataSourceConfig.mode` 调用 `DataService` 中对应的方法。
        4.  对于 `api` 模式，使用 `axios` 或 `fetch` 进行请求，并处理 `requestMap` 和 `responseMap` 的逻辑，确保数据格式符合表格要求。

-----

### **技术栈整合与规范**

  * **类型安全：**

      * 在 `TableLowcode/types/` 目录下定义核心接口，如 `ColumnConfig`、`ActionColumnConfig`、`ViewConfig` 等。
      * **`ColumnConfig` 接口示例：**
        ```typescript
        export interface ColumnConfig {
          field: string;
          title: string;
          type: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'tag';
          width?: number | 'auto';
          align?: 'left' | 'center' | 'right';
          sortable?: boolean;
          // ... 其他属性
        }
        ```
      * 确保所有组件的 Props 和 Emits 都使用 TypeScript 接口进行类型声明。

  * **Pinia 状态管理：**

      * 创建一个 `tableStore` 来管理全局状态，例如：
          * `views`: 存储所有已保存的视图配置。
          * `activeViewId`: 当前正在使用的视图 ID。
          * `dataSourceCache`: 缓存数据，键为 `apiUrl` 和请求参数的组合，值为数据和过期时间。
      * 这样做可以实现组件间的数据共享，并保证状态的持久化和可预测性。

  * **组件组织：**

      * `src/components/TableLowcode/Table/`
          * `DataTable.vue`
          * `components/` (内部组件)
              * `CustomCell.vue`
              * `ImageCell.vue`
              * `TagCell.vue`
              * `ActionButtons.vue`
      * `src/components/TableLowcode/Config/`
          * `ConfigPanel.vue`
          * `forms/` (配置表单)
              * `ViewConfigForm.vue`
              * `ColumnConfigForm.vue`
              * `DataSourceConfigForm.vue`

  * **可扩展性：**

      * 在设计 `type` 字段时，使用 `switch` 语句或映射表，而不是大量的 `if-else`。这样在未来添加新的列类型时，只需新增一个组件和在映射表中注册即可。
      * 将 `actions`、`toolbar` 等配置项设计为数组，这样可以动态增删按钮，无需修改组件代码。