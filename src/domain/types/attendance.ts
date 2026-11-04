export interface UserInfo { academicProgram:string; documentNumber:string; documentType:string; lastName:string; name:string; signatureImage?:string }
export interface AttendanceRecord { id:string; week:string; date:string; attendanceSentDate:string; method:string; routeName:string; tripNumber:number; userInfo:UserInfo }
export interface Beacon { id:string; name:string; macAddress:string; routeName:string; busName?:string; active:boolean }
export interface Route { id:string; name:string; active:boolean; beaconCount?:number }
