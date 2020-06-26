/**
 * the file contains all the functions related to the disk writing for the db
 */
import fs from 'fs'
import path from 'path'

// Object for holding all the functions
const lib = {}

// Cache directory path
const CACHE_DIR_PATH = '../.cache/yet-another-imdb-scraper'
lib.CACHE_DIR = CACHE_DIR_PATH

// Ensure cache directory exists
if (!fs.existsSync(path.resolve(`${CACHE_DIR_PATH}`))) {
  fs.mkdirSync(path.resolve(`${CACHE_DIR_PATH}`), { recursive: true })
}

/**
 * the method to create a file for the record on the disk
 * @param  {String}   dir    the collection of the documents
 * @param  {String}   record the document that is to be stored
 * @param  {Object}   data   the data that is to stored on the disk
 * @param  {Function} cb     the function that is to be called once the work is complete
 *                    1 err: the error in save
 *                    2 data: the data that is saved
 * @return {NULL}
 */
lib.create = (dir, record, data, cb = () => {}) => {
  const isDir = fs.existsSync(path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}`))
  if (isDir) {
    fs.writeFile(
      path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}/${record}.html`),
      data,
      err => {
        if (err) cb(err)
        else cb(null, data)
      }
    )
  } else {
    fs.mkdir(path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}`), function (err) {
      if (err) cb(err, null)
      else {
        fs.writeFile(
          path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}/${record}.html`),
          data,
          err => {
            if (err) cb(err)
            else cb(null, data)
          }
        )
      }
    })
  }
}
/**
 * the method to delete a record on disk
 * @param  {String}   dir    the collection from which document is to be deleted
 * @param  {String}   record the document which is to be deleted
 * @param  {Function} cb     the the function that is to invoked upon compeletion of task
 *                    1 err: the error in save
 *                    2 data: the data that is saved
 * @return {NULL}
 */
lib.delete = (dir, record, cb) => {
  const isDir = fs.existsSync(path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}`))
  if (isDir) {
    fs.unlink(
      path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}/${record}.html`),
      err => {
        cb(err, {
          message: 'success'
        })
      }
    )
  } else {
    cb(new Error('delete failed no such directory or file exists'))
  }
}

/**
 * the method to read the document for the disk
 * @param  {String}   dir    the collection from which the document is to be read
 * @param  {String}   record the document which is to read
 * @param  {Function} cb     the function that is to be invoked upon completion
 *                    1 err: the error in save
 *                    2 data: the data that is saved
 * @return {NULL}
 */
lib.read = (dir, record, cb) => {
  const isDir = fs.existsSync(path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}`))
  if (isDir) {
    fs.readFile(
      path.resolve(`${__dirname}/${CACHE_DIR_PATH}/${dir}/${record}.html`),
      (err, data) => {
        if (err) cb(err, null)
        else cb(err, data.toString('utf-8'))
      }
    )
  } else {
    cb(new Error('no such file or directory exists'))
  }
}

/**
 * the method to update the document on the disk
 * @param  {String}   dir    the collection of the document
 * @param  {String}   record the document which is needed to be updated
 * @param  {Object}   data   the updates to the document
 * @param  {Function} cb     the function that it to be invoked upon completion
 *                    1 err: the error in save
 *                    2 data: the data that is saved
 * @return {NULL}
 */
lib.update = (dir, record, data, cb) => {
  lib.read(dir, record, (err, oldData) => {
    if (err) cb(err, null)
    else {
      lib.create(
        dir,
        record,
        {
          ...oldData,
          ...data
        },
        (err, data) => {
          if (err) cb(err, null)
          else cb(err, data)
        }
      )
    }
  })
}

/**
 * all the function related to writing to disk
 * @type {Object}
 */
export default lib
