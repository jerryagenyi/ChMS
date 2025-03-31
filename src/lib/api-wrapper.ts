import { errorHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';

export const createApiHandler = (handler: ApiHandler, options: ApiOptions = {}) => {
  return errorHandler(
    validate(options.validation)(
      async (req) => {
        // Your handler logic
        return handler(req);
      }
    )
  );
};