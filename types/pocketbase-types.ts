/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	LiveErrors = "live_errors",
	StationA20 = "station_a20",
	StationA20Limits = "station_a20_limits",
	StationA25 = "station_a25",
	StationA25Limits = "station_a25_limits",
	StationA26 = "station_a26",
	StationA26Limits = "station_a26_limits",
	StationNvh = "station_nvh",
	StationNvhLimits = "station_nvh_limits",
	StationR23 = "station_r23",
	StationR23Limits = "station_r23_limits",
	StationS02 = "station_s02",
	StationS02Limits = "station_s02_limits",
	StationUpdates = "station_updates",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum LiveErrorsMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type LiveErrorsRecord<Ttest_data = unknown> = {
	device_code?: string
	device_id: string
	motor_type: LiveErrorsMotorTypeOptions
	station_name?: string
	test_data?: null | Ttest_data
	time?: IsoDateString
}

export enum StationA20MotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationA20Record = {
	HiPot_1_UVW_G_NTC?: number
	HiPot_2_NTC_G?: number
	IR_1_UVW_G_NTC?: number
	IR_2_NTC_G?: number
	NTC1_Res?: number
	Offset_NTC1_Res?: number
	Offset_NTC1_Temp?: number
	Offset_NTC2_Res?: number
	Offset_NTC2_Temp?: number
	Surge_U_VW_L_Vale?: number
	Surge_V_WU_L_Vale?: number
	Surge_W_UV_L_Vale?: number
	device_code: string
	motor_type: StationA20MotorTypeOptions
	test_fail?: boolean
	time: IsoDateString
}

export enum StationA20LimitsMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationA20LimitsRecord = {
	HiPot_1_UVW_G_NTC_MAX?: number
	HiPot_1_UVW_G_NTC_MIN?: number
	HiPot_2_NTC_G_MAX?: number
	HiPot_2_NTC_G_MIN?: number
	IR_1_UVW_G_NTC_MAX?: number
	IR_1_UVW_G_NTC_MIN?: number
	IR_2_NTC_G_MAX?: number
	IR_2_NTC_G_MIN?: number
	NTC1_Res_MAX?: number
	NTC1_Res_MIN?: number
	Offset_NTC1_Res_MAX?: number
	Offset_NTC1_Res_MIN?: number
	Offset_NTC1_Temp_MAX?: number
	Offset_NTC1_Temp_MIN?: number
	Offset_NTC2_Res_MAX?: number
	Offset_NTC2_Res_MIN?: number
	Offset_NTC2_Temp_MAX?: number
	Offset_NTC2_Temp_MIN?: number
	Surge_U_VW_L_Vale_MAX?: number
	Surge_U_VW_L_Vale_MIN?: number
	Surge_V_WU_L_Vale_MAX?: number
	Surge_V_WU_L_Vale_MIN?: number
	Surge_W_UV_L_Vale_MAX?: number
	Surge_W_UV_L_Vale_MIN?: number
	motor_type: StationA20LimitsMotorTypeOptions
}

export enum StationA25MotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationA25Record = {
	Cos__and_Sin_?: number
	Cos_and_Sin?: number
	Offset_Cos__and_Cos?: number
	Offset_Exc__and_Exc?: number
	Offset_NTC1_Res?: number
	Offset_NTC1_Temp?: number
	Offset_NTC2_Res?: number
	Offset_NTC2_Temp?: number
	Offset_PCBA_Ground?: number
	Offset_Sin__and_Sin?: number
	Sin__and_Exc_?: number
	Sin_and_Exc?: number
	device_code: string
	motor_type: StationA25MotorTypeOptions
	test_fail?: boolean
	time: IsoDateString
}

export enum StationA25LimitsMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationA25LimitsRecord = {
	Cos__and_Sin__MAX?: number
	Cos__and_Sin__MIN?: number
	Cos_and_Sin_MAX?: number
	Cos_and_Sin_MIN?: number
	Offset_Cos__and_Cos_MAX?: number
	Offset_Cos__and_Cos_MIN?: number
	Offset_Exc__and_Exc_MAX?: number
	Offset_Exc__and_Exc_MIN?: number
	Offset_NTC1_Res_MAX?: number
	Offset_NTC1_Res_MIN?: number
	Offset_NTC1_Temp_MAX?: number
	Offset_NTC1_Temp_MIN?: number
	Offset_NTC2_Res_MAX?: number
	Offset_NTC2_Res_MIN?: number
	Offset_NTC2_Temp_MAX?: number
	Offset_NTC2_Temp_MIN?: number
	Offset_PCBA_Ground_MAX?: number
	Offset_PCBA_Ground_MIN?: number
	Offset_Sin__and_Sin_MAX?: number
	Offset_Sin__and_Sin_MIN?: number
	Sin__and_Exc__MAX?: number
	Sin__and_Exc__MIN?: number
	Sin_and_Exc_MAX?: number
	Sin_and_Exc_MIN?: number
	motor_type: StationA25LimitsMotorTypeOptions
}

