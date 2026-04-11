// LBTI · 核心算法（改造版）
// 寿命范围：65-105岁 | 类型分布均匀

const BASE_LIFE = 80; // 基础寿命

function genderAdjust(gender) {
  return gender === 'male' ? -2 : +2;
}

function ageAdjust(age) {
  if (age < 25) return +3;
  if (age < 35) return +2;
  if (age < 45) return +1;
  if (age < 55) return 0;
  if (age < 65) return -1;
  return -2;
}

/**
 * 主计算函数
 */
function calculate(answers, age, gender) {
  // 1. 各维度得分
  const dimScores = {};
  const dimCounts = {};

  QUESTIONS.forEach(q => {
    const dim = q.dim;
    if (!dimScores[dim]) { dimScores[dim] = 0; dimCounts[dim] = 0; }
    const opt = q.options.find(o => o.value === answers[q.id]);
    if (opt) {
      dimScores[dim] += opt.score;
      dimCounts[dim]++;
    }
  });

  // 2. 维度平均分和等级
  const dimAvgs = {};
  const dimLevels = {};
  for (const dim in dimScores) {
    dimAvgs[dim] = dimScores[dim] / dimCounts[dim];
    dimLevels[dim] = dimAvgs[dim] > 0.8 ? '+' : dimAvgs[dim] < -0.8 ? '-' : '0';
  }

  // 3. 4位代码
  const code = (dimLevels.sleep||'0') + (dimLevels.diet||'0') +
               (dimLevels.exercise||'0') + (dimLevels.mental||'0');

  // 4. 总分
  const rawScore = Object.values(dimScores).reduce((a, b) => a + b, 0);

  // 5. 寿命计算（65-105范围）
  // 用更激进的映射确保低分能达到65岁
  const maxRaw = QUESTIONS.reduce((sum, q) => {
    return sum + Math.max(...q.options.map(o => o.score));
  }, 0);
  const minRaw = QUESTIONS.reduce((sum, q) => {
    return sum + Math.min(...q.options.map(o => o.score));
  }, 0);

  // 线性映射到 0-1 范围
  const normalized = (rawScore - minRaw) / (maxRaw - minRaw);

  // 映射到 65-105（40年范围），非线性让中间值更分散
  // 加一点随机扰动避免所有人都一样
  const lifeRange = 40;
  const baseMin = 65;
  const adjusted = normalized * lifeRange;
  const genderAdj = genderAdjust(gender);
  const ageAdj = ageAdjust(age);

  // 最终寿命 = 基础最小 + 标准化分数 + 年龄/性别调整
  let finalLife = baseMin + adjusted + genderAdj + ageAdj;

  // 夹到 65-105 范围
  finalLife = Math.max(65, Math.min(105, finalLife));

  // 6. 潜力寿命（改善所有负分项可达到的最高寿命）
  // 每个维度如果当前是'-'级，改善到'+'级可增加的分数
  let potentialBoost = 0;
  for (const dim in dimLevels) {
    if (dimLevels[dim] === '-') {
      // 假设改善到'0'级（不是直接到'+'，更现实）
      const currentAvg = dimAvgs[dim];
      const targetAvg = 0.5; // 保守估计改善到中等水平
      potentialBoost += (targetAvg - currentAvg) * dimCounts[dim];
    }
    if (dimLevels[dim] === '0') {
      // '0'级也有微小改善空间
      potentialBoost += 0.5;
    }
  }

  // 将潜在提升映射到寿命
  const potentialNormalized = potentialBoost / Math.abs(maxRaw - minRaw) * lifeRange;
  let potentialLife = Math.min(105, finalLife + Math.max(5, Math.round(potentialNormalized)));
  const potentialExtra = Math.round(potentialLife - finalLife);

  // 每个人的潜力寿命都应该能到105（如果全部改善）
  const maxPotential = 105;

  // 7. 类型匹配
  const type = matchType(code, dimLevels, dimAvgs, rawScore, normalized);

  // 8. 收集预警
  const warnings = collectWarnings(answers);

  // 9. 改善建议
  const improvements = generateImprovements(dimLevels, dimScores);

  return {
    rawScore, dimScores, dimAvgs, dimLevels, code,
    finalLife: Math.round(finalLife),
    potentialLife: Math.round(potentialLife),
    potentialExtra: Math.max(potentialExtra, 5), // 至少5年的改善空间
    maxPotential,
    type, warnings, improvements
  };
}

