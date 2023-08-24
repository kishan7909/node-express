const Candidate = require('../models/Candidate')
const Professional = require('../models/Professional')
const Education = require('../models/Education')
const Experience = require('../models/Experience')
const fs = require("fs");
const { fileUpload } = require('../middleware/contentful');
const { sendcandidateRegistrationSuccessfully } = require('../middleware/Emails/email');


exports.createCandidatesCsvFile = async (req, res) => {
  try {

    const candidate_Data = await Candidate.query().upsertGraph(req.body, {
      insertMissing: true,
    })
    res.json({ candidate_Data, msg: "success" })
  }
  catch (err) {
    console.info('----------------------------');
    console.info('candidate create err =>', err);
    console.info('----------------------------');
    res.json({ columns: err?.columns, constraint: err?.constraint })
  }
}

exports.createCandidates = async (req, res) => {
  let candidate = req.body
  if (req?.files?.image) {
    let resp = await fileUpload(req.files.image)
    candidate.image = `https:${resp.url}`
  }
  if (req?.files?.resume) {
    let resp = await fileUpload(req.files.resume)
    candidate.resume = `https:${resp.url}`
  }

  try {
    if (candidate?.professional)
      candidate.professional = JSON.parse(req.body.professional)
    await Candidate.query().insertGraph(candidate).then(async (data) => {
      await sendcandidateRegistrationSuccessfully(data)
      res.json(data)
    })
  } catch (err) {
    console.log('dataa candidate create errr', err)
    res.json({ columns: err?.columns, constraint: err?.constraint })
  }
}

exports.deleteCandidate = async (req, res) => {
  const id = req.params.id
  try {
    await Candidate.query().deleteById(id)
    res.json({ msg: 'success' })
  } catch (error) {
    console.log('delete candidate', error)
    res.json({ msg: 'delete candidate err' })
  }
}

exports.candidateUpdate = async (req, res) => {

  const candidate = req.body
  delete candidate.userId
  if (candidate?.interviewerId == 'null') {
    delete candidate?.interviewerId
  }
  if (candidate?.jobOpeningId == 'null') {
    delete candidate?.jobOpeningId
  }
  console.info('----------------------------');
  console.info('candidate =>', candidate);
  console.info('----------------------------');
  if (req?.files?.image) {
    let resp = await fileUpload(req.files.image)
    candidate.image = `https:${resp.url}`
  }
  if (req?.files?.resume) {
    let resp = await fileUpload(req.files.resume)
    candidate.resume = `https:${resp.url}`
  }

  try {

    if (candidate?.professional?.length > 0)
      candidate.professional = JSON.parse(req.body.professional)

    //candidate
    await Candidate.query().upsertGraph(candidate, {
      relate: true,
      insertMissing: true,
    })

    res.json({ msg: 'success' })
  } catch (err) {
    console.log('candidate update', err)
    res.json({ columns: err?.columns, constraint: err?.constraint })
  }
}

// Filter Data
exports.getCandidates = async (req, res) => {
  let { page, perPage } = req.query
  page -= 1
  const basicDetails = req.body
  const field = ['industriesId', 'jobCategoryId', 'gender', 'expectedsalary', 'currentSalary']
  let select = []
  if (basicDetails?.industriesId || basicDetails?.userId) {
    select = ["firstname", "lastname", "gender", "city", "interviewStatus", "status"]
  }
  const candidate = await Candidate.query()
    .withGraphFetched("interviews")
    .withGraphFetched("professional.jobCategory")
    .withGraphJoined('[professional.jobCategory, professional.industries]')
    .select(select)
    .where((builder) => {

      for (const key in basicDetails) {

        if (field.includes(key)) {
          builder.andWhere(key, `${basicDetails[key]}`)
        } else if (key == "userId" && select?.length > 0) {
          builder.orWhere(`candidates.${key}`, basicDetails[key])
          builder.andWhere(`candidates.interviewStatus`, "!=", "hired")
        }
        else if (key == 'comments') {
          builder.andWhere(`candidates.${key}`, 'ilike', `%${basicDetails[key]}%`)
        }
        else {
          builder.andWhere(key, 'ilike', `%${basicDetails[key]}%`)
        }

      }
    })
    .page(page, perPage)
    .orderBy('status', 'aesc')
  try {
    res.json(candidate)
  } catch (error) {
    console.log('Candidate Filter', error)
  }
}

//candidate view update
exports.candidateView = async (req, res) => {
  const id = req.params.id
  await Candidate.query()
    .update({ status: 'view' })
    .where('id', id)
    .then(() => res.json({ msg: 'success' }))
}


exports.checkCandidate = async (req, res) => {
  const { mobile, email } = req.body

  try {
    let msg = {}
    const mobileData = await Candidate.query().where("mobile", mobile)
    const emailData = await Candidate.query().where("email", email)
    if (emailData?.length > 0) {
      msg.email = "error"
    }

    if (mobileData?.length > 0) {
      msg.mobile = "error"
    }
    res.json(msg)
  } catch (err) {
    console.info('----------------------------')
    console.info(' check Candidate err =>', err)
    console.info('----------------------------')
  }

}

exports.hiredCandidateforClients = async (req, res) => {
  const onBoardingId = req?.query?.id
  let { page, perPage } = req.query
  page -= 1
  const candidate = await Candidate.query()
    .withGraphFetched("professional.jobCategory")
    .withGraphJoined('interviews')
    .where("interviews.onBoardingId", "=", onBoardingId)
    .andWhere("interviewStatus", "=", "hired")
    .page(page, perPage)
    .orderBy('status', 'aesc')
  try {

    res.json(candidate)
  } catch (error) {
    console.log('Candidate hired Filter', error)
  }
}