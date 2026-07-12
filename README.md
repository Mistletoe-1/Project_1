# 澄序零售运营后台

澄序零售运营后台是一个面向零售业务场景的后台管理系统，覆盖运营看板、订单处理、商品库存、会员运营、营销活动和消息通知等常见管理流程。项目以 React + JavaScript 构建前端界面，并加入轻量 Node.js 后端接口，用于模拟真实的前后端数据交互。

## 在线预览

Netlify 部署地址：

https://stately-duckanoo-c6f347.netlify.app/

> 线上环境为静态部署版本，Node.js 本地后端不会在 Netlify 上运行。页面已做接口兜底处理，接口不可用时会自动使用本地 mock 数据展示。

## 项目特点

- 业务模块完整：覆盖看板、订单、商品、会员、活动、通知、报表等后台常见场景
- 交互真实可用：订单状态推进、库存补货、活动创建、消息已读、报表查看均可操作
- 视觉风格统一：采用柔和绿色系后台风格，兼顾信息密度和阅读舒适度
- 响应式适配：桌面端、平板端和移动端均有对应布局
- 前后端联调：使用 Fetch 请求 Node.js REST API，并通过 Vite Proxy 代理本地接口
- 容错设计：后端未启动时自动回退到本地 mock 数据，保证页面仍可正常展示

## 技术栈

| 分类     | 技术                              |
| -------- | --------------------------------- |
| 前端     | React 18、JavaScript、HTML5、CSS3 |
| 构建     | Vite                              |
| 后端     | Node.js 原生 HTTP 模块            |
| 数据交互 | Fetch、REST API、Vite Proxy       |
| 部署     | Netlify                           |
| 测试工具 | Playwright 预留                   |

## 功能模块

### 运营看板

- 展示今日成交额、待处理订单、新客转化率、库存健康度等核心指标
- 展示近 7 日成交趋势和渠道贡献占比
- 支持待办事项勾选
- 支持查看销售报表弹窗，包含成交指数、峰值日期、主力渠道、渠道排行和运营建议

### 订单中心

- 展示订单号、客户、城市、金额、渠道、状态和风险标签
- 支持按状态筛选订单
- 支持按订单号、客户、城市、渠道搜索
- 支持点击“处理”推进订单到下一状态
- 后端启动时调用 `PATCH /api/orders/:id`，后端不可用时走本地状态更新

### 商品库存

- 展示商品名称、分类、库存、销量、售价等信息
- 低库存商品展示预警状态
- 支持快速补货 24 件
- 后端启动时调用 `PATCH /api/products/:id`

### 会员运营

- 展示活跃会员、复购率、客单价等运营指标
- 展示会员等级、消费金额、活跃度和用户标签
- 支持按会员名、等级、标签搜索

### 活动计划

- 支持新建运营活动
- 支持展示活动状态、负责人、日期和预算占用
- 使用环形进度展示活动预算比例
- 后端启动时调用 `POST /api/campaigns`

### 消息通知

- 顶部消息按钮展示未读数量
- 消息面板展示订单审核、库存提醒、活动复盘等通知
- 支持全部已读和单条标记处理

## 后端接口

后端目录：`server/`

| 方法  | 接口                | 说明                                               |
| ----- | ------------------- | -------------------------------------------------- |
| GET   | `/api/health`       | 后端健康检查                                       |
| GET   | `/api/bootstrap`    | 获取看板、订单、商品、会员、活动、待办等初始化数据 |
| PATCH | `/api/orders/:id`   | 推进订单状态                                       |
| PATCH | `/api/products/:id` | 商品补货，库存增加 24 件                           |
| POST  | `/api/campaigns`    | 创建运营活动                                       |

前端接口封装文件：`src/api/adminApi.js`

本地开发时，Vite 会把 `/api` 请求代理到 Node.js 后端：

```js
proxy: {
  '/api': 'http://127.0.0.1:3001'
}
```

## 本地运行

### 安装依赖

```bash
npm install
```

### 启动后端接口

```bash
npm run api
```

后端默认运行在：

```text
http://127.0.0.1:3001
```

### 启动前端页面

新开一个终端执行：

```bash
npm run dev
```

前端默认运行在：

```text
http://127.0.0.1:5174
```

### 构建生产版本

```bash
npm run build
```

### 本地预览构建产物

```bash
npm run preview
```

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
├── netlify.toml
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```
