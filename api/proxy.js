// api/proxy.js
export default async function handler(req, res) {
  const { year, date } = req.query;

  if (!year || !date) {
    return res.status(400).json({ error: '需要提供year和date参数' });
  }

  try {
    const response = await fetch(`https://img.owspace.com/Public/uploads/Download/${year}/${date}.jpg`);
    
    if (!response.ok) {
      return res.status(404).json({ error: '图片不存在' });
    }

    // 获取图片内容
    const imageBuffer = await response.arrayBuffer();
    
    // 设置正确的内容类型和缓存头
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存1天
    
    // 返回图片
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('代理请求失败:', error);
    res.status(500).json({ error: '代理请求失败' });
  }
} 