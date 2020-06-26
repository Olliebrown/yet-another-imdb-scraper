/**
 * getActorData - get the details of the actor
 *
 * @param {Object} $ cheerio loaded html string
 *
 * @returns {Promise<Object>} the keys are actorName,actorBorn,actorInfo,actorImage,actorBirth
 */
export function getActorData ($) {
  const result = []
  const info = $('div.inline')
    .text()
    .split('\n')
    .join(' ')
    .split('...')
  const birthDate = $('div#name-born-info a:nth-child(1)')
    .text()
    .trim()
  const birthYear = $('div#name-born-info a:nth-child(2)')
    .text()
    .trim()
  const bornInfo = $('div#name-born-info a:nth-child(3)')
    .text()
    .trim()
  const name = $('h1.header span.itemprop')
    .text()
    .trim()
  const image = $('a img#name-poster')
    .attr('src')
    .trim()
  result.push({
    actorName: name,
    actorImage: image,
    actorInfo: info[0].trim(),
    actorBirth: birthDate + ', ' + birthYear,
    actorBorn: bornInfo
  })
  return result
}
