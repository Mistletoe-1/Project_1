import Icon from './Icons.jsx';

const statusOptions = ['全部', '待审核', '待发货', '运输中', '售后中', '已完成'];

export function OrdersView({ orders, search, filter, onFilterChange, onAdvanceOrder }) {
  const visibleOrders = orders.filter((order) => {
    const inFilter = filter === '全部' || order.status === filter;
    const keyword = search.trim().toLowerCase();
    const inSearch = !keyword || `${order.id}${order.customer}${order.city}${order.channel}`.toLowerCase().includes(keyword);
    return inFilter && inSearch;
  });

  return (
    <section className="panel tablePanel">
      <div className="sectionTitle tableTitle">
        <div>
          <span>订单流转</span>
          <h2>订单中心</h2>
        </div>
        <div className="segmented">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={filter === status ? 'isActive' : ''}
              onClick={() => onFilterChange(status)}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="responsiveTable">
        <table>
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>城市</th>
              <th>金额</th>
              <th>渠道</th>
              <th>状态</th>
              <th>风险</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong><small>{order.time}</small></td>
                <td>{order.customer}</td>
                <td>{order.city}</td>
                <td>¥{order.amount.toLocaleString()}</td>
                <td>{order.channel}</td>
                <td><span className={`status ${order.status}`}>{order.status}</span></td>
                <td><span className="riskTag">{order.risk}</span></td>
                <td>
                  <button className="rowButton" onClick={() => onAdvanceOrder(order.id)} type="button">
                    处理
                    <Icon name="chevron" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
