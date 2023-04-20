<template>
  测试一级结构
  {{ '测试纯文字' }}
  {{ dialogType === DialogTypeEnum.add ? '新增测试' : '编辑测试' }}
  <two-dialog
    width="1200px"
    v-model="show"
    @close="onClose"
    :title="dialogType === DialogTypeEnum.add ? '新增' : '编辑'"
  >
    {{ '测试纯文字' }}
    {{ dialogType === DialogTypeEnum.add ? '新增测试' : '编辑测试' }}
    <span>测试</span>
    <!--测试注释-->
    <span>{{ $t('测试i18n编译') }}</span>
    <span
      :label="$t('测试熟悉下的翻译')"
      :test="dialogType === DialogTypeEnum.add ? $t('测试表达式新增') : '编辑'"
    ></span>
    <el-form ref="formRef" label-width="0" :model="formData" :rules="rules">
      <el-form-item
        label="填报类型"
        label-width="80px"
        style="width: 50%"
        prop="periodFlag"
        :rules="rules.periodFlag"
      >
        <el-radio-group v-if="dialogType === DialogTypeEnum.add" v-model="formData.periodFlag">
          <el-radio label="0">按日填报</el-radio>
          <el-radio label="1">按周填报</el-radio>
        </el-radio-group>
        <span v-if="dialogType === DialogTypeEnum.edit && formData.itemInfos.length">{{
          formData.itemInfos[0].periodFlag === 0
            ? '按日填报'
            : formData.itemInfos[0].periodFlag === 1
            ? '按周填报'
            : '-'
        }}</span>
      </el-form-item>
      <el-form-item
        label="周期"
        label-width="80px"
        style="width: 50%"
        prop="periodDate"
        :rules="rules.periodDate"
      >
        <el-date-picker
          v-if="dialogType === DialogTypeEnum.add"
          v-model="formData.periodDate"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <span v-if="dialogType === DialogTypeEnum.edit && formData.itemInfos.length"
          >{{ formData.itemInfos[0].periodStartDate }}~{{
            formData.itemInfos[0].periodEndDate
          }}</span
        >
      </el-form-item>
      <el-form-item label="一级业态" label-width="80px">
        <el-select
          v-if="dialogType === DialogTypeEnum.add"
          collapse-tags
          collapse-tags-tooltip
          placeholder="全部"
          v-model="formData.topTravelServiceCode"
          @change="changeStatus"
        >
          <template v-for="item in codeList" :key="item.travelServiceCode">
            <el-option
              :value="item.travelServiceCode"
              :label="item.travelServiceCodeName"
            ></el-option>
          </template>
        </el-select>
        <span v-if="dialogType === DialogTypeEnum.edit && formData.itemInfos.length">{{
          formData.itemInfos[0].topTravelServiceName
        }}</span>
      </el-form-item>
      <el-form-item label="二级业态" label-width="80px" v-if="dialogType === DialogTypeEnum.add">
        <el-checkbox-group
          v-if="dialogType === DialogTypeEnum.add"
          v-model="formData.travelServiceCode"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="item in subCodeList"
            :label="item.travelServiceCode"
            :key="item.travelServiceCode"
            >{{ item.travelServiceCodeName }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <two-table
        class="dataTable"
        :data="formData.itemInfos"
        :stripe="false"
        :span-method="spanMethod"
        max-height="700px"
        align="right"
        :header-cell-style="{ textAlign: 'center' }"
      >
        <el-table-column prop="travelServiceName" label="二级业态" min-width="80px">
        </el-table-column>
        <el-table-column
          prop="systemSourceName"
          label="系统来源"
          min-width="80px"
        ></el-table-column>
        <el-table-column label="销售额（万元）-业务口径">
          <el-table-column label="本周期数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].currentPeriodAmount`"
                :rules="rules.currentPeriodAmount"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.currentPeriodAmount"
                  clearable
                  maxlength="16"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="上周期数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].lastPeriodAmount`"
                :rules="rules.lastPeriodAmount"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.lastPeriodAmount"
                  clearable
                  maxlength="16"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="本月数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].currentMonthPeriodAmount`"
                :rules="rules.currentMonthPeriodAmount"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.currentMonthPeriodAmount"
                  clearable
                  maxlength="9"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="本年累计数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].currentYearPeriodAmount`"
                :rules="rules.currentYearPeriodAmount"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.currentYearPeriodAmount"
                  clearable
                  maxlength="16"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="去年同期累计数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].lastYearPeriodAmount`"
                :rules="rules.lastYearPeriodAmount"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.lastYearPeriodAmount"
                  clearable
                  maxlength="16"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="接待人次（人次）">
          <el-table-column label="本周期数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].currentPeriodTourist`"
                :rules="rules.currentPeriodTourist"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.currentPeriodTourist"
                  clearable
                  maxlength="9"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="上周期数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].lastPeriodTourist`"
                :rules="rules.lastPeriodTourist"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.lastPeriodTourist"
                  clearable
                  maxlength="9"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="本月数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].currentMonthPeriodTourist`"
                :rules="rules.currentMonthPeriodTourist"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.currentMonthPeriodTourist"
                  clearable
                  maxlength="9"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="本年累计数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].currentYearPeriodTourist`"
                :rules="rules.currentYearPeriodTourist"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.currentYearPeriodTourist"
                  clearable
                  maxlength="9"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="去年同期累计数" min-width="90px">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`itemInfos[${$index}].lastYearPeriodTourist`"
                :rules="rules.lastYearPeriodTourist"
                class="formItem"
              >
                <el-input
                  placeholder="请输入"
                  v-model.trim="row.lastYearPeriodTourist"
                  clearable
                  maxlength="9"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table-column>
      </two-table>
    </el-form>
    <template #footer>
      测试插槽内容
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </template>
  </two-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { deepClone } from '@/utils/tool'
import CustomMessage from '@/utils/CustomMessage'
import { DialogTypeEnum, IFormData, SpanMethodProps } from './types'
import dayjs from 'dayjs'
import { useGlobalStore } from '@/stores/global'
import ReportServer from '@/services/ReportServer'
import { zeroOrNumber } from '@/utils/validate'
import { useI18n } from 'vue-i18n'
import { loadLocaleMessages, i18n as i18n2 } from '@/i18n'

const i18n = useI18n()
const test1 = i18n.t('测试useI18n')

const test2 = i18n2.global.t('测试js文件引入的i18n')

const test3 = this.$t('测试$t方式')
/*
 * 多行注释测试
 *
 * */
// 单行注释测试
const spanColumsIndex = [0] // 需要合并的列
const show = ref(false)
const dialogType = ref<DialogTypeEnum>(DialogTypeEnum.add)
const formRef = ref<FormInstance>()
const codeList = ref([])
const subCodeList = ref([])
const emit = defineEmits(['update'])
const formBackup = {
  itemInfos: [],
  periodFlag: '0',
}

let formData = reactive<IFormData>(deepClone(formBackup))
const queryServiceCode = async () => {
  let res = await ReportServer.report.getServiceCode()
  codeList.value = res
  subCodeList.value = res[0].subList
  formData.topTravelServiceCode = res[0].travelServiceCode
  let tempArr: any = []
  res[0].subList.forEach((item) => {
    tempArr = tempArr.concat(
      item.subList.map((subItem, index) => {
        return {
          rowspan: index === 0 ? item.subList.length : 0,
          currentMonthPeriodAmount: '',
          currentMonthPeriodTourist: '',
          currentPeriodAmount: '',
          currentPeriodTourist: '',
          currentYearPeriodAmount: '',
          currentYearPeriodTourist: '',
          lastPeriodAmount: '',
          lastPeriodTourist: '',
          lastYearPeriodAmount: '',
          lastYearPeriodTourist: '',
          periodEndDate: '',
          periodStartDate: '',
          periodFlag: 0,
          systemSource: subItem.travelServiceCode,
          systemSourceName: subItem.travelServiceCodeName,
          travelServiceCode: item.travelServiceCode,
          travelServiceName: item.travelServiceCodeName,
        }
      }),
    )
  })
  formData.itemInfos = tempArr
  formData.travelServiceCode = res[0].subList.map((item) => {
    return item.travelServiceCode
  })
}

const onCancel = () => {
  formRef.value?.resetFields()
  onClose()
}
const onClose = () => {
  formRef.value?.clearValidate()
  show.value = false
}
const amountRules: FormItemRule[] = [
  {
    trigger: 'blur',
    validator: (rule, value: string | number, callback) => {
      // if (!value && value !== 0) return callback('请输入')
      if (+value < 0) return callback('需>=0的数字')
      const [beforeNum = '', afterNum = ''] = `${value}`.split('.')
      if (beforeNum.length > 13) return callback('整数位最多13位')
      if (afterNum.length > 2) return callback('小数位最多2位')
      callback()
    },
  },
]
const peopleRules: FormItemRule[] = [
  {
    trigger: 'blur',
    validator: (rule, value: string | number, callback) => {
      // if (!value && value !== 0) return callback('请输入')
      if (value && !zeroOrNumber(`${value}`)) return callback(new Error('需正整数'))
      callback()
    },
  },
]
const rules = reactive({
  periodDate: [
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value && dialogType.value === DialogTypeEnum.add) return callback('请选择周期')
        callback()
      },
    },
  ] as FormItemRule[],
  currentPeriodAmount: amountRules,
  lastPeriodAmount: amountRules,
  currentMonthPeriodAmount: amountRules,
  currentYearPeriodAmount: amountRules,
  lastYearPeriodAmount: amountRules,
  currentPeriodTourist: peopleRules,
  lastPeriodTourist: peopleRules,
  currentMonthPeriodTourist: peopleRules,
  currentYearPeriodTourist: peopleRules,
  lastYearPeriodTourist: peopleRules,
})
const onConfirm = async () => {
  try {
    await formRef.value?.validate()
  } catch (error) {
    return
  }
  try {
    const currentUser = useGlobalStore()
    if (dialogType.value === DialogTypeEnum.edit) {
      const data = {
        ...formData.itemInfos[0],
        createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        createUserName: currentUser.$state.userInfo.name,
      }
      await ReportServer.report.handleBusData({ data: [data] })
    } else {
      if (!formData.itemInfos.length) {
        CustomMessage({ msg: '请至少选择一个二级业态', type: 'warning' })
        return false
      }
      const [periodStartDate, periodEndDate] = formData.periodDate
      const data = formData.itemInfos.map((item) => {
        return {
          ...item,
          createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          createUserName: currentUser.$state.userInfo.name,
          periodStartDate,
          periodEndDate,
          periodFlag: Number(formData.periodFlag),
        }
      })
      await ReportServer.report.handleBusData({ data })
    }
    CustomMessage({ msg: '保存成功', type: 'success' })
    emit('update')
    onClose()
  } catch (e) {
    console.error(e)
  }
}
const open = async (type: DialogTypeEnum, row?: any) => {
  try {
    if (row) {
      formData.itemInfos = [deepClone({ ...row, rowspan: 1 })]
    } else {
      queryServiceCode()
    }
    dialogType.value = type
    show.value = true
  } catch (error) {
    console.error('getByPeriodId', error)
  }
}
const spanMethod = ({ row, columnIndex }: SpanMethodProps) => {
  const rowspan = row.rowspan || 0
  if (spanColumsIndex.includes(columnIndex)) {
    if (rowspan) {
      return {
        rowspan,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

const handleCheckedChange = (value) => {
  const arr: any = []
  subCodeList.value.forEach((item) => {
    if (value.indexOf(item.travelServiceCode) > -1) {
      item.subList.forEach((sonItem, index) => {
        const findItem = formData.itemInfos.find(
          (item) => item.systemSource === sonItem.travelServiceCode,
        )
        arr.push({
          rowspan: index === 0 ? item.subList.length : 0,
          systemSource: sonItem.travelServiceCode,
          systemSourceName: sonItem.travelServiceCodeName,
          travelServiceName: item.travelServiceCodeName,
          travelServiceCode: item.travelServiceCode,
          currentMonthPeriodAmount: findItem ? findItem.currentMonthPeriodAmount : '',
          currentMonthPeriodTourist: findItem ? findItem.currentMonthPeriodTourist : '',
          currentPeriodAmount: findItem ? findItem.currentPeriodAmount : '',
          currentPeriodTourist: findItem ? findItem.currentPeriodTourist : '',
          currentYearPeriodAmount: findItem ? findItem.currentYearPeriodAmount : '',
          currentYearPeriodTourist: findItem ? findItem.currentYearPeriodTouris : '',
          lastPeriodAmount: findItem ? findItem.lastPeriodAmount : '',
          lastPeriodTourist: findItem ? findItem.lastPeriodTourist : '',
          lastYearPeriodAmount: findItem ? findItem.lastYearPeriodAmount : '',
          lastYearPeriodTourist: findItem ? findItem.lastYearPeriodTouris : '',
          periodEndDate: '',
          periodStartDate: '',
          periodFlag: 0,
        })
      })
    }
  })
  formData.itemInfos = arr
}

const changeStatus = (value: number) => {
  const arr: any = []
  subCodeList.value = codeList.value.filter((item) => item.travelServiceCode == value)[0].subList
  subCodeList.value.map((item) => {
    item.subList.map((subItem, index) => {
      arr.push({
        rowspan: index === 0 ? item.subList.length : 0,
        currentMonthPeriodAmount: '',
        currentMonthPeriodTourist: '',
        currentPeriodAmount: '',
        currentPeriodTourist: '',
        currentYearPeriodAmount: '',
        currentYearPeriodTourist: '',
        lastPeriodAmount: '',
        lastPeriodTourist: '',
        lastYearPeriodAmount: '',
        lastYearPeriodTourist: '',
        periodEndDate: '',
        periodStartDate: '',
        periodFlag: 0,
        systemSource: subItem.travelServiceCode,
        systemSourceName: subItem.travelServiceCodeName,
        travelServiceCode: item.travelServiceCode,
        travelServiceName: item.travelServiceCodeName,
      })
    })
  })
  formData.itemInfos = arr
  formData.travelServiceCode = subCodeList.value.map((item) => {
    return item.travelServiceCode
  })
}

defineExpose({
  open,
})
</script>

<style scoped lang="scss">
.formItem {
  margin-top: 15px;
}
.warnLine {
  line-height: 30px;
  display: flex;
  align-items: center;
}
.warnIcon {
  margin-right: 5px;
  font-size: 14px;
}
.dataTable :deep(td.mbs-web-table__cell div) {
  padding: 0 2px;
}
</style>
