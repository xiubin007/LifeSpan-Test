// 41道测试题数据
const QUESTIONS = [
  // ========== 维度A：睡眠作息（7题）==========
  {
    id: 'A1', dim: 'sleep', dimLabel: '睡眠作息',
    text: '你通常晚上几点入睡？',
    options: [
      { label: '22:00前', value: 5, score: 2 },
      { label: '22:00-23:00', value: 4, score: 1 },
      { label: '23:00-00:00', value: 3, score: 0 },
      { label: '00:00-01:00', value: 2, score: -1 },
      { label: '01:00以后', value: 1, score: -2 }
    ],
    ref: 'IARC将昼夜节律紊乱列为2A类致癌物；长期23点后入睡与乳腺癌/前列腺癌风险显著相关'
  },
  {
    id: 'A2', dim: 'sleep', dimLabel: '睡眠作息',
    text: '你每晚实际睡眠时长大约是？',
    options: [
      { label: '7-8小时', value: 5, score: 2 },
      { label: '6-7小时', value: 4, score: 1 },
      { label: '8-9小时', value: 3, score: 0.5 },
      { label: '5-6小时', value: 2, score: -1.5 },
      { label: '少于5小时', value: 1, score: -3 }
    ],
    ref: '睡眠时长与死亡率呈U型曲线；<6h全因死亡风险↑14%（Cappuccio 2010）'
  },
  {
    id: 'A3', dim: 'sleep', dimLabel: '睡眠作息',
    text: '你的作息规律程度如何？',
    options: [
      { label: '每天固定时间睡/起，误差不超30分钟', value: 4, score: 2 },
      { label: '大部分时间规律，周末偶尔打乱', value: 3, score: 1 },
      { label: '经常不规律，每天入睡时间差1-2小时', value: 2, score: -1 },
      { label: '长期倒班或作息完全混乱', value: 1, score: -3 }
    ],
    ref: '不规则作息与代谢综合征风险↑29%（He 2020）；夜班与生物衰老加速显著相关'
  },
  {
    id: 'A4', dim: 'sleep', dimLabel: '睡眠作息',
    text: '你入睡是否容易？中途会醒来吗？',
    options: [
      { label: '躺下10分钟内入睡，一觉到天亮', value: 4, score: 2 },
      { label: '偶尔需要20-30分钟入睡或中途醒一次', value: 3, score: 1 },
      { label: '经常翻来覆去超过30分钟或中途醒多次', value: 2, score: -1 },
      { label: '长期失眠，需要药物或助眠辅助', value: 1, score: -3 }
    ],
    ref: '慢性失眠与心血管疾病风险↑45%，与认知衰退加速相关'
  },
  {
    id: 'A5', dim: 'sleep', dimLabel: '睡眠作息',
    text: '睡前1小时你通常在做什么？',
    options: [
      { label: '冥想/阅读纸质书/轻柔音乐', value: 4, score: 1.5 },
      { label: '偶尔看手机但会限制时间', value: 3, score: 0.5 },
      { label: '刷短视频/追剧/打游戏', value: 2, score: 0 },
      { label: '看手机直到眼睛睁不开才放下', value: 1, score: -1.5 }
    ],
    ref: '蓝光抑制褪黑素分泌达50%+，延迟入睡时间平均30分钟'
  },
  {
    id: 'A6', dim: 'sleep', dimLabel: '睡眠作息',
    text: '醒来后你通常感觉怎样？',
    options: [
      { label: '非常精神，充满活力', value: 4, score: 1.5 },
      { label: '还不错，过一会儿就清醒', value: 3, score: 0.5 },
      { label: '经常感觉没睡够，需要咖啡因续命', value: 2, score: -1 },
      { label: '醒来比睡前还累，长期如此', value: 1, score: -2.5 }
    ],
    ref: '睡眠惯性持续>30分钟提示睡眠结构异常，与深度睡眠不足相关'
  },
  {
    id: 'A7', dim: 'sleep', dimLabel: '睡眠作息',
    text: '白天你会不会不自觉地犯困？',
    options: [
      { label: '从不，精力一直在线', value: 4, score: 1.5 },
      { label: '午后偶尔犯困，小憩后恢复', value: 3, score: 0.5 },
      { label: '每周好几天下午都犯困影响工作', value: 2, score: -1 },
      { label: '几乎每天白天都很困，甚至开会/开车时打瞌睡', value: 1, score: -2.5 }
    ],
    ref: '白天嗜睡ESS评分>10提示潜在睡眠呼吸暂停综合征，未治疗者全因死亡风险↑2-3倍'
  },

  // ========== 维度B：饮食营养（8题）==========
  {
    id: 'B1', dim: 'diet', dimLabel: '饮食营养',
    text: '你每天蔬菜水果的摄入量大约是？',
    options: [
      { label: '每天500g以上（约5份），种类丰富', value: 4, score: 2 },
      { label: '每天300-500g（3-4份）', value: 3, score: 1 },
      { label: '每天100-300g，有时吃有时不吃', value: 2, score: 0 },
      { label: '很少吃，一周才吃几次', value: 1, score: -1.5 }
    ],
    ref: '每天摄入800g蔬果与心血管死亡风险↓22%、预期寿命↑3.25年显著相关（Imperial College London荟萃分析）'
  },
  {
    id: 'B2', dim: 'diet', dimLabel: '饮食营养',
    text: '你一周吃几次红肉（猪牛羊）和加工肉（香肠/培根）？',
    options: [
      { label: '很少吃或几乎不吃，以鱼禽豆为主', value: 4, score: 2 },
      { label: '红肉每周2-3次，不常吃加工肉', value: 3, score: 0.5 },
      { label: '红肉每周4-6次，偶尔加工肉', value: 2, score: -1 },
      { label: '几乎每天吃红肉或加工肉，每周>4次', value: 1, score: -2.5 }
    ],
    ref: 'WHO IARC：加工肉列为一类致癌物，每天50g加工肉肠癌风险↑18%；红肉为2A类'
  },
  {
    id: 'B3', dim: 'diet', dimLabel: '饮食营养',
    text: '你一周吃几次快餐、油炸食品、外卖？',
    options: [
      { label: '几乎不吃，以自己做饭为主', value: 4, score: 2 },
      { label: '每月1-2次', value: 3, score: 1 },
      { label: '每周2-3次', value: 2, score: -1 },
      { label: '每周4次以上，甚至每天', value: 1, score: -3 }
    ],
    ref: '高温油炸产生丙烯酰胺（2A致癌物）和反式脂肪，加速动脉粥样硬化；长期外卖钠摄入普遍超标2-3倍'
  },
  {
    id: 'B4', dim: 'diet', dimLabel: '饮食营养',
    text: '你每天的饮水量和饮水习惯是？',
    options: [
      { label: '每天喝1500-2000ml以上，以白水/淡茶为主', value: 4, score: 1.5 },
      { label: '每天约1000-1500ml白水，偶尔喝饮料', value: 3, score: 0.5 },
      { label: '渴了才喝水，每天白水不足1000ml', value: 2, score: -0.5 },
      { label: '很少喝白水，主要靠奶茶/碳酸饮料/果汁', value: 1, score: -2 }
    ],
    ref: '充足饮水维持肾脏浓缩功能；含糖饮料每天1杯2型糖尿病风险↑26%（英国研究所）'
  },
  {
    id: 'B5', dim: 'diet', dimLabel: '饮食营养',
    text: '你的主食以什么为主？',
    options: [
      { label: '全谷物/杂粮占一半以上（糙米/燕麦/玉米/红薯）', value: 4, score: 2 },
      { label: '粗细搭配，有意识掺杂粮', value: 3, score: 1 },
      { label: '以白米白面为主，较少吃粗粮', value: 2, score: -0.5 },
      { label: '主食以精制碳水为主，且常吃甜食糕点', value: 1, score: -2 }
    ],
    ref: '全谷物降低2型糖尿病风险25-36%、心血管风险20%（Harvard荟萃分析）'
  },
  {
    id: 'B6', dim: 'diet', dimLabel: '饮食营养',
    text: '你的蛋白质摄入是否均衡？',
    options: [
      { label: '每天有鱼/禽/蛋/豆/奶的合理搭配', value: 4, score: 1.5 },
      { label: '大多数时候能保证', value: 3, score: 0.5 },
      { label: '偶尔注意，摄入不规律', value: 2, score: -0.5 },
      { label: '长期偏食，蛋白质来源单一或严重不足', value: 1, score: -2 }
    ],
    ref: '优质蛋白维持肌肉量和免疫功能；肌肉减少症与老年全因死亡率↑约50%相关'
  },
  {
    id: 'B7', dim: 'diet', dimLabel: '饮食营养',
    text: '你吃早餐的习惯是？',
    options: [
      { label: '每天都吃，且包含蛋白质+碳水+蔬果', value: 4, score: 1.5 },
      { label: '经常吃，但内容随意', value: 3, score: 0.5 },
      { label: '偶尔吃，经常空腹到中午', value: 2, score: -1 },
      { label: '几乎不吃早餐', value: 1, score: -1.5 }
    ],
    ref: '定期吃早餐与心血管疾病风险↓14%、2型糖尿病风险↓26%相关'
  },
  {
    id: 'B8', dim: 'diet', dimLabel: '饮食营养',
    text: '你每天的盐摄入大概是什么水平？',
    options: [
      { label: '饮食清淡，外卖少自己做为主', value: 4, score: 2 },
      { label: '适中，有时咸有时淡', value: 3, score: 0 },
      { label: '偏咸，爱吃重口味食物', value: 2, score: -1 },
      { label: '非常咸，且经常吃腌制/酱料食品', value: 1, score: -2.5 }
    ],
    ref: '中国人均盐摄入约10.5g/天，远超WHO推荐5g；每减少1.75g盐摄入，收缩压可降约5mmHg'
  },

  // ========== 维度C：运动体能（7题）==========
  {
    id: 'C1', dim: 'exercise', dimLabel: '运动体能',
    text: '你每周进行中等及以上强度运动的总时长？（快走/跑步/游泳/骑行/球类等，每次30分钟以上）',
    options: [
      { label: '300分钟以上', value: 5, score: 2.5 },
      { label: '150-300分钟', value: 4, score: 2 },
      { label: '60-150分钟', value: 3, score: 1 },
      { label: '30-60分钟', value: 2, score: 0 },
      { label: '几乎不运动', value: 1, score: -2.5 }
    ],
    ref: 'WHO推荐每周≥150分钟中强度运动；满足者全因死亡风险↓31%（Arem 2015 NEJM）'
  },
  {
    id: 'C2', dim: 'exercise', dimLabel: '运动体能',
    text: '你是否进行力量训练？（深蹲/俯卧撑/哑铃/弹力带等）',
    options: [
      { label: '每周2-3次或以上', value: 4, score: 2 },
      { label: '每周1次', value: 3, score: 1 },
      { label: '偶尔做做', value: 2, score: 0 },
      { label: '从不做', value: 1, score: -1.5 }
    ],
    ref: '力量训练降低全因死亡率26%（Momma 2022 BJSM），维持骨密度和肌肉量'
  },
  {
    id: 'C3', dim: 'exercise', dimLabel: '运动体能',
    text: '你每天的日常活动量如何？（步行/站立/家务等）',
    options: [
      { label: '每天步行8000步以上，或工作需要经常走动', value: 4, score: 1.5 },
      { label: '每天5000-8000步', value: 3, score: 0.5 },
      { label: '每天3000-5000步，偶尔活动', value: 2, score: 0 },
      { label: '每天少于3000步，长期久坐', value: 1, score: -2 }
    ],
    ref: '每多走1000步，全因死亡风险↓8%（Paluch 2022）'
  },
  {
    id: 'C4', dim: 'exercise', dimLabel: '运动体能',
    text: '你每天连续久坐多长时间？（不站起来活动）',
    options: [
      { label: '很少超过1小时，会主动起身', value: 4, score: 1.5 },
      { label: '通常1-2小时会起身活动', value: 3, score: 0.5 },
      { label: '经常连续坐3-5小时', value: 2, score: -1 },
      { label: '经常连续坐5小时以上', value: 1, score: -2.5 }
    ],
    ref: '久坐是独立于运动总量的全因死亡风险因素；每天久坐>8小时+不运动者风险与吸烟相当'
  },
  {
    id: 'C5', dim: 'exercise', dimLabel: '运动体能',
    text: '你能轻松完成"从椅子上站起再坐下"连续10次吗？（不借助手臂）',
    options: [
      { label: '轻松完成，不觉得累', value: 4, score: 1.5 },
      { label: '能完成但后半段有点费力', value: 3, score: 0.5 },
      { label: '很费力，做不到10次', value: 2, score: -1 },
      { label: '做不到或不敢尝试', value: 1, score: -2 }
    ],
    ref: '坐站测试：每少做1次，10年内死亡风险↑21%（Brito 2014 Clinimex）'
  },
  {
    id: 'C6', dim: 'exercise', dimLabel: '运动体能',
    text: '你能一次快走/慢跑多长时间不觉得气喘？',
    options: [
      { label: '30分钟以上', value: 4, score: 1.5 },
      { label: '15-30分钟', value: 3, score: 0.5 },
      { label: '5-15分钟', value: 2, score: -0.5 },
      { label: '不到5分钟或走两层楼就气喘', value: 1, score: -2 }
    ],
    ref: '心肺耐力（VO2max）每提高1 MET当量，全因死亡风险↓13%（Kodama 2009）'
  },
  {
    id: 'C7', dim: 'exercise', dimLabel: '运动体能',
    text: '你有规律的运动习惯坚持了多久？',
    options: [
      { label: '超过3年，已经成为生活方式的一部分', value: 4, score: 2 },
      { label: '1-3年，相对稳定', value: 3, score: 1 },
      { label: '断断续续，常开始又放弃', value: 2, score: 0 },
      { label: '从来没有坚持超过1个月', value: 1, score: -1 }
    ],
    ref: '长期规律运动者端粒长度显著更长（Sjogren 2014），生物年龄比实际年龄小约9岁'
  },

  // ========== 维度D：心理健康（12题）==========
  // D1-D4：情绪状态
  {
    id: 'D1', dim: 'mental', dimLabel: '心理健康',
    text: '过去一个月，你感到焦虑或紧张不安的频率是？',
    options: [
      { label: '几乎没有', value: 4, score: 2 },
      { label: '偶尔有，但不影响生活', value: 3, score: 1 },
      { label: '每周出现几次，有时影响工作或睡眠', value: 2, score: -1 },
      { label: '几乎每天都有，很难控制', value: 1, score: -3 }
    ],
    ref: '焦虑症老年男性7年随访全因死亡风险↑87%（Smith 2022）'
  },
  {
    id: 'D2', dim: 'mental', dimLabel: '心理健康',
    text: '过去一个月，你感到情绪低落、沮丧或对事物失去兴趣的频率？',
    options: [
      { label: '几乎没有', value: 4, score: 2 },
      { label: '偶尔有，很快能恢复', value: 3, score: 0 },
      { label: '经常有，持续好几天', value: 2, score: -2 },
      { label: '几乎每天都有，严重影响生活', value: 1, score: -4 }
    ],
    ref: '重度抑郁预期寿命减少7-24年（Walker 2015）'
  },
  {
    id: 'D3', dim: 'mental', dimLabel: '心理健康',
    text: '你会经常反复纠结/反刍同一件负面事情吗？',
    options: [
      { label: '从不，发生就过去了', value: 4, score: 1.5 },
      { label: '偶尔会想，但能转移注意力', value: 3, score: 0.5 },
      { label: '经常反复想，越想越烦', value: 2, score: -1.5 },
      { label: '几乎每天都陷入反刍，很难自拔', value: 1, score: -3 }
    ],
    ref: '反刍思维是抑郁和焦虑的核心维持因素（Nolen-Hoeksema）'
  },
  {
    id: 'D4', dim: 'mental', dimLabel: '心理健康',
    text: '你有多经常感到"无法放松"？',
    options: [
      { label: '很少有这种感觉，即使有也很快调整', value: 4, score: 2 },
      { label: '偶尔，周末能放松下来', value: 3, score: 0.5 },
      { label: '经常觉得浑身紧绷，即使休息也放松不下来', value: 2, score: -1.5 },
      { label: '长期处于紧绷状态，不知道"放松"是什么感觉', value: 1, score: -3 }
    ],
    ref: '慢性压力加速海马体萎缩和端粒缩短（Epel 2004）'
  },
  // D5-D8：压力认知
  {
    id: 'D5', dim: 'mental', dimLabel: '心理健康',
    text: '你目前的生活/工作/学习压力处于什么水平？',
    options: [
      { label: '有一定挑战但完全在掌控中，很享受', value: 4, score: 1.5 },
      { label: '有时有压力但能消化', value: 3, score: 0.5 },
      { label: '经常感到压力较大，有些喘不过气', value: 2, score: -1.5 },
      { label: '压力爆表，感觉快崩溃了', value: 1, score: -3 }
    ],
    ref: '慢性心理压力使全因死亡率增加约30%（Kivimaki 2012 Lancet）'
  },
  {
    id: 'D6', dim: 'mental', dimLabel: '心理健康',
    text: '你对未来的整体态度是？',
    options: [
      { label: '很乐观，相信事情会变好', value: 5, score: 2 },
      { label: '谨慎乐观，有期待也有担忧', value: 4, score: 0.5 },
      { label: '说不上乐观还是悲观', value: 3, score: 0 },
      { label: '较悲观，觉得很多事不会变好', value: 2, score: -2 },
      { label: '非常悲观，对未来没有期待', value: 1, score: -3 }
    ],
    ref: '乐观者比悲观者平均多活11-15年（Levy 2002）'
  },
  {
    id: 'D7', dim: 'mental', dimLabel: '心理健康',
    text: '你对自己要求高吗？达不到目标时会怎样？',
    options: [
      { label: '尽力就好，接受不完美，能自我和解', value: 4, score: 1.5 },
      { label: '有一点追求完美，但能调整', value: 3, score: 0 },
      { label: '对自己要求很高，达不到会自我否定', value: 2, score: -2 },
      { label: '极度苛刻，达不到就陷入深度自我攻击', value: 1, score: -3 }
    ],
    ref: '极度完美主义与抑郁、焦虑高度相关（Frost 1990）'
  },
  {
    id: 'D8', dim: 'mental', dimLabel: '心理健康',
    text: '你做事情时能专注当下吗？',
    options: [
      { label: '经常能沉浸其中（心流状态）', value: 4, score: 2 },
      { label: '大部分时间还行，偶尔走神', value: 3, score: 0.5 },
      { label: '经常同时做很多事，脑子很乱', value: 2, score: -1 },
      { label: '几乎无法专注，注意力分散，思绪混乱', value: 1, score: -2.5 }
    ],
    ref: '正念水平与端粒长度正相关（Epel 2013）'
  },
  // D9-D12：社交与意义
  {
    id: 'D9', dim: 'mental', dimLabel: '心理健康',
    text: '你感到孤独的频率是？',
    options: [
      { label: '很少，我很享受独处也享受社交', value: 4, score: 2 },
      { label: '偶尔会有一点孤独感', value: 3, score: 0 },
      { label: '经常感到孤独，即使身边有人', value: 2, score: -2 },
      { label: '深深的、长期的孤独感，很难排解', value: 1, score: -3.5 }
    ],
    ref: '长期孤独对健康的危害=每天吸15支烟（Holt-Lunstad 2015 Harvard）'
  },
  {
    id: 'D10', dim: 'mental', dimLabel: '心理健康',
    text: '你身边有多少可以无条件倾诉心事的亲友？',
    options: [
      { label: '3个以上，经常交流', value: 4, score: 1.5 },
      { label: '1-2个，关键时刻可以找', value: 3, score: 0.5 },
      { label: '很少主动倾诉，怕麻烦别人', value: 2, score: -0.5 },
      { label: '几乎没有，觉得没人真正理解我', value: 1, score: -2.5 }
    ],
    ref: '强社交关系预测寿命的能力与吸烟相当（Holt-Lunstad 2010 PLOS Medicine）'
  },
  {
    id: 'D11', dim: 'mental', dimLabel: '心理健康',
    text: '遇到重大压力或挫折时，你通常如何应对？',
    options: [
      { label: '有成熟的减压方式（运动/倾诉/写作/冥想等），善于调节', value: 4, score: 1.5 },
      { label: '慢慢能消化，时间会治愈', value: 3, score: 0 },
      { label: '习惯压抑、逃避，或靠暴饮暴食/刷手机', value: 2, score: -1.5 },
      { label: '完全不会应对，经常感到崩溃和无助', value: 1, score: -3 }
    ],
    ref: '积极应对策略降低心血管事件风险30%（Chida 2008 Psychosom Med）'
  },
  {
    id: 'D12', dim: 'mental', dimLabel: '心理健康',
    text: '你觉得你的生活有意义/有目标感吗？',
    options: [
      { label: '非常明确，每天都充满动力', value: 4, score: 2 },
      { label: '有一些方向，但有时会迷茫', value: 3, score: 0.5 },
      { label: '走一步看一步，不太清楚意义在哪', value: 2, score: -1 },
      { label: '经常感到空虚，不知道为什么活着', value: 1, score: -3 }
    ],
    ref: 'Ikigai（生存意义）是蓝区百岁老人核心共性；生活有目标感者全因死亡率↓15%（Hill 2020 JAMA）'
  },

  // ========== 维度E：健康指标（3题）==========
  {
    id: 'E1', dim: 'indicator', dimLabel: '健康指标',
    text: '你最近一次测量血压的数值大约是？',
    options: [
      { label: '正常（收缩压<120 且 舒张压<80）', value: 6, score: 2 },
      { label: '正常偏高（120-130/80-85）', value: 5, score: 1 },
      { label: '偏高但未到高血压标准（130-140/85-90）', value: 4, score: -0.5 },
      { label: '已确诊高血压，规律服药控制良好', value: 3, score: -1 },
      { label: '已确诊高血压但未规律治疗', value: 2, score: -3 },
      { label: '从未量过，不清楚', value: 1, score: 0 }
    ],
    ref: '高血压是全球第一大死亡风险因素，收缩压每升高20mmHg，心血管死亡风险↑2倍',
    warnFlag: 'bp'
  },
  {
    id: 'E2', dim: 'indicator', dimLabel: '健康指标',
    text: '你的静息心率（安静坐着不说话时每分钟心跳）大约是？',
    options: [
      { label: '60-75次/分', value: 5, score: 1.5 },
      { label: '75-85次/分', value: 4, score: 0.5 },
      { label: '50-60次/分且非运动员', value: 3, score: 0 },
      { label: '85-100次/分', value: 2, score: -1.5 },
      { label: '>100次/分或<50次/分或不知道', value: 1, score: -1 }
    ],
    ref: '静息心率>90bpm与全因死亡率↑37%相关（Jensen 2013 Heart）',
    warnFlag: 'heartRate'
  },
  {
    id: 'E3', dim: 'indicator', dimLabel: '健康指标',
    text: '你的BMI（体重kg÷身高m的平方）大约是多少？',
    options: [
      { label: '18.5-23.9（正常）', value: 6, score: 2 },
      { label: '24-27.9（超重）', value: 5, score: -1 },
      { label: '28-32（肥胖）', value: 4, score: -3 },
      { label: '>32（严重肥胖）', value: 3, score: -5 },
      { label: '<18.5（偏瘦）', value: 2, score: -1 },
      { label: '不清楚', value: 1, score: 0 }
    ],
    ref: '肥胖(BMI≥30)与预期寿命减少约5-10年相关（Lancet 2016）',
    warnFlag: 'bmi'
  },

  // ========== 维度F：身体信号（1题，多选）==========
  {
    id: 'F1', dim: 'signal', dimLabel: '身体信号',
    text: '以下身体信号，你符合哪些？（可多选）',
    multi: true,
    options: [
      { label: '嘴唇经常发紫或暗沉', value: 'lip_purple', score: -1, warn: 'lip' },
      { label: '指甲月牙很少或没有', value: 'no_moon', score: -0.5, warn: null },
      { label: '长期明显黑眼圈', value: 'dark_eyes', score: -0.5, warn: null },
      { label: '经常头晕或胸闷气短', value: 'chest', score: -1.5, warn: 'chest' },
      { label: '以上都不符合', value: 'none', score: 1, warn: null }
    ],
    ref: '唇紫/胸闷可能提示心肺功能异常，建议就医确认；月牙无直接科学依据；黑眼圈反映疲劳程度'
  },

  // ========== 维度G：生活习惯（3题）==========
  {
    id: 'G1', dim: 'habit', dimLabel: '生活习惯',
    text: '你的吸烟情况？（含电子烟）',
    options: [
      { label: '从不吸烟，也很少接触二手烟', value: 6, score: 3 },
      { label: '已戒烟超过5年', value: 5, score: 2 },
      { label: '已戒烟1-5年', value: 4, score: 1 },
      { label: '偶尔吸烟或长期接触大量二手烟', value: 3, score: -2 },
      { label: '每天吸烟10支以下', value: 2, score: -5 },
      { label: '每天吸烟10支以上', value: 1, score: -8 }
    ],
    ref: '吸烟平均减少寿命10年（Doll 2004 BMJ）；戒烟10年后风险接近不吸烟者'
  },
  {
    id: 'G2', dim: 'habit', dimLabel: '生活习惯',
    text: '你的饮酒情况？（1标准杯≈啤酒355ml/红酒150ml/白酒50ml）',
    options: [
      { label: '从不饮酒或每月<1次', value: 4, score: 2 },
      { label: '每周1-3次，每次不超过推荐量', value: 3, score: 0.5 },
      { label: '每周4次以上或偶尔醉酒', value: 2, score: -1.5 },
      { label: '几乎每天饮酒或每周醉酒>1次', value: 1, score: -4 }
    ],
    ref: '全球酒精消费导致每年300万死亡（WHO 2018）；2022 Lancet：任何量饮酒均增加心血管风险'
  },
  {
    id: 'G3', dim: 'habit', dimLabel: '生活习惯',
    text: '你多久做一次全面的身体检查？',
    options: [
      { label: '每年至少一次全面体检', value: 4, score: 1.5 },
      { label: '每2-3年一次', value: 3, score: 0.5 },
      { label: '偶尔做，不舒服了才去', value: 2, score: -0.5 },
      { label: '从不做体检', value: 1, score: -1.5 }
    ],
    ref: '早期筛查使结直肠癌死亡率↓约68%、乳腺癌↓约25%'
  }
];

