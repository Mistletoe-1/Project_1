import { useMemo, useState } from 'react';
import { NewCampaignModal, SalesReportModal } from './components/ActionOverlays.jsx';
import { CampaignsView } from './components/Campaigns.jsx';
import { ChannelPanel, InsightPanel, RevenueChart, StatGrid, TaskPanel } from './components/Dashboard.jsx';
import { Sidebar, Topbar } from './components/Layout.jsx';
import { MembersView } from './components/Members.jsx';
import { OrdersView } from './components/Orders.jsx';
import { ProductsView } from './components/Products.jsx';
import {
  channelSeries,
  initialCampaigns,
  initialOrders,
  initialProducts,
  members,
  navItems,
  revenueSeries,
  stats,
  tasks as seedTasks
} from './data/mockData.js';

const initialNotifications = [
  {
    id: 'N-001',
    title: '企业购订单待审核',
    desc: 'SO-240719 金额 ¥1,298，需要确认折扣与开票信息。',
    time: '刚刚',
    type: 'order',
    unread: true
  },
  {
    id: 'N-002',
    title: '低库存商品提醒',
    desc: '城市防晒衬衫库存低于安全线，建议今天完成补货。',
    time: '12 分钟前',
    type: 'stock',
    unread: true
  },
  {
    id: 'N-003',
    title: '活动复盘已生成',
    desc: '老客召回礼券活动复购率 27.4%，可进入活动计划查看。',
    time: '36 分钟前',
    type: 'campaign',
    unread: false
  }
];

const nextStatus = {
  待审核: '待发货',
  待发货: '运输中',
  运输中: '已完成',
  售后中: '已完成',
  已完成: '已完成'
};

function DashboardView({ tasks, onToggleTask, onOpenReport }) {
  return (
    <>
      <StatGrid stats={stats} />
      <div className="dashboardGrid">
        <RevenueChart data={revenueSeries} onOpenReport={onOpenReport} />
        <ChannelPanel channels={channelSeries} />
        <TaskPanel tasks={tasks} onToggleTask={onToggleTask} />
        <InsightPanel />
      </div>
    </>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('全部');
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [tasks, setTasks] = useState(seedTasks);
  const [toast, setToast] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const activeLabel = useMemo(() => {
    return navItems.find((item) => item.id === activeView)?.label || '运营看板';
  }, [activeView]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => item.unread).length;
  }, [notifications]);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(''), 2800);
  }

  function handleAdvanceOrder(id) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status: nextStatus[order.status] || order.status } : order
      )
    );
    showToast(`${id} 已推进到下一处理节点`);
  }

  function handleRestock(id) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, stock: product.stock + 24 } : product
      )
    );
    showToast('已生成补货记录，库存同步增加 24 件');
  }

  function handleToggleTask(index) {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) => (taskIndex === index ? { ...task, done: !task.done } : task))
    );
  }

  function handleCreateCampaign(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get('title').trim();
    const owner = form.get('owner');
    const budget = Number(form.get('budget'));
    const startDate = form.get('startDate');
    const endDate = form.get('endDate');
    const date = startDate && endDate ? `${startDate.slice(5)} - ${endDate.slice(5)}` : '待确认';

    if (!title) return;

    setCampaigns((currentCampaigns) => [
      { title, owner, budget, status: '排期中', date },
      ...currentCampaigns
    ]);
    event.currentTarget.reset();
    showToast(`活动「${title}」已加入排期`);
    setCreateModalOpen(false);
    setActiveView('campaigns');
  }

  function handleOpenCreate() {
    setCreateModalOpen(true);
    setNotificationOpen(false);
    setReportModalOpen(false);
  }

  function handleOpenReport() {
    setReportModalOpen(true);
    setNotificationOpen(false);
  }

  function handleToggleNotifications() {
    setNotificationOpen((open) => !open);
  }

  function handleMarkAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
    showToast('消息已全部标记为已读');
  }

  function handleResolveNotice(id) {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
    showToast('消息已标记处理');
  }

  return (
    <div className="appShell">
      <Sidebar navItems={navItems} activeView={activeView} onNavigate={setActiveView} />

      <main className="mainArea">
        <Topbar
          activeLabel={activeLabel}
          search={search}
          onSearchChange={setSearch}
          onOpenCreate={handleOpenCreate}
          notifications={notifications}
          unreadCount={unreadCount}
          notificationOpen={notificationOpen}
          onToggleNotifications={handleToggleNotifications}
          onCloseNotifications={() => setNotificationOpen(false)}
          onMarkAllRead={handleMarkAllRead}
          onResolveNotice={handleResolveNotice}
        />

        {activeView === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onOpenReport={handleOpenReport}
          />
        )}
        {activeView === 'orders' && (
          <OrdersView
            orders={orders}
            search={search}
            filter={orderFilter}
            onFilterChange={setOrderFilter}
            onAdvanceOrder={handleAdvanceOrder}
          />
        )}
        {activeView === 'products' && (
          <ProductsView products={products} search={search} onRestock={handleRestock} />
        )}
        {activeView === 'members' && <MembersView members={members} search={search} />}
        {activeView === 'campaigns' && (
          <CampaignsView campaigns={campaigns} onCreateCampaign={handleCreateCampaign} />
        )}
      </main>

      <NewCampaignModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
      <SalesReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        revenue={revenueSeries}
        channels={channelSeries}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
