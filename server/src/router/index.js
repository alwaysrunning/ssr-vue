// const auth = require('../middleware/auth')();
const illegalAccess = require('../middleware/illegalAccess')
// import UserLogger from '../middleware/userLogger'

module.exports = app => {
    const holidayNotice = require('../controller/holidayNotice')

    app.route('/api/holidayNotice/holiday')
        .get(illegalAccess.limitTimes, holidayNotice.holiday)
}