export enum StationA26MotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationA26Record = {
	Lineraity?: number
	NTC1_Res?: number
	OffsetAngle?: number
	Offset_UV_Vpeak?: number
	Offset_VW_Vpeak?: number
	Offset_WU_Vpeak?: number
	PhaseSequence?: number
	THD?: number
	Un_UV?: number
	Un_VW?: number
	Un_WU?: number
	device_code: string
	motor_type: StationA26MotorTypeOptions
	test_fail?: boolean
	time: IsoDateString
}

export enum StationA26LimitsMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationA26LimitsRecord = {
	Lineraity_MAX?: number
	Lineraity_MIN?: number
	NTC1_Res_MAX?: number
	NTC1_Res_MIN?: number
	OffsetAngle_MAX?: number
	OffsetAngle_MIN?: number
	Offset_UV_Vpeak_MAX?: number
	Offset_UV_Vpeak_MIN?: number
	Offset_VW_Vpeak_MAX?: number
	Offset_VW_Vpeak_MIN?: number
	Offset_WU_Vpeak_MAX?: number
	Offset_WU_Vpeak_MIN?: number
	PhaseSequence_MAX?: number
	PhaseSequence_MIN?: number
	THD_MAX?: number
	THD_MIN?: number
	Un_UV_MAX?: number
	Un_UV_MIN?: number
	Un_VW_MAX?: number
	Un_VW_MIN?: number
	Un_WU_MAX?: number
	Un_WU_MIN?: number
	motor_type: StationA26LimitsMotorTypeOptions
}

export enum StationNvhMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationNvhRecord = {
	Acc_1_Air?: number
	Acc_2_Air?: number
	Acc_3_Air?: number
	DC_bus?: number
	No_Load_Current?: number
	Out_PowerkW?: number
	Out_Voltage?: number
	Up_side_Air?: number
	Vibration?: number
	device_code: string
	motor_type: StationNvhMotorTypeOptions
	test_fail?: boolean
	time: IsoDateString
}

export enum StationNvhLimitsMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationNvhLimitsRecord = {
	Acc_1_Air_MAX?: number
	Acc_1_Air_MIN?: number
	Acc_2_Air_MAX?: number
	Acc_2_Air_MIN?: number
	Acc_3_Air_MAX?: number
	Acc_3_Air_MIN?: number
	DC_bus_MAX?: number
	DC_bus_MIN?: number
	No_Load_Current_MAX?: number
	No_Load_Current_MIN?: number
	Out_PowerkW_MAX?: number
	Out_PowerkW_MIN?: number
	Out_Voltage_MAX?: number
	Out_Voltage_MIN?: number
	Up_side_Air_MAX?: number
	Up_side_Air_MIN?: number
	Vibration_MAX?: number
	Vibration_MIN?: number
	motor_type?: StationNvhLimitsMotorTypeOptions
}

export enum StationR23MotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationR23Record = {
	Finish_Temp?: number
	L12?: number
	L12_1?: number
	L13?: number
	L14?: number
	L15?: number
	L16?: number
	L23?: number
	L34?: number
	L45?: number
	L56?: number
	Offset_UV_Vpeak?: number
	Offset_VW_Vpeak?: number
	Offset_WU_Vpeak?: number
	Origin_UV_Vpeak?: number
	Origin_VW_Vpeak?: number
	Origin_WU_Vpeak?: number
	Start_Temp?: number
	THD?: number
	Un_UV?: number
	Un_VW?: number
	Un_WU?: number
	device_code: string
	motor_type: StationR23MotorTypeOptions
	test_fail?: boolean
	time: IsoDateString
}

