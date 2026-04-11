// LBTI · APP 主逻辑（改造版）
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
  // 随机打乱题目
  const shuffled = [...QUESTIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  state.shuffledQuestions = shuffled;
  state.answers = {};
  state.currentIndex = 0;
  showScreen('test');
  renderQuestion();
}

// ===== 渲染题目 =====
function renderQuestion() {
  const q = state.shuffledQuestions[state.currentIndex];
  const area = document.getElementById('questionArea');
  const selected = state.answers[q.id];

  let html = `
    <div class="question-meta">
      <span class="q-badge">${state.currentIndex + 1} / ${state.shuffledQuestions.length}</span>
      <span>${q.dimLabel || ''}</span>
    </div>
    <div class="question-title">${q.text}</div>
    <div class="options" id="optsBox">
  `;

  q.options.forEach((opt) => {
    const val = opt.value;
    const valStr = typeof val === 'string' ? "'" + val + "'" : val;
    const isSelected = selected === val;
    html += `
      <div class="option ${isSelected ? 'selected' : ''}" onclick="handleClick('${q.id}',${valStr},this)">
        <div class="option-radio"></div>
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
function handleClick(qId, value, el) {
  state.answers[qId] = value;
  // 更新UI
  const container = document.getElementById('questionArea');
  container.querySelectorAll('.option').forEach(opt => {
    opt.classList.toggle('selected', opt === el);
  });
  updateProgress();
  updateNav();
}

function updateProgress() {
  const answered = Object.keys(state.answers).filter(k => state.answers[k] !== undefined).length;
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
  document.getElementById('nextBtn').textContent = isLast ? '查看结果 →' : '下一题 →';
  const answered = Object.keys(state.answers).filter(k => state.answers[k] !== undefined).length;
  const hint = document.getElementById('testHint');
  if (isLast) {
    const un = total - answered;
    hint.textContent = un > 0 ? `还有 ${un} 题没答` : '全部完成！🎉';
  } else {
    hint.textContent = answered + '/' + total + ' 已完成';
  }
}

function nextQuestion() {
  const total = state.shuffledQuestions.length;
  if (state.currentIndex >= total - 1) {
    const answered = Object.keys(state.answers).filter(k => state.answers[k] !== undefined).length;
    if (answered < total && !confirm(`还有 ${total - answered} 题没答，确定提交？`)) return;
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

// ===== 提交结果 =====
function submitResult() {
  state.result = calculate(state.answers, state.age, state.gender);
  renderResult();
  showScreen('result');
}

// ===== 渲染结果页 =====
function renderResult() {
  const r = state.result;
  const t = r.type;
  const tierLabels = {
    T1: '👑 顶级长寿', T2: '💪 偏科良好',
    T3: '🤔 一般水平', T4: '⚠️ 需要关注', T5: '🔴 全面预警'
  };

  // 扎心结论文案（根据分数区间生成）
  const punchline = generatePunchline(r);

  let html = '';

  // ===== 分享卡片（结果页核心）=====
  html += `
    <div class="result-card" id="shareCard">
      <div class="card-header">
        <div class="card-tier">${tierLabels[t.tier]}</div>
        <div class="card-emoji">${t.emoji}</div>
      </div>
      <div class="card-name">${t.name}</div>
      <div class="card-sub">${t.sub}</div>

      <div class="card-lifespan">
        <div class="card-life-row">
          <div class="card-life-item">
            <div class="card-life-label">健康寿命指数</div>
            <div class="card-life-value" id="lifeVal">0</div>
            <div class="card-life-unit">岁</div>
          </div>
          <div class="card-life-divider"></div>
          <div class="card-life-item">
            <div class="card-life-label">潜力寿命</div>
            <div class="card-life-value potential" id="potVal">0</div>
            <div class="card-life-unit">岁</div>
          </div>
        </div>
        <div class="card-life-diff">
          <span class="diff-num">+${r.potentialExtra}</span> 年改善空间
        </div>
      </div>

      <div class="card-punchline">${punchline}</div>

      <div class="card-footer">
        <span>LBTI · 你还能活多久？</span>
        <span>扫码测试你的寿命</span>
      </div>
    </div>
  `;

  // ===== 类型解读 =====
  html += `
    <div class="result-detail">
      <div class="detail-section">
        <div class="detail-title">📋 ${t.name} · 详细解读</div>
        <div class="detail-text">${t.desc}</div>
      </div>
  `;

  // ===== 维度分析 =====
  html += `
    <div class="detail-section">
      <div class="detail-title">📊 维度分析</div>
      <div class="radar-wrap"><canvas id="radarCanvas"></canvas></div>
      <div class="dim-bars" style="margin-top:16px">
  `;

  const dims = [
    { key: 'sleep', name: '睡眠', icon: '🌙' },
    { key: 'diet', name: '饮食', icon: '🥗' },
    { key: 'exercise', name: '运动', icon: '🏃' },
    { key: 'mental', name: '心理', icon: '🧠' },
    { key: 'indicator', name: '指标', icon: '🫀' },
    { key: 'habit', name: '习惯', icon: '🚬' }
  ];

  dims.forEach(dim => {
    const level = r.dimLevels[dim.key] || '0';
    const score = (r.dimScores[dim.key] || 0).toFixed(1);
    const levelText = level === '+' ? '优秀' : level === '-' ? '需改善' : '一般';
    const pct = level === '+' ? 90 : level === '0' ? 50 : 15;
    const levelClass = level === '+' ? 'plus' : level === '-' ? 'minus' : 'zero';
    html += `
      <div class="dim-bar-item">
        <span class="dim-bar-icon">${dim.icon}</span>
        <div class="dim-bar-info">
          <div class="dim-bar-label"><span>${dim.name}</span><span class="score">${score}</span></div>
          <div class="dim-bar-track"><div class="dim-bar-fill ${levelClass}" style="width:${pct}%"></div></div>
        </div>
        <span class="dim-level-tag ${levelClass}">${levelText}</span>
      </div>
    `;
  });

  html += '</div></div>';

  // ===== 风险预警 =====
  if (r.warnings.length > 0) {
    html += `<div class="detail-section"><div class="detail-title">⚠️ 健康预警</div>`;
    r.warnings.forEach(w => {
      html += `<div class="warn-card ${w.type}"><span>${w.type==='danger'?'🔴':'🟡'}</span><span>${w.text}</span></div>`;
    });
    html += '</div>';
  }

  // ===== 逆天改命指南 =====
  if (r.improvements.length > 0) {
    html += `<div class="detail-section"><div class="detail-title">💡 逆天改命指南</div><div class="improve-list">`;
    r.improvements.forEach(tip => {
      html += `
        <div class="improve-card">
          <span class="improve-icon">${tip.icon}</span>
          <div class="improve-body">
            <div class="improve-title">${tip.label}</div>
            <div class="improve-desc">${tip.tip}</div>
            <div class="improve-ref">${tip.detail}</div>
          </div>
          <span class="improve-years">+${tip.years}岁</span>
        </div>
      `;
    });
    html += `</div>
      <div class="potential-banner">
        <div class="pot-label">如果全部改善</div>
        <div class="pot-big">${r.maxPotential} <span>岁 · 人人都能达到</span></div>
        <div class="pot-note">理论上通过全面改善生活方式可获得的最高寿命<br>实际效果因人而异，循序渐进最有效</div>
      </div>
    </div>`;
  }

  // ===== 关于测试 =====
  html += `
    <div class="detail-section">
      <div class="detail-title">🔬 关于这个测试</div>
      <div class="detail-text" style="color:var(--muted);font-size:13px">
        本测试基于公开流行病学研究设计，参考了Framingham心脏研究、Blue Zones长寿区研究、WHO全球健康统计、Lancet、NEJM、JAMA等权威文献。<br><br>
        ⚠️ 本测试仅供娱乐参考，不具有医学诊断效力。作者不是医生，自己也快熬夜写代码猝死了。测出来结果不好别来打作者，测出来好的话请分享给朋友。
      </div>
    </div>
  `;

  html += '</div>'; // end result-detail

  // 操作按钮
  html += `
    <div class="result-actions">
      <button class="btn-secondary" onclick="restartTest()">🔄 重新测试</button>
      <button class="btn-primary" onclick="shareResult()">📤 分享给朋友</button>
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

/**
 * 生成扎心结论
 */
function generatePunchline(r) {
  const life = r.finalLife;
  const extra = r.potentialExtra;
  const dimLevels = r.dimLevels;

  // 统计有几个 '-'
  const badCount = Object.values(dimLevels).filter(v => v === '-').length;

  if (life >= 90) {
    const lines = [
      '继续这样活，你可能要参加所有朋友的葬礼。',
      '恭喜，你的身体年龄比实际年龄小了一轮。',
      '你的生活方式，连百岁老人都要喊一声"前辈"。',
      '按这个节奏，你会成为广场舞里最靓的那个仔。'
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  } else if (life >= 80) {
    const lines = [
      '你的身体目前还扛得住，但已经在偷偷记仇了。',
      '活到80没问题，但你的膝盖可能提前退休。',
      '还行，离"中年危机"还有几公里。',
      '你的身体给你的评价：合格，但不优秀。'
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  } else if (life >= 72) {
    const lines = [
      '如果继续这样生活，你的人生可能会提前结束。',
      `你现在正在透支约${extra}年寿命，但好消息是，还能追回来。`,
      '你的身体在给你发最后通牒了，再不管就来不及了。',
      '你的生活方式不是在活着，是在给地府冲业绩。'
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  } else {
    const lines = [
      '系统判定：建议你直接把自己腌起来，可能保存得比较久。',
      `你的身体正在以比同龄人快3倍的速度衰老，但还有${extra}年可以追回来。`,
      '你现在的状态，连"脆皮大学生"看了都自愧不如。',
      '如果身体能发微信，它已经给你发了99+条"救命"。'
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }
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
  const r = state.result;
  const text = `我的LBTI寿命人格是【${t.emoji}${t.name}】\n健康寿命指数：${r.finalLife}岁\n潜力寿命：${r.potentialLife}岁（+${r.potentialExtra}年）\n\n你的寿命人格是什么？来测测 👇`;
  if (navigator.share) {
    navigator.share({ title: 'LBTI · 你还能活多久？', text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
      alert('已复制到剪贴板，快去发给朋友！');
    }).catch(() => alert('请截图分享 📸'));
  }
}
