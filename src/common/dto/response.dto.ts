export class ApiResponse<T> {
    statusCode: number;
    timestamp: string;
    error: string;
    path: string;
    message: string | string[];
    data?: T; // Optionally include the response data

    constructor(
        statusCode: number,
        error: string,
        message: string | string[],
        path: string,
        data?: T
    ) {
        this.statusCode = statusCode;
        this.path = path;
        this.error = error;
        this.message = message;
        this.data = data;
    }
}
