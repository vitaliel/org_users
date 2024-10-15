const express = require("express");
const morgan = require("morgan");

app = express()
app.use(morgan('dev')) //dev, combined - apache similar logs

const role_map = {
  'vitalie.lazu@gmail.com': ["org-001/admin", "org-005/user"],
  'vlazu98106@gmail.com': ["org-003/user"],
}

app.get('/status', (_req, res) => { res.send({ date: new Date() }) })
app.get('/user/info', (req, res) => {
  const { email } = req.query

  if (email) {
    const roles = role_map[email]

    if (roles) {
      res.send({ email, roles })
    } else {
      res.status(404).send({ error: 'User not found.' })
    }
  } else {
    res.status(422).send({ error: 'Pass user email.' })
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
        res.status(404).send({ error: 'Role not found.' })
      }
    } else {
      res.status(404).send({ error: 'User not found.' })
    }
  } else {
    res.status(422).send({ error: 'Pass user email.' })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Listening on port ' + port)
})
