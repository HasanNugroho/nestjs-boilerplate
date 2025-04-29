export class ApiResponse<T> {
    statusCode: number;
    timestamp: string;
    error: string;
    message: string | string[];
    data?: T; // Optionally include the response data

    constructor(
        statusCode: number,
        error: string,
        message: string | string[],
        data?: T
    ) {
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.data = data;
    }
}
