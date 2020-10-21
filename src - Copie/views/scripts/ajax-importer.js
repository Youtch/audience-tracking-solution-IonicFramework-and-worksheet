// views/scripts/ajax-importer.js
const fsService = require('../../services/fs-management-service');
const genererCSV = require('../../services/generer-csv-service');
// Redéclaration d'import serait meilleur pratique ? const dateUtilsService = require('../../services/date-operations-service');
const utilsService = require('../../services/utils-service');
/////////// Exporter les fonctions publiques
module.exports = {
  //init:init,
  importerJeuDonnees:importerJeuDonnees, 
  mockData_importerDonnees:mockData_importerDonnees, 
  genererFichierCSV:genererFichierCSV
};

// Private
// émulation du constructor() d'une architecture de code POO
/*function constructor(){ 
}*/
// init(req){}


// TODO : définir nomFichier selon la variable du modele de nom, stockée en storage persistant (globalModeleNomFichier ?)


/**
 * @PRODUCTION
 * import of the data set from a real firebase
 * @param  {Object} _firebaseService
 * @param  {number=0|string} _dateMaxLimite
 * @param  {number=0|string} _dateMinLimite
 * @return {Object<
 *   metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string} 
 *   data:{Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string,
 *    sessionKey:string, androidVersion:string, licenceEstPremium:Boolean,
 *    nbUiAidesOuverts:number|string, nombrePagesVisitees:number|string, nombreCmpsCmpsntUINonDstnctVisites:number|string, cheminNavigation:string}>}* 
 * >}
 */
function importerJeuDonnees(_firebaseService, _dateMaxLimite, _dateMinLimite)
{  
  /* const oReglages = get_reglagesApp();
  console.log("strNomfichier = "+ oReglages.modeleFichierCsv);
  */
  // DEV
  /*console.log("_dateMaxLimite = ",_dateMaxLimite);
  console.log("_dateMinLimite = ",_dateMinLimite);*/
  return new Promise( (resolve)=>{
  	// Architecture : l'init de la connexion est établie sur une 
    _firebaseService.importerDonnees(_dateMaxLimite, _dateMinLimite).then( (oJeuDonneesConcat)=>{
  	  console.log("_firebaseService.importerDonnees lancé... oJeuDonneesConcat.length = "+ oJeuDonneesConcat.data.length );
      resolve( {data:oJeuDonneesConcat.data, metadata:oJeuDonneesConcat.metadata} );
    });
  });
}

/*
 * @MOCK
 * import of the data set from a mocking database
 * @param  {Object} _firebaseService
 * @param  {number=0|string} _dateMaxLimite
 * @param  {number=0|string} _dateMinLimite
 * @return {Object<
 *   metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string} 
 *   data:{Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string,
 *    sessionKey:string, androidVersion:string, licenceEstPremium:Boolean,
 *    nbUiAidesOuverts:number|string, nombrePagesVisitees:number|string, nombreCmpsCmpsntUINonDstnctVisites:number|string, cheminNavigation:string}>}* 
 * >}
 */
function mockData_importerDonnees(_firebaseService, _dateMaxLimite, _dateMinLimite)
{  
  /* const oReglages = get_reglagesApp();
  console.log("strNomfichier = "+ oReglages.modeleFichierCsv);
  */
  // DEV
  /*console.log("_dateMaxLimite = ",_dateMaxLimite);
  console.log("_dateMinLimite = ",_dateMinLimite);*/
  console.log("mockData_importerDonnees :: _dateMaxLimite = ",_dateMaxLimite);
  console.log("mockData_importerDonnees :: _dateMinLimite = ",_dateMinLimite);
  return new Promise( (resolve)=>{
    _firebaseService.mockData_importerDonnees(_dateMaxLimite, _dateMinLimite).then( (oJeuDonneesConcat)=>{
      console.log("_firebaseService.mockData_importerDonnees lancé... oJeuDonneesConcat.length = "+ oJeuDonneesConcat.data.length );
      resolve( {data:oJeuDonneesConcat.data, metadata:oJeuDonneesConcat.metadata} );
    });
  });
}
 

/**
 * [genererFichierCSV description]
 * @param  {[type]} _aJeuDonneesConcat [description]
 * @param  {[type]} _modeleNomFichier  [description]
 * @param  {[type]} _nbSessions        [description]
 * @param  {[type]} _dateUtilsService  [description]
 * @return {[type]}                    [description]
 */
function genererFichierCSV(_aJeuDonneesConcat, _modeleNomFichier, _nbSessions, _dateUtilsService){
  return new Promise(resolve => {
  	// console.log("_dateUtilsService.daysOfWeekHumanText_en_short[0] = " + _dateUtilsService.daysOfWeekHumanText_en_short[0]);
  	//console.log("_dateUtilsService.getBlip = " + _dateUtilsService.getBlip());
  	//console.log("_dateUtilsService.getBlop = " + _dateUtilsService.getBlop());
  	//////////////////// 1) Formatage des données selon spécification de type CSV
	let strJeuDonnees = genererCSV.miseEnFormeContenu(_aJeuDonneesConcat);

	//////////////////// 2) Préparer le nom du fichier selon le modèle de l'utilisateur
	// Rechercher les masques d'horodatage dans le nom du fichier 
	var aTagsPossibles = ["dateFr", "dateUs", "horaire", "nbActions", "nbSessions"];
	
	var aTags = []; // Array contenant le modèle dont chaque motif utilisé est trié selon l'ordre défini par l'utilisateur
	var value;

	var now = new Date();
	var date;
	var month;
	// Ajouter chaque valeur correspondand au tag inscrit dans le modèle :
	if(_modeleNomFichier.search(/dateFr/)>0){
	  value = _dateUtilsService.masquageDeuxCaract(now.getDate()) + "-" + 
	    _dateUtilsService.masquageDeuxCaract(now.getMonth()+1) + "-" + 
	    now.getFullYear() 
	  ;
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
	
	// Trier les tags selon l'ordre défini par l'utilisateur :
	utilsService.sortArrayOfObject( aTags, "index");
	//DEV 
	//console.log("aTags = ", aTags);
	
	// reconstituer le nom, selon le modèle demandé ...
	var nomFichier = "";
	aTags.forEach( elt=>{
	  if(nomFichier=="")
	    nomFichier = elt.tag;
	  else
	  	nomFichier = nomFichier + "-" +elt.tag;
	});
	nomFichier += ".csv";
	// DEV 
	//console.log("nomFichier = "+nomFichier);
	// TODO : Dans l'UI il faut interdire tout autre section de caractères différents des modèles : trop compliqué (pour user ET pour codeur)

    //////////////////// 3) Créer le fichier physique
	try{
		fsService.creerFichier(nomFichier, strJeuDonnees).then( resultCreer=>{
			if(resultCreer){
				fsService.getInfosFichier(nomFichier).then( resultsStats=>{
					resolve( resultsStats );
				},
				(errorS)=>{
					// DEV
					console.log("genererFichierCSV :: errorS = ",errorS)
					resolve(false);
				});
			}else {
				resolve(false);
			}
		},
		(errorC)=>{
			// DEV
			console.log("genererFichierCSV :: errorC = ",errorC)
			resolve(false);
		});
	}
	catch(err){
		console("fsService.creerFichier error : ",err);// TOTEST
	}
  });
  // TODO : gérer le retour si fichier non généré, s'il existe déjà => message par "Modal", plus modifier le "msg validateur" (= msg de haute importance).
}
//constructor();