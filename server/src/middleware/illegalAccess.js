
const limitTimes = (req, res, next) => {
  if (!req.session) {
    req.session = {}
  }
  if (!req.session.visitCount) {
    req.session.visitCount = 1;
  } else {
    req.session.visitCount++;
  }
  next();
};
  
const getIp = req => {
    let ip =  req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      ''
    ip = ip.match(/\d+.\d+.\d+.\d+/)
    ip = ip ?  ip.join('.') : null
    return ip
}
  
module.exports = {
    limitTimes,
    getIp,
};
  