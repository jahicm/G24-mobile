export interface EntryPayload {
  userId: string;
  dataEntryTime: string;      // ISO string without offset
  measurementTime: string;    // ISO string without offset
  value: string;
  sugarValue: number;
  unit: string;
  referenceValue: number;
  status: string;
}