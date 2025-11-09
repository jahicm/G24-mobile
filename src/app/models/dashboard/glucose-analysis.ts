export class GlucoseAnalysis {
    constructor(
        public readonly weeklyAvg: number,
        public readonly unit: string,
        public readonly trend: string,
        public readonly highReadingsCount: number,
        public readonly threshold: number,
        public readonly bestTimeSlot: TimeSlot,
        public readonly worstTimeSlot: TimeSlot,
        public readonly recommendations: string[],
        public readonly hba1c_prediction?: any
    ) { }

    get needsAttention(): boolean {
        return this.highReadingsCount > 0;
    }
}

export class TimeSlot {
    constructor(
        public readonly range: string,
        public readonly avgValue: number
    ) { }
}