/**
 * 类型匹配 - 基于得分等级和具体特征
 */
function matchType(code, dimLevels, dimAvgs, rawScore, normalized) {
  // 根据 normalized 分数确定大致 tier
  let tier;
  if (normalized > 0.75) tier = 'T1';
  else if (normalized > 0.55) tier = 'T2';
  else if (normalized > 0.35) tier = 'T3';
  else if (normalized > 0.15) tier = 'T4';
  else tier = 'T5';

  const levelMap = { '+': 1, '0': 0, '-': -1 };
  const userLevels = [levelMap[code[0]], levelMap[code[1]], levelMap[code[2]], levelMap[code[3]]];

  // 在同 tier 中找最匹配的
  let bestMatch = null;
  let minDist = Infinity;

  const tierTypes = TYPES.filter(t => t.tier === tier);
  const fallbackTypes = TYPES.filter(t => t.tier === tier);

  // 先在同 tier 中找
  tierTypes.forEach(type => {
    const pat = type.pattern || '0000';
    const patLevels = [levelMap[pat[0]]||0, levelMap[pat[1]]||0, levelMap[pat[2]]||0, levelMap[pat[3]]||0];
    const dist = Math.abs(userLevels[0]-patLevels[0]) + Math.abs(userLevels[1]-patLevels[1]) +
                 Math.abs(userLevels[2]-patLevels[2]) + Math.abs(userLevels[3]-patLevels[3]);
    if (dist < minDist) { minDist = dist; bestMatch = type; }
  });

  // 如果没找到，用 tier 内第一个
  if (!bestMatch) bestMatch = fallbackTypes[0] || TYPES[0];

  // 特殊处理：凤凰重生型 - 分数最低但关键问题有正面回答
  if (normalized < 0.15) {
    const d6 = answers['D6']; // 生活意义
    const d5 = answers['D5']; // 挫折应对
    if ((d6 >= 3 || d5 >= 3) && answers['D7'] >= 2) {
      const phoenix = TYPES.find(t => t.code === 'PHOENIX');
      if (phoenix) return phoenix;
    }
  }

  return bestMatch;
}

/**
 * 收集健康预警
 */
function collectWarnings(answers) {
  const warnings = [];
  // E1 血压
  if (answers['E1'] === 1 || answers['E1'] === 3) {
    warnings.push({ type: 'danger', text: '血压偏高或未控制，高血压是心脑血管疾病首要风险因素，请关注！' });
  }
  // E2 BMI
  if (answers['E2'] === 3) {
    warnings.push({ type: 'warning', text: 'BMI偏高，建议制定科学的饮食和运动计划。' });
  }
  // F1 吸烟
  if (answers['F1'] <= 2) {
    warnings.push({ type: 'danger', text: '吸烟是最大的可预防死因，每吸一支烟缩短寿命11分钟。任何年龄戒烟都有益！' });
  }
  // D4 内耗
  if (answers['D4'] === 1) {
    warnings.push({ type: 'warning', text: '严重的内耗/反刍思维正在损害你的心理健康，建议寻求专业帮助。' });
  }
  // D8 身心俱疲
  if (answers['D8'] === 1) {
    warnings.push({ type: 'danger', text: '长期身心俱疲是一种需要干预的状态，不是"年轻人的常态"。请重视！' });
  }
  return warnings;
}

/**
 * 生成改善建议（带科学依据）
 */
function generateImprovements(dimLevels) {
  const tips = [];
  const priority = ['habit', 'mental', 'sleep', 'exercise', 'diet'];

  // 先加 '-' 维度的建议
  priority.forEach(dim => {
    if (dimLevels[dim] === '-' && IMPROVEMENT_TIPS[dim]) {
      IMPROVEMENT_TIPS[dim].slice(0, 2).forEach(t => {
        if (!tips.find(x => x.label === t.label)) tips.push(t);
      });
    }
  });

  // 再加 '0' 维度的建议
  priority.forEach(dim => {
    if (dimLevels[dim] === '0' && IMPROVEMENT_TIPS[dim]) {
      IMPROVEMENT_TIPS[dim].slice(0, 1).forEach(t => {
        if (!tips.find(x => x.label === t.label) && tips.length < 6) tips.push(t);
      });
    }
  });

  return tips.slice(0, 6);
}