export enum StationR23LimitsMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
}
export type StationR23LimitsRecord = {
	Finish_Temp_MAX?: number
	Finish_Temp_MIN?: number
	L12_1_MAX?: number
	L12_1_MIN?: number
	L12_MAX?: number
	L12_MIN?: number
	L13_MAX?: number
	L13_MIN?: number
	L14_MAX?: number
	L14_MIN?: number
	L15_MAX?: number
	L15_MIN?: number
	L16_MAX?: number
	L16_MIN?: number
	L23_MAX?: number
	L23_MIN?: number
	L34_MAX?: number
	L34_MIN?: number
	L45_MAX?: number
	L45_MIN?: number
	L56_MAX?: number
	L56_MIN?: number
	Offset_UV_Vpeak_MAX?: number
	Offset_UV_Vpeak_MIN?: number
	Offset_VW_Vpeak_MAX?: number
	Offset_VW_Vpeak_MIN?: number
	Offset_WU_Vpeak_MAX?: number
	Offset_WU_Vpeak_MIN?: number
	Origin_UV_Vpeak_MAX?: number
	Origin_UV_Vpeak_MIN?: number
	Origin_VW_Vpeak_MAX?: number
	Origin_VW_Vpeak_MIN?: number
	Origin_WU_Vpeak_MAX?: number
	Origin_WU_Vpeak_MIN?: number
	Start_Temp_MAX?: number
	Start_Temp_MIN?: number
	THD_MAX?: number
	THD_MIN?: number
	Un_UV_MAX?: number
	Un_UV_MIN?: number
	Un_VW_MAX?: number
	Un_VW_MIN?: number
	Un_WU_MAX?: number
	Un_WU_MIN?: number
	motor_type: StationR23LimitsMotorTypeOptions
}

export enum StationS02MotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
	"Short" = "Short",
}
export type StationS02Record = {
	HiPot_1_UVW_G_NTC?: number
	HiPot_2_NTC_G?: number
	IR_1_UVW_G_NTC?: number
	IR_2_NTC_G?: number
	NTC1_Res?: number
	NTC2_Res?: number
	Offset_WR_UV_Res?: number
	Offset_WR_VW_Res?: number
	Offset_WR_WU_Res?: number
	Surge_U_VW_AreaDiff?: number
	Surge_U_VW_DiffArea?: number
	Surge_U_VW_L_Vale?: number
	Surge_V_WU_AreaDiff?: number
	Surge_V_WU_DiffArea?: number
	Surge_V_WU_L_Vale?: number
	Surge_W_UV_AreaDiff?: number
	Surge_W_UV_DiffArea?: number
	Surge_W_UV_L_Vale?: number
	Un_UV?: number
	Un_VW?: number
	Un_WU?: number
	device_code: string
	motor_type: StationS02MotorTypeOptions
	test_fail?: boolean
	time: IsoDateString
}

export enum StationS02LimitsMotorTypeOptions {
	"EFAD" = "EFAD",
	"ERAD" = "ERAD",
}
export type StationS02LimitsRecord = {
	HiPot_1_UVW_G_NTC_MAX?: number
	HiPot_1_UVW_G_NTC_MIN?: number
	HiPot_2_NTC_G_MAX?: number
	HiPot_2_NTC_G_MIN?: number
	IR_1_UVW_G_NTC_MAX?: number
	IR_1_UVW_G_NTC_MIN?: number
	IR_2_NTC_G_MAX?: number
	IR_2_NTC_G_MIN?: number
	NTC1_Res_MAX?: number
	NTC1_Res_MIN?: number
	NTC2_Res_MAX?: number
	NTC2_Res_MIN?: number
	Offset_WR_UV_Res_MAX?: number
	Offset_WR_UV_Res_MIN?: number
	Offset_WR_VW_Res_MAX?: number
	Offset_WR_VW_Res_MIN?: number
	Offset_WR_WU_Res_MAX?: number
	Offset_WR_WU_Res_MIN?: number
	Surge_U_VW_AreaDiff_MAX?: number
	Surge_U_VW_AreaDiff_MIN?: number
	Surge_U_VW_DiffArea_MAX?: number
	Surge_U_VW_DiffArea_MIN?: number
	Surge_U_VW_L_Vale_MAX?: number
	Surge_U_VW_L_Vale_MIN?: number
	Surge_V_WU_AreaDiff_MAX?: number
	Surge_V_WU_AreaDiff_MIN?: number
	Surge_V_WU_DiffArea_MAX?: number
	Surge_V_WU_DiffArea_MIN?: number
	Surge_V_WU_L_Vale_MAX?: number
	Surge_V_WU_L_Vale_MIN?: number
	Surge_W_UV_AreaDiff_MAX?: number
	Surge_W_UV_AreaDiff_MIN?: number
	Surge_W_UV_DiffArea_MAX?: number
	Surge_W_UV_DiffArea_MIN?: number
	Surge_W_UV_L_Vale_MAX?: number
	Surge_W_UV_L_Vale_MIN?: number
	Un_UV_MAX?: number
	Un_UV_MIN?: number
	Un_VW_MAX?: number
	Un_VW_MIN?: number
	Un_WU_MAX?: number
	Un_WU_MIN?: number
	motor_type: StationS02LimitsMotorTypeOptions
}

