
class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
    public errName?: string;


    constructor(message: string , statusCode: number, errName?: string){
        super(message)

        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errName = errName;
        Error.captureStackTrace(this);
    }

}
export default AppError;