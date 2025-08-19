module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are supported for image proxy'
    });
  }

  try {
    // 从 URL 路径中提取文件 ID
    const { fileId } = req.query;
    
    if (!fileId) {
      return res.status(400).json({ 
        error: 'Missing file ID',
        message: 'File ID is required for image proxy'
      });
    }

    // 构造原始 Telegram CDN URL
    const targetUrl = `https://cdn1.telesco.pe/file/${fileId}`;

    // 代理请求到 Telegram CDN
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://t.me/',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch image',
        message: `Telegram CDN returned ${response.status}`
      });
    }

    // 获取内容类型
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // 设置响应头
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存 24 小时
    
    // 如果有 Content-Length，也设置它
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // 流式传输图片数据
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to proxy image request'
    });
  }
};
