import vue from 'vue'
import { onnToInetyNine, oneToEighteen, oneToOneHundred, oneToThreeHundred } from '@/utils/validate'
import { tips, tipsFormat, nullErrorTips, delayTips } from '../../tool'
import { defEnum } from '../../pageConfig'
import { judgeIsPackageTour } from './utils'

// 国内外预定须知
export function reminderText(self) {
  const textOne =
    '1.每位游客都应遵守法律，恪守公德，讲究礼仪，爱护环境，尊重旅游目的地文化习俗。让我们携起手来，从我做起，从现在做起，从点滴做起，共同喊出口号“文明旅游我先行”。   \n' +
    '2.中国公民国内旅游文明行为公约：\n' +
    '营造文明、和谐的旅游环境，关系到每位游客的切身利益。做文明游客是我们大家的义务，请遵守以下公约："   \n' +
    '1）维护环境卫生。不随地吐痰和口香糖，不乱扔废弃物，不在禁烟场所吸烟。   \n' +
    '2）遵守公共秩序。不喧哗吵闹，排队遵守秩序，不并行挡道，不在公众场所高声交谈。   \n' +
    '3）保护生态环境。不踩踏绿地，不摘折花木和果实，不追捉、投打、乱喂动物。   \n' +
    '4）保护文物古迹。不在文物古迹上涂刻，不攀爬触摸文物，拍照摄像遵守规定。   \n' +
    '5）爱惜公共设施。不污损客房用品，不损坏公用设施，不贪占小便宜，节约用水用电，用餐不浪费。   \n' +
    '6）尊重别人权利。不强行和外宾合影，不对着别人打喷嚏，不长期占用公共设施，尊重服务人员的劳动，尊重各民族宗教习俗。   \n' +
    '7）讲究以礼待人。衣着整洁得体，不在公共场所袒胸赤膊；礼让老幼病残，礼让女士；不讲粗话。   \n' +
    '8）提倡健康娱乐。抵制封建迷信活动，拒绝黄、赌、毒。   \n' +
    '"3.旅途用餐节约倡议\n' +
    '“谁知盘中餐，粒粒皆辛苦。”日常的一粥一饭，旅途的一餐一饮，从我做起，珍惜粮食、光盘行动，厉行节约、反对浪费，世界那么大，祖国那么美，我们一起享受旅途中的美好“食”光。   \n'
  if (defEnum().notesAndInstructions.two === self.version) return textOne
  // 国内
  if (self.isDomestic) return textOne
  else
    return `1.出团通知。我社通常在出团前1-2个工作日召开行前说明会，请关注网站通知。若能提前确定，我们将会第一时间通知您。
2.意见反馈。我们非常重视您的意见和建议，《游客意见表》是我们判定旅游团服务质量的重要依据，请您如实填写《游客意见表》，感谢您留下宝贵的意见和建议，我们将不断改进工作，更好地为广大游客提供服务。
3.每位游客都应遵守法律，恪守公德，讲究礼仪，爱护环境，尊重旅游目的地文化习俗。让我们携起手来，从我做起，从现在做起，从点滴做起，让我们共同喊出口号“文明旅游我先行”。
4.中国公民出国（境）旅游文明行为指南
中国公民，出境旅游，注重礼仪，保持尊严。
讲究卫生，爱护环境；衣着得体，请勿喧哗。
尊老爱幼，助人为乐；女士优先，礼貌谦让。
出行办事，遵守时间；排队有序，不越黄线。
文明住宿，不损用品；安静用餐，请勿浪费。
健康娱乐，有益身心；赌博色情，坚决拒绝。
参观游览，遵守规定；习俗禁忌，切勿冒犯。
遇有疑难，咨询领馆；文明出行，一路平安。`
}

