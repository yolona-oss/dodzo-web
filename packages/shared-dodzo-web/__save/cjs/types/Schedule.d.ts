export declare const WeekDays: readonly ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
export type DayOfWeekType = typeof WeekDays[number];
export interface IWeekCut {
    from: DayOfWeekType;
    to: DayOfWeekType;
}
export type WeekCutsType = IWeekCut[];
export type WeekDayType = DayOfWeekType;
export type WeekDaysType = DayOfWeekType[];
export interface IWorkHours {
    start: number;
    count: number;
}
export interface ISchedule {
    weekDays: WeekDaysType[];
    workHours: IWorkHours;
}
//# sourceMappingURL=Schedule.d.ts.map