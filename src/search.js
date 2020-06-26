import { request } from './request'
import cheerio from 'cheerio'
import { ifError } from './error'

/**
 * search - search a term on imdb
 *
 * @param {string} term  search term
 * @param {number} [n=4] count of result
 *
 * @returns {Promise<Array>} the array of the search result
 */
export function search (term, n = 4) {
  return request(
    `https://www.imdb.com/find?q=${term}&s=tt&exact=true&ref_=fn_al_tt_ex`
  )
    .then(data => {
      const $ = cheerio.load(data)
      const result = []
      let i = 1
      while (i <= n) {
        try {
          result.push({
            poster:
              $(
                `tr.findResult:nth-child(${i}) > td:nth-child(1) > a:nth-child(1) > img:nth-child(1)`
              )[0].attribs.loadlate.split('@._')[0] + '@._V1_QL50.jpg',
            title: $(
              `tr.findResult:nth-child(${i}) > td:nth-child(2) > a:nth-child(1)`
            ).text(),
            id: $(
              `tr.findResult:nth-child(${i}) > td:nth-child(2) > a:nth-child(1)`
            )[0].attribs.href.split('/')[2]
          })
          i++
        } catch (e) {
          i++
        }
      }
      return result
    })
    .catch(ifError)
}

/**
 * simpleSearch - search directly using imdb auto suggests api
 *
 * @param {String} term       search term
 *
 * @returns {Promise<Array>}  array contains search result
 */
export function simpleSearch (term) {
  const prefix = term[0].toLowerCase()
  return request(`https://v2.sg.media-imdb.com/suggests/${prefix}/${term}.json`)
    .then(data => {
      const termWithUnderscores = term.split(' ').join('_')
      data = data.split(`imdb$${termWithUnderscores}(`)
      let re = data[1].split('')
      re.pop()
      re = re.join('')
      return JSON.parse(re)
    })
    .catch(ifError)
}

/**
 * searchActor - search actor
 *
 * @param {String} keyword the search term
 * @param {number} [n=7] number of required result
 * @returns {Promise<Array>} results of search are in the array
 */
export function searchActor (keyword, n = 7) {
  return request(`https://www.imdb.com/find?ref_=nv_sr_fn&q=${keyword}&s=nm`)
    .then(data => {
      const $ = cheerio.load(data)
      const result = []
      result.push({
        searchQuery: keyword
      })
      $('tr').each((index, element) => {
        try {
          if (index > n - 1) return false
          let image = $(element)
            .find('td.primary_photo > a > img')
            .attr('src')
          const name = $(element)
            .find('td.result_text > a')
            .text()
            .trim()
          image = image
            .replace('\'', '')
            .replace(/\\g/, '')
            .split('@._')[0] += '@._V1_UX1024_CR1024,1024,0,0_AL_.jpg'
          const id = $(element)
            .find('td.primary_photo > a')
            .attr('href')
            .split('/')[2]
          result.push({
            actorImage: image,
            actorName: name,
            actorId: id
          })
        } catch (e) {}
      })
      return result
    })
    .catch(ifError)
}
