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

// views/scripts/ajax-importer.js

const fsService = require('../../services/fs-management-service');
const genererCSV = require('../../services/generer-csv-service');
const utilsService = require('../../services/utils-service');

module.exports = {
  importerJeuDonnees:importerJeuDonnees, 
  mockData_importerDonnees:mockData_importerDonnees, 
  genererFichierCSV:genererFichierCSV
};

/**
 * @PRODUCTION
 * To retrieve the dataset from a Firebase Database account
 * @param  {Object} _firebaseService [description]
 * @param  {number=0|string} _dateMaxLimite   [description]
 * @param  {number=0|string} _dateMinLimite   [description]
 * @return {Object<
 *   metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string} 
 *   data:{Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string,
 *    sessionKey:string, androidVersion:string, licenceEstPremium:Boolean,
 *    nbUiAidesOuverts:number|string, nombrePagesVisitees:number|string, nombreCmpsCmpsntUINonDstnctVisites:number|string, cheminNavigation:string}>}* 
 * >}
 */
function importerJeuDonnees(_firebaseService, _dateMaxLimite, _dateMinLimite)
{  
  return new Promise( (resolve)=>{
  	_firebaseService.importerDonnees(_dateMaxLimite, _dateMinLimite).then( (oJeuDonneesConcat)=>{
  	  console.log("_firebaseService.importerDonnees lancé... oJeuDonneesConcat.length = "+ oJeuDonneesConcat.data.length );
      resolve( {data:oJeuDonneesConcat.data, metadata:oJeuDonneesConcat.metadata} );
    });
  });
}

/**
 * To retrieve dataset from the mocking database
 * @MOCK
 * @param  {Object} _firebaseService [description]
 * @param  {number=0|string} _dateMaxLimite   [description]
 * @param  {number=0|string} _dateMinLimite   [description]
 * @return { Promise< Object<
 *   metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string} 
 *   data:{Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string,
 *    sessionKey:string, androidVersion:string, licenceEstPremium:Boolean,
 *    nbUiAidesOuverts:number|string, nombrePagesVisitees:number|string, nombreCmpsCmpsntUINonDstnctVisites:number|string, cheminNavigation:string}>}
 * >}
 */
function mockData_importerDonnees(_firebaseService, _dateMaxLimite, _dateMinLimite)
{  
  console.log("mockData_importerDonnees :: _dateMaxLimite = ",_dateMaxLimite);
  console.log("mockData_importerDonnees :: _dateMinLimite = ",_dateMinLimite);
  return new Promise( (resolve)=>{
    _firebaseService.mockData_importerDonnees(_dateMaxLimite, _dateMinLimite).then( (oJeuDonneesConcat)=>{
      resolve( {data:oJeuDonneesConcat.data, metadata:oJeuDonneesConcat.metadata} );
    });
  });
}
 

/**
 * @param  {Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string, sessionKey:string, androidVersion:string, licenceEstPremium:Boolean, nbUiAidesOuverts:number|string, nombrePagesVisitees:number|string, nombreCmpsCmpsntUINonDstnctVisites:number|string, cheminNavigation:string}>} _aJeuDonneesConcat
 * @param  {string} _modeleNomFichier  [description]
 * @param  {number} _nbSessions        [description]
 * @param  {Object} _dateUtilsService  [description]
 * @return {boolean=false | Promise< Object<nom:string, poidsHuman:string, creaDateHoraireHuman:string >>}
 */
function genererFichierCSV(_aJeuDonneesConcat, _modeleNomFichier, _nbSessions, _dateUtilsService){
  return new Promise(resolve => {
  
    ////////////////// #1) Formatting data as CSV-text ////////////////// 
	let strJeuDonnees = genererCSV.miseEnFormeContenu(_aJeuDonneesConcat);



	////////////////// #2) Prepare the filename from the user's filename pattern ////////////////// 
	var aTagsPossibles = ["dateFr", "dateUs", "horaire", "nbActions", "nbSessions"];
	
	//Contening the pattern whose each keyword will be order as defined by the user
	var aTags = [];
	var value;

	var now = new Date();
	var date;
	var month;
	//Add each value matching with the keyword of the filename pattern
	if(_modeleNomFichier.search(/dateFr/)>0){
	  value = _dateUtilsService.masquageDeuxCaract(3) + "-" + 
	    _dateUtilsService.masquageDeuxCaract(3) + "-" + 
	    now.getFullYear();
	  console.log("_modeleNomFichier.search(/dateFr/ => value = "+value);
	  aTags.push({ "index":_modeleNomFichier.search(/dateFr/), "tag":value});
	}
	else if(_modeleNomFichier.search(/dateUs/)>=0){
	  value = now.getFullYear() + "-" + 
	    _dateUtilsService.masquageDeuxCaract(now.getMonth()+1) + "-" + 
	    _dateUtilsService.masquageDeuxCaract(now.getDate())
	  ;
	  aTags.push({ "index":_modeleNomFichier.search(/dateUs/), "tag":value }); 
	}
	if(_modeleNomFichier.search(/horaire/)>=0){
		value = _dateUtilsService.masquageDeuxCaract(now.getHours()) + "-" + 
	    _dateUtilsService.masquageDeuxCaract(now.getMinutes()) + "-" + 
	    _dateUtilsService.masquageDeuxCaract(now.getSeconds())
	  ;
	  aTags.push({ "index":_modeleNomFichier.search(/horaire/), "tag":value });
	}
	if(_modeleNomFichier.search(/nbActions/)>=0)
	  aTags.push({ "index":_modeleNomFichier.search(/dateFr/), "tag":_aJeuDonneesConcat.length + "AU" }) ;
	if(_modeleNomFichier.search(/nbSessions/)>=0)
	  aTags.push({ "index":_modeleNomFichier.search(/dateFr/), "tag":_nbSessions + "SU"}) ;
	
	//Sorting wordkeys according to the user's order
	utilsService.sortArrayOfObject( aTags, "index");
	
	//Concatening name, according to the filename pattern
	var nomFichier = "";
	aTags.forEach( elt=>{
	  if(nomFichier=="")
	    nomFichier = elt.tag;
	  else
	  	nomFichier = nomFichier + "-" +elt.tag;
	});
	nomFichier += ".csv";

	

    //////////////////// 3) Creating the physical file ////////////////// 
	try{
		fsService.creerFichier(nomFichier, strJeuDonnees).then( resultCreer=>{
			if(resultCreer){
				fsService.getInfosFichier(nomFichier).then( resultsStats=>{
					resolve( resultsStats );
				},
				(errorS)=>{
					console.log("genererFichierCSV :: errorS = ",errorS)
					resolve(false);
				});
			}else {
				resolve(false);
			}
		},
		(errorC)=>{
			console.log("genererFichierCSV :: errorC = ",errorC)
			resolve(false);
		});
	}
	catch(err){
		console("fsService.creerFichier error : ",err);
	}
  });
}