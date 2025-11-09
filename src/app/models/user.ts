export class User {
    userId!: string;
    name!: string;
    lastName!: string;
    dob!: Date;
    postCode!: string;
    city?: string;
    country!: string;
    unit!: string;
    diabetesType!: string;
    medication?: string;
    email!: string;
    password!: string;
    password_repeat!: string;
}
