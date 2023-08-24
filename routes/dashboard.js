const { dashboard, statistics, recruitorsWork, interviews, todayInterviews, candidates } = require("../controllers/dashboard")

const router = require("express").Router()

router.post("/dashboard", dashboard)
router.post("/dashboard/statistics", statistics)
router.post("/dashboard/recruitorsWork", recruitorsWork)
router.post("/dashboard/interviews", interviews)
router.post("/dashboard/todayInterviews", todayInterviews)
router.post("/dashboard/candidates", candidates)

module.exports = router