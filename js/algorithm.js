// 核心算法

/**
 * 基础寿命（基于中国2023年人均预期寿命）
 */
const BASE_LIFE = 80;

/**
 * 性别调整
 */
function genderAdjust(gender) {
  return gender === 'male' ? -2 : +2;
}

/**
 * 年龄调整（越年轻，可改善空间越大）
 */
function ageAdjust(age) {
  if (age < 30) return +2;
  if (age < 40) return +1;
  if (age < 50) return 0;
  if (age < 60) return -1;
  return -2;
}

/**
 * 计算维度等级
 * @param {number} avgScore - 维度平均分
 * @returns {string} '+' / '0' / '-'
 */
function getDimLevel(avgScore) {
  if (avgScore > 0.8) return '+';
  if (avgScore < -0.8) return '-';
  return '0';
}

/**
 * 主计算函数
 * @param {Object} answers - { questionId: selectedValue }
 * @param {number} age
 * @param {string} gender - 'male' | 'female'
 * @returns {Object} 完整计算结果
 */
function calculate(answers, age, gender) {
  // 1. 计算各维度得分
  const dimScores = {};
  const dimCounts = {};
  const negativeScores = [];

  QUESTIONS.forEach(q => {
    const dim = q.dim;
    if (!dimScores[dim]) { dimScores[dim] = 0; dimCounts[dim] = 0; }

    let score = 0;
    if (q.multi) {
      // 多选题（F1）
      const selected = answers[q.id] || [];
      if (Array.isArray(selected)) {
        selected.forEach(val => {
          const opt = q.options.find(o => o.value === val);
          if (opt) {
            score += opt.score;
            if (opt.score < 0) negativeScores.push(opt.score);
          }
        });
      }
    } else {
      const opt = q.options.find(o => o.value === answers[q.id]);
      if (opt) {
        score = opt.score;
        if (opt.score < 0) negativeScores.push(opt.score);
      }
    }

    dimScores[dim] += score;
    dimCounts[dim]++;
  });

  // 2. 计算维度平均分和等级
  const dimAvgs = {};
  const dimLevels = {};
  for (const dim in dimScores) {
    dimAvgs[dim] = dimScores[dim] / dimCounts[dim];
    dimLevels[dim] = getDimLevel(dimAvgs[dim]);
  }

  // 3. 生成4位代码（基于S/D/E/M）
  const code = (dimLevels.sleep || '0') + (dimLevels.diet || '0') +
               (dimLevels.exercise || '0') + (dimLevels.mental || '0');

  // 4. 计算总分
  const rawScore = Object.values(dimScores).reduce((a, b) => a + b, 0);

  // 5. 寿命计算
  const maxAdjust = 15;
  const adjustment = Math.max(-maxAdjust, Math.min(maxAdjust, rawScore * 0.25));
  const finalLife = Math.max(age + 5, Math.min(110,
    BASE_LIFE + genderAdjust(gender) + ageAdjust(age) + adjustment
  ));

  // 6. 潜力寿命（假设所有负分项改善到0）
  const negativeTotal = negativeScores.reduce((a, b) => a + b, 0);
  const potentialExtra = Math.max(0, Math.min(maxAdjust - Math.abs(adjustment),
    Math.abs(negativeTotal) * 0.25));
  const potentialLife = Math.min(110, finalLife + potentialExtra);

  // 7. 类型匹配
  const type = matchType(code, rawScore, answers);

  // 8. 收集预警
  const warnings = collectWarnings(answers);

  // 9. 生成改善建议
  const improvements = generateImprovements(dimLevels, dimScores);

  return {
    rawScore,
    dimScores,
    dimAvgs,
    dimLevels,
    code,
    finalLife: Math.round(finalLife),
    potentialLife: Math.round(potentialLife),
    potentialExtra: Math.round(potentialExtra),
    type,
    warnings,
    improvements
  };
}

/**
 * 类型匹配
 */
