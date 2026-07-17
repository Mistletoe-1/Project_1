export const navItems = [
  { id: 'dashboard', label: '运营看板', icon: 'grid' },
  { id: 'orders', label: '订单中心', icon: 'receipt' },
  { id: 'products', label: '商品库存', icon: 'box' },
  { id: 'members', label: '会员运营', icon: 'users' },
  { id: 'campaigns', label: '活动计划', icon: 'spark' }
];

export const stats = [
  { label: '今日成交额', value: '¥128,460', trend: '+12.8%', tone: 'green', meta: '较昨日增长 14,580' },
  { label: '待处理订单', value: '318', trend: '-6.2%', tone: 'blue', meta: '超时风险 12 单' },
  { label: '新客转化率', value: '18.7%', trend: '+3.1%', tone: 'orange', meta: '直播间贡献 41%' },
  { label: '库存健康度', value: '86', trend: '+4', tone: 'purple', meta: '低库存 SKU 9 个' }
];

export const revenueSeries = [
  { day: '周一', value: 36 },
  { day: '周二', value: 45 },
  { day: '周三', value: 42 },
  { day: '周四', value: 58 },
  { day: '周五', value: 67 },
  { day: '周六', value: 76 },
  { day: '周日', value: 72 }
];

export const channelSeries = [
  { name: '小程序', value: 78, color: '#357c66' },
  { name: '门店自提', value: 64, color: '#d16d4d' },
  { name: '直播间', value: 52, color: '#4b78a8' },
  { name: '企业购', value: 36, color: '#b69148' }
];

export const initialOrders = [
  { id: 'SO-240718', customer: '林知夏', city: '杭州', amount: 862, status: '待发货', channel: '小程序', time: '10:28', risk: '普通', hoursOpen: 3, discount: 0, timeline: ['10:28 订单创建', '10:31 支付完成', '待仓库发货'] },
  { id: 'SO-240719', customer: '周予安', city: '上海', amount: 1298, status: '待审核', channel: '企业购', time: '10:41', risk: '高价值', hoursOpen: 6, discount: 18, timeline: ['10:41 企业购订单创建', '10:44 提交折扣申请', '待运营审核'] },
  { id: 'SO-240720', customer: '许念', city: '成都', amount: 436, status: '运输中', channel: '门店自提', time: '11:05', risk: '普通', hoursOpen: 2, discount: 0, timeline: ['11:05 订单创建', '11:12 已拣货', '11:20 物流揽收'] },
  { id: 'SO-240721', customer: '陈景和', city: '南京', amount: 2190, status: '售后中', channel: '直播间', time: '11:22', risk: '需跟进', hoursOpen: 28, discount: 12, timeline: ['昨日 08:16 申请售后', '昨日 11:40 客服跟进', '等待人工判定'] },
  { id: 'SO-240722', customer: '温嘉', city: '苏州', amount: 759, status: '已完成', channel: '小程序', time: '12:03', risk: '普通', hoursOpen: 1, discount: 0, timeline: ['12:03 订单创建', '12:36 完成签收'] },
  { id: 'SO-240723', customer: '韩屿', city: '广州', amount: 1486, status: '待发货', channel: '直播间', time: '12:36', risk: '高价值', hoursOpen: 18, discount: 0, timeline: ['昨日 18:36 直播间下单', '昨日 18:40 支付完成', '仓库待处理'] }
];

export const initialProducts = [
  { id: 'P-1008', name: '云柔棉睡眠套装', category: '家居', stock: 148, sales: 932, price: 299, alert: 90, dailySales: 12, leadDays: 5, incoming: 0 },
  { id: 'P-1013', name: '轻量通勤托特包', category: '配饰', stock: 58, sales: 681, price: 389, alert: 80, dailySales: 11, leadDays: 7, incoming: 36 },
  { id: 'P-1021', name: '冷萃咖啡礼盒', category: '食品', stock: 212, sales: 1104, price: 169, alert: 120, dailySales: 18, leadDays: 4, incoming: 0 },
  { id: 'P-1035', name: '城市防晒衬衫', category: '服饰', stock: 34, sales: 856, price: 259, alert: 70, dailySales: 9, leadDays: 6, incoming: 0 },
  { id: 'P-1042', name: '香氛旅行套盒', category: '个护', stock: 96, sales: 443, price: 199, alert: 60, dailySales: 6, leadDays: 5, incoming: 24 }
];

export const members = [
  { name: '沈晴', level: '黑金会员', spent: '¥18,460', activity: 94, tag: '高复购' },
  { name: '李牧', level: '金卡会员', spent: '¥9,830', activity: 72, tag: '价格敏感' },
  { name: '乔晚', level: '银卡会员', spent: '¥5,294', activity: 63, tag: '新品偏好' },
  { name: '顾然', level: '普通会员', spent: '¥2,178', activity: 41, tag: '待唤醒' }
];

export const initialCampaigns = [
  { title: '周末会员专享日', owner: '运营组', budget: 68, status: '进行中', date: '7/13 - 7/14', goal: '提升高复购会员客单价', conversion: '14.8%', roi: '2.6', channel: '小程序' },
  { title: '夏季新品预售', owner: '商品组', budget: 42, status: '排期中', date: '7/18 - 7/25', goal: '验证新品需求与订货量', conversion: '—', roi: '—', channel: '直播间' },
  { title: '老客召回礼券', owner: 'CRM', budget: 88, status: '复盘中', date: '7/01 - 7/07', goal: '召回沉默 30 天以上会员', conversion: '8.4%', roi: '1.9', channel: '短信' }
];

export const tasks = [
  { title: '核对企业购异常折扣', time: '14:00 前', done: false },
  { title: '补充低库存商品主图', time: '今日', done: false },
  { title: '导出直播间成交明细', time: '已完成', done: true },
  { title: '确认周末活动短信文案', time: '16:30', done: false }
];
