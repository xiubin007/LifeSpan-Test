// ===== APP 主逻辑 =====

let state = {
  age: null, gender: null, answers: {},
  currentIndex: 0, shuffledQuestions: [], result: null
};

// ===== 初始化 =====
document.getElementById('ageInput').addEventListener('input', function() {
  const age = parseInt(this.value);
  state.age = (age >= 1 && age <= 120) ? age : null;
  checkStartBtn();
});

function selectGender(gender) {
  state.gender = gender;
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.gender === gender);
  });
  checkStartBtn();
}

function checkStartBtn() {
  document.getElementById('startBtn').disabled = !(state.age && state.gender);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 开始测试 =====
function startTest() {
  if (!state.age || !state.gender) return;
  const normal = QUESTIONS.filter(q => !q.multi);
  const multi = QUESTIONS.filter(q => q.multi);
  for (let i = normal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [normal[i], normal[j]] = [normal[j], normal[i]];
  }
  state.shuffledQuestions = [...normal, ...multi];
  state.answers = {};
  state.currentIndex = 0;
  showScreen('test');
  renderQuestion();
}

// ===== 渲染题目 =====
function renderQuestion() {
  const q = state.shuffledQuestions[state.currentIndex];
  const area = document.getElementById('questionArea');
  const isMulti = !!q.multi;
  const selected = isMulti ? (state.answers[q.id] || []) : state.answers[q.id];

  let html = `
    <div class="question-meta">
      <span class="q-badge">第 ${state.currentIndex + 1} 题 / 共 ${state.shuffledQuestions.length} 题</span>
      <span>${q.dimLabel || ''}</span>
    </div>
    <div class="question-title">${q.text}</div>
    <div class="options" id="optsBox">
  `;

  q.options.forEach((opt) => {
    const val = opt.value;
    const valStr = typeof val === 'string' ? "'" + val + "'" : val;
    const isSelected = isMulti
      ? (Array.isArray(selected) && selected.includes(val))
      : selected === val;

    html += `
      <div class="option ${isSelected ? 'selected' : ''}" onclick="handleClick('${q.id}',${isMulti},${valStr},this)">
        <div class="${isMulti ? 'option-checkbox' : 'option-radio'}"></div>
        <div class="option-label">${opt.label}</div>
      </div>
    `;
  });

  html += '</div>';
  area.innerHTML = html;
  updateProgress();
  updateNav();
}

// ===== 选项点击 =====
function handleClick(qId, isMulti, value, el) {
  if (isMulti) {
    let sel = state.answers[qId] || [];
    if (value === 'none') { sel = ['none']; }
    else {
      sel = sel.filter(v => v !== 'none');
      const idx = sel.indexOf(value);
      if (idx > -1) sel.splice(idx, 1); else sel.push(value);
    }
    state.answers[qId] = sel.length > 0 ? sel : undefined;
  } else {
    state.answers[qId] = value;
  }

  // 更新UI
  const container = document.getElementById('questionArea');
  container.querySelectorAll('.option').forEach(opt => {
    opt.classList.toggle('selected', opt === el);
  });

  updateProgress();
  updateNav();
}

function updateProgress() {
  const answered = Object.keys(state.answers).filter(k => {
    const v = state.answers[k];
    return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0);
  }).length;
  const total = state.shuffledQuestions.length;
  document.getElementById('progressBar').style.width = (answered / total * 100) + '%';
  document.getElementById('progressText').textContent = answered + ' / ' + total;
  const q = state.shuffledQuestions[state.currentIndex];
  if (q) document.getElementById('dimLabel').textContent = q.dimLabel || '—';
}

function updateNav() {
  document.getElementById('prevBtn').style.display = state.currentIndex > 0 ? '' : 'none';
  const total = state.shuffledQuestions.length;
  const isLast = state.currentIndex >= total - 1;
  document.getElementById('nextBtn').textContent = isLast ? '提交并查看结果 →' : '下一题 →';

  const answered = Object.keys(state.answers).filter(k => {
    const v = state.answers[k];
    return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0);
  }).length;

  const hint = document.getElementById('testHint');
  if (isLast) {
    const un = total - answered;
    hint.textContent = un > 0 ? `还有 ${un} 题未作答，确定提交吗？` : '全部完成！提交查看结果 🎉';
  } else {
    hint.textContent = answered + ' / ' + total + ' 已完成';
  }
}

