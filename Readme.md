# Yet Another IMDB Scrapper

A fork of of the IMDB Scraper by sunbirder with some extra features and cleaned up to follow Standard JS. Every function in this lib is asynchronous, they all return a promise:

1.  `scrapper(id)`: `id` refers to IMDB ID like _tt1825683_. This function provides some basic metadata like genre, runtime, plot etc.
2.  `awardsPage(id)`: `id` refers to IMDB ID like _tt1825683_. This function provides list of awards won by the movie. By default it provides first three awards or most rated ones.
3.  `getCast(id[,n])`: `id` refers to IMDB ID like _tt1825683_, `n` is optional, it specify number of actors and actresses. By default it is set to 20. This function provide cast of the movies.
4.  `getFull(id)`: `id` refers to IMDB ID like _tt1825683_. This function is the amalgamation of above three. And its configurations are set to default.
5.  For making a get request use **request**
6.  `getActor(id)` : To get detail of the actor id is the IMDB actor id like _nm43124_.This function provide basic info about the actor like name, birthdate, image etc
7.  `searchActor(term)`: This function provide the search functionality for actors
8.  `episodePage(id,seasonNumber)`: The season no. is the season which is required
9.  `simpleSearch(term)`: This provide a fast way to get autocomplete suggestions .Under the hood it uses the IMDB api for result. No scrapping is involved in the process.
10. `serach(term)` : This provide api to serach for `term` using scrapping.
11. `getTrendingGenre(genre,n), getTrending(n,type)`: Get movies trending based on `genre` or `type =['tv','movies']`.
12. `getStarsBornToday(),getStarsBorn(date)`: Gives the stars born on `date` or today.
13. `changeQuality(url,n)`: A function to change the quality of image in `url` based on the scale of _0-5_ n specify the scale .
