import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/*This is an implementation of an AuthMiddleware in a Nest.js application. The middleware checks if an incoming request contains a JWT in the Authorization header, and if it does, it verifies the token's signature using the jsonwebtoken library and the secret key stored in an environment variable named SECRET_KEY.

Here is how the middleware works step by step:

The use method is called for each incoming request.
It retrieves the JWT from the Authorization header by splitting the header value on a space and taking the second part.
If the token is not present, the middleware returns a 401 status code and an error message indicating that access is denied and no token was provided.
If the token is present, it tries to verify the token's signature using the jsonwebtoken library and the secret key.
If the token is valid, it attaches the decoded token payload to the req object as a property named user.
Finally, it calls the next function to allow the request to proceed to the endpoint.
If the token is not valid, the middleware returns a 400 status code and an error message indicating that the token is invalid.
In this example, the middleware is set up to be used globally for all incoming requests by registering it in the application's main module.
*/

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    try {
      const decoded = jwt.verify(token, 'mysecretkey');
      req.banana = 20;
      req.user_id = decoded.id;
      next();
    } catch (error) {
      return res.status(400).send('Invalid token.');
    }
  }
}
