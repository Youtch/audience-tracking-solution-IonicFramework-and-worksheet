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
SOFTWARE.*/

// views/scripts/ajax-commun.js

const localStorageModel = require('../../model/local-storage-model');

module.exports = {
  getServeurFireBDisponibilite:getServeurFireBDisponibilite,
  getSessionCSVFileExists:getSessionCSVFileExists
};

/**
 * Check for the availability of the firebase server (connection)
 * @param  {prototype} _firebaseService firebaseService is provided by the app.js unique instance
 * @return {string} A boolean value which is converted to string for the Ajax callback
 */
function getServeurFireBDisponibilite(_firebaseService){
  return new Promise( resolve=> {
    var oReglagesApp = localStorageModel.get_reglagesApp();
    // Reset connection with the stored parameters, and then requesting for the connection status
    _firebaseService.init(oReglagesApp.databaseUrl, oReglagesApp.serviceAccount).then( result=>{
      _firebaseService.checkFbCnxWithTypedDatabaseUrl().then( servFbDbEstDispo =>{
	     // Changing the non-persistant storage
	     localStorageModel.set_fbDbEstDispo(servFbDbEstDispo);
	      
	     resolve( servFbDbEstDispo.toString() );	
	    })
    });
  });
}

/**
 * Check for this session if a CSV-text file is yet created
 * @return {string} A boolean value which is converted to string for the Ajax callback
 */
function getSessionCSVFileExists(){
  return new Promise( resolve=> {
	  resolve(localStorageModel.get_fichierCSVGenereExiste().toString());
  });
}