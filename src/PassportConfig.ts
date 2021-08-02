import passport from 'passport'
import passportLocal from 'passport-local'
import type { User } from '../routes/Users'
import { getUserByEmail, getUserById } from '../routes/Users'
const LocalStrategy = passportLocal.Strategy

function initializePassport(passportParam: passport.PassportStatic) {
  const authenticateUser: passportLocal.VerifyFunction = (email, password, done) => {
    const user = getUserByEmail(email)
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
    const currentUser = user as User
    return done(null, currentUser.id)
  })
  passportParam.deserializeUser((id, done) => {
    const currentId = id as string
    return done(null, getUserById(currentId))
  })
}

export default initializePassport
