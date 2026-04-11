// LBTI · 33道测试题（娱乐化改造版）
// 无多选题，每题4-6个选项，幽默/有梗/扎心

const QUESTIONS = [
  // ========== 维度A：睡眠作息（5题）==========
  {
    id: 'A1', dim: 'sleep', dimLabel: '睡眠作息',
    text: '你通常几点睡？',
    options: [
      { label: '22:00前，养生届的天花板', value: 5, score: 2.5 },
      { label: '22:00-23:00，还行，不算作死', value: 4, score: 1.5 },
      { label: '23:00-00:00，年轻人标配', value: 3, score: 0 },
      { label: '00:00-01:00，夜生活才刚开始', value: 2, score: -1.5 },
      { label: '01:00以后，地府VIP客户', value: 1, score: -3 }
    ],
    ref: 'IARC将昼夜节律紊乱列为2A类致癌物；长期23点后入睡与癌症风险显著相关'
  },
  {
    id: 'A2', dim: 'sleep', dimLabel: '睡眠作息',
    text: '周末闹钟响了，你会……',
    options: [
      { label: '秒起，生物钟比闹钟还准', value: 4, score: 2 },
      { label: '赖床10分钟然后起，适度赖床是人之常情', value: 3, score: 0.5 },
      { label: '按掉闹钟继续睡到中午，周末不睡等于没放假', value: 2, score: -1 },
      { label: '直接把闹钟关了，醒来已经是下午3点', value: 1, score: -2.5 }
    ],
    ref: '周末补觉无法逆转工作日睡眠不足的代谢损害（Depner 2019）'
  },
  {
    id: 'A3', dim: 'sleep', dimLabel: '睡眠作息',
    text: '睡前1小时你通常在干嘛？',
    options: [
      { label: '阅读/冥想/泡脚，优雅永不过时', value: 4, score: 2 },
      { label: '刷手机但会设个闹钟提醒自己该睡了', value: 3, score: 0.5 },
      { label: '刷短视频刷到凌晨，"再刷一个" × 100', value: 2, score: -1 },
      { label: '打游戏/追剧，眼睛闭上就算睡了', value: 1, score: -2 }
    ],
    ref: '蓝光抑制褪黑素分泌达50%+，延迟入睡时间平均30分钟'
  },
  {
    id: 'A4', dim: 'sleep', dimLabel: '睡眠作息',
    text: '你白天的精神状态怎么样？',
    options: [
      { label: '精力充沛，下午也不犯困', value: 4, score: 2 },
      { label: '偶尔犯困，一杯咖啡就能续上', value: 3, score: 0.5 },
      { label: '每天都困，靠冰美式和奶茶撑着', value: 2, score: -1 },
      { label: '随时能睡，开会开车都在犯困', value: 1, score: -2.5 }
    ],
    ref: '白天嗜睡ESS>10提示潜在睡眠呼吸暂停，未治疗者全因死亡风险↑2-3倍'
  },
  {
    id: 'A5', dim: 'sleep', dimLabel: '睡眠作息',
    text: '躺到床上后多久能睡着？',
    options: [
      { label: '10分钟以内，头碰枕头就着', value: 4, score: 2 },
      { label: '15-30分钟，需要翻几下', value: 3, score: 0.5 },
      { label: '经常30分钟以上，脑子里全是今天的事', value: 2, score: -1.5 },
      { label: '失眠专业户，数羊数到天亮', value: 1, score: -3 }
    ],
    ref: '慢性失眠与心血管疾病风险↑45%（Sofi 2014），与认知衰退加速相关'
  },

  // ========== 维度B：饮食营养（6题）==========
  {
    id: 'B1', dim: 'diet', dimLabel: '饮食营养',
    text: '你的主要"续命方式"是？',
    options: [
      { label: '均衡饮食，荤素搭配', value: 4, score: 2 },
      { label: '主要靠外卖活着，偶尔自己做饭', value: 3, score: 0 },
      { label: '奶茶+咖啡+泡面三件套', value: 2, score: -2 },
      { label: '吃不吃看缘分，饿了再说', value: 1, score: -3 }
    ],
    ref: '长期外卖钠摄入普遍超标2-3倍；含糖饮料每天1杯糖尿病风险↑26%'
  },
  {
    id: 'B2', dim: 'diet', dimLabel: '饮食营养',
    text: '你一周大概点几次外卖？',
    options: [
      { label: '基本不做饭，外卖养我', value: 1, score: -2.5 },
      { label: '每周3-5次，做饭太麻烦了', value: 2, score: -1 },
      { label: '每周1-2次，偶尔偷懒', value: 3, score: 1 },
      { label: '很少，基本自己做', value: 4, score: 2 }
    ],
    ref: '高温油炸产生丙烯酰胺（2A致癌物）和反式脂肪，加速动脉粥样硬化'
  },
  {
    id: 'B3', dim: 'diet', dimLabel: '饮食营养',
    text: '你的"快乐水"是什么？',
    options: [
      { label: '白开水/淡茶，朴素但健康', value: 4, score: 2 },
      { label: '奶茶每周1-2杯，偶尔犒劳自己', value: 3, score: 0.5 },
      { label: '每天至少一杯奶茶或咖啡续命', value: 2, score: -1.5 },
      { label: '奶茶当水喝，血液里流淌的是珍珠', value: 1, score: -3 }
    ],
    ref: '每天1杯含糖饮料2型糖尿病风险↑26%（Imperial College London）'
  },
  {
    id: 'B4', dim: 'diet', dimLabel: '饮食营养',
    text: '你吃蔬菜水果的情况？',
    options: [
      { label: '每天都吃够量，五颜六色', value: 4, score: 2 },
      { label: '吃一些，但没刻意凑够', value: 3, score: 0.5 },
      { label: '偶尔吃，水果还行蔬菜就算了', value: 2, score: -0.5 },
      { label: '蔬菜？那是什么？火锅里的肉片旁边的装饰吗？', value: 1, score: -2 }
    ],
    ref: '每天摄入800g蔬果与心血管死亡风险↓22%、预期寿命↑3.25年（Imperial College London）'
  },
  {
    id: 'B5', dim: 'diet', dimLabel: '饮食营养',
    text: '你吃早餐的习惯？',
    options: [
      { label: '每天吃，而且吃得像皇帝', value: 4, score: 2 },
      { label: '经常吃，但比较随意', value: 3, score: 0.5 },
      { label: '周末起不来就跳过', value: 2, score: -1 },
      { label: '早餐？不存在的，午饭就是第一顿', value: 1, score: -2 }
    ],
    ref: '规律吃早餐与心血管疾病风险↓14%、2型糖尿病风险↓26%相关'
  },
  {
    id: 'B6', dim: 'diet', dimLabel: '饮食营养',
    text: '你吃饭的口味？',
    options: [
      { label: '清淡为主，盐少油少', value: 4, score: 1.5 },
      { label: '适中，不特别重口', value: 3, score: 0 },
      { label: '偏重口，无辣不欢', value: 2, score: -1 },
      { label: '越咸越香，腌制品是我的最爱', value: 1, score: -2.5 }
    ],
    ref: '中国人均盐摄入约10.5g/天，远超WHO推荐5g；每减少1.75g盐收缩压降约5mmHg'
  },

  // ========== 维度C：运动体能（5题）==========
  {
    id: 'C1', dim: 'exercise', dimLabel: '运动体能',
    text: '你上次正经运动是什么时候？',
    options: [
      { label: '昨天/今天，运动就是我的日常', value: 5, score: 3 },
      { label: '这周，还能记得上次运动', value: 4, score: 1.5 },
      { label: '上个月？可能是赶公交那次', value: 3, score: 0 },
      { label: '想不起来了，运动是什么？', value: 2, score: -1.5 },
      { label: '运动？我走路去拿外卖就算运动了', value: 1, score: -3 }
    ],
    ref: 'WHO推荐每周≥150分钟中强度运动；满足者全因死亡风险↓31%（Arem 2015 NEJM）'
  },
  {
    id: 'C2', dim: 'exercise', dimLabel: '运动体能',
    text: '你有做力量训练吗？（深蹲/俯卧撑/撸铁）',
    options: [
      { label: '每周2次以上，健身房常客', value: 4, score: 2.5 },
      { label: '偶尔做做，在家跟着视频练', value: 3, score: 1 },
      { label: '俯卧撑是什么？我连引体向上都做不了', value: 2, score: 0 },
      { label: '力量训练？我最强的力量是按手机屏幕', value: 1, score: -1.5 }
    ],
    ref: '力量训练降低全因死亡率26%（Momma 2022 BJSM），维持骨密度和肌肉量'
  },
  {
    id: 'C3', dim: 'exercise', dimLabel: '运动体能',
    text: '你每天的活动量大概是？',
    options: [
      { label: '每天8000步以上，走路上班或主动遛弯', value: 4, score: 2 },
      { label: '5000-8000步，正常通勤水平', value: 3, score: 0.5 },
      { label: '3000步以下，能坐绝不站', value: 2, score: -1 },
      { label: '今天走了几步？从床到椅子到厕所，大概100步吧', value: 1, score: -2.5 }
    ],
    ref: '每多走1000步，全因死亡风险↓8%（Paluch 2022 JAMA）'
  },
  {
    id: 'C4', dim: 'exercise', dimLabel: '运动体能',
    text: '你在工位上一坐就是几个小时？',
    options: [
      { label: '很少超过1小时，会主动起来活动', value: 4, score: 1.5 },
      { label: '1-2小时会起身，还行', value: 3, score: 0.5 },
      { label: '3-5小时才想起来该活动了', value: 2, score: -1.5 },
      { label: '屁股焊在椅子上了，从早坐到晚', value: 1, score: -3 }
    ],
    ref: '久坐是独立于运动量的全因死亡风险因素；每天久坐>8小时+不运动风险与吸烟相当'
  },
  {
    id: 'C5', dim: 'exercise', dimLabel: '运动体能',
    text: '爬三层楼你会怎样？',
    options: [
      { label: '面不改色心不跳，小意思', value: 4, score: 2 },
      { label: '稍微有点喘，但能接受', value: 3, score: 0.5 },
      { label: '喘得厉害，心跳加速', value: 2, score: -1 },
      { label: '还没到二楼就已经在想为什么没有电梯', value: 1, score: -2.5 }
    ],
    ref: '心肺耐力（VO2max）每提高1 MET当量，全因死亡风险↓13%（Kodama 2009）'
  },

  // ========== 维度D：心理健康（10题）==========
  {
    id: 'D1', dim: 'mental', dimLabel: '心理健康',
    text: '明天有个大任务要交，现在已经是晚上10点了，你的状态是？',
    options: [
      { label: '心态稳如老狗，该睡就睡明天再说', value: 4, score: 2.5 },
      { label: '有点焦虑但能控制，理性规划时间', value: 3, score: 1 },
      { label: '已经开了三罐红牛，今晚不睡了', value: 2, score: -1 },
      { label: '一边焦虑一边刷手机，然后更焦虑了', value: 1, score: -3 }
    ],
    ref: '慢性压力加速海马体萎缩和端粒缩短（Epel 2004）'
  },
  {
    id: 'D2', dim: 'mental', dimLabel: '心理健康',
    text: '你最近一个月焦虑的频率？',
    options: [
      { label: '几乎没有，心态平和得像出家人', value: 4, score: 2.5 },
      { label: '偶尔，但不影响正常生活', value: 3, score: 1 },
      { label: '经常，有时候莫名其妙就开始焦虑', value: 2, score: -1.5 },
      { label: '每天都在焦虑，已经是一种生活方式了', value: 1, score: -3 }
    ],
    ref: '焦虑症老年男性7年随访全因死亡风险↑87%（Smith 2022）'
  },
  {
    id: 'D3', dim: 'mental', dimLabel: '心理健康',
    text: '看到朋友圈别人晒旅游/升职/买房，你会？',
    options: [
      { label: '看看就过，人家过得好跟我没关系', value: 4, score: 2 },
      { label: '有点酸但也就那样，刷过去就好', value: 3, score: 0.5 },
      { label: '内心os：凭什么他可以我不行……陷入emo', value: 2, score: -1 },
      { label: '直接关掉APP，开始怀疑人生', value: 1, score: -2.5 }
    ],
    ref: '频繁社会比较与抑郁/焦虑症状显著正相关（Appel 2016）'
  },
  {
    id: 'D4', dim: 'mental', dimLabel: '心理健康',
    text: '晚上躺床上准备睡了，你的脑子在干嘛？',
    options: [
      { label: '放空，秒睡型选手', value: 4, score: 2.5 },
      { label: '偶尔想想明天的事，很快就放下了', value: 3, score: 0.5 },
      { label: '自动复盘今天说过的每一句话，越想越尴尬', value: 2, score: -1.5 },
      { label: '疯狂内耗，各种emo想法涌上来，根本停不下来', value: 1, score: -3 }
    ],
    ref: '反刍思维是抑郁和焦虑的核心维持因素（Nolen-Hoeksema 2008）'
  },
  {
    id: 'D5', dim: 'mental', dimLabel: '心理健康',
    text: '工作/学习中突然遇到一个大挫折，你第一反应是？',
    options: [
      { label: '冷静分析，找出解决方案', value: 4, score: 2 },
      { label: '先骂几句发泄一下，然后想办法', value: 3, score: 0.5 },
      { label: '直接摆烂，逃避一会儿再说', value: 2, score: -1 },
      { label: '世界末日，整个人都不好了', value: 1, score: -2.5 }
    ],
    ref: '积极应对策略降低心血管事件风险30%（Chida 2008 Psychosom Med）'
  },
  {
    id: 'D6', dim: 'mental', dimLabel: '心理健康',
    text: '你觉得自己活得"有意义"吗？',
    options: [
      { label: '有明确目标，每天都有动力', value: 4, score: 2.5 },
      { label: '有些方向，虽然偶尔迷茫', value: 3, score: 1 },
      { label: '走一步看一步，意义是什么？', value: 2, score: -1 },
      { label: '经常觉得活着没意思，不知道为什么', value: 1, score: -3 }
    ],
    ref: 'Ikigai（生存意义）是蓝区百岁老人核心共性；有目标感者全因死亡率↓15%（Hill 2020 JAMA）'
  },
  {
    id: 'D7', dim: 'mental', dimLabel: '心理健康',
    text: '你身边有能说心里话的人吗？',
    options: [
      { label: '好几个，随时可以聊', value: 4, score: 2 },
      { label: '1-2个，关键时刻能找', value: 3, score: 0.5 },
      { label: '很少，怕麻烦别人', value: 2, score: -0.5 },
      { label: '没有，跟谁都说不上来', value: 1, score: -3 }
    ],
    ref: '长期孤独对健康的危害=每天吸15支烟（Holt-Lunstad 2015 Harvard）'
  },
  {
    id: 'D8', dim: 'mental', dimLabel: '心理健康',
    text: '你有多经常感到"身心俱疲"？',
    options: [
      { label: '很少，大部分时候精力充沛', value: 4, score: 2 },
      { label: '偶尔，周末充充电就好', value: 3, score: 0.5 },
      { label: '经常，每天都感觉被掏空', value: 2, score: -1.5 },
      { label: '一直如此，已经习惯了这种"活死人"状态', value: 1, score: -3 }
    ],
    ref: '慢性疲劳与全因死亡风险↑40%相关；长期"燃尽"状态加速端粒缩短'
  },
  {
    id: 'D9', dim: 'mental', dimLabel: '心理健康',
    text: '你对自己达不到目标时的态度？',
    options: [
      { label: '尽力就好，接受不完美', value: 4, score: 2 },
      { label: '有点小失望，但能调整', value: 3, score: 0.5 },
      { label: '会自我否定，觉得自己不行', value: 2, score: -1.5 },
      { label: '疯狂自我攻击，"你个傻逼怎么连这个都做不到"', value: 1, score: -3 }
    ],
    ref: '极度完美主义与抑郁、焦虑高度相关（Frost 1990）；自我慈悲训练可显著改善'
  },
  {
    id: 'D10', dim: 'mental', dimLabel: '心理健康',
    text: '你对未来的整体态度？',
    options: [
      { label: '很乐观，相信一切都会好', value: 4, score: 2.5 },
      { label: '谨慎乐观，有期待也有担忧', value: 3, score: 1 },
      { label: '不太确定，走着看吧', value: 2, score: -0.5 },
      { label: '悲观，觉得好不了了', value: 1, score: -3 }
    ],
    ref: '乐观者比悲观者平均多活11-15年（Levy 2002）'
  },

  // ========== 维度E：健康指标（3题）==========
  {
    id: 'E1', dim: 'indicator', dimLabel: '健康指标',
    text: '你知道自己的血压大概多少吗？',
    options: [
      { label: '正常（<120/80），定期量', value: 5, score: 2 },
      { label: '正常偏高，偶尔量量', value: 4, score: 1 },
      { label: '偏高/已确诊高血压', value: 3, score: -1 },
      { label: '从没量过，血压是什么？', value: 2, score: 0 },
      { label: '血压高得离谱但不管它', value: 1, score: -4 }
    ],
    ref: '高血压是全球第一大死亡风险因素，收缩压每升高20mmHg心血管死亡风险↑2倍'
  },
  {
    id: 'E2', dim: 'indicator', dimLabel: '健康指标',
    text: '你的BMI大概是多少？（体重÷身高²）',
    options: [
      { label: '18.5-23.9，标准身材', value: 5, score: 2 },
      { label: '24-27.9，微胖也是胖', value: 4, score: 0 },
      { label: '28以上，胖得有点离谱', value: 3, score: -3 },
      { label: '<18.5，太瘦了，风一吹就倒', value: 2, score: -1 },
      { label: '不知道，从没算过，也不想算', value: 1, score: 0 }
    ],
    ref: '肥胖(BMI≥30)与预期寿命减少约5-10年相关（Lancet 2016）'
  },
  {
    id: 'E3', dim: 'indicator', dimLabel: '健康指标',
    text: '你多久体检一次？',
    options: [
      { label: '每年都做，健康第一', value: 4, score: 2 },
      { label: '2-3年一次，想起来就做', value: 3, score: 0.5 },
      { label: '不舒服了才去，平时不管', value: 2, score: -0.5 },
      { label: '从不体检，怕查出什么来', value: 1, score: -2 }
    ],
    ref: '早期筛查使结直肠癌死亡率↓68%、乳腺癌↓25%；定期体检是预防医学基石'
  },

  // ========== 维度F：生活习惯（4题）==========
  {
    id: 'F1', dim: 'habit', dimLabel: '生活习惯',
    text: '你抽烟吗？（含电子烟）',
    options: [
      { label: '从不抽，二手烟都嫌呛', value: 5, score: 3 },
      { label: '已戒烟，恭喜我', value: 4, score: 2 },
      { label: '偶尔社交场合来一根', value: 3, score: -1 },
      { label: '每天一包，饭后一根赛神仙', value: 2, score: -5 },
      { label: '电子烟不算烟吧？（算的）', value: 1, score: -4 }
    ],
    ref: '吸烟平均减少寿命10年（Doll 2004 BMJ）；戒烟10年后风险接近不吸烟者'
  },
  {
    id: 'F2', dim: 'habit', dimLabel: '生活习惯',
    text: '你喝酒的频率？',
    options: [
      { label: '不喝或极少喝', value: 4, score: 2 },
      { label: '偶尔喝点，小酌怡情', value: 3, score: 0.5 },
      { label: '每周好几次，应酬多没办法', value: 2, score: -2 },
      { label: '不喝睡不着/不喝就难受', value: 1, score: -4 }
    ],
    ref: '2022 Lancet：任何量饮酒均增加心血管风险；全球酒精消费导致每年300万死亡（WHO 2018）'
  },
  {
    id: 'F3', dim: 'habit', dimLabel: '生活习惯',
    text: '你对熬夜的态度？',
    options: [
      { label: '到点就睡，绝不犹豫', value: 4, score: 2 },
      { label: '偶尔熬一下，但能收住', value: 3, score: 0 },
      { label: '经常熬夜，明知道不好但就是停不下来', value: 2, score: -1.5 },
      { label: '不熬夜的人生不完整，凌晨2点才是我的黄金时间', value: 1, score: -3 }
    ],
    ref: '长期昼夜节律紊乱与代谢综合征风险↑29%（He 2020），与多种癌症风险显著相关'
  },
  {
    id: 'F4', dim: 'habit', dimLabel: '生活习惯',
    text: '你每天喝几杯咖啡/奶茶？',
    options: [
      { label: '不喝或偶尔1杯', value: 4, score: 1 },
      { label: '每天1杯，提神必备', value: 3, score: 0.5 },
      { label: '每天2-3杯，靠咖啡因活着', value: 2, score: -0.5 },
      { label: '血液里的咖啡因浓度可能比血红蛋白还高', value: 1, score: -1.5 }
    ],
    ref: '适量咖啡（1-3杯/天）对健康无害甚至有益，但过量咖啡因干扰睡眠和焦虑水平'
  }
];

// 维度配置
const DIMENSIONS = {
  sleep:    { name: '睡眠作息', key: 'S', icon: '🌙' },
  diet:     { name: '饮食营养', key: 'D', icon: '🥗' },
  exercise: { name: '运动体能', key: 'E', icon: '🏃' },
  mental:   { name: '心理健康', key: 'M', icon: '🧠' },
  indicator:{ name: '健康指标', key: 'I', icon: '🫀' },
  habit:    { name: '生活习惯', key: 'F', icon: '🚬' }
};
