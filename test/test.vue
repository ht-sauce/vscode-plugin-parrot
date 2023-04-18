<script lang="ts" setup>
import ContentWrapper from '../ContentWrapper/index.vue'
import PrepareMaterials from '../PrepareMaterials/index.vue'
import {
  provide,
  ref,
  computed,
  defineProps,
  withDefaults,
  watch,
  reactive,
  toRefs,
  defineEmits,
  onUnmounted,
} from 'vue'
import BatchHandleVisaDialog from '../BatchHandleVisaDialog/index'
import PeopleTab from '../PeopleTab/index.vue'
import VisaNameTab from '../VisaNameTab/index.vue'
import GiveVisa from '../GiveVisa/index.vue'
import FeedBack from '../FeedBack/index.vue'
import DestroyVisa from '../DestroyVisa/index.vue'
import StopVisa from '../StopVisa/index.vue'
import { visaProgressEnum } from '@/const/VisaServer'
import { buttonEnum, getButtonList } from '../enum'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { jumpToNbsPage } from '@/utils/tool'
import ConfirmServer from '@/services/ConfirmServer/index'
import { i18n } from '@/i18n'

const router = useRouter()
const prepareMaterialsRef: any = ref(null)
const batchHandleVisa: any = ref(null)
const peopleList: any = ref([]) // 当前人员列表
const visaList: any = ref([])
const allPeopleList: any = ref([]) // 所有用户列表
const emit = defineEmits(['refresh'])

const state: any = reactive({
  userId: '', // 用户id
  resourceId: '', // 资源id
  materialCollectEndDate: '', // 材料截止日期
  resourceType: '', // 资源类型
  visaTabActive: 0, // 当前资源tab index值
  userVisaDetail: null, // 用户详情
  interviewType: '', // 产品面试类型
  subStatus: '', // 签证状态
  currentIndex: 0,
  visaProgressEnums: visaProgressEnum(),
  visaDetailStageMaxSubStatusToList: [], // 当前送签人的状态，需要展示的模块 1:准备材料 2: 送签 3：反馈结果 4：销签 5：中止送签
  buttonList: [],
  workFormId: '', // 确认单id
})

interface Props {
  info: any
  manageVisaUserType: any
  resourceId: any
  applicantId: any
  orderId: any
}

const props = withDefaults(defineProps<Props>(), {
  info: {},
  manageVisaUserType: 0,
  resourceId: '',
  applicantId: '',
  orderId: '',
})

