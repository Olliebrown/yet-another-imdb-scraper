/**
 * Main file for library: the API is exposed from here
 * - All functions exported return promises
 * */

import { timeFormat as d3TimeFormat } from 'd3-time-format'
import cheerio from 'cheerio' // import cheerio for making use of css selector to get info

import { request } from './src/request' // importing request for making get request
import { ifError } from './src/error' // error file
import { getWinner } from './src/awards' // awards are provided
import { getCast, getPoster } from './src/photo' // poster and cast info is given by this function
import { getEpisodes } from './src/episode'
import {
  getRating,
  getGenre,
  getPro,
  getStory,
  getTitle,
  getRuntime,
  getYear,
  getEpisodeCount,
  getStars,
  getSimilarMoviesById
} from './src/data'
import { getActorData } from './src/actor'

// Re-expose internal functions
export * from './src/request'
export * from './src/photo'
export { getTrending, getTrendingGenre } from './src/trending'
export { search, searchActor, simpleSearch } from './src/search'
export { getUpcoming } from './src/upcoming'

// Helpful constants
const getMonthDay = d3TimeFormat('%m-%d')
const BASE_URL = 'https://www.imdb.com'

/**
 * scrapper - the function to get meta data about movie or tv show
 *
 * @param {type} id The id of movie or tv show
 *
 * @returns {Promise<Object>} the keys are
 * title,runtime,year,story,writers|writer,producer|producers,
 * director|directors,genre,poster,episodes,seasons,related
 */
export function scrapper (id) {
  var options = ''
  if (typeof id === 'object') {
    options = id
  } else {
    options = `${BASE_URL}/title/${id}/?ref_=nv_sr_1`
  }

  return request(options)
    .then(data => {
      const $ = cheerio.load(data)

      return {
        ...getTitle($),
        ...getRuntime($),
        ...getYear($),
        ...getStory($),
        ...getPro($),
        ...getGenre($),
        ...getRating($),
        ...getPoster($),
        ...getEpisodeCount($),
        ...getSimilarMoviesById($)
      }
    })
    .catch(ifError)
} // combining all the low level api in the single one

/**
 * awardsPage - get top three awards won by the movies
 *
 * @param {type} id id of the movie
 *
 * @returns {Promise<Array>} array contains object
 */
export function awardsPage (id) {
  return request(`${BASE_URL}/title/${id}/awards?ref_=tt_awd`)
    .then(data => {
      const $ = cheerio.load(data)
      return [getWinner(4, $), getWinner(7, $), getWinner(10, $)]
    })
    .catch(ifError)
}

/**
 * episodesPage - provides the episodes of particular series
 *
 * @param {String}   id         the id of movie or tv show
 * @param {number} [season=1] Description
 *
 * @returns {Promise<Array>} array contains the object
 */
export function episodesPage (id, season = 1) {
  return request(`https://www.imdb.com/title/${id}/episodes?season=${season}`)
    .then(data => {
      const $ = cheerio.load(data)
      return { ...getEpisodes($) }
    })
    .catch(ifError)
}

/**
 * getStarsByBornDay - the function provide the days stars were born
 *
 * @param {object} [date={}] the date which born stars are required
 *
 * @returns {Promise<Array>} the array contains the object
 */
export function getStarsByBornDay (date = new Date()) {
  const monthDay = getMonthDay(date)
  return request(
    `${BASE_URL}/search/name?birth_monthday=${monthDay}&refine=birth_monthday&ref_=nv_cel_brn`
  )
    .then(data => {
      const $ = cheerio.load(data)
      return getStars($)
    })
    .catch(ifError)
}

/**
 * getStarsBornToday - get stars born today
 *
 * @returns {Promise<Array>} array contains the object
 */
export function getStarsBornToday () {
  return getStarsByBornDay(Date.now())
}

/**
 * getFull - get all the details of a particular movie
 *
 * @param {type} id the id movie or the tv show
 *
 * @returns {Promise<object>}
 */
export function getFull (id) {
  return Promise.all([scrapper(id), awardsPage(id), getCast(id)])
    .then(data => {
      return { ...data[0], awards: data[1], ...data[2] }
    })
    .catch(ifError)
}

/**
 * getActor - get actor detail
 *
 * @param {type} id of the actor
 *
 * @returns {Promise<Array>} the array contains the object
 */
export function getActor (id) {
  return request(`https://www.imdb.com/name/${id}/?ref_=tt_cl_t1`)
    .then(data => {
      const $ = cheerio.load(data)
      return getActorData($)
    })
    .catch(ifError)
}
