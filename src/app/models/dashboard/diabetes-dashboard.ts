
import { GlucoseAnalysis, TimeSlot } from "./glucose-analysis";
import { Medication } from "./medication";
import { Reading } from "./reading";
import { SmartInsight, PriorityLevel } from "./smart-insight";

export class DiabetesDashboard {
    constructor(
        public readonly currentReading: Reading,
        public readonly weeklyAverage: Reading,
        public readonly weeklyReadings: Reading[],
        public readonly medications: Medication[],
        public readonly analysis: GlucoseAnalysis,
        public readonly insight: SmartInsight,
        public readonly metadata: {
            generatedAt: Date;
            apiVersion: string;
        }
    ) { }

    static fromJson(json: any): DiabetesDashboard {
        const data = json ?? {};
        const latestReading = data.latest_readings?.reading
            ? new Reading(
                data.latest_readings.reading.sugarValue ?? 0,
                data.latest_readings.reading.unit ?? '',
                data.latest_readings.reading.status ?? '',
                data.latest_readings.reading.date ?? '',
                data.latest_readings.reading.context ?? ''
            )
            : new Reading(0, '', '', '', '');

        const weeklyAverage = data.latest_readings?.weekly_average
            ? new Reading(
                data.latest_readings.weekly_average.value ?? 0,
                data.latest_readings.weekly_average.unit ?? '',
                data.latest_readings.weekly_average.status ?? ''
            )
            : new Reading(0, '', '');

        const weeklyOverview = data.weekly_overview?.readings
            ? data.weekly_overview.readings.map(
                (r: any) => new Reading(r.sugarValue ?? 0, r.unit ?? '', '')
            )
            : [];

        const medications = data.medications
            ? data.medications.map(
                (m: any) =>
                    new Medication(m.name ?? '', m.type ?? '', m.dosage ?? '', m.frequency ?? '')
            )
            : [];
        const ai = data.ai_analysis ?? {};
        const summary = ai.summary ?? {};
        const highReadings = ai.high_readings ?? {};
        const timeAnalysis = ai.time_analysis ?? {};
        const best = timeAnalysis.best ?? {};
        const worst = timeAnalysis.worst ?? {};

        const glucoseAnalysis = new GlucoseAnalysis(
            summary.weekly_avg ?? 0,
            summary.unit ?? '',
            summary.trend ?? '',
            highReadings.count ?? 0,
            highReadings.threshold ?? 0,
            new TimeSlot(best.range ?? '', best.avg_value ?? 0),
            new TimeSlot(worst.range ?? '', worst.avg_value ?? 0),
            ai.recommendations ?? [],
            ai.hba1c_prediction?.value ?? 0
        );

        const smartInsight = data.smart_insight
            ? new SmartInsight(
                data.smart_insight.text ?? '',
                data.smart_insight.translation ?? '',
                data.smart_insight.context ?? '',
                (data.smart_insight.priority ?? 'low').toLowerCase() as PriorityLevel
            )
            : new SmartInsight('', '', '', 'low' as PriorityLevel);

        return new DiabetesDashboard(
            latestReading,
            weeklyAverage,
            weeklyOverview,
            medications,
            glucoseAnalysis,
            smartInsight,
            {
                generatedAt: new Date(),
                apiVersion: '1.0'
            }
        );
    }


    // Domain logic methods
    get needsMedicalAttention(): boolean {
        return this.currentReading.isHigh ||
            this.analysis.needsAttention;
    }

    get formattedMedications(): string[] {
        return this.medications.map(m => m.summary);
    }
}