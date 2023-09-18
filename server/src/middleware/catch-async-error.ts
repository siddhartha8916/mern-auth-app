import { Request, Response, NextFunction } from 'express'

// Define the type for asyncError
type AsyncErrorHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const catchAsyncError = (asyncError: AsyncErrorHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(asyncError(req, res, next)).catch(next)
}

export default catchAsyncError