function matchType(code, rawScore, answers) {
  const levelMap = { '+': 1, '0': 0, '-': -1 };
  const userLevels = [levelMap[code[0]], levelMap[code[1]], levelMap[code[2]], levelMap[code[3]]];

  let bestMatch = null;
  let minDist = Infinity;

  TYPES.forEach(type => {
    const pattern = type.pattern;
    const patLevels = [levelMap[pattern[0]], levelMap[pattern[1]], levelMap[pattern[2]], levelMap[pattern[3]]];

    // 曼哈顿距离
    const dist = Math.abs(userLevels[0] - patLevels[0]) +
                 Math.abs(userLevels[1] - patLevels[1]) +
                 Math.abs(userLevels[2] - patLevels[2]) +
                 Math.abs(userLevels[3] - patLevels[3]);

    // 精确匹配优先
    if (dist === 0 && !bestMatch) {
      bestMatch = type;
      minDist = 0;
    } else if (dist < minDist && !type.isPhoenix) {
      // 优先非凤凰类型（凤凰需要特殊触发）
      bestMatch = type;
      minDist = dist;
    }
  });

  // 凤凰特殊触发：T5等级 + D12或D11有正面选择
  if (rawScore < -15) {
    const d12Answer = answers['D12'];
    const d11Answer = answers['D11'];
    // D12正面：value 4 或 3；D11正面：value 4
    if ((d12Answer === 4 || d12Answer === 3) || d11Answer === 4) {
      return TYPES.find(t => t.code === 'PHOENIX');
    }
    // 否则检查是否已匹配到CANDLE
    if (bestMatch && bestMatch.code !== 'CANDLE') {
      // 如果当前匹配的不是灰烬也不是蜡烛，优先蜡烛
      const candle = TYPES.find(t => t.code === 'CANDLE');
      if (candle && bestMatch.code !== 'BURNOUT') {
        // 检查心理维度
        if (levelMap[code[3]] >= 0) return candle;
      }
      const burnout = TYPES.find(t => t.code === 'BURNOUT');
      if (burnout) return burnout;
    }
    return bestMatch;
  }

  return bestMatch || TYPES[0];
}

/**
 * 收集健康预警
 */
function collectWarnings(answers) {
  const warnings = [];

  // F1 身体信号
  const f1Answers = answers['F1'] || [];
  if (Array.isArray(f1Answers)) {
    if (f1Answers.includes('lip_purple')) {
      warnings.push({ type: 'danger', text: '嘴唇经常发紫或暗沉，可能提示心肺功能异常，建议尽快就医检查。' });
    }
    if (f1Answers.includes('chest')) {
      warnings.push({ type: 'danger', text: '经常头晕或胸闷气短，建议尽快进行心脏相关检查。' });
    }
  }

  // E1 血压
  const e1 = answers['E1'];
  if (e1 === 2 || e1 === 4) { // 严重高血压
    warnings.push({ type: 'danger', text: '血压严重偏高或未得到有效控制，高血压是心脑血管疾病的首要风险因素，请尽快就医。' });
  }

  // E2 心率
  const e2 = answers['E2'];
  if (e2 === 1) { // >100或<50
    warnings.push({ type: 'warning', text: '静息心率异常，建议到医院进行心电图检查。' });
  }

  // E3 BMI
  const e3 = answers['E3'];
  if (e3 === 3 || e3 === 4) { // 肥胖/严重肥胖
    warnings.push({ type: 'warning', text: 'BMI偏高，建议咨询营养师制定科学的饮食和运动计划。' });
  }

  return warnings;
}

/**
 * 生成改善建议
 */
function generateImprovements(dimLevels, dimScores) {
  const tips = [];

  // 找出最弱的维度（-等级的维度）
  const weakDims = [];
  for (const dim in dimLevels) {
    if (dimLevels[dim] === '-' && IMPROVEMENT_TIPS[dim]) {
      weakDims.push(dim);
    }
  }

  // 也加入0等级的维度（但优先级低）
  const midDims = [];
  for (const dim in dimLevels) {
    if (dimLevels[dim] === '0' && IMPROVEMENT_TIPS[dim]) {
      midDims.push(dim);
    }
  }

  // 先加弱维度建议
  weakDims.forEach(dim => {
    const dimTips = IMPROVEMENT_TIPS[dim];
    if (dimTips) {
      tips.push(dimTips[0]); // 取每个维度最重要的建议
    }
  });

  // 再加中等维度的建议（最多补到5个）
  midDims.forEach(dim => {
    if (tips.length >= 5) return;
    const dimTips = IMPROVEMENT_TIPS[dim];
    if (dimTips) {
      tips.push(dimTips[0]);
    }
  });

  // 去重
  const seen = new Set();
  return tips.filter(t => {
    if (seen.has(t.label)) return false;
    seen.add(t.label);
    return true;
  }).slice(0, 5);
}
