import express, { NextFunction, Request, Response } from 'express'
import passport from 'passport'

import type { User } from './Users'
import users, { getUserByEmail } from './Users'

const IndexRouter = express.Router()

IndexRouter.get('/', (req, res) => {
  res.render('index.hbs', { signedin: req.isAuthenticated() })
})

IndexRouter.get('/sign-up', (req, res) => {
  let message = ''
  if (res.app.locals.signUpFailed) {
    res.app.locals.signUpFailed = false
    message = 'The same email is already signed up'
  }
  res.render('sign-up.hbs', { message })
})

IndexRouter.post('/sign-up/user', (req, res) => {
  const user = getUserByEmail(req.body.email)
  if (!user) {
    const newUser = {
      id: Date.now().toString(),
      ...req.body
    }
    users.push(newUser)
    res.redirect('/sign-in')
  } else {
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

IndexRouter.get('/my-page', checkAuthenticated, (req, res) => {
  let userName = ''
  let userEmail = ''
  if (req.user) {
    const currentUser = req.user as User
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

IndexRouter.get('/users', (req, res) => {
  res.send(JSON.stringify(users, null, 2))
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
