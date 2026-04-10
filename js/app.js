// ===== APP 主逻辑 =====

// 状态
let state = {
  age: null,
  gender: null,
  answers: {},
  currentIndex: 0,
  shuffledQuestions: [],
  result: null
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

// ===== 屏幕切换 =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 开始测试 =====
function startTest() {
  if (!state.age || !state.gender) return;

  const normalQuestions = QUESTIONS.filter(q => !q.multi);
  const multiQuestions = QUESTIONS.filter(q => q.multi);

  shuffleArray(normalQuestions);
  state.shuffledQuestions = [...normalQuestions, ...multiQuestions];
  state.answers = {};
  state.currentIndex = 0;

  showScreen('test');
  renderQuestion();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ===== 渲染题目 =====
function renderQuestion() {
  const q = state.shuffledQuestions[state.currentIndex];
  const area = document.getElementById('questionArea');
  const isMulti = !!q.multi;
  const selected = isMulti ? (state.answers[q.id] || []) : state.answers[q.id];

  let html = `
    <div class="question-meta">
      <span class="badge">第 ${state.currentIndex + 1} 题 / 共 ${state.shuffledQuestions.length} 题</span>
      <span>${q.dimLabel || ''}</span>
    </div>
    <div class="question-title">${q.text}</div>
    <div class="options" id="optionsContainer">
  `;

  q.options.forEach((opt, idx) => {
    const isSelected = isMulti
      ? (Array.isArray(selected) && selected.includes(opt.value))
      : selected === opt.value;

    html += `
      <div class="option ${isSelected ? 'selected' : ''}" data-qid="${q.id}" data-multi="${isMulti}" data-value="${opt.value}" data-idx="${idx}">
        <div class="${isMulti ? 'option-checkbox' : 'option-radio'}"></div>
        <div class="option-label">${opt.label}</div>
      </div>
    `;
  });

  html += `</div>`;
  area.innerHTML = html;

  // 用事件委托绑定点击
  document.getElementById('optionsContainer').addEventListener('click', handleOptionClick);

  updateProgress();
  updateNav();
}

// ===== 选项点击处理（事件委托） =====
function handleOptionClick(e) {
  const optionEl = e.target.closest('.option');
  if (!optionEl) return;

  const qId = optionEl.dataset.qid;
  const isMulti = optionEl.dataset.multi === 'true';
  const value = optionEl.dataset.value;

  // 找到对应的题目，确定 value 的实际类型
  const q = state.shuffledQuestions.find(question => question.id === qId);
  if (!q) return;

  // 转换 value 类型
  let actualValue;
  if (isMulti) {
    actualValue = value; // 多选保持字符串
  } else {
    actualValue = isNaN(Number(value)) ? value : Number(value);
  }

  if (isMulti) {
    let selected = state.answers[qId] || [];

    if (actualValue === 'none') {
      selected = ['none'];
    } else {
      selected = selected.filter(v => v !== 'none');
      const idx = selected.indexOf(actualValue);
      if (idx > -1) {
        selected.splice(idx, 1);
      } else {
        selected.push(actualValue);
      }
    }

    state.answers[qId] = selected.length > 0 ? selected : undefined;
  } else {
    state.answers[qId] = actualValue;
  }

  // 更新选中状态
  const container = document.getElementById('optionsContainer');
  container.querySelectorAll('.option').forEach(opt => {
    const optVal = opt.dataset.value;
    if (isMulti) {
      const currentSelected = state.answers[qId] || [];
      opt.classList.toggle('selected', currentSelected.includes(optVal));
    } else {
      const numVal = isNaN(Number(optVal)) ? optVal : Number(optVal);
      opt.classList.toggle('selected', state.answers[qId] === numVal);
    }
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
  const pct = Math.round((answered / total) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${answered} / ${total}`;

  const q = state.shuffledQuestions[state.currentIndex];
  if (q) document.getElementById('dimLabel').textContent = q.dimLabel || '—';
}

function updateNav() {
  document.getElementById('prevBtn').style.display = state.currentIndex > 0 ? '' : 'none';

  const total = state.shuffledQuestions.length;
  const isLast = state.currentIndex === total - 1;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = isLast ? '提交并查看结果 →' : '下一题 →';

  const hint = document.getElementById('testHint');
  const answered = Object.keys(state.answers).filter(k => {
    const v = state.answers[k];
    return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0);
  }).length;

  if (isLast) {
    const unanswered = total - answered;
    hint.textContent = unanswered > 0
      ? `还有 ${unanswered} 题未作答，确定要提交吗？`
      : '全部完成！提交查看结果 🎉';
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

    if (answered < total) {
      if (!confirm(`还有 ${total - answered} 题未作答，确定要提交吗？`)) return;
    }

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

// ===== 渲染结果 =====
function renderResult() {
  const r = state.result;
  const t = r.type;

  let html = `
    <div class="result-hero">
      <div class="type-emoji">${t.emoji}</div>
      <div class="type-name">${t.name}</div>
      <div class="type-code">${r.code} · ${t.code}</div>
      <p style="color:var(--muted);font-size:14px;margin-bottom:16px;">${t.sub}</p>

      <div class="life-cards">
        <div class="life-card primary">
          <div class="label">健康寿命指数</div>
          <div class="value" id="lifeValue">0</div>
          <div class="label">岁</div>
        </div>
        <div class="life-card">
          <div class="label">潜力寿命</div>
          <div class="value" id="potentialValue">0</div>
          <div class="extra">+${r.potentialExtra} 岁</div>
        </div>
      </div>
    </div>
  `;

  // 雷达图 + 维度徽章
  html += `
    <div class="result-section">
      <h3>📊 维度分析</h3>
      <div class="radar-wrap">
        <canvas id="radarCanvas"></canvas>
      </div>
      <div class="dim-badges">
  `;

  const mainDims = ['sleep', 'diet', 'exercise', 'mental', 'indicator', 'habit'];
  mainDims.forEach(dim => {
    const d = DIMENSIONS[dim];
    if (!d) return;
    const level = r.dimLevels[dim] || '0';
    const levelClass = level === '+' ? 'level-plus' : level === '-' ? 'level-minus' : 'level-zero';
    const levelText = level === '+' ? '优秀' : level === '-' ? '需改善' : '一般';
    html += `
      <div class="dim-badge ${levelClass}">
        <span class="dim-icon">${d.icon}</span>
        <span class="dim-name">${d.name}</span>
        <span class="dim-level">${levelText}</span>
      </div>
    `;
  });

  html += `</div></div>`;

  // 类型解读
  html += `
    <div class="result-section">
      <h3>📋 类型解读</h3>
      <p>${t.desc}</p>
    </div>
  `;

  // 风险预警
  if (r.warnings.length > 0) {
    html += `<div class="result-section"><h3>⚠️ 健康预警</h3>`;
    r.warnings.forEach(w => {
      html += `
        <div class="warn-item ${w.type}">
          <span class="warn-icon">${w.type === 'danger' ? '🔴' : '🟡'}</span>
          <span>${w.text}</span>
        </div>
      `;
    });
    html += `</div>`;
  }

  // 改善建议
  if (r.improvements.length > 0) {
    html += `<div class="result-section"><h3>💡 逆天改命指南</h3>`;
    r.improvements.forEach(imp => {
      html += `
        <div class="improve-item">
          <span class="improve-icon">${imp.icon}</span>
          <div class="improve-content">
            <div class="improve-label">${imp.label}</div>
            <div class="improve-tip">${imp.tip}</div>
          </div>
          <span class="improve-years">+${imp.years}岁</span>
        </div>
      `;
    });

    html += `
      <div class="potential-banner">
        <div class="big">全部改善后：${r.potentialLife}岁</div>
        <div class="note">比现在多活 ${r.potentialExtra} 年 · 科学依据支撑，完全可以做到</div>
      </div>
    `;
    html += `</div>`;
  }

  // 操作按钮
  html += `
    <div class="result-actions">
      <button class="btn-secondary" onclick="restartTest()">🔄 重新测试</button>
      <button class="btn-primary" onclick="shareResult()">📤 分享给朋友</button>
    </div>
    <div class="result-disclaimer">
      ⚠️ 本测试仅供娱乐参考，不具有医学诊断效力。测试结果基于公开流行病学统计数据估算，不能替代专业医疗建议。如有健康问题请咨询专业医生。<br>
      数据参考：Framingham心脏研究 · Blue Zones长寿区 · WHO · Lancet · NEJM · JAMA 等公开文献
    </div>
  `;

  document.getElementById('resultContent').innerHTML = html;

  // 绘制雷达图
  setTimeout(() => {
    const canvas = document.getElementById('radarCanvas');
    if (canvas) drawRadarChart(canvas, r.dimLevels, r.dimAvgs);
  }, 100);

  // 数字动画
  animateNumber('lifeValue', r.finalLife, 1200);
  animateNumber('potentialValue', r.potentialLife, 1500);
}

// ===== 数字滚动动画 =====
function animateNumber(elementId, target, duration) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
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
  const text = `我的健康寿命指数是${state.result.finalLife}岁，属于【${t.emoji}${t.name}】！来测测你能活多久？🧬`;

  if (navigator.share) {
    navigator.share({
      title: '生命长度测试',
      text: text,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
      alert('已复制到剪贴板，粘贴分享给朋友吧！');
    }).catch(() => {
      alert('请截图分享给朋友 📸');
    });
  }
}
