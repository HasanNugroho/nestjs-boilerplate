export class ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string | string[];
    data?: T; // Optionally include the response data

    constructor(
        statusCode: number,
        success: boolean,
        message: string | string[],
        data?: T
    ) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
