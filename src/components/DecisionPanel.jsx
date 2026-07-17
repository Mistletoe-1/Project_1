export function getRiskProfile(order) {
  const factors = [];
  let score = 18;

  if (order.amount >= 1200) {
    score += 28;
    factors.push('高价值订单');
  }
  if (order.hoursOpen >= 12) {
    score += 22;
    factors.push(`已滞留 ${order.hoursOpen} 小时`);
  }
  if (order.discount >= 10) {
    score += 18;
    factors.push(`${order.discount}% 异常折扣`);
  }
  if (order.status === '售后中') {
    score += 26;
    factors.push('售后处理未闭环');
  }

  const level = score >= 70 ? '高风险' : score >= 40 ? '需关注' : '正常';
  return { score: Math.min(score, 99), level, factors: factors.length ? factors : ['订单流程正常'] };
}

export function RiskQueue({ orders, onOpenOrder, onNavigate }) {
  const riskOrders = orders
    .map((order) => ({ order, profile: getRiskProfile(order) }))
    .filter(({ profile }) => profile.level !== '正常')
    .sort((a, b) => b.profile.score - a.profile.score)
    .slice(0, 3);

  return (
    <section className="panel priorityPanel">
      <div className="sectionTitle">
        <div>
          <span>优先队列</span>
          <h2>今日风险订单</h2>
        </div>
        <button className="ghostButton" type="button" onClick={() => onNavigate('orders')}>查看全部</button>
      </div>
      <div className="priorityList">
        {riskOrders.map(({ order, profile }) => (
          <button className="priorityItem" key={order.id} type="button" onClick={() => onOpenOrder(order)}>
            <span className={`riskScore ${profile.level === '高风险' ? 'isHigh' : ''}`}>{profile.score}</span>
            <span>
              <strong>{order.id}</strong>
              <small>{profile.factors.join(' · ')}</small>
            </span>
            <em>{order.customer}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

export function OrderDetailDrawer({ order, onClose, onAdvance }) {
  if (!order) return null;

  const profile = getRiskProfile(order);
  return (
    <div className="drawerLayer" role="presentation" onMouseDown={onClose}>
      <aside className="orderDrawer" role="dialog" aria-modal="true" aria-labelledby="order-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawerHeader">
          <div>
            <span>订单风险详情</span>
            <h2 id="order-drawer-title">{order.id}</h2>
          </div>
          <button className="iconButton modalClose" type="button" onClick={onClose} aria-label="关闭订单详情">×</button>
        </div>
        <div className="riskHero">
          <div>
            <span>风险评分</span>
            <strong>{profile.score}</strong>
          </div>
          <p>{profile.level}</p>
        </div>
        <section className="drawerSection">
          <span>风险依据</span>
          <div className="factorList">{profile.factors.map((factor) => <b key={factor}>{factor}</b>)}</div>
        </section>
        <section className="drawerSection detailGrid">
          <div><span>客户</span><strong>{order.customer}</strong></div>
          <div><span>订单金额</span><strong>¥{order.amount.toLocaleString()}</strong></div>
          <div><span>渠道</span><strong>{order.channel}</strong></div>
          <div><span>当前状态</span><strong>{order.status}</strong></div>
        </section>
        <section className="drawerSection">
          <span>处理时间线</span>
          <ol className="timelineList">{(order.timeline || ['订单已创建']).map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
        <button className="primaryButton wide" type="button" onClick={() => onAdvance(order.id)}>
          推进订单并记录处理
        </button>
      </aside>
    </div>
  );
}

export function getReplenishment(product) {
  const dailySales = product.dailySales || Math.max(1, Math.round(product.sales / 90));
  const daysCover = Math.max(0, Math.floor(product.stock / dailySales));
  const target = Math.max(product.alert * 2, dailySales * ((product.leadDays || 5) + 14));
  const quantity = Math.max(0, Math.ceil(target - product.stock - (product.incoming || 0)));
  const level = daysCover <= (product.leadDays || 5) ? '紧急' : daysCover <= 10 ? '关注' : '正常';
  return { dailySales, daysCover, quantity, level };
}
