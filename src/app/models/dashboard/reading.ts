export class Reading {
    constructor(
        public readonly sugarValue: number,
        public readonly unit: string,
        public readonly status: string,
        public readonly date?: string,
        public readonly context?:string    
    ) { }

    get isHigh(): boolean {
        return this.status.toLowerCase() === 'high';
    }
    get isNormal(): boolean {
        return this.status.toLowerCase() === 'normal'
    }
    get isLow(): boolean {
        return this.status.toLowerCase() === 'low'
    }
    get isElevated(): boolean {
        return this.status.toLowerCase() === 'elevated'
    }
    format(): string {
        return `${this.sugarValue} ${this.unit}`;
    }
}