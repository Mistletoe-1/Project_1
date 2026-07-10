export function MembersView({ members, search }) {
  const visibleMembers = members.filter((member) => {
    const keyword = search.trim().toLowerCase();
    return !keyword || `${member.name}${member.level}${member.tag}`.toLowerCase().includes(keyword);
  });

  return (
    <div className="membersLayout">
      <section className="panel memberSummary">
        <div className="sectionTitle">
          <div>
            <span>会员分层</span>
            <h2>复购与活跃</h2>
          </div>
        </div>
        <div className="segmentCards">
          <div><strong>3,482</strong><span>活跃会员</span></div>
          <div><strong>27.4%</strong><span>复购率</span></div>
          <div><strong>¥486</strong><span>客单价</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="memberList">
          {visibleMembers.map((member) => (
            <article className="memberRow" key={member.name}>
              <div className="avatar">{member.name.slice(0, 1)}</div>
              <div>
                <strong>{member.name}</strong>
                <span>{member.level} · {member.tag}</span>
              </div>
              <div className="activityLine">
                <span style={{ width: `${member.activity}%` }} />
              </div>
              <em>{member.spent}</em>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
