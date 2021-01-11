

const IP = require('../models.js').IP

class CheckIP {
  constructor(reqIp) {
    this.reqIp = reqIp
  }

  ipThere() {
    // console.log('reqIp: ', reqIp)
    IP.findOne({ ipAddress: this.reqIp }, (err, ipAddressFound) => {
      if (err || !ipAddressFound) {
        console.log('ip not found!')

        const ip = new IP({ ipAddress: this.reqIp })
        // ip.ipAddress = reqIp
        ip.save((err, ipAddressFound_Saved) => {
          if (err || !ipAddressFound_Saved) {
            console.log('ip not found, not saved!', err, ipAddressFound_Saved)
          }
          else {
            console.log('ip not found, saved!')
            return true
          }
        })
      }
      else {
        console.log('ip found!!')
        return false
      }
    })
  }
}

exports.CheckIP = CheckIP