// 维度配置
const DIMENSIONS = {
  sleep:    { name: '睡眠作息', key: 'S', icon: '🌙' },
  diet:     { name: '饮食营养', key: 'D', icon: '🥗' },
  exercise: { name: '运动体能', key: 'E', icon: '🏃' },
  mental:   { name: '心理健康', key: 'M', icon: '🧠' },
  indicator:{ name: '健康指标', key: 'I', icon: '🫀' },
  signal:   { name: '身体信号', key: 'F', icon: '👀' },
  habit:    { name: '生活习惯', key: 'G', icon: '🚬' }
};

// 维度等级解读
const DIM_LEVEL_TEXT = {
  sleep: {
    '+': '你的睡眠习惯堪称典范。规律的作息和充足的睡眠是你长寿的基石，身体在夜间的修复效率极高。',
    '0': '睡眠方面表现一般，偶尔的熬夜或不规律可能正在悄悄消耗你的"睡眠银行"。建议尝试固定作息时间。',
    '-': '睡眠严重不足或不规律，这是你最大的健康短板。长期如此会加速衰老、损害免疫力和认知功能。'
  },
  diet: {
    '+': '你的饮食习惯非常科学，均衡的营养摄入为身体提供了充足的燃料和修复原料。',
    '0': '饮食有一定基础，但在某些方面（如蔬果量、盐摄入）还有改善空间。小改变，大收益。',
    '-': '饮食结构需要重点关注。高油高盐高糖或营养不均衡，正在为心血管和代谢疾病埋下隐患。'
  },
  exercise: {
    '+': '你是一个自律的运动者，规律的身体活动是你最好的"长寿药"，心肺功能和肌肉量都保持得很好。',
    '0': '运动量还行但不够稳定，或者有久坐的习惯。建议循序渐进地增加运动频率，哪怕每天多走1000步。',
    '-': '运动严重不足，这是你急需改变的领域。即使从每天散步15分钟开始，也能带来显著的健康收益。'
  },
  mental: {
    '+': '你的心理健康状态非常好，积极的心态和良好的情绪管理能力是你最强大的长寿武器。',
    '0': '心理状态有起伏，但基本在可控范围内。学会一两个减压技巧（如冥想、深呼吸），会让你的生活大不一样。',
    '-': '心理压力较大，焦虑/抑郁/孤独感可能正在损害你的身心健康。请重视，必要时寻求专业帮助。'
  }
};
