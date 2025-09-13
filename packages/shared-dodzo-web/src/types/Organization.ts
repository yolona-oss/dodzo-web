import { IAddressBook } from "./AddressBook";
import { IEmployee } from "./Employee";
import { IWeekSchedule } from "./WeekSchedule";

export interface IOrg {
    id: string
    label: string;
    address: IAddressBook
    medianDeliveryTime: number
    medianPickupTime: number
    lastMedianPickupUpdateTime: Date
    lastMedianDeliveryUpdateTime: Date
    employees: IEmployee[]
    schedule: IWeekSchedule

    // STOCK ENTITY
}
