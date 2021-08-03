import express from 'express'
import expressSession from 'express-session'
import expressFlash from 'express-flash'
import methodOverride from 'method-override'
import logging from 'morgan'
import passport from 'passport'

import initializePassport from './PassportConfig'
import IndexRouter from '../routes/IndexRouter'
import AuthController from '../typeorm/controller/Auth'

const expressApp = express()
const port = 4000

initializePassport(passport)

expressApp
  .set('views', 'views')
  .set('view-engine', 'hbs')
  .use(logging('dev'))
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(expressFlash())
  .use(expressSession({
    secret: 'SecretForSession',
    resave: false,
    saveUninitialized: false
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(methodOverride('_method'))

expressApp
  .use('/', IndexRouter)

expressApp.listen(port, () => {
  console.log(`[Express App] listening on port ${port}`)
})

const authController = new AuthController()

export default expressApp
export {
  authController
}
