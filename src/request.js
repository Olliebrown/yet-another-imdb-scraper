import https from 'https'
import http from 'http'
import URL from 'url'
import querystring from 'querystring'
import fs from 'fs'

import promisify from './promisify'
import db from './cache'

// different protocol
const protocols = {
  'https:': https,
  'http:': http
}

// options
let _options = {
  // should we use cache
  useCache: true,
  // time of cache clearance
  timeInterval: 60 * 60 * 1000
}

// use of the path for storing cache
const cachePath = `${__dirname}/${db.CACHE_DIR}`

// cb must be function
// this is the example for supporting both promise and callback
/**
 * @required @param {String} url Must be string for making a request
 *
 * @param {Function} cb Function which is invoked when response is there
 *
 * @return {Promise<Object>}
 */
const _ajax = (url, cb) => {
  let responseData = ''
  return new Promise((resolve, reject) => {
    const parsedUrl = URL.parse(url)
    parsedUrl.query = querystring.parse(parsedUrl.search)
    const options = {
      ...parsedUrl,
      method: 'GET'
    }
    const req = protocols[parsedUrl.protocol].request(options, res => {
      res.on('data', data => {
        responseData = responseData + data
      })
      res.on('end', data => {
        if (cb && typeof cb === 'function') {
          cb(null, responseData)
        } else {
          resolve(responseData)
        }
      })
    })
    //  req.write(bodyTobeSent)
    req.on('error', err => {
      if (cb && typeof cb === 'function') {
        cb(err, null)
      } else {
        reject(err)
      }
    })
    req.end()
  })
}

/**
 * formatUrl - change the url to base64URL
 *
 * @param {String} url which is to be converted base64URL
 *
 * @returns {String} the base64url
 */
function formatUrl (url) {
  const { path } = URL.parse(url)
  return Buffer.from(path)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

/**
 * the function to make request
 * @param {object|string} options string is the url for request object is response_data
 * @param {function} cb the callback invoked when work is done
 */
export function request (options) {
  if (_options.useCache) {
    return new Promise((resolve, reject) => {
      if (typeof options === 'object') {
        resolve(options.data)
      } else {
        const url = options
        const path = formatUrl(url)
        db.read('urls', path, (err, data) => {
          if (err) {
            _ajax(url).then(val => {
              db.create('urls', path, val, (err, data) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(val)
                }
              })
            })
          } else {
            resolve(data)
          }
        })
      }
    })
  } else {
    return _ajax(options)
  }
}

/**
 * options - change the options of request properties
 *
 * @param {Object} options changes in options
 */
export function options (options) {
  _options = { ..._options, ...options }
}

/**
 * clearCache - used to clear the cache (asynchronously)
 * @return {Promise} Promise that resolves when cache is successfully cleared
 */
export function clearCache () {
  fs.readdir(cachePath, (err, path) => {
    if (err) {
      console.error('Error listing contents of cache path')
      return null
    } else {
      const deletionJob = path.map(fileName => {
        return promisify(fs.unlink)(`${cachePath}/${fileName}`)
      })
      return Promise.all(deletionJob)
    }
  })
}

const intervalId = setInterval(() => {
  clearCache()
}, _options.timeInterval)

export function stopCacheClear () {
  clearInterval(intervalId)
}
