const Config = require('./config')

class HolidayNotice extends Config {
    static holiday() {
        return this.fetchDotNetApi(`${this._apiUrl}/Holidaies`, {
            method: 'GET',
            // token: `Bearer ${token}`,
            // roleType
        })
    }
}

module.exports = HolidayNotice;
