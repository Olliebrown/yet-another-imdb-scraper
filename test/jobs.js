import {
  scrapper,
  getTrendingGenre,
  getTrending,
  search,
  getFull,
  getStarsByBornDay,
  getStarsBornToday,
  awardsPage,
  episodesPage,
  getCast,
  getActor,
  searchActor,
  simpleSearch,
  getUpcoming,
  changeQuality
} from '../index.js'

const jobs = executeMe => [
  getFull('tt2395427').then(movieDetails => {
    return executeMe('getFull-tt2395427', movieDetails)
  }),

  simpleSearch('flash').then(data => {
    return executeMe('simpleSearch-flash', data)
  }),

  getTrending(7).then(data => {
    return executeMe('getTrending-7', data)
  }),

  getTrendingGenre('comedy', 7).then(data => {
    return executeMe('getTrending-comedy-7', data)
  }),

  awardsPage('tt2395427').then(movieDetails => {
    return executeMe('awardsPage-tt5580390', movieDetails)
  }),

  scrapper('tt1825683').then(movieDetails => {
    return executeMe('scrapper-tt1825683', movieDetails)
  }),

  search('new').then(result => {
    return executeMe('search-\'new world\'', result)
  }),

  episodesPage('tt3107288', 2).then(episodes => {
    return executeMe('episodesPage-tt3107288-2', episodes)
  }),
  getCast('tt1825683').then(movieDetails => {
    return executeMe('getCast-tt1825683', movieDetails)
  }),

  getActor('nm2652716').then(actorDetails => {
    return executeMe('getActor-nm2652716', actorDetails)
  }),

  searchActor('govinda').then(val => {
    return executeMe('searchActor-govinda', val)
  }),

  getUpcoming(20).then(val => {
    return executeMe('getUpcoming-20', val)
  })
]

export default jobs
