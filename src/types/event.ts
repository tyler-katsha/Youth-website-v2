import type { EventType } from "./types";

export interface CalendarProps {
    plans?: Plan[];
    onDateSelect?: (date: Date) => void;
}

export interface Plan extends PartialPlan {
    id: number;
    dateKey: string;

}
export interface PartialPlan {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    color: string;
    eventType: EventType;
}