// ===== 导航 =====
function nextQuestion() {
  const total = state.shuffledQuestions.length;
  if (state.currentIndex >= total - 1) {
    const answered = Object.keys(state.answers).filter(k => {
      const v = state.answers[k];
      return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0);
    }).length;
    if (answered < total && !confirm(`还有 ${total - answered} 题未作答，确定提交吗？`)) return;
    submitResult();
    return;
  }
  state.currentIndex++;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ===== 提交 =====
function submitResult() {
  state.result = calculate(state.answers, state.age, state.gender);
  renderResult();
  showScreen('result');
}

// ===== 渲染结果 =====
function renderResult() {
  const r = state.result;
  const t = r.type;
  const tierLabels = { T1: '🏆 顶配长寿型', T2: '💪 偏科强者型', T3: '🤔 一强一弱型', T4: '⚠️ 双弱型', T5: '🔴 全面预警型' };

  let html = '';

  // === Hero ===
  html += `
    <div class="result-hero">
      <div class="result-tier">${tierLabels[t.tier] || ''} · LBTI</div>
      <span class="result-type-emoji">${t.emoji}</span>
      <div class="result-type-name">${t.name}</div>
      <div class="result-type-code">${r.code} · ${t.code}</div>
      <div class="result-type-sub">${t.sub}</div>
    </div>
  `;

  // === 寿命卡片 ===
  html += `
    <div class="result-life-section">
      <div class="life-cards">
        <div class="life-card primary">
          <div class="label">健康寿命指数</div>
          <div class="value" id="lifeVal">0</div>
          <div class="unit">岁</div>
        </div>
        <div class="life-card">
          <div class="label">潜力寿命</div>
          <div class="value" id="potVal">0</div>
          <div class="extra">+${r.potentialExtra} 岁</div>
        </div>
      </div>
      <div class="life-diff" style="margin-top:14px">
        <div class="big">通过改善生活方式，你最多还能多活 <strong>${r.potentialExtra} 年</strong></div>
        <div class="note">科学依据支撑，完全可以做到</div>
      </div>
    </div>
  `;

  // === 内容区块 ===
  html += '<div class="result-sections">';

  // --- 类型解读 ---
  html += `
    <div class="r-section">
      <div class="r-section-title"><span class="icon">📋</span> 你的健康人格解读</div>
      <p class="type-desc-text">${t.desc}</p>
    </div>
  `;

  // --- 雷达图 + 维度条 ---
  html += `
    <div class="r-section">
      <div class="r-section-title"><span class="icon">📊</span> 维度分析</div>
      <div class="radar-wrap"><canvas id="radarCanvas"></canvas></div>
      <div class="dim-bars" style="margin-top:16px">
  `;

  const dims = [
    { key: 'sleep', name: '睡眠作息', icon: '🌙' },
    { key: 'diet', name: '饮食营养', icon: '🥗' },
    { key: 'exercise', name: '运动体能', icon: '🏃' },
    { key: 'mental', name: '心理健康', icon: '🧠' },
    { key: 'indicator', name: '健康指标', icon: '🫀' },
    { key: 'habit', name: '生活习惯', icon: '🚬' }
  ];

  dims.forEach(dim => {
    const level = r.dimLevels[dim.key] || '0';
    const score = (r.dimScores[dim.key] || 0).toFixed(1);
    const levelText = level === '+' ? '优秀' : level === '-' ? '需改善' : '一般';
    const pct = level === '+' ? 90 : level === '0' ? 50 : 15;

    html += `
      <div class="dim-bar-item">
        <span class="dim-bar-icon">${dim.icon}</span>
        <div class="dim-bar-info">
          <div class="dim-bar-label">
            <span>${dim.name}</span>
            <span class="score">${score}分</span>
          </div>
          <div class="dim-bar-track">
            <div class="dim-bar-fill ${level === '+' ? 'plus' : level === '-' ? 'minus' : 'zero'}" style="width:${pct}%"></div>
          </div>
        </div>
        <span class="dim-level-tag ${level === '+' ? 'plus' : level === '-' ? 'minus' : 'zero'}">${levelText}</span>
      </div>
    `;
  });

  html += '</div></div>';

  // --- 风险预警 ---
  if (r.warnings.length > 0) {
    html += `<div class="r-section"><div class="r-section-title"><span class="icon">⚠️</span> 健康预警</div>`;
    r.warnings.forEach(w => {
      html += `
        <div class="warn-card ${w.type}">
          <span class="warn-icon">${w.type === 'danger' ? '🔴' : '🟡'}</span>
          <span>${w.text}</span>
        </div>
      `;
    });
    html += '</div>';
  }

  // --- 逆天改命指南（丰富版）---
  const allTips = generateRichTips(r);
  if (allTips.length > 0) {
    html += `
      <div class="r-section">
        <div class="r-section-title"><span class="icon">💡</span> 逆天改命指南</div>
        <div class="improve-list">
    `;

    allTips.forEach(tip => {
      html += `
        <div class="improve-card">
          <span class="improve-icon">${tip.icon}</span>
          <div class="improve-body">
            <div class="improve-title">${tip.title}</div>
            <div class="improve-desc">${tip.desc}</div>
            <div class="improve-desc" style="color:var(--accent);font-weight:600;margin-top:2px;font-size:11px">📖 ${tip.ref}</div>
          </div>
          <span class="improve-years">+${tip.years}岁</span>
        </div>
      `;
    });

    // 潜力横幅
    const totalYears = allTips.reduce((s, t) => s + t.years, 0).toFixed(1);
    html += `
        </div>
        <div class="potential-banner">
          <div class="label">如果全部改善</div>
          <div class="big">潜力寿命 ${r.potentialLife} 岁 <span>（+${r.potentialExtra} 年）</span></div>
          <div class="note">理论上通过全面改善生活方式可获得的最高寿命提升<br>实际效果因个体差异而异，建议循序渐进、持之以恒</div>
        </div>
      </div>
    `;
  }

  // --- 科学依据 ---
  html += `
    <div class="r-section">
      <div class="r-section-title"><span class="icon">🔬</span> 关于这个测试</div>
      <p style="font-size:13px;line-height:1.9;color:var(--muted)">
        本测试基于以下公开流行病学研究和统计数据设计：<br>
        <strong>Framingham心脏研究</strong>（心血管风险模型）· <strong>Blue Zones长寿区研究</strong>（长寿人群共性）· <strong>WHO全球健康统计</strong>· <strong>中国人均预期寿命数据</strong><br>
        <strong>The Lancet</strong>（BMI与寿命）· <strong>NEJM</strong>（运动与全因死亡率）· <strong>JAMA</strong>（生活目标与寿命）<br><br>
        每道题的分值参考了对应文献的研究结论，通过加权计算得出概率估算值。<br>
        结果仅供参考，不能替代专业医疗建议。
      </p>
    </div>
  `;

  html += '</div>'; // end result-sections

  // 操作按钮
  html += `
    <div class="result-actions">
      <button class="btn-secondary" onclick="restartTest()">🔄 重新测试</button>
      <button class="btn-primary" onclick="shareResult()">📤 分享给朋友</button>
    </div>
    <div class="result-disclaimer">
      ⚠️ 本测试仅供娱乐参考，不具有医学诊断效力。测试结果基于公开的流行病学统计数据估算，不能替代专业医疗建议。如有健康问题请咨询专业医生。<br>
      数据参考：Framingham心脏研究 · Blue Zones长寿区 · WHO · Lancet · NEJM · JAMA 等公开文献
    </div>
  `;

  document.getElementById('resultContent').innerHTML = html;

  // 雷达图
  setTimeout(() => {
    const canvas = document.getElementById('radarCanvas');
    if (canvas) drawRadarChart(canvas, r.dimLevels, r.dimAvgs);
  }, 100);

  // 数字动画
  animateNum('lifeVal', r.finalLife, 1200);
  animateNum('potVal', r.potentialLife, 1500);
}

