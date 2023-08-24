const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const path = require("path")
const fs = require('fs')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  connectionTimeout: 10 * 60 * 1000
})

exports.sendEmailLink = async (user) => {
  const filePath = path.join(__dirname, './tamplates/forgotPassword.html')
  const source = fs.readFileSync(filePath, 'utf-8').toString()
  const template = handlebars.compile(source)
  const token = jwt.sign({ user }, process.env.SECRET, {
    expiresIn: process.env.FORGOT_PASSWORD_TIMEOUT,
  })
  const replacements = {
    name: user.name,
    link: `${process.env.FORGOT_PASSWORD_LINK}id=${user?.id}&token=${token}`
  }
  const htmlToSend = template(replacements)
  await transporter.sendMail({
    from: process.env.USER,
    to: user?.email,

    subject: 'Reset Password',
    html: htmlToSend,
  })
}

exports.sendInterviewRequest = async (req, res) => {
  const filePath = path.join(__dirname, "./tamplates/interviewRequest.html")
  const source = fs.readFileSync(filePath, 'utf-8').toString()
  const template = handlebars.compile(source)
  const { client, candidate } = req.body
  const replacements = {
    clientName: client?.companyowner,
    CompanyName: client?.companyName,
    clientMobile: client?.mobile,
    clientemail: client?.email,
    candidateName: candidate?.firstname + candidate?.lastname,
    // candidateMobile: candidate?.mobile,
    // candidateEmail: candidate?.email

    // link: `${process.env.FORGOT_PASSWORD_LINK}id=${user?.id}&token=${token}`
  }
  const htmlToSend = template(replacements)
  await transporter.sendMail({
    from: process.env.USER,
    to: process.env.INTERVIEW_REQUEST,

    subject: 'Interview Request',
    html: htmlToSend,
  }).then(() => res.json
    ({ msg: "success" }))
}

exports.sendcandidateRegistrationSuccessfully = async (candidate) => {
  try {
    const filePath = path.join(__dirname, "./tamplates/candidateRegistrationSuccess.html")
    const source = fs.readFileSync(filePath, 'utf-8').toString()
    const template = handlebars.compile(source)

    const replacements = {
      name: `${candidate?.firstname} ${candidate?.lastname}`,
      email: candidate?.email,
      mobile: candidate?.mobile
    }
    const htmlToSend = template(replacements)
    await transporter.sendMail({
      from: process.env.USER,
      to: process.env.INTERVIEW_REQUEST,

      subject: ' New candidate added',
      html: htmlToSend,
    })
  }
  catch (err) {
    console.info('----------------------------');
    console.info('new Candidate adeed send msg =>', err);
    console.info('----------------------------');
  }
}

exports.sendClientApproval = async (client) => {

  try {
    const filePath = path.join(__dirname, "./tamplates/clientApproval.html")
    const source = fs.readFileSync(filePath, 'utf-8').toString()
    const template = handlebars.compile(source)

    const replacements = {
      name: client?.name,
      id: client?.email,
      password: client?.password
    }
    const htmlToSend = template(replacements)
    await transporter.sendMail({
      from: process.env.USER,
      to: client?.email,

      subject: 'Client Approval',
      html: htmlToSend,
    })
  }
  catch (err) {
    console.info('----------------------------');
    console.info('clietn approval send msg =>', err);
    console.info('----------------------------');
  }
}

exports.newClientAdded = async (client) => {
  try {
    const filePath = path.join(__dirname, "./tamplates/clientRegistrationSuccess.html")
    const source = fs.readFileSync(filePath, 'utf-8').toString()
    const template = handlebars.compile(source)

    const replacements = {
      name: `${client?.companyowner}`,
      email: client?.email,
      mobile: client?.mobile
    }
    const htmlToSend = template(replacements)
    await transporter.sendMail({
      from: process.env.USER,
      to: process.env.INTERVIEW_REQUEST,

      subject: ' New client added',
      html: htmlToSend,
    })
  }
  catch (err) {
    console.info('----------------------------');
    console.info('new client adeed send msg =>', err);
    console.info('----------------------------');
  }
}