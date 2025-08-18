// 健康检查 - 遵循YAGNI原则：只返回必要信息

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'TG Proxy (Vercel)'
  });
};
