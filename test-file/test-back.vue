<template>
    <two-dialog
            :title="DialogName[dialogType]"
            v-model="show"
            @close="onclose"
            @confirm="onConfirm"
            is-footer-button
            ConfirmText="保存"
            :loading="loading"
            width="80vw"
    >
        <div class="dialog-main">
            <el-form :model="fromData" :rules="rules" ref="formRef" label-width="120px">
                <el-form-item label="产品类目" prop="allCategory">
                    <AllCategory
                            :disabled-all="isEdit"
                            :before-label="BeforeLabel"
                            v-model="allCategoryData"
                            @change="changeAllCategory"
                    />
                </el-form-item>
                <el-form-item label="单团活动说明" prop="activityDescription">
                    <el-input
                            clearable
                            v-model="fromData.activityDescription"
                            placeholder="可输入地点、品牌、活动等信息，最多70字"
                            maxlength="70"
                            style="width: 476px"
                            show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="自定义团代号后缀" prop="customGroupCode">
                    <el-input
                            clearable
                            style="width: 155px"
                            v-model="fromData.customGroupCode"
                            placeholder="请输入"
                            maxlength="6"
                            show-word-limit
                    ></el-input>
                </el-form-item>
                <div class="flex" ref="ownerRef">
                    <el-form-item :disabled="isEdit" label="产品负责人" prop="ownerId">
                        <WxUserList is-auth-id :disabled="isEdit" v-model="WxUser" @change="onChangeUserList" />
                    </el-form-item>
                    <el-form-item
                            label="负责人部门"
                            prop="depCode"
                            :label-width="ownerHeight > 51 ? '120px' : '166px'"
                    >
                        <UserDepartment
                                :disabled="isEdit"
                                :userId="Number(fromData.ownerId)"
                                v-model="depValue"
                                :style="{ width: ownerHeight > 51 ? '160px' : '314px' }"
                                @getOptions="getDepartmentOptions"
                                @onChange="
                (val) => {
                  fromData.depCode = val?.value
                  fromData.depName = val?.label
                  checkOneProp('depCode')
                  fromData.purchaseCompanyId = null
                  fromData.purchaseCompanyName = ''

                  getStandardCode(val)
                }
              "
                        />
                    </el-form-item>
                    <el-form-item label="呈现终端" prop="terminals">
                        <el-checkbox-group disabled v-model="fromData.terminals">
                            <template
                                    v-for="item in TerminalTypeEnum().list.filter(
                  (li) => li.value === TerminalTypeEnum().five,
                )"
                                    :key="item.value"
                            >
                                <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
                            </template>
                        </el-checkbox-group>
                    </el-form-item>
                </div>

                <el-form-item label="行程天数" prop="journeyDayNight">
                    <el-form-item prop="journeyDay">
                        <el-input
                                maxlength="3"
                                :disabled="isEdit"
                                v-model="fromData.journeyDay"
                                style="width: 66px"
                                placeholder="请输入"
                                clearable
                        ></el-input>
                        <span class="mr-item">天</span>
                    </el-form-item>
                    <el-form-item prop="journeyNight">
                        <el-input
                                maxlength="3"
                                :disabled="isEdit"
                                style="width: 66px"
                                v-model="fromData.journeyNight"
                                placeholder="请输入"
                                clearable
                        ></el-input>
                        <span class="mr-item">晚</span>
                    </el-form-item>
                </el-form-item>
                <div class="flex">
                    <el-form-item label="首站目的地城市" prop="destinationCityId">
                        <PoiCityList
                                :disabled="isEdit"
                                v-model="destinationCity"
                                @change="
                (val) => {
                  fromData.destinationCityId = val?.value
                  fromData.destinationCityName = val?.label
                }
              "
                        />
                    </el-form-item>
                    <el-form-item
                            label="出发城市"
                            prop="departureCityId"
                            :label-width="ownerHeight > 51 ? '120px' : '168px'"
                    >
                        <PoiCityList
                                :disabled="isEdit"
                                :is-national="isEdit"
                                v-model="departureCity"
                                @change="
                (val) => {
                  fromData.departureCityId = val?.value
                  fromData.departureCityName = val?.label
                }
              "
                        />
                        <TextTips text="出发城市不填默认全国出发" />
                    </el-form-item>
                </div>
                <el-form-item label="是否包含往返交通" prop="containReturnTraffic">
                    <el-radio-group :disabled="isEdit" v-model="fromData.containReturnTraffic">
                        <template v-for="item in ContainReturnTrafficEnum().list" :key="item.value">
                            <el-radio :label="item.value">{{ item.label }}</el-radio>
                        </template>
                    </el-radio-group>
                </el-form-item>
                <template v-if="fromData.containReturnTraffic === ContainReturnTrafficEnum().T">
                    <el-form-item label="往返交通" prop="toFromTraffic">
                        <div style="display: flex">
                            <el-select
                                    :disabled="isEdit"
                                    v-model="fromData.fromTraffic"
                                    placeholder="往"
                                    style="margin-right: 10px"
                            >
                                <el-option
                                        v-for="item in fromTraffic"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="Number(item.value)"
                                >
                                </el-option>
                            </el-select>
                            <el-select :disabled="isEdit" v-model="fromData.toTraffic" placeholder="返">
                                <el-option
                                        v-for="item in toTraffic"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item label="交通说明">
                        <el-input
                                :disabled="isEdit"
                                clearable
                                v-model="fromData.trafficInfo"
                                placeholder="参考航班（车次）等信息"
                                maxlength="50"
                                show-word-limit
                        ></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="上传行程">
                    <div>
                        <el-button :icon="Upload" type="primary" @click="uploadFile">上传行程</el-button>
                        <span class="mr-left">支持格式 pdf、jpg、png</span>
                        <template v-if="fromData?.attachment?.name">
                            <div style="display: flex">
                                <div class="file-name">{{ fromData.attachment?.name }}</div>
                                <el-button
                                        style="margin-left: 10px"
                                        link
                                        type="primary"
                                        :icon="Download"
                                        @click="fileDownload"
                                ></el-button>
                                <el-button link type="primary" :icon="Close" @click="removeFile"></el-button>
                            </div>
                        </template>
                    </div>
                </el-form-item>
                <div class="flex">
                    <el-form-item label="采购公司" prop="purchaseCompanyId">
                        <PurchasingCompany
                                :disabled="isEdit"
                                :code="fromData.depCode"
                                v-model="fromData.purchaseCompanyId"
                                placeholder="请先选择部门"
                                @change="
                (val) => {
                  fromData.purchaseCompanyId = val?.value
                  fromData.purchaseCompanyName = val?.label
                }
              "
                                style="width: 155px"
                        />
                    </el-form-item>
                    <el-form-item
                            prop="estimatedGrossProfitNumber"
                            :label-width="ownerHeight > 51 ? '320px' : '320px'"
                    >
                        <template #label>
                            <div class="flex">
                                <span>单团预估毛利（</span>
                                <el-radio-group v-model="fromData.estimatedGrossProfit">
                                    <el-radio :label="0">毛利率</el-radio>
                                    <el-radio :label="1">毛利润</el-radio>
                                </el-radio-group>
                                <span>）</span>
                            </div>
                        </template>
                        <template #default>
                            <div class="flex">
                                <el-input
                                        style="width: 100px"
                                        v-model="fromData.estimatedGrossProfitNumber"
                                        placeholder="请输入"
                                        clearable
                                ></el-input>
                                <div class="unit">
                                    {{
                                    fromData.estimatedGrossProfit == profitRate
                                        ? '%'
                                        : standardCurrency?.standardCurrencyCode + '/人'
                                    }}
                                </div>
                                <TextTips
                                        text="参照公司内部结算价填写预估毛利，实际利润和成本以最终的确认单为准。"
                                />
                            </div>
                        </template>
                    </el-form-item>
                </div>
                <el-form-item>
                    <template #label>
                        <div class="flex">
                            <div style="color: var(--error); margin-right: 4px">*</div>
                            <div>团期价格</div>
                        </div>
                    </template>
                    <template #default>
                        <EditPriceTable
                                ref="editPriceTableRef"
                                :departDateList="fromData.departDateList"
                                :productId="productId"
                                :standardCurrency="standardCurrency"
                        />
                    </template>
                </el-form-item>
            </el-form>
        </div>
    </two-dialog>
