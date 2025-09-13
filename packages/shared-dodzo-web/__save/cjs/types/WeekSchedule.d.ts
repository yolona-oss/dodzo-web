export type WeekDayType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export interface IWeekSchedule {
    id: string;
    schedule: Record<WeekDayType, {
        start: string;
        end: string;
    } | null>;
}
//# sourceMappingURL=WeekSchedule.d.ts.map