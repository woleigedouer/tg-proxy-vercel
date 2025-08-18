// TG代理核心功能 - Vercel Serverless Function
// 遵循KISS原则：保持简单，只做代理转发

module.exports = async (req, res) => {
  // CORS处理
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 提取路径：/api/proxy?path=telegram&q=search
    const { path, ...queryParams } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Missing path parameter' });
    }
    
    // 构建目标URL
    let targetUrl = `https://t.me/s/${path}`;
    
    // 添加查询参数
    const searchParams = new URLSearchParams(queryParams);
    if (searchParams.toString()) {
      targetUrl += `?${searchParams.toString()}`;
    }
    
    console.log(`代理请求: ${targetUrl}`);
    
    // 发起请求（使用fetch，遵循DRY原则）
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Proxy request failed',
        status: response.status 
      });
    }
    
    const data = await response.text();
    
    // 设置响应头并返回
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    
    return res.status(200).send(data);
    
  } catch (error) {
    console.error('代理请求失败:', error.message);
    
    // 简化错误处理（遵循KISS原则）
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: '请求超时' });
    }
    
    return res.status(500).json({ 
      error: '代理服务器错误',
      message: error.message 
    });
  }
};
