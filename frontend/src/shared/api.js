const REDIS_BASE_URL = 'http://localhost:8080/redistalk'
const CONVERSION_BASE_URL = 'http://localhost:8080/conversion'
// Api 6
const setKeyValue = () => {
  const url = `${REDIS_BASE_URL}/set`
}

const getGibberish = async (pageUrl) => {
  const url = `${CONVERSION_BASE_URL}/utg/${pageUrl}`
  const contents = await fetch(url)
  return contents.text()
}

const getUrl = async (gibberish) => {
  const url = `${CONVERSION_BASE_URL}/gtu/${gibberish}`
  const contents = await fetch(url)
  return contents.text()
}

const getReportCount = async (pageUrl)
export { setKeyValue, }