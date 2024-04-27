import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';

import { logger } from '@/server';

import { env } from '../utils/envConfig';

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Getting the refresh token and stuff', accessToken, refreshToken, profile);
      logger.info(accessToken, refreshToken, profile);
      done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
