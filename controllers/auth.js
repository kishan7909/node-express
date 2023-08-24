const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.loginUser = async (req, res) => {
  var { email, password } = req.body
  await User.query()
    .findOne({
      email,
      password,
    }).withGraphFetched("role").withGraphFetched("clients.industries")
    .then((result) => {
      if (result !== undefined) {
        jwt.sign(
          { result },
          process.env.SECRET,
          { expiresIn: process.env.EXPIRES_IN },
          (err, token) => {
            res.json({
              token,
              user: result,
            })
          },
        )
      } else {
        res.json({
          msg: 'user is not valid',
        })
      }
    })
    .catch((err) => console.log('login user', err))
}

exports.refreshToken = async (req, res) => {
  var { email, password } = req.body

  // const email = req.body.email
  await User.findOne({
    where: { email, password },
  })
    .then((result) => {
      if (result) {
        jwt.sign(
          { result },
          process.env.SECRET,
          { expiresIn: process.env.RE_EXPIRES_IN },
          (err, token) => {
            res.json({
              token,
              user: result,
            })
          },
        )
      } else {
        res.json({
          msg: 'user is not valid',
        })
      }
    })
    .catch((err) => console.log('login user', err))
}
