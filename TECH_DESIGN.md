# TECH_DESIGN

基于 PRD 的技术设计，适用于 Vue 3 + Vite + LocalStorage 的单机 TodoList 应用。

## 1. 总体架构
- 客户端单页应用（SPA），Vue 3 + Vite。
- 状态管理：组合式 API + composables（无 Pinia），局部响应为主。
- 数据持久化：LocalStorage 封装模块，统一键名/版本，提供容错。
- 视图层：组件化拆分（表单/过滤/列表/统计/对话框）。
- 样式：Tailwind CSS（utility-first，集中在 `tailwind.config.js` 定义色板/间距/圆角/阴影/响应断点），搭配少量全局样式覆写。

## 2. 页面与布局
- 单页，无路由切分；主容器区域：标题区 → 统计 → 表单 → 搜索/筛选 → 列表 → 空状态。
- 响应式：>768px 双列（表单+过滤 / 列表），≤768px 单列。

## 3. 数据模型
```ts
type Priority = 'high' | 'medium' | 'low';
interface Todo {
  id: string;          // timestamp-rand
  title: string;       // 1-100
  description: string; // 0-500
  completed: boolean;
  priority: Priority;  // default: medium
  category: string;    // default: '工作'
  dueDate: string | null; // ISO 8601
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
}

type Category = string; // 预设 + 自定义单分类
```
- 存储键名：`todolist_todos`, `todolist_categories`，预留 `todolist_settings`。
- ID 生成：`Date.now()` + 随机串。

## 4. 模块与职责
1) `storage.ts`
   - `loadTodos()`, `saveTodos(todos)`, `loadCategories()`, `saveCategories(cats)`。
   - LocalStorage 封装，try/catch 容错，返回默认值；预留版本号与 settings。
2) `useTodos.ts`
   - `todos` 响应式列表；CRUD；`toggleComplete`；`updateTodo`；`deleteTodo`。
   - 写入前更新 `updatedAt`；删除由外层确认。
3) `useFilters.ts`
   - 状态：关键词、状态（all/active/completed）、优先级、分类、排序字段。
   - `filteredTodos`（computed）：搜索 + 筛选 + 排序。
4) `useCategories.ts`
   - 预设分类（工作/学习/生活）+ 自定义单分类；新增后持久化。
5) 组件
   - `HeaderStats`: 总数/已完成/进行中/完成率。
   - `TodoForm`: 标题必填；描述/优先级/分类/截止日期为可折叠高级项；提交后清空。
   - `FiltersBar`: 搜索 + 筛选（状态/优先级/分类）+ 排序（创建时间/截止日期/优先级）。
   - `TodoList` 与 `TodoItem`: 标题、徽标、分类、截止日期、完成复选、编辑、删除；空状态提示。
   - `ConfirmDialog`: 删除确认。
   - `Toast/Notice`: 轻量提示（可选简单实现）。
6) 样式
   - 主色 `#3b82f6`，优先级红/黄/绿；文字深灰，辅助浅灰。
   - 基础动效：新增淡入，删除淡出，完成状态过渡。

## 5. 关键交互与逻辑
- 创建：标题必填且 ≤100，描述 ≤500；默认 priority=medium，category="工作"；`createdAt/updatedAt` 填当前 ISO。
- 编辑：表单回填更新；刷新 `updatedAt`。
- 完成切换：更新 `completed` 与 `updatedAt`，样式删除线/弱化。
- 删除：确认对话框后删除（淡出再移除）。
- 搜索：标题/描述关键词（不区分大小写）实时过滤。
- 筛选：状态、优先级、分类；排序（创建时间/截止日期/优先级）。对 `dueDate=null` 设定排序规则（如置后）。
- 截止日期显示：计算与今天差值，显示今天/明天/N 天后/已过期；过期标红。

## 6. 非功能性实现要点
- 性能：过滤/排序用 computed；目标 500 条内流畅。
- 容错：LocalStorage 失败 catch 提示（toast 一次），回退默认空数据。
- 安全：避免 `v-html`；用户输入直接文本渲染，防 XSS。
- 可访问性：label 关联输入，焦点态可见，键盘可操作。
- 兼容性：现代浏览器近两版；移动端常见尺寸适配。

## 7. 目录建议
```
src/
  main.ts
  App.vue
  components/
    HeaderStats.vue
    TodoForm.vue
    FiltersBar.vue
    TodoList.vue
    TodoItem.vue
    ConfirmDialog.vue
    Toast.vue
  composables/
    useTodos.ts
    useFilters.ts
    useCategories.ts
  utils/
    storage.ts
    date.ts
  styles/
    vars.css
    base.css
```

## 8. 依赖与配置
- 依赖：Vue 3, Vite；可选 PostCSS（autoprefixer）。
- 路径别名：`@ -> src`。
- 开发端口可自定义（如 5173）。

## 9. 测试与验收
- 单元/组件测试（如 Vitest + Vue Test Utils）：
  - `useTodos`: CRUD/持久化调用/`updatedAt` 更新。
  - `useFilters`: 多条件过滤与排序。
  - `date.ts`: 截止日期文案与过期判断。
- 手动验收：
  - 创建/编辑/删除/完成/未完成流程。
  - 搜索/筛选/排序组合。
  - LocalStorage 清空后的默认分类恢复。
  - LocalStorage 写入异常提示与降级。
  - 移动端布局与可访问性检查。

## 10. 风险与缓解
- LocalStorage 读写失败：封装 try/catch + 用户提示；内存态可用。
- 大量任务性能：computed 过滤；>1000 可评估虚拟列表（非本期）。
- 误删：强制确认对话框。
- 截止日期为空排序：显式规则（如置后或固定优先顺序）。

## 11. 里程碑对齐
1) MVP（P0）：模型 + storage + useTodos + 表单/列表 + 完成/删除/编辑 + 基础样式 + 删除确认 + 本地持久化。
2) 增强（P1）：FiltersBar（搜索/筛选/排序）、优先级色彩、截止日期提示、统计区、分类管理。
3) 可选：Toast 友好提示、动效微调。
