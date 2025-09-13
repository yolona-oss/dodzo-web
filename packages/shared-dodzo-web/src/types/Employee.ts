import { IAuthUser } from "@/auth/types/AuthUser";
import { IOrg } from "./Organization";
import { EmployeeSpecEnum } from "@/enums/employee-spec";
import { IWeekSchedule } from "./WeekSchedule";

export interface IEmployee {
    user: IAuthUser
    organization: IOrg
    specialization: EmployeeSpecEnum
    schedule: IWeekSchedule
}
