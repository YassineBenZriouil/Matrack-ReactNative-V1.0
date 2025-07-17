export type LoginCredentials = {
    username: string;
    password: string;
};

export type RegisterData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: string;
};

export interface LicensePlate {
    id: string;
    plateNumber: string;
    vehicleType: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    ownerName: string;
    ownerPhone?: string;
    registrationDate: Date;
    expiryDate: Date;
    status: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AppSettings {
    camera: {
        autoFocus: boolean;
        flashMode: string;
        quality: string;
    };
    search: {
        autoSearch: boolean;
        saveHistory: boolean;
        maxHistoryItems: number;
    };
    theme: string;
    language: string;
}