// ===== 丰富版改善建议 =====
function generateRichTips(r) {
  const tips = [];

  // 睡眠维度
  const sleepLevel = r.dimLevels.sleep || '0';
  if (sleepLevel !== '+') {
    tips.push({
      icon: '😴', title: '提前入睡时间',
      desc: '将入睡时间调至23:00前。IARC将昼夜节律紊乱列为2A类致癌物，长期23点后入睡与多种癌症风险显著相关。',
      ref: 'IARC 2019 · Cappuccio 2010',
      years: 2.0
    });
    tips.push({
      icon: '⏰', title: '保证7-8小时睡眠',
      desc: '睡眠时长与死亡率呈U型曲线，<6小时全因死亡风险↑14%。规律作息比偶尔补觉更重要。',
      ref: 'Cappuccio 2010 · He 2020',
      years: 1.5
    });
    tips.push({
      icon: '📱', title: '睡前1小时远离屏幕',
      desc: '蓝光抑制褪黑素分泌达50%+，延迟入睡平均30分钟。试试用纸质书或冥想代替刷手机。',
      ref: 'Harvard Health 2020',
      years: 1.0
    });
  }

  // 饮食维度
  const dietLevel = r.dimLevels.diet || '0';
  if (dietLevel !== '+') {
    tips.push({
      icon: '🥗', title: '每天吃够500g蔬菜水果',
      desc: '每天摄入800g蔬果与心血管死亡风险↓22%、预期寿命↑3.25年显著相关。五颜六色最健康。',
      ref: 'Imperial College London 荟萃分析',
      years: 3.25
    });
    tips.push({
      icon: '🍳', title: '减少外卖和加工食品',
      desc: 'WHO将加工肉列为一类致癌物。每周快餐控制在2次以内，长期外卖钠摄入普遍超标2-3倍。',
      ref: 'WHO IARC 2015',
      years: 2.0
    });
    tips.push({
      icon: '🌾', title: '主食换成全谷物',
      desc: '全谷物降低2型糖尿病风险25-36%、心血管风险20%。试试糙米、燕麦、红薯代替部分白米白面。',
      ref: 'Harvard 荟萃分析 2016',
      years: 1.5
    });
    tips.push({
      icon: '🧂', title: '减少盐的摄入',
      desc: '中国人均盐摄入约10.5g/天，远超WHO推荐5g。每减少1.75g盐摄入，收缩压可降约5mmHg。',
      ref: 'WHO 2023 · 中国居民膳食指南',
      years: 1.5
    });
    tips.push({
      icon: '🌅', title: '坚持每天吃早餐',
      desc: '规律吃早餐与心血管疾病风险↓14%、2型糖尿病风险↓26%相关。一顿营养早餐开启高效的一天。',
      ref: '多项队列研究荟萃分析',
      years: 1.0
    });
  }

  // 运动维度
  const exerciseLevel = r.dimLevels.exercise || '0';
  if (exerciseLevel !== '+') {
    tips.push({
      icon: '🏃', title: '每周3次有氧运动',
      desc: 'WHO推荐每周≥150分钟中强度运动。满足者全因死亡风险↓31%，预期寿命↑3.2-7年。',
      ref: 'Arem 2015 NEJM · WHO指南',
      years: 3.2
    });
    tips.push({
      icon: '💪', title: '加入力量训练',
      desc: '力量训练降低全因死亡率26%，维持骨密度和肌肉量，预防老年跌倒。每周2次深蹲/俯卧撑就够。',
      ref: 'Momma 2022 BJSM',
      years: 2.0
    });
    tips.push({
      icon: '🚶', title: '每天走到8000步',
      desc: '每多走1000步，全因死亡风险↓8%。不需要一次走完，积少成多也有效。',
      ref: 'Paluch 2022 JAMA',
      years: 2.0
    });
    tips.push({
      icon: '🪑', title: '减少久坐，每小时起身',
      desc: '久坐是独立于运动量的全因死亡风险因素。每坐1小时起来活动5分钟，就能显著降低风险。',
      ref: 'Katzmarzyk 2019',
      years: 1.5
    });
  }

  // 心理维度
  const mentalLevel = r.dimLevels.mental || '0';
  if (mentalLevel !== '+') {
    tips.push({
      icon: '🧘', title: '学习正念冥想',
      desc: '每天10-15分钟冥想，可以降低皮质醇水平、改善免疫功能、减缓端粒缩短。手机上就有免费的冥想APP。',
      ref: 'Epel 2013 · Goyal 2014 JAMA',
      years: 2.5
    });
    tips.push({
      icon: '👥', title: '增加面对面的社交',
      desc: '长期孤独对健康的危害=每天吸15支烟。每周至少与朋友面对面交流2-3次，是长寿的关键保护因素。',
      ref: 'Holt-Lunstad 2015 Harvard',
      years: 3.0
    });
    tips.push({
      icon: '✨', title: '找到生活的意义感',
      desc: '蓝区百岁老人核心共性——Ikigai（生存意义）。有明确目标感的人全因死亡率↓15%。',
      ref: 'Hill 2020 JAMA Network Open',
      years: 2.5
    });
    tips.push({
      icon: '🧠', title: '减少反刍思维',
      desc: '反复纠结负面事情是抑郁和焦虑的核心维持因素。学会"暂停"负面想法，转移注意力到当下正在做的事。',
      ref: 'Nolen-Hoeksema 2008',
      years: 1.5
    });
    tips.push({
      icon: '📝', title: '建立自己的减压方式',
      desc: '运动、倾诉、写作、艺术、大自然……找到适合你的减压方法。积极应对策略降低心血管事件风险30%。',
      ref: 'Chida 2008 Psychosom Med',
      years: 2.0
    });
  }

  // 生活习惯维度
  const habitLevel = r.dimLevels.habit || '0';
  if (habitLevel !== '+') {
    tips.push({
      icon: '🚭', title: '戒烟（最重要的一条）',
      desc: '吸烟平均减少寿命10年，对死亡率的预测能力甚至强于基因评分。好消息是：任何年龄戒烟都能显著延长寿命，戒烟10年后风险接近不吸烟者。',
      ref: 'Doll 2004 BMJ',
      years: 7.0
    });
    tips.push({
      icon: '🍷', title: '控制饮酒量',
      desc: '全球酒精消费导致每年300万死亡。2022年Lancet研究：任何量饮酒均增加心血管风险。控制在每周3次以下。',
      ref: 'WHO 2018 · Lancet 2022',
      years: 3.0
    });
    tips.push({
      icon: '🏥', title: '每年做一次全面体检',
      desc: '早期筛查使结直肠癌死亡率↓68%、乳腺癌↓25%。定期体检是预防医学的基石，早发现早治疗。',
      ref: '多项筛查指南',
      years: 2.0
    });
  }

  // 去重并限制数量
  const seen = new Set();
  return tips.filter(t => {
    if (seen.has(t.title)) return false;
    seen.add(t.title);
    return true;
  });
}

// ===== 数字动画 =====
function animateNum(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * ease);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== 重新测试 =====
function restartTest() {
  state = { age: null, gender: null, answers: {}, currentIndex: 0, shuffledQuestions: [], result: null };
  document.getElementById('ageInput').value = '';
  document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('selected'));
  document.getElementById('startBtn').disabled = true;
  showScreen('intro');
}

// ===== 分享 =====
function shareResult() {
  const t = state.result.type;
  const text = `我的LBTI健康寿命指数是${state.result.finalLife}岁，属于【${t.emoji}${t.name}】！来测测你能活多久？🧬`;
  if (navigator.share) {
    navigator.share({ title: 'LBTI · 你还能活多久？', text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
      alert('已复制到剪贴板，粘贴分享给朋友吧！');
    }).catch(() => alert('请截图分享给朋友 📸'));
  }
}
