const HolidayNoticeApi = require('../api/holidayNotice')
const to = require('../service/to')

class HolidayNotice {
    static async holiday (req, res) {
        const [err, status] = await to(HolidayNoticeApi.holiday())
        if (err) {
            let { statusCode, error }= err
            return res.status(statusCode || 200).json(error)
        }
        res.json(status)
    };
}

module.exports = HolidayNotice