</template>

<script setup lang="ts">
import { Close, Download, Upload } from '@element-plus/icons-vue'
import AllCategory from '@/businessComponents/AllCategory/index.vue'
import WxUserList from '@/businessComponents/WxUserList/index.vue'
import UserDepartment from '@/businessComponents/UserDepartment/index.vue'
import PoiCityList from '@/businessComponents/PoiCityList/index.vue'
import TextTips from '@/businessComponents/TextTips/index.vue'
import PurchasingCompany from '@/businessComponents/PurchasingCompany/index.vue'
import EditPriceTable from '../component/EditPriceTable/index.vue'
import { computed, watch } from 'vue'

import { DialogName, DialogTypeEnum } from '../types'
import {
    ContainReturnTrafficEnum,
    PastReturnTraffic,
    TerminalTypeEnum,
} from '@/const/ProductServer'
import { useData } from './data'
import { addEditGroup } from './addEditGroup'
import AuthServer from '@/services/AuthServer'

const emits = defineEmits(['refresh'])

const uData = useData()

const {
    loading,
    show,
    dialogType,
    WxUser,
    allCategoryData,
    formRef,
    fromData,
    rules,
    departureCity,
    destinationCity,
    toTraffic,
    fromTraffic,
    BeforeLabel,
    depValue,
    ownerRef,
    ownerHeight,
    editPriceTableRef,
    productId,
    profitRate,
    standardCurrency,
} = uData

