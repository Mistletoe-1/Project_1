import Icon from './Icons.jsx';

export function NotificationPanel({ notifications, unreadCount, onClose, onMarkAllRead, onResolve }) {
  return (
    <section className="notificationPanel" aria-label="消息通知">
      <div className="notificationHead">
        <div>
          <span>消息中心</span>
          <strong>{unreadCount > 0 ? `${unreadCount} 条未读消息` : '暂无未读消息'}</strong>
        </div>
        <button className="textButton" type="button" onClick={onMarkAllRead}>
          全部已读
        </button>
      </div>

      <div className="notificationList">
        {notifications.map((item) => (
          <article className={`noticeItem ${item.unread ? 'isUnread' : ''}`} key={item.id}>
            <div className={`noticeIcon ${item.type}`}>
              <span />
            </div>
            <div>
              <div className="noticeTitle">
                <strong>{item.title}</strong>
                <time>{item.time}</time>
              </div>
              <p>{item.desc}</p>
              <button type="button" onClick={() => onResolve(item.id)}>
                标记处理
              </button>
            </div>
          </article>
        ))}
      </div>

      <button className="notificationClose" type="button" onClick={onClose} aria-label="关闭消息面板">
        <Icon name="close" size={16} />
      </button>
    </section>
  );
}

export function NewCampaignModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="modalLayer" role="presentation" onMouseDown={onClose}>
      <section className="campaignModal" role="dialog" aria-modal="true" aria-labelledby="campaign-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <span>活动计划</span>
            <h2 id="campaign-modal-title">新建运营活动</h2>
          </div>
          <button className="iconButton modalClose" type="button" onClick={onClose} aria-label="关闭弹窗">
            <Icon name="close" size={18} />
          </button>
        </div>

        <form className="modalForm" onSubmit={onSubmit}>
          <label className="fieldFull">
            活动名称
            <input name="title" placeholder="例如：会员加购满减" autoFocus required />
          </label>

          <label>
            负责人
            <select name="owner" defaultValue="运营组">
              <option>运营组</option>
              <option>商品组</option>
              <option>CRM</option>
              <option>门店组</option>
            </select>
          </label>

          <label>
            投放渠道
            <select name="channel" defaultValue="小程序">
              <option>小程序</option>
              <option>直播间</option>
              <option>门店自提</option>
              <option>企业购</option>
            </select>
          </label>

          <label>
            开始日期
            <input name="startDate" type="date" required />
          </label>

          <label>
            结束日期
            <input name="endDate" type="date" required />
          </label>

          <label className="fieldFull">
            活动目标
            <textarea name="goal" rows="3" placeholder="写清楚目标人群、优惠机制和预期动作" />
          </label>

          <label className="fieldFull">
            预算占用
            <input name="budget" type="range" min="10" max="95" defaultValue="54" />
          </label>

          <div className="modalActions">
            <button className="ghostButton" type="button" onClick={onClose}>取消</button>
            <button className="primaryButton" type="submit">
              <Icon name="plus" size={18} />
              创建活动
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function SalesReportModal({ open, onClose, revenue, channels }) {
  if (!open) return null;

  const totalScore = revenue.reduce((sum, item) => sum + item.value, 0);
  const peakDay = revenue.reduce((best, item) => (item.value > best.value ? item : best), revenue[0]);
  const topChannel = channels.reduce((best, item) => (item.value > best.value ? item : best), channels[0]);
  const maxRevenue = Math.max(...revenue.map((item) => item.value));

  return (
    <div className="modalLayer" role="presentation" onMouseDown={onClose}>
      <section className="reportModal" role="dialog" aria-modal="true" aria-labelledby="sales-report-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <span>销售报表</span>
            <h2 id="sales-report-title">近 7 日成交分析</h2>
          </div>
          <button className="iconButton modalClose" type="button" onClick={onClose} aria-label="关闭报表">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="reportSummary">
          <article>
            <span>成交指数</span>
            <strong>{totalScore}</strong>
            <p>较上周期提升 12.8%</p>
          </article>
          <article>
            <span>峰值日期</span>
            <strong>{peakDay.day}</strong>
            <p>单日表现 {peakDay.value} 分</p>
          </article>
          <article>
            <span>主力渠道</span>
            <strong>{topChannel.name}</strong>
            <p>贡献占比 {topChannel.value}%</p>
          </article>
        </div>

        <div className="reportBody">
          <section className="reportPanel">
            <div className="reportPanelTitle">
              <span>趋势拆解</span>
              <strong>成交热度</strong>
            </div>
            <div className="reportBars">
              {revenue.map((item) => (
                <div className="reportBarItem" key={item.day}>
                  <span>{item.day}</span>
                  <div>
                    <i style={{ width: `${(item.value / maxRevenue) * 100}%` }} />
                  </div>
                  <em>{item.value}</em>
                </div>
              ))}
            </div>
          </section>

          <section className="reportPanel">
            <div className="reportPanelTitle">
              <span>渠道表现</span>
              <strong>贡献排行</strong>
            </div>
            <div className="reportChannelList">
              {channels.map((channel, index) => (
                <div className="reportChannel" key={channel.name}>
                  <b>{index + 1}</b>
                  <div>
                    <strong>{channel.name}</strong>
                    <span>{channel.value}%</span>
                  </div>
                  <i style={{ width: `${channel.value}%`, background: channel.color }} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="reportAdvice">
          <strong>运营建议</strong>
          <p>周五至周六成交热度最高，建议把会员短信、直播间优惠券和低库存补货排在周五上午前完成，小程序仍是本周转化主渠道。</p>
        </div>
      </section>
    </div>
  );
}
