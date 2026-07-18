import { useEffect, useMemo, useState } from 'react';
import { NewCampaignModal, SalesReportModal } from './components/ActionOverlays.jsx';
import { CampaignsView } from './components/Campaigns.jsx';
import { ChannelPanel, InsightPanel, RevenueChart, StatGrid, TaskPanel } from './components/Dashboard.jsx';
import { OrderDetailDrawer, RiskQueue } from './components/DecisionPanel.jsx';
import { Sidebar, Topbar } from './components/Layout.jsx';
import { MembersView } from './components/Members.jsx';
import { OrdersView } from './components/Orders.jsx';
import { ProductsView } from './components/Products.jsx';
import { advanceOrder, createCampaign, getBootstrap, restockProduct } from './api/adminApi.js';
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

function DashboardView({ dashboardStats, revenueData, channelData, tasks, orders, onToggleTask, onOpenReport, onOpenOrder, onNavigate }) {
  return (
    <>
      <StatGrid stats={dashboardStats} />
      <div className="dashboardGrid">
        <RevenueChart data={revenueData} onOpenReport={onOpenReport} />
        <ChannelPanel channels={channelData} />
        <TaskPanel tasks={tasks} onToggleTask={onToggleTask} />
        <RiskQueue orders={orders} onOpenOrder={onOpenOrder} onNavigate={onNavigate} />
        <InsightPanel />
      </div>
    </>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('全部');
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [revenueData, setRevenueData] = useState(revenueSeries);
  const [channelData, setChannelData] = useState(channelSeries);
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [memberList, setMemberList] = useState(members);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [tasks, setTasks] = useState(seedTasks);
  const [toast, setToast] = useState('');
  const [apiReady, setApiReady] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadRemoteData() {
      try {
        const data = await getBootstrap();
        if (ignore) return;

        setDashboardStats(data.stats || stats);
        setRevenueData(data.revenueSeries || revenueSeries);
        setChannelData(data.channelSeries || channelSeries);
        setOrders(data.orders || initialOrders);
        setProducts(data.products || initialProducts);
        setMemberList(data.members || members);
        setCampaigns(data.campaigns || initialCampaigns);
        setTasks(data.tasks || seedTasks);
        setApiReady(true);
      } catch (error) {
        if (!ignore) {
          setApiReady(false);
          console.info('API 未启动，当前使用本地 mock 数据。');
        }
      }
    }

    loadRemoteData();

    return () => {
      ignore = true;
    };
  }, []);

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

  async function handleAdvanceOrder(id) {
    try {
      const updatedOrder = await advanceOrder(id);
      setOrders((currentOrders) =>
        currentOrders.map((order) => (
          order.id === id
            ? { ...order, ...updatedOrder, timeline: [...(order.timeline || []), '刚刚 已推进订单状态'] }
            : order
        ))
      );
      showToast(`${id} 已通过后端接口推进状态`);
    } catch (error) {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === id
            ? { ...order, status: nextStatus[order.status] || order.status, timeline: [...(order.timeline || []), '刚刚 已本地推进订单状态'] }
            : order
        )
      );
      showToast(`${id} 已本地推进状态`);
    }

    setSelectedOrder((current) => (
      current && current.id === id
        ? {
            ...current,
            status: nextStatus[current.status] || current.status,
            timeline: [...(current.timeline || []), '刚刚 已推进订单状态并记录处理']
          }
        : current
    ));
  }

  async function handleRestock(id) {
    try {
      const updatedProduct = await restockProduct(id);
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === id ? updatedProduct : product))
      );
      showToast('后端已生成补货记录，库存增加 24 件');
    } catch (error) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === id ? { ...product, stock: product.stock + 24 } : product
        )
      );
      showToast('已本地生成补货记录，库存增加 24 件');
    }
  }

  function handleToggleTask(index) {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) => (taskIndex === index ? { ...task, done: !task.done } : task))
    );
  }

  async function handleCreateCampaign(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = form.get('title').trim();
    const owner = form.get('owner');
    const channel = form.get('channel');
    const goal = String(form.get('goal') || '').trim();
    const budget = Number(form.get('budget'));
    const startDate = form.get('startDate');
    const endDate = form.get('endDate');
    const date = startDate && endDate ? `${startDate.slice(5)} - ${endDate.slice(5)}` : '待确认';

    if (!title) return;

    const payload = {
      title,
      owner,
      channel,
      goal,
      budget,
      date,
      status: '排期中',
      conversion: '待复盘',
      roi: '待复盘'
    };

    try {
      const createdCampaign = await createCampaign(payload);
      setCampaigns((currentCampaigns) => [{ ...payload, ...createdCampaign }, ...currentCampaigns]);
      showToast(`活动「${title}」已通过后端接口加入排期`);
    } catch (error) {
      setCampaigns((currentCampaigns) => [
        payload,
        ...currentCampaigns
      ]);
      showToast(`活动「${title}」已本地加入排期`);
    }

    formElement.reset();
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

        <div className={`apiStatus ${apiReady ? 'isOnline' : 'isLocal'}`}>
          {apiReady ? 'Node.js API 已连接' : '本地 mock 数据模式'}
        </div>

        {activeView === 'dashboard' && (
          <DashboardView
            dashboardStats={dashboardStats}
            revenueData={revenueData}
            channelData={channelData}
            tasks={tasks}
            orders={orders}
            onToggleTask={handleToggleTask}
            onOpenReport={handleOpenReport}
            onOpenOrder={setSelectedOrder}
            onNavigate={setActiveView}
          />
        )}
        {activeView === 'orders' && (
          <OrdersView
            orders={orders}
            search={search}
            filter={orderFilter}
            onFilterChange={setOrderFilter}
            onAdvanceOrder={handleAdvanceOrder}
            onOpenOrder={setSelectedOrder}
          />
        )}
        {activeView === 'products' && (
          <ProductsView products={products} search={search} onRestock={handleRestock} />
        )}
        {activeView === 'members' && <MembersView members={memberList} search={search} />}
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
        revenue={revenueData}
        channels={channelData}
      />
      <OrderDetailDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvance={handleAdvanceOrder}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
