/**
 * getGenre - return the array of genre of the movies
 *
 * @param {Object} $ then cheerio loaded html string
 *
 * @returns {Object} object with genre key and value as array of string
 */
export function getGenre ($) {
  try {
    const genreString = $('div.see-more:nth-child(10)')
      .text()
      .split('\n')
    genreString.pop()
    genreString.splice(0, 2)
    return {
      genre: genreString
        .join('')
        .split('|')
        .map(gen => gen.trim())
    }
  } catch (e) {
    return { genre: ['N/A'] }
  }
}

/**
 * getStory - gives the story of the movies
 *
 * @param {Object} $ the cheerio load html string
 *
 * @returns {Object} the object with key story and value as string pf plot of movie
 */
export function getStory ($) {
  try {
    return {
      story: $('div.inline:nth-child(3) > p:nth-child(1) > span:nth-child(1)')
        .text()
        .trim()
    }
  } catch (e) {
    return { story: 'N/A' }
  }
}

/**
 * getPro - gives directors and writers
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Object} the key can be director or directors and writer or writers
 */
export function getPro ($) {
  try {
    const creditDetails = {}
    $('.credit_summary_item').each(function (i, elem) {
      const creditText = $('.inline', elem)
        .text()
        .trim()
        .match(/\w*/)[0]
        .toLowerCase()
        .trim()

      creditDetails[creditText] = []
      creditDetails[creditText].push(
        $('a', elem)
          .first()
          .text()
          .trim()
      ) // handle the first person

      // handle rest people  until the 'See more' links
      $('a', elem)
        .nextUntil('span')
        .each(function (index2) {
          creditDetails[creditText].push(
            $(this)
              .text()
              .trim()
          )
        })
    })
    return creditDetails
  } catch (e) {
    return {
      directors: 'N/A',
      writers: 'N/A',
      stars: 'NA'
    }
  }
}

/**
 * getYear - The release year of the movie or tv
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Object} the key is year and value is string of release year
 */
export function getYear ($) {
  try {
    return {
      year:
        $('#titleYear > a:nth-child(1)').text() ||
        $('a[title=\'See more release dates\']')
          .text()
          .match(/\d{4}/)[0]
          .trim()
    }
  } catch (error) {
    return {
      year: ''
    }
  }
}

/**
 * getRuntime - The runtime of movie or tv shows
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Object} the key is runtime with value is string
 */
export function getRuntime ($) {
  try {
    return {
      runtime: $('.subtext time')
        .text()
        .trim()
    }
  } catch (e) {
    return { runtime: '' }
  }
}

/**
 * getEpisodeCount - the function provide the number of episode and season
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Object} the key is episodes and seasons
 */
export function getEpisodeCount ($) {
  try {
    const headingText = $('.bp_heading')
      .text()
      .trim()
    if (headingText === 'Episode Guide') {
      return {
        episodes: $('.bp_sub_heading')
          .text()
          .trim(),
        seasons: $('.seasons-and-year-nav > div:nth-child(4) > a:nth-child(1)')
          .text()
          .trim()
      }
    } else {
      return {}
    }
  } catch (e) {
    return {}
  }
}

/**
 * getRating - it provide rating of movie and tv show
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Object} the key is rating
 */
export function getRating ($) {
  return {
    rating: $('.ratingValue > strong:nth-child(1) > span:nth-child(1)')
      .text()
      .trim()
  }
}

export function getTitle ($) {
  return {
    title: $('.title_wrapper > h1:nth-child(1)')
      .text()
      .split('    ')[0]
      .trim()
  }
}

/**
 * getStar - the function to get star or cast
 *
 * @param {Object} $ cheerio loaded string
 *
 * @returns {Object} the object contains id ,name,photoUrl
 */
export function getStar ($) {
  return function (index, element) {
    const id = $(this)
      .find('.lister-item-image a')
      .attr('href')
      .replace('/name/', '')
      .trim()
    const name = $(this)
      .find('.lister-item-image a img')
      .attr('alt')
      .trim()
    const photoUrl = $(this)
      .find('.lister-item-image a img')
      .attr('src')
      .trim()
    return { id, name, photoUrl }
  }
}

/**
 * getStars - the functions give star and cast
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Object} the keys are stars
 */
export function getStars ($) {
  const stars = $('.lister-list .lister-item').map(getStar($))
  return Array.from(stars)
}

/**
 * getSimilarMovieTitle - provide the similar movies or related movies
 *
 * @param {Object} $ cheerio loaded html
 *
 * @returns {Object} the keys are id ,poster,name
 */
export function getSimilarMovieTitle ($) {
  return function (index, element) {
    const id = $(this)
      .find('a')[0]
      .attribs.href.split('/')[2]
    const _data = $(this).find('.rec_poster_img')[0].attribs
    return { id, poster: _data.loadlate.trim(), name: _data.title.trim() }
  }
}

/**
 * getSimilarMoviesById - provide related movie is array
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Array}
 */
export function getSimilarMoviesById ($) {
  const similarMoviesList = $('.rec_poster').map(getSimilarMovieTitle($))
  return { related: Array.from(similarMoviesList) }
}
