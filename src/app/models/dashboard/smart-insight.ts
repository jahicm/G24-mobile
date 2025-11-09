export type PriorityLevel = 'high' | 'medium' | 'low';

export class SmartInsight {
    constructor(
        public readonly text: string,
        public readonly translation: string,
        public readonly context: string,
        public readonly priority: PriorityLevel
    ) { }

    get priorityColor(): string {
        const colors = {
            high: '#ff4444',
            medium: '#ffbb33',
            low: '#00C851'
        };
        return colors[this.priority];
    }
}