provide(
  'info',
  computed(() => props.info),
)
// 用户操作类型
provide(
  'manageVisaUserType',
  computed(() => props.manageVisaUserType),
)
provide(
  'resourceId',
  computed(() => state.resourceId),
)
// 监听info
watch(
  () => props.info,
  (newItem: any) => {
    if (!newItem) return null
    console.log(props.info, ' info info')
    const { resourceDetailList } = newItem
    // 所有人员切换列表
    allPeopleList.value = resourceDetailList.reduce((pre: any, cur: any) => {
      const list = cur.applicantList.map((item: any) => {
        return {
          name: item.applicant,
          id: item.applicantId,
          statusName: item.subStatusName,
          subStatus: item.subStatus,
          resourceId: cur.resourceId,
          resourceName: cur.resourceName,
          materialCollectEndDate: item.materialCollectEndDate, // 截止日期
          interviewType: cur.interviewType,
        }
      })
      pre.push(...list)
      return pre
    }, [])
    // 签证资源tab列表
    visaList.value = allPeopleList.value.reduce((pre: any, cur: any) => {
      const resourceArr = pre.map((item: any) => item.resourceId)
      // 资源不同，表示不同的资源tab
      if (!resourceArr.includes(cur.resourceId)) {
        pre.push({
          resourceName: cur.resourceName,
          resourceId: cur.resourceId,
          materialCollectEndDate: cur.materialCollectEndDate,
          interviewType: cur.interviewType,
        })
      } else {
        //资源相同，表示不同的收取材料日期
        const sameResource = allPeopleList.value.filter(
          (item: any) => item.resourceId === cur.resourceId,
        ) // 相同资源
        const preDate = pre.map((item: any) => item.materialCollectEndDate)
        sameResource.forEach((item: any) => {
          if (!preDate.includes(item.materialCollectEndDate)) {
            pre.push({
              resourceName: cur.resourceName,
              resourceId: cur.resourceId,
              materialCollectEndDate: cur.materialCollectEndDate,
              interviewType: cur.interviewType,
            })
          }
        })
      }
      return pre
    }, [])
    // 获取当前资源下的人员列表
    if (props.resourceId) state.resourceId = props.resourceId
    if (props.applicantId) state.userId = props.applicantId
    if (props.resourceId) {
      const currentResource = visaList.value.find(
        (item: any) => item.resourceId == state.resourceId,
      )
      const { materialCollectEndDate, interviewType } = currentResource
      state.interviewType = interviewType
      state.materialCollectEndDate = materialCollectEndDate || ''
      peopleList.value = allPeopleList.value.filter(
        (item: any) =>
          item.resourceId == state.resourceId &&
          item.materialCollectEndDate == materialCollectEndDate,
      )
      updateUserDetail(state.userId)
      state.currentIndex = peopleList.value.findIndex((item: any) => item.id == state.userId) || 0
      state.visaTabActive =
        visaList.value.findIndex((item: any) => item.resourceId == state.resourceId) || 0
    } else {
      if (!state.resourceId) {
        const [firstResource] = visaList.value
        const { resourceId, materialCollectEndDate, interviewType } = firstResource
        state.resourceId = resourceId
        state.interviewType = interviewType
        state.materialCollectEndDate = materialCollectEndDate
        peopleList.value = allPeopleList.value.filter(
          (item: any) =>
            item.resourceId == resourceId && item.materialCollectEndDate == materialCollectEndDate,
        )
        const [firstPeople] = peopleList.value
        state.userId = firstPeople.id
        updateUserDetail(state.userId)
      } else {
        const currentResource = visaList.value.find(
          (item: any) => item.resourceId == state.resourceId,
        )
        const { materialCollectEndDate, interviewType } = currentResource
        state.interviewType = interviewType
        state.materialCollectEndDate = materialCollectEndDate || ''
        peopleList.value = allPeopleList.value.filter(
          (item: any) =>
            item.resourceId == state.resourceId &&
            item.materialCollectEndDate == materialCollectEndDate,
        )
        updateUserDetail(state.userId)
      }
      state.currentIndex = peopleList.value.findIndex((item: any) => item.id == state.userId) || 0
      state.visaTabActive =
        visaList.value.findIndex((item: any) => item.resourceId == state.resourceId) || 0
    }
    showConfirmDialog()
  },
  { deep: true, immediate: true },
)
// 获取确认单详情id
async function getConfirmId(id: any) {
  try {
    const result = await ConfirmServer.getConfirmId({ id })
    state.workFormId = result.workformId
  } catch (err) {
    console.log(err)
  }
}
async function showConfirmDialog() {
  try {
    const subStatusList = peopleList.value.map((item: any) => item.subStatus)
    const { requirementId } = props.info
    if (subStatusList.includes(state.visaProgressEnums.alreadySendVisa)) {
      const allTrue = subStatusList.some(
        (item: any) => item != state.visaProgressEnums.alreadySendVisa,
      )
      if (!allTrue) {
        await getConfirmId(requirementId)
        ElMessageBox.alert(i18n.global.t('visa.visaDetail.147707-0'), {
          callback: async (action: any) => {
            if (action === 'confirm') {
              jumpToNbsPage('/confirm/confirm/handle', {
                id: state.workFormId,
              })
            }
          },
        })
      }
    }
    if (subStatusList.includes(state.visaProgressEnums.alreadySendTransact)) {
      const allTrue = subStatusList.some(
        (item: any) => item != state.visaProgressEnums.alreadySendTransact,
      )
      if (!allTrue) {
        await getConfirmId(requirementId)
        ElMessageBox.alert(i18n.global.t('visa.visaDetail.147707-1'), {
          callback: async (action: any) => {
            if (action === 'confirm') {
              jumpToNbsPage('/confirm/confirm/handle', {
                id: state.workFormId,
              })
            }
          },
        })
      }
    }
  } catch (error) {
    console.log('🚀 ~ file: index.vue:204 ~ showConfirmDialog ~ error', error)
  }
}

// 监听人员id
watch(
  () => state.userId,
  (newUserId) => {
    updateUserDetail(newUserId)
  },
  { deep: true },
)
// 更新当前人信息
function updateUserDetail(newUserId: any) {
  console.log(newUserId, 'newUserId')
  const { resourceDetailList } = props.info
  const current = resourceDetailList.find((item: any) => item.resourceId === state.resourceId)
  state.userVisaDetail = current.applicantList.find((item: any) => item.applicantId == newUserId)
  state.subStatus = state.userVisaDetail.subStatus
  // 获取当前人展示的模块
  state.visaDetailStageMaxSubStatusToList =
    state.userVisaDetail.visaDetailStageMaxSubStatusToList?.map((item: any) => item.visaStage) || []
  state.buttonList = getButtonList(
    true,
    state.subStatus,
    props.manageVisaUserType,
    buttonEnum,
    current.resourceType,
  )
}
// 监听资源id以及收取材料截止日期
watch([() => state.materialCollectEndDate, () => state.resourceId], ([newDate, newResourceId]) => {
  if (newDate && newResourceId) {
    const { resourceDetailList } = props.info
    const current = resourceDetailList.find((item: any) => item.resourceId === state.resourceId)
    state.interviewType = current.interviewType
    state.resourceType = current.resourceType
    peopleList.value = allPeopleList.value.filter(
      (item: any) => item.resourceId == newResourceId && item.materialCollectEndDate == newDate,
    )
  }
})

