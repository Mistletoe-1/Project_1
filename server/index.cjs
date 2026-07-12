const http = require('node:http');
const { URL } = require('node:url');
const data = require('./data.cjs');

const PORT = Number(process.env.PORT || 3001);

const nextStatus = {
  待审核: '待发货',
  待发货: '运输中',
  运输中: '已完成',
  售后中: '已完成',
  已完成: '已完成'
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(status === 204 ? null : JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

function bootstrap() {
  return {
    stats: data.stats,
    revenueSeries: data.revenueSeries,
    channelSeries: data.channelSeries,
    orders: data.orders,
    products: data.products,
    members: data.members,
    campaigns: data.campaigns,
    tasks: data.tasks
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true, service: 'retail-admin-api' });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/bootstrap') {
      sendJson(res, 200, bootstrap());
      return;
    }

    if (req.method === 'PATCH' && url.pathname.startsWith('/api/orders/')) {
      const id = decodeURIComponent(url.pathname.split('/')[3] || '');
      const order = data.orders.find((item) => item.id === id);

      if (!order) {
        sendJson(res, 404, { message: '订单不存在' });
        return;
      }

      order.status = nextStatus[order.status] || order.status;
      sendJson(res, 200, order);
      return;
    }

    if (req.method === 'PATCH' && url.pathname.startsWith('/api/products/')) {
      const id = decodeURIComponent(url.pathname.split('/')[3] || '');
      const product = data.products.find((item) => item.id === id);

      if (!product) {
        sendJson(res, 404, { message: '商品不存在' });
        return;
      }

      product.stock += 24;
      sendJson(res, 200, product);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/campaigns') {
      const body = await readBody(req);
      const title = String(body.title || '').trim();

      if (!title) {
        sendJson(res, 400, { message: '活动名称不能为空' });
        return;
      }

      const campaign = {
        title,
        owner: body.owner || '运营组',
        budget: Number(body.budget || 54),
        status: '排期中',
        date: body.date || '待确认'
      };

      data.campaigns.unshift(campaign);
      sendJson(res, 201, campaign);
      return;
    }

    sendJson(res, 404, { message: '接口不存在' });
  } catch (error) {
    sendJson(res, 500, { message: '服务异常', detail: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`API server running at http://127.0.0.1:${PORT}`);
});
