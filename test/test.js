/**
 * This file contains all the test that are Written for testing our package
 * please add test if any new user facing api is added
 * use displayMessage for showing error or success
 * never add  console.log for any the data that a function is returned
 * */
import {
  getFull,
  getStarsByBornDay,
  getStarsBornToday,
  episodesPage
} from '../index.js'

/**
 * displayMessage - show error or success message
 *
 * @param {String} msg   the tested function name
 * @param {Boolean} status the status of the working of tested functions
 *
 * @returns {Undefined}
 */
function displayMessage(msg, status) {
  status
    ? console.log(`${msg} is working fine`)
    : console.error(`Something is wrong with ${msg}`);
}

function testGetStarsByBornDay() {
  return getStarsByBornDay(new Date('2018-10-2')).then(data => {
    const isValid = data.length > 0;
    displayMessage('Stars By Born Day', isValid);
  });
}

function testGetStarsBornToday() {
  return getStarsBornToday().then(data => {
    const isValid = data.length > 0;
    displayMessage('Stars Born Today', isValid);
  });
}
function test() {
  Promise.all([
    getFull('tt2395427'),
    getFull('tt0944947'),
    episodesPage('tt2177461'),
    episodesPage('tt0436992', -1),
    testGetStarsBornToday(),
    testGetStarsByBornDay()
  ]).then(data => {
    let movieDetails = data[0];
    const expectedMovieDetails = {
      title: 'Avengers: Age of Ultron (2015)',
      runtime: '2h 21min',
      year: '2015',
      story:
        'Tony Stark creates the Ultron Program to protect the world, but when the peacekeeping program becomes hostile, he Avengers go into action to try and defeat a virtually impossible enemy together. Earths mightiest heroes must come together once again to protect the world from global extinction.                Written byapplenatalia9            ',
      director: ['Joss Whedon'],
      writers: ['Joss Whedon', 'Stan Lee'],
      stars: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
      genre: ['Action ', 'Adventure ', 'Sci-Fi'],
      rating: '7.4'
    };

    const moviesTestValid = movieDetails.title === expectedMovieDetails.title;
    displayMessage('Movie Details', moviesTestValid);

    let seriesDetails = data[1];
    const expectedSeriesDetails = {
      title: 'Game of Thrones',
      runtime: '57min',
      year: '2011',
      story:
        '    In the mythical continent of Westeros, several powerful families fight for control of the Seven Kingdoms. As conflict erupts in the kingdoms of men, an ancient enemy rises once again to threaten them all. Meanwhile, the last heirs of a recently usurped dynasty plotto take back their homeland from across the Narrow Sea.',
      creators: ['David Benioff', 'D.B. Weiss'],
      stars: ['Emilia Clarke', 'Peter Dinklage', 'Kit Harington'],
      genre: [' Action ', ' Adventure ', ' Drama ', ' Fantasy ', ' Romance'],
      rating: '9.5',
      episodes: '73 episodes'
    };

    //series should have year, runtime, episode count
    let seriesTestValid =
      seriesDetails.title === expectedSeriesDetails.title &&
      seriesDetails.year === expectedSeriesDetails.year &&
      seriesDetails.runtime === expectedSeriesDetails.runtime &&
      seriesDetails.episodes !== null;
    displayMessage('Series Details', seriesTestValid);

    let seriesEpisode = data[2].episodes[0];
    const expectedSeriesEpisodeDetails = {
      story:
        'Things get creepy for historian and closet witch, Diana Bishop, when she calls up a magical manuscript. Her discovery is about to throw her back into the world of magic and into the path of Matthew Clairmont, a centuries old vampire.',
      airDate: '14 Sep. 2018',
      rating: '8.6'
    };

    let episodeTestValid =
      seriesEpisode.story === expectedSeriesEpisodeDetails.story &&
      seriesEpisode.airDate === expectedSeriesEpisodeDetails.airDate &&
      seriesEpisode.rating !== null;
    displayMessage('Series Episode', episodeTestValid);

    let seriesEpisode2 = data[3].episodes[14];
    const expectedSeriesEpisodeDetails2 = {
      story: 'N/A',
      airDate: '16 Sep. 2012',
      rating: '7.2'
    };

    let episodeTestValid2 =
      seriesEpisode2.story === expectedSeriesEpisodeDetails2.story &&
      seriesEpisode2.airDate === expectedSeriesEpisodeDetails2.airDate &&
      seriesEpisode2.rating !== null &&
      seriesEpisode2.poster === null;
    displayMessage('Series Episode 2', episodeTestValid2);
    process.exit(0);
  });
}

if (module === require.main) {
  test();
}
