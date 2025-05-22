export interface RfrAndComment {
    text: string;
    type: string;
    dangerous: boolean;
}

export interface MotTest {
    completedDate: string;
    testResult: string;
    expiryDate?: string;
    odometerValue: string;
    odometerUnit: string;
    motTestNumber: string;
    odometerResultType: string;
    rfrAndComments: RfrAndComment[];
}

export interface VehicleTestHistory {
    motTests: MotTest[];
}

export interface ApiResponse {
    testHistory: VehicleTestHistory;
}
