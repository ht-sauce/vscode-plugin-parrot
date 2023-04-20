import { computed, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { BaseProps, ComModel, VisaProductInfo } from '../types'
import { MaterialTypeEnum } from '@/views/product/tool'
import { CertTypeEnum } from '@/const/VisaServer'
import { DistributionType, OddEvenAuth, OddEvenAuthEnum } from '@/const/ProductServer/VisaAuth'
import { useGlobalStore } from '@/stores/global'
import type VisaProperty from './VisaProperty.vue'
import type ProductFeatures from './ProductFeatures.vue'
import type TransactFlowList from './TransactFlowList.vue'
import type StockCurrency from './StockCurrency.vue'

export type Emits = 'mainTitle' | 'countryId'

// 受理范围模板
export function acceptedScopeTem(certType: CertTypeEnum, acceptedScope = '') {
  if (certType === CertTypeEnum.visa)
    return `适用于【长期居住地】为【${acceptedScope ? acceptedScope : '受理范围'}】的申请者`
  else return `适用于【公证书开具地】为【${acceptedScope ? acceptedScope : '受理范围'}】的申请者`
}

export function useData2(props = {} as BaseProps) {
  const gStore = useGlobalStore()

  const visaOrAuthName = MaterialTypeEnum().keyJson[props.type]

  const VisaPropertyRef = ref<InstanceType<typeof VisaProperty> | null>(null) // 签证属性
  const ProductFeaturesRef = ref<InstanceType<typeof ProductFeatures> | null>(null)
  const TransactFlowListRef = ref<InstanceType<typeof TransactFlowList> | null>(null)
  const StockCurrencyRef = ref<InstanceType<typeof StockCurrency> | null>(null)

  const WxUser = ref<ComModel>({ label: gStore.userInfo.name, value: gStore.userInfo.id })
  // 部门
  const depValue = ref<ComModel>({})

  const formData = ref<VisaProductInfo>({
    certType: MaterialTypeEnum().strToKey[props.type],
    oddEvenAuth: OddEvenAuth.single,
    orgCompanyId: gStore.orgCompany?.orgCompanyId,
    orgCompanyName: gStore.orgCompany?.orgCompanyName,
    ownerId: gStore.userInfo.id,
    ownerName: gStore.userInfo.name,
    acceptedScope: acceptedScopeTem(MaterialTypeEnum().strToKey[props.type]),
    terminals: [], // 默认值在接口调用后处理
    distributionType: DistributionType.directSelling,
    // 预订须知写死数据格式
    instructions: {
      bookInstruction: {
        bookExplain: {
          // 预订说明的顺序为5
          selectedItems: '5',
          // 预订说明最终存入位置
          bookExplain: '',
        },
      },
    },
  })
  // 无校验规则需要展示星号
  const IrregularAsterisk: any = {
    required: true,
    validator: (rule: any, value: any, callback: any) => {
      callback()
    },
  }
  const formRef = ref<FormInstance | null>()
  const rules = ref<FormRules>({
    countryId: { required: true, message: '国家/地区不能为空', trigger: 'change' },
    consularDistrictId: { required: true, message: '领区不能为空', trigger: 'change' },
    secondCertTypeCode: {
      required: true,
      message: visaOrAuthName + '类型不能为空',
      trigger: 'change',
    },
    oddEvenAuth: { required: true, message: '认证不能为空', trigger: 'change' },
    mainTitle: { required: true, message: '产品名称不能为空', trigger: 'change' },
    ownerId: { required: true, message: '产品负责人不能为空', trigger: 'blur' },
    depCode: { required: true, message: '负责人部门不能为空', trigger: 'blur' },
    acceptedScope: { required: true, message: '受理范围不能为空', trigger: 'blur' },
    terminals: {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value || value.length < 1) return callback(new Error('请选择终端'))
        callback()
      },
    },
    distributionType: { required: true, message: '请选择是否共享到事业群', trigger: 'change' },
    visaProperty: IrregularAsterisk,
    // 预订须知
    instructionsBookExplain: {
      required: true,
      validator: (rule, value, callback) => {
        if (!formData.value.instructions?.bookInstruction.bookExplain.bookExplain)
          return callback(new Error(''))
        callback()
      },
    },
    // 办理流程
    transactFlowList: IrregularAsterisk,
  })

  // 主标题拼接展示
  const mainTitle = computed(() => {
    const { consularDistrictName, countryName, secondCertTypeName, certType, oddEvenAuth } =
      formData.value
    const addAuth = oddEvenAuth?.toString()
    const CountryName = countryName ?? '+国家/地区'
    const isVisaTxt = certType === CertTypeEnum.visa ? '签证' : '认证'
    const SecondCertTypeName = secondCertTypeName ?? `+${isVisaTxt}类型`

    if (certType === CertTypeEnum.visa) {
      const tit = `${consularDistrictName ? `【${consularDistrictName}送签】` : '【领区】'}${
        CountryName + SecondCertTypeName
      }`
      // 为主标题赋值
      if (consularDistrictName && countryName && secondCertTypeName) formData.value.mainTitle = tit

      return tit
    } else {
      const tit = `${consularDistrictName ? `【${consularDistrictName}】` : '【领区】'}${
        CountryName + SecondCertTypeName
      }${addAuth ? OddEvenAuthEnum().keyJson[addAuth] : '+单双证'}`
      // 为主标题赋值
      if (consularDistrictName && countryName && secondCertTypeName && addAuth)
        formData.value.mainTitle = tit

      return tit
    }
  })

  return {
    WxUser,
    depValue,
    visaOrAuthName,
    formData,
    formRef,
    rules,
    mainTitle,
    VisaPropertyRef,
    ProductFeaturesRef,
    TransactFlowListRef,
    StockCurrencyRef,
  }
}