// 监听传入的资源的id和人员id,确定tab选项
watch(
  [() => props.resourceId, () => props.applicantId, visaList.value],
  ([newResourceId, newApplicantId, newVisaList]) => {
    if (newResourceId && newApplicantId && newVisaList.length) {
      const index = newVisaList.value.findIndex((item: any) => (item.id = newApplicantId))
      state.visaTabActive = index
      const { resourceId, materialCollectEndDate } = newVisaList[index]
      peopleList.value = allPeopleList.value.filter(
        (item: any) =>
          item.resourceId == resourceId && item.materialCollectEndDate == materialCollectEndDate,
      )
    }
  },
)

// 批量处理人
function batchHandle() {
  batchHandleVisa.value.show(state.subStatus, props.orderId, state.userId)
}

// 获取用户id
function getUserId(id: number) {
  state.userId = id
  localStorage.setItem('visaApplicantId', state.userId)
  prepareMaterialsRef.value.clearPeopleForm() // 清除准备材料人员信息表单校验
}

function refresh() {
  emit('refresh')
}

// 获取资源id以及材料截止日期
function getVisaDetail(detail: any) {
  const { resourceId, materialCollectEndDate } = detail
  state.resourceId = resourceId
  localStorage.setItem('visaResourceId', state.resourceId)
  state.materialCollectEndDate = materialCollectEndDate
  state.currentIndex = 0 // 初始化人列表
  const { resourceDetailList } = props.info
  const current = resourceDetailList.find((item: any) => item.resourceId === resourceId)
  const [firstUser] = current.applicantList
  state.userId = firstUser.applicantId
  updateUserDetail(state.userId)
  prepareMaterialsRef.value.clearPeopleForm() // 清除准备材料人员信息表单校验
}
// 更新选择人员index
function updateIndex(index: number) {
  state.currentIndex = index
}

onUnmounted(() => {
  localStorage.setItem('visaResourceId', '')
  localStorage.setItem('visaApplicantId', '')
})

const {
  visaTabActive,
  resourceType,
  userVisaDetail,
  interviewType,
  subStatus,
  currentIndex,
  visaProgressEnums,
  visaDetailStageMaxSubStatusToList,
  buttonList,
} = toRefs(state)
</script>

<template>
  <BatchHandleVisaDialog
    ref="batchHandleVisa"
    :currentType="0"
    :manageVisaUserType="manageVisaUserType"
    :resourceType="resourceType"
    @refresh="refresh"
  />
  <content-wrapper :title="$t('visa.visaDetail.147707-2')" :showSpreadBtn="false">
    <template #header>
      <div class="show-more-btn-area">
        <el-button type="primary" @click="batchHandle" v-if="buttonList && buttonList.length">{{
          $t('visa.visaDetail.147707-3')
        }}</el-button>
      </div>
    </template>
    <template #default>
      <VisaNameTab :list="visaList" @getVisaDetail="getVisaDetail" :active="visaTabActive" />
      <div class="content">
        <div class="left-content">
          <PeopleTab
            :list="peopleList"
            @getUserId="getUserId"
            :currentIndex="currentIndex"
            @updateIndex="updateIndex"
          />
        </div>
        <div class="right-content">
          <PrepareMaterials
            ref="prepareMaterialsRef"
            :userVisaDetail="userVisaDetail"
            :orderId="orderId"
            :resourceType="resourceType"
            :manageVisaUserType="manageVisaUserType"
            @refresh="refresh"
          />
          <GiveVisa
            v-if="visaDetailStageMaxSubStatusToList.includes(2)"
            :userVisaDetail="userVisaDetail"
            :resourceType="resourceType"
            :interviewType="interviewType"
            :orderId="orderId"
            :manageVisaUserType="manageVisaUserType"
            @refresh="refresh"
          />
          <FeedBack
            v-if="visaDetailStageMaxSubStatusToList.includes(3)"
            :userVisaDetail="userVisaDetail"
            :manageVisaUserType="manageVisaUserType"
            :orderId="orderId"
            :resourceType="resourceType"
            @refresh="refresh"
          />
          <DestroyVisa
            v-if="visaDetailStageMaxSubStatusToList.includes(4)"
            :userVisaDetail="userVisaDetail"
            :manageVisaUserType="manageVisaUserType"
            @refresh="refresh"
          />
          <StopVisa
            :userVisaDetail="userVisaDetail"
            :manageVisaUserType="manageVisaUserType"
            :orderId="orderId"
            v-if="visaDetailStageMaxSubStatusToList.includes(5)"
            @refresh="refresh"
          />
        </div>
      </div>
    </template>
  </content-wrapper>
</template>

<style lang="scss" scoped>
.show-more-btn-area {
  margin-left: auto;
}
.content {
  display: flex;
  height: 70vh;
  .left-content {
    padding: 13px 8px;
    width: 12vw;
    overflow: auto;
    border-left: 1px solid rgba(204, 204, 204, 1);
    border-top: 1px solid rgba(204, 204, 204, 1);
    border-bottom: 1px solid rgba(204, 204, 204, 1);
  }
  .right-content {
    padding: 13px 12px;
    width: 100vw;
    border: 1px solid rgba(204, 204, 204, 1);
    overflow: auto;
  }
}
</style>
