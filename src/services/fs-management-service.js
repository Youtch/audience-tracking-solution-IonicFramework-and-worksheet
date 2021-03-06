/*MIT License

Copyright (c) 2020 FRANÇOIS GARDIEN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// services/fs-management-service.js

'use strict'

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();//It's required to load process.env in a global variable or constant
const DateOperationsService = require('./date-operations-service.js');
const configConstants = require('../config/config-constants');
const utilsService = require('./utils-service');

module.exports = {
  creerFichier : creerFichier,
  getInfosFichier : getInfosFichier,
};

const UPLOAD_PATH = path.resolve(__dirname, "..", process.env.DIR_FICHIERS_CSV)

//Create folder if it doesn't exist
// @DEV : to test !
function init(){
  !fs.existsSync(this.uploadPath) && mkdirp.sync(this.uploadPath);
}

/**
 * [creerFichier description]
 * @param  {string} _fileName
 * @param  {string} _donneesTextuelles
 * @return {Promise<boolean>}
 */
function creerFichier(_fileName, _donneesTextuelles){
  return new Promise(resolve => {
  	try{
      /**Writing mode options :
       - w = Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
       - wx = Like 'w' but fails if the path exists.
       @DEV : https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_file_system_flags
      */
     console.log("UPLOAD_PATH + process.env.DIR_SEPARATEUR + _fileName = " + UPLOAD_PATH + process.env.DIR_SEPARATEUR + _fileName);
      fs.writeFile(UPLOAD_PATH + process.env.DIR_SEPARATEUR + _fileName, _donneesTextuelles, {encoding:"utf8", flag:"wx"}, (err) => {
        if(err) 
          resolve(false);
        resolve(true);
      });
    }
    catch(err){
      resolve(false);
    }
	});
}


/**
 * Open file constants : cf https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_file_open_constants
 * @DEV : cf https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_class_fs_stats
 *    
 * @param  {string} _fileName
 * @return {Object<nom:string, poidsHuman:string, creaDateHoraireHuman:string>}
 */
function getInfosFichier(_fileName){
  return new Promise(resolve => {
    fs.stat(UPLOAD_PATH + process.env.DIR_SEPARATEUR + _fileName, (err, stat) => {
  	  if (err) throw err;
  	  const dateStatCreation = new Date(stat.birthtimeMs);
  	  const dateService = new DateOperationsService();
      const poids = utilsService.getHumanReadableFileSize(stat.size);
      const data = {
          nom: _fileName,
          poidsHuman: poids.size+" "+poids.unitOfMeasure,
          creaDateHoraireHuman: (dateService.getDateToShortHumanText_i18n(dateStatCreation, configConstants.DATE_LANG_IS_FR, true, configConstants.DATE_FORMAT, false, true, 1, true)).toLowerCase()
      };
      resolve(data);
    });
  });
}