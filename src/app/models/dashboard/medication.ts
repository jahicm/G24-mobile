export class Medication {
    constructor(
        public readonly name: string,
        public readonly type: string,
        public readonly dosage: string,
        public readonly frequency: string
    ) { }

    get summary(): string {
        return `${this.name} (${this.type}) - ${this.dosage}, ${this.frequency}`;
    }
}