const isEdit = computed(() => dialogType.value === DialogTypeEnum.edit)

let {
    open,
    onclose,
    onConfirm,
    changeAllCategory,
    uploadFile,
    fileDownload,
    removeFile,
    onChangeUserList,
    checkOneProp,
    getDepartmentOptions,
} = addEditGroup(uData, emits)

// onConfirm = antiShake(() => onConfirm())
getEnums()

async function getEnums() {
    try {
        const enumData = await PastReturnTraffic()
        if (enumData) {
            toTraffic.value = enumData.toTraffic
            fromTraffic.value = enumData.fromTraffic
        }
    } catch (e) {
        console.log(e)
    }
}
const getStandardCode = async (val: any) => {
    // if(vla)
    // console.log(val, 999)
    if (!val?.value) return
    try {
        const res = await AuthServer.relation.list({
            data: {
                departmentId: val?.value,
                departmentCorpType: 1,
            },
        })

        if (res.length) {
            const id = res[0].corpId
            // res?.length&&  res[0].corpId
            const { standardCurrency: name, standardCurrencyCode } = await AuthServer.corpCheck({
                data: {
                    id,
                },
            })
            standardCurrency.value = {
                standardCurrencyCode,
                standardCurrency: name,
            }
        }
    } catch (error) {
        console.log(error)
    }
}
watch(ownerRef, (newItem) => {
    ownerHeight.value = newItem && newItem.offsetHeight
})
watch(
    () => depValue.value,
    (val) => {
        getStandardCode(val)
    },
    {
        immediate: true,
        deep: true,
    },
)

defineExpose({
    open,
})
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  flex-wrap: wrap;
}
.flex-center {
  // align-items: center;
}

::v-deep .mbs-web-table__header {
  width: 100% !important;
}
::v-deep .mbs-web-table__body-wrapper {
  width: 100% !important;
}
::v-deep .mbs-web-table__body {
  width: 100% !important;
}
.dialog-main {
  overflow: auto;
  max-height: 60vh;
}
.unit {
  margin: 0 10px;
}
.mr-item {
  margin: 0 5px;
}
.mr-left {
  margin-left: 4px;
}
.w-input {
  width: 170px !important;
}
.file-name {
  margin-right: 10px;
}
</style>
