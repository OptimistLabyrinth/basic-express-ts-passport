import passport from 'passport'
import passportLocal from 'passport-local'
import Auth from '../typeorm/entity/Auth'
import { authController } from './Server'
const LocalStrategy = passportLocal.Strategy

function initializePassport(passportParam: passport.PassportStatic) {
  const authenticateUser: passportLocal.VerifyFunction = async (email, password, done) => {
    const user = await authController.findAuthByEmail(email)
    if (!user) {
      return done(null, false, { message: 'No user with that email' })
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password' })
    }
    return done(null, user)
  }

  passportParam.use(new LocalStrategy({
      usernameField: 'email', passwordField: 'password'
    }, authenticateUser))
  passportParam.serializeUser((user, done) => {
    const currentUser = user as Auth
    return done(null, currentUser.id)
  })
  passportParam.deserializeUser((id, done) => {
    const currentId = id as number
    return done(null, authController.findAuthById(currentId))
  })
}

export default initializePassport