export type StationUpdatesRecord = {
	station_id: string
	update_time?: IsoDateString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type LiveErrorsResponse<Ttest_data = unknown, Texpand = unknown> = Required<LiveErrorsRecord<Ttest_data>> & BaseSystemFields<Texpand>
export type StationA20Response<Texpand = unknown> = Required<StationA20Record> & BaseSystemFields<Texpand>
export type StationA20LimitsResponse<Texpand = unknown> = Required<StationA20LimitsRecord> & BaseSystemFields<Texpand>
export type StationA25Response<Texpand = unknown> = Required<StationA25Record> & BaseSystemFields<Texpand>
export type StationA25LimitsResponse<Texpand = unknown> = Required<StationA25LimitsRecord> & BaseSystemFields<Texpand>
export type StationA26Response<Texpand = unknown> = Required<StationA26Record> & BaseSystemFields<Texpand>
export type StationA26LimitsResponse<Texpand = unknown> = Required<StationA26LimitsRecord> & BaseSystemFields<Texpand>
export type StationNvhResponse<Texpand = unknown> = Required<StationNvhRecord> & BaseSystemFields<Texpand>
export type StationNvhLimitsResponse<Texpand = unknown> = Required<StationNvhLimitsRecord> & BaseSystemFields<Texpand>
export type StationR23Response<Texpand = unknown> = Required<StationR23Record> & BaseSystemFields<Texpand>
export type StationR23LimitsResponse<Texpand = unknown> = Required<StationR23LimitsRecord> & BaseSystemFields<Texpand>
export type StationS02Response<Texpand = unknown> = Required<StationS02Record> & BaseSystemFields<Texpand>
export type StationS02LimitsResponse<Texpand = unknown> = Required<StationS02LimitsRecord> & BaseSystemFields<Texpand>
export type StationUpdatesResponse<Texpand = unknown> = Required<StationUpdatesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	live_errors: LiveErrorsRecord
	station_a20: StationA20Record
	station_a20_limits: StationA20LimitsRecord
	station_a25: StationA25Record
	station_a25_limits: StationA25LimitsRecord
	station_a26: StationA26Record
	station_a26_limits: StationA26LimitsRecord
	station_nvh: StationNvhRecord
	station_nvh_limits: StationNvhLimitsRecord
	station_r23: StationR23Record
	station_r23_limits: StationR23LimitsRecord
	station_s02: StationS02Record
	station_s02_limits: StationS02LimitsRecord
	station_updates: StationUpdatesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	live_errors: LiveErrorsResponse
	station_a20: StationA20Response
	station_a20_limits: StationA20LimitsResponse
	station_a25: StationA25Response
	station_a25_limits: StationA25LimitsResponse
	station_a26: StationA26Response
	station_a26_limits: StationA26LimitsResponse
	station_nvh: StationNvhResponse
	station_nvh_limits: StationNvhLimitsResponse
	station_r23: StationR23Response
	station_r23_limits: StationR23LimitsResponse
	station_s02: StationS02Response
	station_s02_limits: StationS02LimitsResponse
	station_updates: StationUpdatesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'live_errors'): RecordService<LiveErrorsResponse>
	collection(idOrName: 'station_a20'): RecordService<StationA20Response>
	collection(idOrName: 'station_a20_limits'): RecordService<StationA20LimitsResponse>
	collection(idOrName: 'station_a25'): RecordService<StationA25Response>
	collection(idOrName: 'station_a25_limits'): RecordService<StationA25LimitsResponse>
	collection(idOrName: 'station_a26'): RecordService<StationA26Response>
	collection(idOrName: 'station_a26_limits'): RecordService<StationA26LimitsResponse>
	collection(idOrName: 'station_nvh'): RecordService<StationNvhResponse>
	collection(idOrName: 'station_nvh_limits'): RecordService<StationNvhLimitsResponse>
	collection(idOrName: 'station_r23'): RecordService<StationR23Response>
	collection(idOrName: 'station_r23_limits'): RecordService<StationR23LimitsResponse>
	collection(idOrName: 'station_s02'): RecordService<StationS02Response>
	collection(idOrName: 'station_s02_limits'): RecordService<StationS02LimitsResponse>
	collection(idOrName: 'station_updates'): RecordService<StationUpdatesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
