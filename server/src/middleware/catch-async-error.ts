import { Request, Response, NextFunction } from 'express'

type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>

const asyncMiddleware = (asyncError: AsyncMiddleware) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(asyncError(req, res, next)).catch(next)
}

export default asyncMiddleware
