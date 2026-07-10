import Icon from './Icons.jsx';

export function StatGrid({ stats }) {
  return (
    <section className="statGrid" aria-label="核心指标">
      {stats.map((stat) => (
        <article className={`statCard tone-${stat.tone}`} key={stat.label}>
          <div>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
          <p>
            <Icon name="trend" size={16} />
            {stat.trend}
          </p>
          <small>{stat.meta}</small>
        </article>
      ))}
    </section>
  );
}

export function RevenueChart({ data, onOpenReport }) {
  const points = data
    .map((item, index) => {
      const x = 18 + index * 54;
      const y = 144 - item.value * 1.35;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className="panel revenuePanel">
      <div className="sectionTitle">
        <div>
          <span>销售趋势</span>
          <h2>近 7 日成交表现</h2>
        </div>
        <button className="ghostButton" type="button" onClick={onOpenReport}>查看报表</button>
      </div>
      <div className="chartWrap">
        <svg viewBox="0 0 360 160" role="img" aria-label="近七日销售趋势折线图">
          <defs>
            <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#357c66" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#357c66" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline className="gridLine" points="18,128 342,128" />
          <polyline className="gridLine" points="18,88 342,88" />
          <polyline className="gridLine" points="18,48 342,48" />
          <polygon points={`18,148 ${points} 342,148`} fill="url(#areaFill)" />
          <polyline points={points} fill="none" stroke="#357c66" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((item, index) => {
            const x = 18 + index * 54;
            const y = 144 - item.value * 1.35;
            return <circle key={item.day} cx={x} cy={y} r="4.5" fill="#fff" stroke="#357c66" strokeWidth="3" />;
          })}
        </svg>
        <div className="chartLabels">
          {data.map((item) => <span key={item.day}>{item.day}</span>)}
        </div>
      </div>
    </section>
  );
}

export function ChannelPanel({ channels }) {
  return (
    <section className="panel">
      <div className="sectionTitle">
        <div>
          <span>渠道结构</span>
          <h2>来源贡献</h2>
        </div>
      </div>
      <div className="channelList">
        {channels.map((item) => (
          <div className="channelItem" key={item.name}>
            <div>
              <strong>{item.name}</strong>
              <span>{item.value}%</span>
            </div>
            <div className="bar">
              <span style={{ width: `${item.value}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TaskPanel({ tasks, onToggleTask }) {
  return (
    <section className="panel">
      <div className="sectionTitle">
        <div>
          <span>今日待办</span>
          <h2>运营事项</h2>
        </div>
      </div>
      <div className="taskList">
        {tasks.map((task, index) => (
          <button
            className={`taskItem ${task.done ? 'isDone' : ''}`}
            key={task.title}
            onClick={() => onToggleTask(index)}
            type="button"
          >
            <span className="checkCircle">
              {task.done && <Icon name="check" size={14} />}
            </span>
            <span>{task.title}</span>
            <em>{task.time}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

export function InsightPanel() {
  return (
    <section className="panel insightPanel">
      <div>
        <span>运营建议</span>
        <h2>优先处理高价值订单与低库存 SKU</h2>
        <p>当前成交额由会员复购拉动，建议把客服资源集中在企业购与售后中订单，同时将服饰类补货排到今天下班前。</p>
      </div>
      <div className="insightNumbers">
        <strong>12</strong>
        <span>需人工跟进</span>
      </div>
    </section>
  );
}
