# 澄序零售运营后台

一个面向零售业务场景的后台管理系统，适合作为前端实习项目展示。项目以 React + JavaScript 为主，补充了一个轻量 Node.js 后端，用于体现基础前后端联调能力。

## 项目简介

系统围绕零售运营工作台展开，包含运营看板、订单中心、商品库存、会员运营、活动计划等模块。页面注重后台系统的真实业务逻辑、响应式布局、舒适配色和完整交互，不是单纯静态模板。

项目新增了 Node.js 原生 HTTP 后端，不引入 Express、不接数据库，使用内存数据模拟真实接口，方便展示对 REST API、前后端联调、Vite 代理和接口兜底的理解。

## 技术栈

| 分类      | 技术                        |
| --------- | --------------------------- |
| 前端框架  | React 18、JavaScript        |
| 构建工具  | Vite                        |
| 样式      | HTML5、CSS3、响应式布局     |
| 后端      | Node.js 原生 HTTP 模块      |
| 数据交互  | Fetch、REST API、Vite Proxy |
| 测试/验证 | Playwright 预留             |

## 核心功能

### 运营看板

- 今日成交额、待处理订单、新客转化率、库存健康度等指标卡片
- 近 7 日成交趋势图
- 渠道贡献占比展示
- 今日待办事项勾选
- 销售报表弹窗，展示成交指数、峰值日期、主力渠道、渠道排行和运营建议

### 订单中心

- 订单列表展示订单号、客户、城市、金额、渠道、状态和风险标签
- 支持按订单状态筛选
- 支持关键词搜索
- 点击“处理”可推进订单状态
- 后端启动时优先调用 `PATCH /api/orders/:id`，后端未启动时自动本地兜底

### 商品库存

- 商品卡片展示库存、销量、售价和分类
- 低库存商品预警
- 点击“快速补货 24 件”更新库存
- 后端启动时优先调用 `PATCH /api/products/:id`

### 会员运营

- 展示活跃会员、复购率、客单价
- 会员等级、消费金额、活跃度和运营标签
- 支持搜索会员名称、等级和标签

### 活动计划

- 新建运营活动
- 活动列表展示状态、负责人、日期和预算占用
- 预算环形进度展示
- 后端启动时优先调用 `POST /api/campaigns`

### 消息通知

- 右上角消息按钮展示未读数量
- 消息面板展示订单审核、库存提醒、活动复盘等通知
- 支持全部已读和单条标记处理

## 后端接口说明

后端目录：`server/`

| 方法  | 接口                | 说明                                               |
| ----- | ------------------- | -------------------------------------------------- |
| GET   | `/api/health`       | 后端健康检查                                       |
| GET   | `/api/bootstrap`    | 获取看板、订单、商品、会员、活动、待办等初始化数据 |
| PATCH | `/api/orders/:id`   | 推进订单到下一状态                                 |
| PATCH | `/api/products/:id` | 商品补货，库存增加 24 件                           |
| POST  | `/api/campaigns`    | 创建运营活动                                       |

前端接口封装文件：`src/api/adminApi.js`

Vite 代理配置：`vite.config.js`

```js
proxy: {
  '/api': 'http://127.0.0.1:3001'
}
```

## 容错设计

前端启动时会请求 `/api/bootstrap`。

- 如果 Node.js 后端已启动，页面显示 `Node.js API 已连接`，订单处理、库存补货、活动创建优先走接口。
- 如果后端没有启动，页面显示 `本地 mock 数据模式`，系统继续使用本地模拟数据，不影响页面展示和基础交互。

## 项目结构

```text
project_1/
├── server/
│   ├── data.cjs              # 后端模拟数据
│   └── index.cjs             # Node.js 原生 HTTP 接口服务
├── src/
│   ├── api/
│   │   └── adminApi.js       # 前端接口请求封装
│   ├── components/
│   │   ├── ActionOverlays.jsx
│   │   ├── Campaigns.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Icons.jsx
│   │   ├── Layout.jsx
│   │   ├── Members.jsx
│   │   ├── Orders.jsx
│   │   └── Products.jsx
│   ├── data/
│   │   └── mockData.js       # 前端兜底 mock 数据
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动后端接口

```bash
npm run api
```

后端默认运行在：

```text
http://127.0.0.1:3001
```

### 3. 启动前端页面

新开一个终端执行：

```bash
npm run dev
```

前端默认运行在：

```text
http://127.0.0.1:5174
```

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产版本

```bash
npm run preview
```
