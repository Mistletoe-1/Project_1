import Icon from './Icons.jsx';
import { NotificationPanel } from './ActionOverlays.jsx';

export function Sidebar({ navItems, activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">澄</div>
        <div>
          <strong>澄序 Admin</strong>
          <span>零售运营中台</span>
        </div>
      </div>

      <nav className="navList" aria-label="后台导航">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`navItem ${activeView === item.id ? 'isActive' : ''}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebarPanel">
        <span className="panelLabel">本周目标</span>
        <strong>成交额达成 78%</strong>
        <div className="miniProgress">
          <span style={{ width: '78%' }} />
        </div>
        <p>直播间与会员复购表现稳定，低库存商品需要优先补货。</p>
      </div>
    </aside>
  );
}

export function Topbar({
  activeLabel,
  search,
  onSearchChange,
  onOpenCreate,
  notifications,
  unreadCount,
  notificationOpen,
  onToggleNotifications,
  onCloseNotifications,
  onMarkAllRead,
  onResolveNotice
}) {
  return (
    <header className="topbar">
      <div>
        <p className="pageHint">工作台 / {activeLabel}</p>
        <h1>{activeLabel}</h1>
      </div>

      <div className="topActions">
        <label className="searchBox">
          <Icon name="search" size={18} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="搜索订单、商品、会员"
          />
        </label>
        <div className="notificationWrap">
          <button
            className={`iconButton ${notificationOpen ? 'isPressed' : ''}`}
            type="button"
            aria-label={`通知，${unreadCount} 条未读`}
            aria-expanded={notificationOpen}
            onClick={onToggleNotifications}
          >
            <Icon name="bell" size={19} />
            {unreadCount > 0 && <span className="dot">{unreadCount}</span>}
          </button>
          {notificationOpen && (
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onClose={onCloseNotifications}
              onMarkAllRead={onMarkAllRead}
              onResolve={onResolveNotice}
            />
          )}
        </div>
        <button className="primaryButton" type="button" onClick={onOpenCreate}>
          <Icon name="plus" size={18} />
          新建活动
        </button>
      </div>
    </header>
  );
}
