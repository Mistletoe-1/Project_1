import { useEffect, useState } from 'react';
import { advanceCampaign } from '../api/adminApi.js';
import Icon from './Icons.jsx';

export function CampaignsView({ campaigns, onCreateCampaign }) {
  const [visibleCampaigns, setVisibleCampaigns] = useState(campaigns);
  const [processingId, setProcessingId] = useState('');

  useEffect(() => {
    setVisibleCampaigns(campaigns);
  }, [campaigns]);

  async function handleAdvanceCampaign(id) {
    setProcessingId(id);

    try {
      const updatedCampaign = await advanceCampaign(id);
      setVisibleCampaigns((current) => current.map((campaign) => (
        campaign.id === id ? { ...campaign, ...updatedCampaign } : campaign
      )));
    } catch (error) {
      window.alert('活动状态更新失败，请确认本地 API 正在运行。');
    } finally {
      setProcessingId('');
    }
  }

  return (
    <div className="campaignLayout">
      <section className="panel createPanel">
        <div className="sectionTitle">
          <div>
            <span>活动编排</span>
            <h2>新建运营活动</h2>
          </div>
        </div>
        <form className="campaignForm" onSubmit={onCreateCampaign}>
          <label>
            活动名称
            <input name="title" placeholder="例如：会员加购满减" required />
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
            预算占用
            <input name="budget" type="range" min="10" max="95" defaultValue="54" />
          </label>
          <button className="primaryButton wide" type="submit">
            <Icon name="plus" size={18} />
            加入计划
          </button>
        </form>
      </section>

      <section className="campaignList">
        {visibleCampaigns.map((campaign) => (
          <article className="campaignCard" key={campaign.id || `${campaign.title}-${campaign.date}`}>
            <div>
              <span className="status 待发货">{campaign.status}</span>
              <h2>{campaign.title}</h2>
              <p>{campaign.owner} · {campaign.date} · {campaign.channel || '待定渠道'}</p>
              <small className="campaignGoal">{campaign.goal || '待补充运营目标'}</small>
            </div>
            <div className="campaignMetrics">
              <div><strong>{campaign.conversion || '—'}</strong><span>转化率</span></div>
              <div><strong>{campaign.roi || '—'}</strong><span>ROI</span></div>
              <div className="budgetRing" style={{ '--value': `${campaign.budget}%` }}>
                <strong>{campaign.budget}%</strong>
                <span>预算</span>
              </div>
              {campaign.status !== '已归档' && (
                <button className="rowButton campaignAdvance" type="button" disabled={processingId === campaign.id} onClick={() => handleAdvanceCampaign(campaign.id)}>
                  {processingId === campaign.id ? '处理中…' : '推进状态'} <Icon name="chevron" size={15} />
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
