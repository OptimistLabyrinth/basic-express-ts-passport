import express, { NextFunction, Request, Response } from 'express'
import passport from 'passport'

import Auth from '../typeorm/entity/Auth'
import { authController } from '../src/Server'

const IndexRouter = express.Router()

IndexRouter.get('/', (req, res) => {
  res.render('index.hbs', { signedin: req.isAuthenticated() })
})

IndexRouter.get('/sign-up', (req, res) => {
  let message = ''
  if (res.app.locals.duplicateEmail) {
    res.app.locals.duplicateEmail = false
    message = 'Same email has already been signed up'
  }
  else if (res.app.locals.signUpFailed) {
    res.app.locals.signUpFailed = false
    message = 'Sign up failed because of server internal error'
  }
  res.render('sign-up.hbs', { message })
})

IndexRouter.post('/sign-up/user', async (req, res) => {
  const auth = await authController.findAuthByEmail(req.body.email)
  if (auth) {
    res.app.locals.duplicateEmail = true
    res.redirect('/sign-up')
  }
  else if (await authController.saveAuth(req.body)) {
    res.redirect('/sign-in')
  }
  else {
    res.app.locals.signUpFailed = true
    res.redirect('/sign-up')
  }
})

IndexRouter.get('/sign-in', checkNotAuthenticated, (req, res) => {
  res.render('sign-in.hbs')
})

IndexRouter.post('/sign-in/user',
  passport.authenticate('local', {
    successRedirect: '/my-page',
    failureRedirect: '/sign-in',
    failureFlash: true
  })
)

IndexRouter.get('/my-page', checkAuthenticated, async (req, res) => {
  let userName = ''
  let userEmail = ''
  const reqUser = (await req.user) as Auth
  if (req.user) {
    const currentUser = reqUser
    if (currentUser.name) {
      userName = currentUser.name
    }

    if (currentUser.email) {
      userEmail = currentUser.email
    }
  }
  res.render('my-page.hbs', {
    body: {
      name: userName,
      email: userEmail
    }
  })
})

IndexRouter.get('/secret', checkAuthenticated, (req, res) => {
  res.render('secret.hbs')
})

IndexRouter.delete('/sign-out', (req, res) => {
  req.logOut()
  res.redirect('/')
})

IndexRouter.get('/users', async (req, res) => {
  const listOfAuth = await authController.listAuth()
  res.send(listOfAuth)
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/sign-in')
}

function checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/my-page')
}

export default IndexRouter
