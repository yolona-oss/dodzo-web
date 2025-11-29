import { IAuthUser } from "../../dto/auth/auth-user.dto";
import { EmployeeSpecEnum } from "./employee-spec.type";
import { IRestaurant } from "../restaurant";
import { IWeekSchedule } from "../week-schedule.type";

export interface IEmployee {
    id: string
    user: IAuthUser
    restaurant: IRestaurant
    specialization: EmployeeSpecEnum
    schedule: IWeekSchedule
}