export default function useData(self) {
  const defSelCheck = self.isDomestic ? 1 : 0
  const formData = vue.observable({
    // 预订限制
    bookRestriction: {
      // 证件（国籍）限制
      credentials: {
        c_Checkbox: false,
        selectedItems: [],
        credentials: null,
        visa: 2,
        reason: 1,
        area: 1,
      },
      age: {
        c_Checkbox: false,
        selectedItems: [],
        minAge: null,
        maxAge: null,
        ageRange: { minAge: null, maxAge: null },
        maxAgeNotOccupiedBed: null,
        oldPeople: {
          age: null,
          ageForEntourage: null,
        },
        ageWithoutEntourage: null,
        tourismIntensity: {
          ageForOldPeople: null,
          ageForYoungPeople: null,
          minAgeForEntourage: null,
          maxAgeForEntourage: null,
        },
        tourismIntensityAge: null,
        serviceability: {
          ageForOldPeople: null,
          ageForYoungPeople: null,
          minAgeForEntourage: null,
          maxAgeForEntourage: null,
        },
        serviceabilityAge: null,
      },
      // 人群限制，额外处理
      crowd: {
        c_Checkbox: false,
      },
      // 预订限制新
      bookLimit: {
        c_Checkbox: false,
        selectedItems: [],
        bookInstruction: null,
      },

      // 单房差，额外处理
      singleSupplement: {
        c_Checkbox: false,
        selectedItems: '',
      },
      // 违约条款
      breachContractClause: {
        c_Checkbox: judgeIsPackageTour(self.type, self.info?.base),
        selectedItems: [],
        departureDateOne: null,
        costRateThree: null,
        additionalNote: null,
        // 默认至少一条数据
        costRateTOList: [
          {
            costRate: null,
            departureDateOne: null,
            departureDateTwo: null,
          },
        ],
      },
    },
    //	预订须知
    bookInstruction: {
      // 预订说明额外处理
      bookExplain: {
        c_Checkbox: false,
        selectedItems: [],
        bookExplain: null,
      },
      product: {
        c_Checkbox: false,
        selectedItems: [],
        touristAgency: null, // 旅行社名称
      },
      traffic: {
        c_Checkbox: false,
        selectedItems: [],
      },
      hotel: {
        c_Checkbox: false,
        selectedItems: [],
      },
      meal: {
        c_Checkbox: false,
        selectedItems: [],
        numbersOfDishes: null,
      },
      journeyArrangement: {
        c_Checkbox: false,
        selectedItems: [],
        trafficNote: '',

        guideServiceNote: '',

        journeyNote: '',
      },
      shopping: {
        c_Checkbox: false,
        selectedItems: [],
      },
      priceDifference: {
        c_Checkbox: false,
        selectedItems: [],
      },
      missionNotice: {
        c_Checkbox: false,
        selectedItems: [],
        day: null,
      },
      touristGroup: {
        c_Checkbox: false,
        selectedItems: [],
        minTourGroupSize: null,

        maxTourGroupSize: null,
      },
      flightChangeStatement: {
        c_Checkbox: false,
        selectedItems: [],
        flightChange: 1,
      },
      // 意见反馈(0未选,1选中)
      feedbackSelect: 0,
      reminder: {
        c_Checkbox: false,
        selectedItems: [],
        reminder: reminderText(self),
      }, // 温馨提示
    },
    // 签证须知
    visaInstruction: {
      visa: {
        c_Checkbox: false,
        selectedItems: [],
        cancelVisaStatement: '',
        visaWaiverCountry: '',
        additionalNote: '',
        childBookNote: '以及父母双方的其他材料',
      },
      visaWaiver: {
        c_Checkbox: false,
        selectedItems: [],
        stayTime: null,
        country: null,
        months: null,
        blankPages: null,
        workDay: null,
        photoNote: '',
        instructions: '',
      },
      landingVisa: {
        c_Checkbox: false,
        selectedItems: [],
        stayTime: null,
        country: null,
        months: null,
        blankPages: null,
        workDay: null,
        photoNote: null,
        instructions: null,
        boardingPassCountry: '', //  国家（登机牌）
        destinationCountry: '', // 抵达目的地国家
      },
    },
    // 安全须知
    safetyInstruction: {
      specialNotice: {
        c_Checkbox: self.isDomestic ? true : false,
        selectedItems: self.isDomestic ? ['1'] : [],
        specialNotice:
          '旅游者在旅游过程中坚持勤洗手、戴口罩等良好卫生习惯，携带常备感冒退烧药，做好自己健康的第一责任人，关注自身健康状况，如出现发热等健康异常情况，请立即通知团队组织者。增强安全意识和自我防控意识，遵守旅游活动中的安全警示规定，积极配合旅行社做好各项防控措施。',
      },

      personalSelect: 0, //人身安全（0未选,1选中）
      financialSelect: defSelCheck, // 财物安全（0未选,1选中）
      credentialsSelect: 0, // 证件安全（0未选,1选中）
      tourSelect: defSelCheck, // 游览安全（0未选,1选中）
      hotelSelect: defSelCheck, // 住宿安全（0未选,1选中）
      emergencySelect: defSelCheck, // 突发事件（0未选,1选中）
      dietMedicineSelect: defSelCheck, // 饮食和药品安全（0未选,1选中）

      preparationSelect: defSelCheck, // 出发前准备事项（0未选,1选中）
      trafficSelect: defSelCheck, //  交通安全（0未选,1选中）
      freeActivitySelect: defSelCheck, // 自由活动期间安全（0未选,1选中）
      highRiskSelect: 0, // 高危项目安全注意事项（0未选,1选中）
      selfDriveSelect: 0, // 自驾车安全注意事项（0未选,1选中）

      // 其他
      otherInstruction: {
        c_Checkbox: false,
        selectedItems: [],
        otherInstruction: null,
      },
    },
  })

  const bookRestrictionTxt = '预订限制'
  const breachContractClauseTxt = '违约条款'
  const bookInstructionTxt = '预订须知'
  const visaInstructionTxt = '签证须知'
  const safetyInstructionTxt = '安全须知'

  const titleJson = {
    bookRestriction: bookRestrictionTxt,
    bookInstruction: bookInstructionTxt,
    visaInstruction: visaInstructionTxt,
    safetyInstruction: safetyInstructionTxt,
  }

  // 小标题至少选中一项校验
  function smallAtLeastOne(pField, sField) {
    try {
      const value = self.formData[pField][sField]
      // 剔除空数据
      const selectedItems = value.selectedItems
      if (Array.isArray(selectedItems)) {
        const selItem = selectedItems.filter((li) => !!li)
        return value.c_Checkbox && selItem.length < 1
      } else {
        return value.c_Checkbox && selectedItems.length < 1
      }
    } catch (e) {
      console.log(pField, sField, e)
    }
  }
  // 大标题至少选中一项校验
  function bigAtLeastOne(field, customField = []) {
    try {
      for (const key in self.formData[field]) {
        // 有一项选择则通过
        // customField忽略的校验字段，一般会自定义额外校验
        if (!customField.includes(key) && self.formData[field][key].c_Checkbox) {
          console.warn('整体校验', field, key)
          return true
        }
      }
      return false // 默认一项都未选
    } catch (e) {
      console.warn(field, e)
    }
  }

  // 所有大项校验混合,只要其中一项为true即可
  const bigAllCheck = () => {
    const checkAll = () => {
      for (const key in self.formData.safetyInstruction) {
        const value = self.formData.safetyInstruction[key]
        if (['specialNotice', 'otherInstruction'].includes(key)) {
          if (value.c_Checkbox) return true
        } else {
          if (value == 1) return true
        }
      }
      return false
    }
    const { breachContractClause } = self.formData.bookRestriction

    // 预订限制
    const isBookRestriction = !bigAtLeastOne('bookRestriction', ['breachContractClause'])

    // 违约条款
    const isBreachContractClause = !breachContractClause.c_Checkbox

    // 预订须知 意见反馈的校验独立处理
    const isBookInstruction =
      !bigAtLeastOne('bookInstruction', ['feedbackSelect']) &&
      !self.formData.bookInstruction.feedbackSelect

    // 签证须知
    const isVisaInstruction = !bigAtLeastOne('visaInstruction')

    // 安全须知
    const isSafetyInstruction = !checkAll()

    const isAllCheck =
      isBookRestriction &&
      isBreachContractClause &&
      isBookInstruction &&
      isVisaInstruction &&
      isSafetyInstruction

    if (isAllCheck) {
      delayTips('须知&说明不能为空')
    }

    return isAllCheck
  }

  // 安全须知通用勾选校验
  const safetyInstructionCheckbox = (callback, field = '', title = '') => {
    const checkField = self.formData.safetyInstruction[field]
    if (self.isDomestic && checkField != 1)
      return tips(callback, tipsFormat(safetyInstructionTxt, title).small4)
    callback()
  }

  const rules = vue.observable({
    // 对所有大项校验整合在一起，避免页面输入框报红色
    bigCheckAll: [
      {
        trigger: 'noblur',
        validator: (rule, value, callback) => {
          if (bigAllCheck()) return nullErrorTips(callback)

          // 循环校验
          const loopCheck = (pField, loopJson) => {
            let too = true
            for (const key in loopJson) {
              if (smallAtLeastOne(pField, key)) {
                too = false
                tips(callback, tipsFormat(titleJson[pField], loopJson[key]).small)
              }
            }
            return too
          }

          // 预订限制
          const bookRestrictionTitle = {
            credentials: '证件（国籍）限制',
            age: '年龄限制',
            // crowd: '人群限制',
            bookLimit: '预订限制',
            singleSupplement: '单房差',
            // breachContractClause: '违约条款',
          }
          //	预订须知
          const bookInstructionTitle = {
            bookExplain: '预订说明',
            product: '产品说明',
            traffic: '交通说明',
            hotel: '住宿说明',
            meal: '用餐说明',
            journeyArrangement: '行程安排说明',
            shopping: '购物说明',
            priceDifference: '差价说明',
            missionNotice: '出游通知',
            touristGroup: '成团说明',
            flightChangeStatement: '航班变动申明',
            feedbackSelect: '意见反馈',
            reminder: '温馨提示',
          }
          // 签证须知
          const visaInstructionTitle = {
            visa: '签证须知',
            visaWaiver: '免签',
            landingVisa: '落地签',
          }
          // 安全须知
          const safetyInstructionTitle = {
            specialNotice: '特别提示',
            // personalSelect: '人身安全',
            // financialSelect: '财物安全',
            // credentialsSelect: '证件安全',
            // tourSelect: '游览安全',
            // hotelSelect: '住宿安全',
            // dietMedicineSelect: '饮食和药品安全',
            // emergencySelect: '突发事件',
            otherInstruction: '其他',
          }

          // 违约条款特殊处理
          const checkBreachContractClause = () => {
            if (smallAtLeastOne('bookRestriction', 'breachContractClause')) {
              tips(callback, tipsFormat('违约条款').big)
              return false
            }

            return true
          }

          if (
            !loopCheck('bookRestriction', bookRestrictionTitle) ||
            !checkBreachContractClause() ||
            !loopCheck('bookInstruction', bookInstructionTitle) ||
            !loopCheck('visaInstruction', visaInstructionTitle) ||
            !loopCheck('safetyInstruction', safetyInstructionTitle)
          )
            return null

          callback()
        },
      },
    ],
    // 违约条款
    'breachContractClause-departureDateOne': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '违约条款'
          const { c_Checkbox, departureDateOne } =
            self.formData.bookRestriction.breachContractClause

          if (judgeIsPackageTour(self.type, self.info?.base) && !c_Checkbox) {
            return tips(callback, tipsFormat(breachContractClauseTxt, samllTitle).small3 + '必选')
          }

          if ((c_Checkbox || departureDateOne) && !oneToThreeHundred(departureDateOne))
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '请输入1-300数字',
            )

          callback()
        },
      },
    ],
    // 表单数组校验方式
    'breachContractClaus-costRateTOList-departureDateOne': {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const samllTitle = '违约条款'
        const { departureDateOne, selectedItems, costRateTOList } =
          self.formData.bookRestriction.breachContractClause

        // 从规则中获取index值
        const index = Number(rule.field.split('.').splice(-2)[0])

        if (selectedItems.includes('1') || value) {
          if (!value)
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '请输入1-300数字',
            )

          if (!oneToThreeHundred(value))
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '请输入1-300数字',
            )

          // 第一行的第一个输入框的日期不能大于最开始的第一个输入框
          if (Number(value) > Number(departureDateOne))
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '违约条款的内容填写错误',
            )
          // 校验上一行
          if (
            index > 0 &&
            Number(costRateTOList[index].departureDateOne) >=
              Number(costRateTOList[index - 1].departureDateTwo)
          )
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '违约条款的内容填写错误',
            )
        }
        callback()
      },
    },
    // 表单数组校验方式
    'breachContractClaus-costRateTOList-departureDateTwo': {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const samllTitle = '违约条款'
        const { selectedItems, costRateTOList } = self.formData.bookRestriction.breachContractClause

        // 从规则中获取index值
        const index = Number(rule.field.split('.').splice(-2)[0])

        if (selectedItems.includes('1') || value) {
          if (!value)
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '请输入1-300数字',
            )

          if (!oneToThreeHundred(value))
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '请输入1-300数字',
            )

          // 后输入框不能大于前面输入框
          const { departureDateOne } = costRateTOList[index]

          // 当前行
          if (Number(value) > Number(departureDateOne))
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '违约条款的内容填写错误',
            )
        }

        callback()
      },
    },
    // 表单数组校验方式
    'breachContractClaus-costRateTOList-costRate': {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const samllTitle = '违约条款'
        const { selectedItems } = self.formData.bookRestriction.breachContractClause

        if ((selectedItems.includes('1') || value) && !oneToOneHundred(value)) {
          if (!value)
            return tips(
              callback,
              tipsFormat(breachContractClauseTxt, samllTitle).small3 + '请输入1-100数字',
            )
        }

        callback()
      },
    },
    'breachContractClause-costRateThree': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '违约条款'
          const { costRateThree, selectedItems } =
            self.formData.bookRestriction.breachContractClause

          if ((costRateThree || selectedItems.includes('2')) && !oneToOneHundred(costRateThree)) {
            if (!value)
              return tips(
                callback,
                tipsFormat(breachContractClauseTxt, samllTitle).small3 + '请输入1-100数字',
              )
          }

          callback()
        },
      },
    ],
    'breachContractClause-additionalNote': {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const samllTitle = '违约条款'
        const { additionalNote, selectedItems } = self.formData.bookRestriction.breachContractClause

        if (selectedItems.includes('3') && !additionalNote) {
          return tips(callback, tipsFormat(breachContractClauseTxt, samllTitle).small2)
        }

        callback()
      },
    },
    // -------------预订限制-------------
    credentials: [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '证件（国籍）限制'
          const { selectedItems, credentials } = self.formData.bookRestriction.credentials

          if (selectedItems.includes('1') && !credentials) {
            return tips(callback, tipsFormat(bookRestrictionTxt, samllTitle).small2)
          }

          callback()
        },
      },
    ],
    'age-minAge': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, minAge } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          if (minAge || selectedItems.includes('1')) {
            if (!onnToInetyNine(minAge)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-maxAge': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, maxAge } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          if (maxAge || selectedItems.includes('2')) {
            if (!onnToInetyNine(maxAge)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-ageRange-minAge': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, ageRange } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const checkText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '最低数字不能大于最高数字'
          if (ageRange.minAge || selectedItems.includes('12')) {
            if (!onnToInetyNine(ageRange.minAge)) return tips(callback, onnToInetyNineText)
            if (ageRange.maxAge && ageRange.minAge && ageRange.maxAge < ageRange.minAge)
              return tips(callback, checkText)
          }

          callback()
        },
      },
    ],
    'age-ageRange-maxAge': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, ageRange } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'
          const checkText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '最低数字不能大于最高数字'
          if (ageRange.maxAge || selectedItems.includes('12')) {
            if (!onnToInetyNine(ageRange.maxAge)) return tips(callback, onnToInetyNineText)
            if (ageRange.maxAge && ageRange.minAge && ageRange.maxAge < ageRange.minAge)
              return tips(callback, checkText)
          }

          callback()
        },
      },
    ],
    'age-maxAgeNotOccupiedBed': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, maxAgeNotOccupiedBed } = self.formData.bookRestriction.age

          if (maxAgeNotOccupiedBed || selectedItems.includes('4')) {
            if (!oneToEighteen(maxAgeNotOccupiedBed))
              return tips(
                callback,
                tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入0~18（不含）以内的整数',
              )
          }

          callback()
        },
      },
    ],
    'age-oldPeople-age': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, oldPeople } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          if (oldPeople.age || selectedItems.includes('5')) {
            if (!onnToInetyNine(oldPeople.age)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-oldPeople-ageForEntourage': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, oldPeople } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          if (oldPeople.ageForEntourage || selectedItems.includes('5')) {
            if (!onnToInetyNine(oldPeople.ageForEntourage))
              return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-ageWithoutEntourage': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, ageWithoutEntourage } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          if (ageWithoutEntourage || selectedItems.includes('6')) {
            if (!onnToInetyNine(ageWithoutEntourage)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-tourismIntensity-ageForOldPeople': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, tourismIntensity } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { ageForOldPeople } = tourismIntensity

          if (ageForOldPeople || selectedItems.includes('7')) {
            if (!onnToInetyNine(ageForOldPeople)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-tourismIntensity-ageForYoungPeople': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, tourismIntensity } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { ageForYoungPeople } = tourismIntensity

          if (ageForYoungPeople || selectedItems.includes('7')) {
            if (!onnToInetyNine(ageForYoungPeople)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-tourismIntensity-minAgeForEntourage': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, tourismIntensity } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { minAgeForEntourage } = tourismIntensity

          if (minAgeForEntourage || selectedItems.includes('7')) {
            if (!onnToInetyNine(minAgeForEntourage)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-tourismIntensity-maxAgeForEntourage': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, tourismIntensity } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { maxAgeForEntourage } = tourismIntensity

          if (maxAgeForEntourage || selectedItems.includes('7')) {
            if (!onnToInetyNine(maxAgeForEntourage)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-tourismIntensityAge': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, tourismIntensityAge } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          if (tourismIntensityAge || selectedItems.includes('9')) {
            if (!onnToInetyNine(tourismIntensityAge)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-serviceability-ageForOldPeople': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, serviceability } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { ageForOldPeople } = serviceability
          if (ageForOldPeople || selectedItems.includes('10')) {
            if (!onnToInetyNine(ageForOldPeople)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-serviceability-ageForYoungPeople': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, serviceability } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { ageForYoungPeople } = serviceability
          if (ageForYoungPeople || selectedItems.includes('10')) {
            if (!onnToInetyNine(ageForYoungPeople)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-serviceability-minAgeForEntourage': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, serviceability } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { minAgeForEntourage } = serviceability
          if (minAgeForEntourage || selectedItems.includes('10')) {
            if (!onnToInetyNine(minAgeForEntourage)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-serviceability-maxAgeForEntourage': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, serviceability } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          const { maxAgeForEntourage } = serviceability
          if (maxAgeForEntourage || selectedItems.includes('10')) {
            if (!onnToInetyNine(maxAgeForEntourage)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'age-serviceabilityAge': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '年龄限制'
          const { selectedItems, serviceabilityAge } = self.formData.bookRestriction.age

          const onnToInetyNineText =
            tipsFormat(bookRestrictionTxt, samllTitle).small3 + '请输入1-99数字'

          if (serviceabilityAge || selectedItems.includes('11')) {
            if (!onnToInetyNine(serviceabilityAge)) return tips(callback, onnToInetyNineText)
          }

          callback()
        },
      },
    ],
    'bookRestriction-bookLimit-bookInstruction': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const { selectedItems, bookInstruction } = self.formData.bookRestriction.bookLimit

          if (selectedItems.includes('3') && !bookInstruction) {
            return tips(callback, tipsFormat(bookRestrictionTxt, '预订限制').small2)
          }

          callback()
        },
      },
    ],
    'bookInstruction-bookExplain-bookExplain': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const { selectedItems, bookExplain } = self.formData.bookInstruction.bookExplain

          if (selectedItems.includes('5') && !bookExplain) {
            return tips(callback, tipsFormat(bookInstructionTxt, '预订说明').small2)
          }

          callback()
        },
      },
    ],
    //	预订须知
    'product-touristAgency': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '产品说明'

          const { selectedItems, touristAgency, c_Checkbox } = self.formData.bookInstruction.product

          if (judgeIsPackageTour(self.type, self.info?.base) && !c_Checkbox) {
            return tips(callback, tipsFormat(bookInstructionTxt, samllTitle).small3 + '必选')
          }

          if (selectedItems.includes('2')) {
            if (!touristAgency)
              return tips(callback, tipsFormat(bookInstructionTxt, samllTitle).small2)
          }

          callback()
        },
      },
    ],
    'meal-numbersOfDishes': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '用餐说明'

          const { selectedItems, numbersOfDishes } = self.formData.bookInstruction.meal
          if ((numbersOfDishes || selectedItems.includes('1')) && !onnToInetyNine(numbersOfDishes))
            return tips(
              callback,
              tipsFormat(bookInstructionTxt, samllTitle).small3 + '请输入1-99数字',
            )

          callback()
        },
      },
    ],
    'missionNotice-day': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '出游通知'

          const { selectedItems, day } = self.formData.bookInstruction.missionNotice
          // 输入框校验待书写
          if ((selectedItems.includes('1') || day) && !onnToInetyNine(day)) {
            return tips(
              callback,
              tipsFormat(bookInstructionTxt, samllTitle).small3 + '请输入1-99数字',
            )
          }

          callback()
        },
      },
    ],
    'touristGroup-minTourGroupSize': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '成团说明'

          const { selectedItems, minTourGroupSize, c_Checkbox } =
            self.formData.bookInstruction.touristGroup

          // 境外 && 跟团游 必填
          if (judgeIsPackageTour(self.type, self.info?.base) && !c_Checkbox) {
            return tips(callback, tipsFormat(bookInstructionTxt, samllTitle).small3 + '必选')
          }

          // 输入框校验待书写
          if (
            (selectedItems.includes('1') || minTourGroupSize) &&
            !onnToInetyNine(minTourGroupSize)
          )
            return tips(
              callback,
              tipsFormat(bookInstructionTxt, samllTitle).small3 + '请输入1-99数字',
            )

          callback()
        },
      },
    ],
    'touristGroup-maxTourGroupSize': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '成团说明'

          const { selectedItems, maxTourGroupSize } = self.formData.bookInstruction.touristGroup

          if (
            (selectedItems.includes('4') || maxTourGroupSize) &&
            !onnToInetyNine(maxTourGroupSize)
          )
            return tips(
              callback,
              tipsFormat(bookInstructionTxt, samllTitle).small3 + '请输入1-99数字',
            )

          callback()
        },
      },
    ],
    reminder: [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '温馨提示'

          const { selectedItems, reminder } = self.formData.bookInstruction.reminder
          if (selectedItems.includes('1') && !reminder)
            return tips(callback, tipsFormat(bookInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
    // 签证须知
    'visa-cancelVisaStatement': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '签证须知'
          const { selectedItems, cancelVisaStatement } = self.formData.visaInstruction.visa

          if (selectedItems.includes('3') && !cancelVisaStatement)
            return tips(callback, tipsFormat(visaInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
    'visa-visaWaiverCountry': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '签证须知'
          const { selectedItems, visaWaiverCountry } = self.formData.visaInstruction.visa

          if (selectedItems.includes('6') && !visaWaiverCountry)
            return tips(callback, tipsFormat(visaInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
    'visa-childBookNote': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '签证须知'
          const { selectedItems, childBookNote } = self.formData.visaInstruction.visa

          if (selectedItems.includes('9') && !childBookNote)
            return tips(callback, tipsFormat(visaInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
    'visa-additionalNote': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '签证须知'
          const { selectedItems, additionalNote } = self.formData.visaInstruction.visa

          if (selectedItems.includes('11') && !additionalNote)
            return tips(callback, tipsFormat(visaInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
    'visaWaiver-country': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '免签'

          const { selectedItems, country } = self.formData.visaInstruction.visaWaiver

          if (selectedItems.includes('1')) {
            if (!country)
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入国家',
              )
          }

          callback()
        },
      },
    ],
    'visaWaiver-stayTime': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '免签'

          const { selectedItems, stayTime } = self.formData.visaInstruction.visaWaiver

          if (stayTime || selectedItems.includes('1')) {
            if (!onnToInetyNine(stayTime))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'visaWaiver-months': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '免签'

          const { selectedItems, months } = self.formData.visaInstruction.visaWaiver

          if (months || selectedItems.includes('1')) {
            if (!onnToInetyNine(months))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'visaWaiver-blankPages': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '免签'

          const { selectedItems, blankPages } = self.formData.visaInstruction.visaWaiver

          if (blankPages || selectedItems.includes('1')) {
            if (!onnToInetyNine(blankPages))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'visaWaiver-workDay': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '免签'

          const { selectedItems, workDay } = self.formData.visaInstruction.visaWaiver

          if (workDay || selectedItems.includes('1')) {
            if (!onnToInetyNine(workDay))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'visaWaiver-photoNote': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '免签'

          const { selectedItems, photoNote } = self.formData.visaInstruction.visaWaiver

          if (selectedItems.includes('1')) {
            if (!photoNote)
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 +
                  '请输入说明照片尺寸（如需照片）及其他材料',
              )
          }

          callback()
        },
      },
    ],
    'visaWaiver-instructions': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '免签'

          const { selectedItems, instructions } = self.formData.visaInstruction.visaWaiver

          if (selectedItems.includes('2') && !instructions) {
            return tips(callback, tipsFormat(visaInstructionTxt, samllTitle).small2)
          }

          callback()
        },
      },
    ],
    'landingVisa-country': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, country } = self.formData.visaInstruction.landingVisa

          if (selectedItems.includes('1')) {
            if (!country)
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入国家',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-boardingPassCountry': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, boardingPassCountry } = self.formData.visaInstruction.landingVisa

          if (selectedItems.includes('1')) {
            if (!boardingPassCountry)
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入国家、目的地',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-destinationCountry': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, destinationCountry } = self.formData.visaInstruction.landingVisa

          if (selectedItems.includes('1')) {
            if (!destinationCountry)
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入国家、目的地',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-stayTime': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, stayTime } = self.formData.visaInstruction.landingVisa

          if (stayTime || selectedItems.includes('1')) {
            if (!onnToInetyNine(stayTime))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-months': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, months } = self.formData.visaInstruction.landingVisa

          if (months || selectedItems.includes('1')) {
            if (!onnToInetyNine(months))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-blankPages': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, blankPages } = self.formData.visaInstruction.landingVisa

          if (blankPages || selectedItems.includes('1')) {
            if (!onnToInetyNine(blankPages))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-workDay': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, workDay } = self.formData.visaInstruction.landingVisa

          if (workDay || selectedItems.includes('1')) {
            if (!onnToInetyNine(workDay))
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 + '请输入1-99数字',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-photoNote': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, photoNote } = self.formData.visaInstruction.landingVisa

          if (selectedItems.includes('1')) {
            if (!photoNote)
              return tips(
                callback,
                tipsFormat(visaInstructionTxt, samllTitle).small3 +
                  '请输入说明照片尺寸（如需照片）及其他材料',
              )
          }

          callback()
        },
      },
    ],
    'landingVisa-instructions': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '落地签'
          const { selectedItems, instructions } = self.formData.visaInstruction.landingVisa

          if (selectedItems.includes('2') && !instructions)
            return tips(callback, tipsFormat(visaInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
    // 安全须知
    'specialNotice-specialNotice': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '特别提示'

          const { selectedItems, specialNotice } = self.formData.safetyInstruction.specialNotice
          // 国内版特别提示必填
          if (self.isDomestic && !selectedItems.includes('1')) {
            return tips(callback, tipsFormat(safetyInstructionTxt, samllTitle).small4)
          }
          if (selectedItems.includes('1') && !specialNotice)
            return tips(callback, tipsFormat(safetyInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
    // 出发前准备事项
    'safetyInstruction-preparationSelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'preparationSelect', '出发前准备事项')
        },
      },
    ],
    // 交通安全
    'safetyInstruction-trafficSelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'trafficSelect', '交通安全')
        },
      },
    ],
    // 财物安全
    'safetyInstruction-financialSelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'financialSelect', '财物安全')
        },
      },
    ],
    // 游览安全
    'safetyInstruction-tourSelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'tourSelect', '游览安全')
        },
      },
    ],
    // 住宿安全
    'safetyInstruction-hotelSelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'hotelSelect', '住宿安全')
        },
      },
    ],
    // 饮食和药品安全
    'safetyInstruction-dietMedicineSelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'dietMedicineSelect', '饮食和药品安全')
        },
      },
    ],
    //自由活动期间安全
    'safetyInstruction-freeActivitySelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'freeActivitySelect', '自由活动期间安全')
        },
      },
    ],
    // 突发事件
    'safetyInstruction-emergencySelect': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          safetyInstructionCheckbox(callback, 'emergencySelect', '突发事件')
        },
      },
    ],
    // 最后其他输入项控制
    'otherInstruction-otherInstruction': [
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const samllTitle = '其他'

          const { selectedItems, otherInstruction } =
            self.formData.safetyInstruction.otherInstruction

          if (selectedItems.includes('1') && !otherInstruction)
            return tips(callback, tipsFormat(safetyInstructionTxt, samllTitle).small2)

          callback()
        },
      },
    ],
  })

  return {
    formData,
    rules,
  }
}
