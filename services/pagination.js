function getOffset(req) {
  console.log(req)
  let offset = 0
  if (req.query.page) {
    offset = (req.query.page - 1) * pageLimit
  }
  return offset
}

function paginate(req, count, pageLimit) {
  const page = Number(req.query.page) || 1
  const pages = Math.ceil(count / pageLimit)
  const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
  const prev = page - 1 < 1 ? 1 : page - 1
  const next = page + 1 > pages ? pages : page + 1
  return page, totalPage, prev, next
}


module.exports = {
  getOffset,
  paginate
}