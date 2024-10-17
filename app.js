import express from "express";
import morgan from "morgan";
import requestID from 'express-request-id';

const app = express()
app.use(morgan('dev')) //dev, combined - apache similar logs
app.use(requestID()) // use req.id

const role_map = {
  'vitalie.lazu@gmail.com': ["org-001/admin", "org-005/user"],
  'vlazu98106@gmail.com': ["org-003/user"],
}

// https://learn.microsoft.com/en-us/azure/active-directory-b2c/restful-technical-profile#returning-validation-error-message
function createError(requestId, userMessage) {
  return {
    version: "1.0.0", // rest api version
    status: 409, // should be always 409
    requestId,
    userMessage,
    // "developerMessage": "Verbose description of problem and how to fix it.",
    // "code": "API12345",
    // "moreInfo": "https://restapi/error/API12345/moreinfo"
  }
}

app.get('/status', (_req, res) => { res.send({ date: new Date() }) })
app.get('/user/info', (req, res) => {
  const { email } = req.query

  if (email) {
    const roles = role_map[email]

    if (roles) {
      res.send({ email, roles })
    } else {
      res.status(404).send(createError(req.id, 'User not found.'))
    }
  } else {
    res.status(422).send(createError(req.id, 'Pass user email.'))
  }
})

app.get('/user/is_role_valid', (req, res) => {
  const { email, role } = req.query

  if (email) {
    const roles = role_map[email]

    if (roles) {
      if (roles.indexOf(role) >= 0) {
        res.send({ email, role })
      } else {
        res.status(404).send(createError(req.id, 'Role not found.'))
      }
    } else {
      res.status(404).send(createError(req.id, 'User not found.'))
    }
  } else {
    res.status(422).send(createError(req.id, 'Pass user email.'))
  }
})

export default app
