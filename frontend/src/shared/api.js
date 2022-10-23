const REDIS_BASE_URL = 'http://localhost:8080/redistalk'
const CONVERSION_BASE_URL = 'http://localhost:8080/conversion'
const REPORT_BASE_URL = 'http://localhost:8080/report'
// Api 6
const setKeyValue = () => {
  const url = `${REDIS_BASE_URL}/set`
}

const getGibberish = async (pageUrl) => {
  const url = `${CONVERSION_BASE_URL}/utg/${pageUrl}`
  const contents = await fetch(url)
  return contents.json()
}

const getUrl = async (gibberish) => {
  const url = `${CONVERSION_BASE_URL}/gtu/${gibberish}`
  const contents = await fetch(url)
  return [contents.status == 200 ? await contents.json() : "Invalid site ID", contents.status == 200]
}

const getReportCount = async (pageUrl) => {
  const url = `${REPORT_BASE_URL}/count/${pageUrl}`
  const contents = await fetch(url)
  return [contents.status === 200 ? await contents.json() : "Invalid page URL", contents.status == 200]
}

const reportSite = async (gibberish) => {
  const url = `${REPORT_BASE_URL}/increment/gib/${gibberish}`
  const contents = await fetch(url, { method: 'POST' })
  return [contents.status === 200 ? "" : "Invalid site ID", contents.status == 200]
}
const getAllReports = async () => {
  const url = `${REPORT_BASE_URL}/allurls`
  const contents = await fetch(url)
  return contents.json()
}

export { getAllReports, setKeyValue, getGibberish, getUrl, getReportCount, reportSite }