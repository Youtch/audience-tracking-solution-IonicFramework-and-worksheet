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

// services/generer-csv-service.js

const configConstants = require('../config/config-constants');

module.exports = {
  miseEnFormeContenu:miseEnFormeContenu
}

/**
 * The contents is formated : adding separators and carriage-return of the fields  ; Adding the labels of the columns
 * @param _aJeuDonneesConcat:Array
 * @return string
 */
function miseEnFormeContenu(_aJeuDonneesConcat){
  let contenuFichier;
	contenuFichier = configConstants.LIBELLES; // + "\n";
  
  _aJeuDonneesConcat.forEach( (item)=>{
    contenuFichier = contenuFichier + item.key + ";" + item.date + ";" + item.sessionKey + ";" + item.statsSessionId + ";" + item.licenceEstPremium + ";" +  item.androidVersion + ";" + item.page + ";" + item.composantUI + ";" + 
      item.cheminNavigation + ";" + item.nombreCmpsCmpsntUINonDstnctVisites + ";" + item.nombrePagesVisitees + ";" + item.nbUiAidesOuverts +
      "\r\n" ;
  });
	return contenuFichier;
}