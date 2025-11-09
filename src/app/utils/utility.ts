import { Entry } from "../models/entry";
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from "../models/user";


export class Utility {

    static convertStringToDateAndFilter(entries: Entry[], fromDate: string, toDate: string): Entry[] {
        if (!fromDate || !toDate) {
            return entries;
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        return entries.filter(entry => {
            const entryDate = new Date(entry.measurementTime);
            return entryDate >= from && entryDate <= to;
        });
    }

    static decodeUserIdFromToken(token: string): string {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(sessionStorage.getItem('token') || '');
        const userId = decodedToken ? decodedToken.userId : null;
        return userId;
    }
    static normalizeUnit(entry: Entry, user: User): void {

        if (entry.unit === "mg/dL" && user && user.unit === "2") {
            entry.sugarValue = Math.round(entry.sugarValue / 18 * 100) / 100;
            entry.unit = "mmol/L";
        } else if (entry.unit === "mmol/L" && user && user.unit === "1") {
            entry.sugarValue = Math.round(entry.sugarValue * 18 * 100) / 100;
            entry.unit = "mg/dL";
        }
    }
}
