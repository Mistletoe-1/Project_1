# 澄序零售运营决策中台

面向多渠道零售运营场景的 React 管理后台。项目聚焦运营人员的日常决策：识别高风险订单、判断库存补货优先级、跟踪营销活动效果，并将处理结果沉淀为可追溯的运营流程。

## 在线预览

https://retail-operation-frontend-v1.netlify.app/

> Netlify 为静态部署环境。Node.js 本地 API 未启动时，前端会自动使用 mock 数据，因此核心界面和交互仍可展示。

## 项目亮点

- **可解释的订单风险队列**：基于订单金额、滞留时长、异常折扣和售后状态计算风险评分，并在详情中展示风险依据。
- **订单处理闭环**：支持查看客户、渠道、订单状态与处理时间线；推进订单后会更新状态并记录处理结果。
- **库存补货决策**：结合日均销量、供货周期、在途库存和安全库存，计算可售天数与建议补货量。
- **活动效果复盘**：展示活动目标、投放渠道、预算占用、转化率和 ROI，支持创建新的运营活动。
- **工程化交互体验**：包含全局搜索、状态筛选、通知处理、表单弹窗、接口失败降级、响应式布局和本地 REST API 联调。
- **本地持久化演示**：订单推进、库存补货和活动创建会写入本地运行时 JSON；重启 API 后仍能读取变更结果。

## 技术栈

| 分类     | 技术                                   |
| -------- | -------------------------------------- |
| 前端     | React 18、JavaScript、HTML5、CSS3      |
| 构建工具 | Vite                                   |
| 本地服务 | Node.js 原生 HTTP 模块                 |
| 数据交互 | Fetch、REST API、Vite Proxy、mock 降级 |
| 部署     | Netlify                                |
| 测试工具 | Playwright                             |

## 功能模块

### 运营看板

- 今日成交额、待处理订单、新客转化率和库存健康度等核心指标
- 近 7 日成交趋势、渠道贡献、待办事项与运营建议
- 今日风险订单优先队列，可直接进入订单风险详情

### 订单风险工作台

- 按状态筛选，按订单号、客户、城市和渠道搜索
- 风险评分和风险等级展示
- 订单详情抽屉：风险依据、客户信息、订单金额、渠道、状态和时间线
- 订单状态推进与处理记录反馈

### 商品库存与补货

- 商品库存、销量、售价与低库存状态
- 以可售天数、供货周期、在途库存为依据的补货建议
- 生成补货单后更新库存和下一次补货建议

### 会员与活动运营

- 会员等级、消费金额、活跃度和运营标签
- 新建活动、预算占用、目标、渠道、转化率和 ROI 展示
- 通知面板支持批量和单条处理

## API

后端目录：`server/`

| 方法  | 接口                 | 说明                                       |
| ----- | -------------------- | ------------------------------------------ |
| GET   | `/api/health`        | 健康检查                                   |
| GET   | `/api/bootstrap`     | 获取看板、订单、商品、会员、活动和待办数据 |
| PATCH | `/api/orders/:id`    | 推进订单状态                               |
| PATCH | `/api/products/:id`  | 商品补货，库存增加 24 件                   |
| PATCH | `/api/campaigns/:id` | 推进活动状态：排期、执行、复盘、归档       |
| POST  | `/api/campaigns`     | 创建运营活动                               |

前端请求封装位于 `src/api/adminApi.js`。本地开发时，Vite 将 `/api` 代理至 `http://127.0.0.1:3001`。

运行时数据文件为 `server/.runtime-data.json`。它由 API 自动生成并被 `.gitignore` 排除；删除该文件即可恢复仓库中的初始演示数据。

## 本地运行

```bash
npm install
npm run api
```

新开一个终端：

```bash
npm run dev
```

前端默认地址：`http://127.0.0.1:5174`

构建生产版本：

```bash
npm run build
```

## 测试

```bash
npm test
```

测试覆盖运行时数据持久化、旧活动 ID 迁移，以及活动状态在 API 重启后的恢复。

## 项目结构

```text
RetailOperationBack-end/
├── server/
│   ├── data.cjs
│   └── index.cjs
├── src/
│   ├── api/adminApi.js
│   ├── components/
│   │   ├── ActionOverlays.jsx
│   │   ├── Campaigns.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DecisionPanel.jsx
│   │   ├── Layout.jsx
│   │   ├── Members.jsx
│   │   ├── Orders.jsx
│   │   └── Products.jsx
│   ├── data/mockData.js
│   ├── App.jsx
│   └── styles.css
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```
