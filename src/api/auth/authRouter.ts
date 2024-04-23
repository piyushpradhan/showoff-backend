import { Router } from 'express';
import passport from 'passport';

import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { AuthService } from './authService';

export const authRouter: Router = (() => {
  const authService = new AuthService();
  const router = Router();

  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['email', 'profile'],
    })
  );

  // Redirected during authentication
  router.get('/google/redirect', passport.authenticate('google'), async (req, res) => {
    const serviceResponse = await authService.loginWithGoogle(
      // @ts-expect-error somehow define the type of user
      req.user?.id,
      // @ts-expect-error somehow define the type of user
      req.user?.displayName,
      // @ts-expect-error somehow define the type of user
      req.user?.emails[0]?.value
    );
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
