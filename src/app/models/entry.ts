export interface Entry {
  userId:string;
  dataEntryTime: Date;
  measurementTime: Date;
  value: string;
  sugarValue: number;
  unit: string;
  referenceValue: number;
  status: string;
}