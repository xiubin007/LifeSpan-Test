// 雷达图绘制（Canvas）
function drawRadarChart(canvas, dimLevels, dimAvgs) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(cx, cy) - 40;

  const dims = [
    { key: 'sleep', label: '睡眠' },
    { key: 'diet', label: '饮食' },
    { key: 'exercise', label: '运动' },
    { key: 'mental', label: '心理' },
    { key: 'indicator', label: '指标' },
    { key: 'habit', label: '习惯' }
  ];

  const n = dims.length;
  const angleStep = (Math.PI * 2) / n;

  // 计算每个维度的归一化分数（0-1）
  // 等级映射：+ → 1.0, 0 → 0.5, - → 0.15
  function levelToValue(level) {
    if (level === '+') return 1.0;
    if (level === '0') return 0.5;
    return 0.15;
  }

  // 绘制背景网格
  ctx.strokeStyle = '#dbe8dd';
  ctx.lineWidth = 1;

  for (let ring = 1; ring <= 4; ring++) {
    const r = (maxR / 4) * ring;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + angleStep * i;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 绘制轴线
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + angleStep * i;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
    ctx.stroke();
  }

  // 绘制数据区域
  ctx.beginPath();
  dims.forEach((dim, i) => {
    const level = dimLevels[dim.key] || '0';
    const val = levelToValue(level);
    const r = maxR * val;
    const angle = -Math.PI / 2 + angleStep * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();

  // 填充
  ctx.fillStyle = 'rgba(108, 141, 113, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#6c8d71';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 绘制数据点
  dims.forEach((dim, i) => {
    const level = dimLevels[dim.key] || '0';
    const val = levelToValue(level);
    const r = maxR * val;
    const angle = -Math.PI / 2 + angleStep * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#4d6a53';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 绘制标签
  ctx.fillStyle = '#1e2a22';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  dims.forEach((dim, i) => {
    const angle = -Math.PI / 2 + angleStep * i;
    const labelR = maxR + 25;
    const x = cx + labelR * Math.cos(angle);
    const y = cy + labelR * Math.sin(angle);

    const level = dimLevels[dim.key] || '0';
    const levelText = level === '+' ? ' ⭐' : level === '-' ? ' ⚠️' : '';
    ctx.fillText(dim.label + levelText, x, y);
  });
}
