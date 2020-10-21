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

// model/local-storage-model.js
const localStorageService = require('../services/local-storage-service');
const configConstants = require('../config/config-constants');
let appDebugMode;
let appMockData;
/**
 * Architecture for local-data-storing is below (persistant and non-persistant local data) :
 
  1) Persistant storage entries (remained between sessions)
  
    FichiersGeneres
      {string} nom (format : *.csv)
      {string} poids (format : \d+ [ko|mo|go] ; ex : 45 ko ; 2 mo)
      {string} dateCreation (format : dd/mm/yyyyy hh:mm:ss)
      {string} nombreSessionsUtilisateurs
      {string} nombreActionsUtilisateurs
      {string} dateDebutJeuDonnees (format : dd/mm/yyyyy hh:mm:ss)
      {string} dateFinJeuDonnees (format : dd/mm/yyyyy hh:mm:ss)
    
    dernierJeuDeDonneesCsv { 
      {string} nom (format : *.csv)
      {string} poids (format : \d+ [ko|mo|go] ; ex : 45 ko ; 2 mo)
      {string} dateCreation (format : dd/mm/yyyyy hh:mm:ss)
      {number|string} nombreSessionsUtilisateurs
      {number|string} nombreActionsUtilisateurs
      {string} dateDebutJeuDonnees (format : dd/mm/yyyyy hh:mm:ss)
      {string} dateFinJeuDonnees (format : dd/mm/yyyyy hh:mm:ss)
    }
    
    reglagesApp {
      {string} modeleFichierCsv
      {string} databaseUrl
      {string} serviceAccount
    }
    
  2) Non-persistant storage entries(deleted at each session beginning)
  
    globalData
      {boolean} fbDbEstDispo
      {boolean} fichierCSVGenereExiste
  }

  NB: type are not applicable to physical storage on the server : all data must be stored as string.
 */

module.exports = {
  init:init,
  
  set_fichiersGeneres:set_fichiersGeneres,
  get_fichiersGeneres:get_fichiersGeneres,
  add_fichiersGeneres:add_fichiersGeneres,
  set_dernierJeuDeDonneesCsv:set_dernierJeuDeDonneesCsv,
  get_dernierJeuDeDonneesCsv:get_dernierJeuDeDonneesCsv,
  
  get_reglagesApp:get_reglagesApp,
  set_reglagesApp:set_reglagesApp,
    set_reglagesApp_modelGenerFic:set_reglagesApp_modelGenerFic,
  	set_reglagesApp_FirebaseDB:set_reglagesApp_FirebaseDB,

  get_fichierCSVGenereExiste:get_fichierCSVGenereExiste,
  set_fichierCSVGenereExiste:set_fichierCSVGenereExiste,
  set_fbDbEstDispo:set_fbDbEstDispo,
  get_fbDbEstDispo:get_fbDbEstDispo,
};

/**
 * @EXPERIMENTAL
 * TODO : A multi-user feature could be implemented with efforts
 * @type {number}
 */
var idUser;

/**
 * This module implements a sort of ORM paradigm
 * @return {[type]} [description]
 */
function constructor()
{
  set_idUser(1);
}

function init()
{ 
  appDebugMode = Boolean(Number(process.env.DEBUG_MODE));
  appMockData = Boolean(Number(process.env.MOCK_DATA));

  return new Promise( resolve=>{
	
    // FIRST LAUNCHING ONLY :
  	if(localStorageService.getItem(idUser+'-fichiersGeneres')==null){ 
      
      set_reglagesApp("", "", "");
      set_fichiersGeneres("{}");

    	if(!appMockData){
        set_dernierJeuDeDonneesCsv();
      }
  		else{set_dernierJeuDeDonneesCsv( configConstants.MOCK_DERNIER_FICHIER.nom, configConstants.MOCK_DERNIER_FICHIER.poids,
    		  configConstants.MOCK_DERNIER_FICHIER.dateCreation, configConstants.MOCK_DERNIER_FICHIER.nombreSessionsUtilisateurs,
    		  configConstants.MOCK_DERNIER_FICHIER.nombreActionsUtilisateurs, configConstants.MOCK_DERNIER_FICHIER.dateDebutJeuDonnees,
    		  configConstants.MOCK_DERNIER_FICHIER.dateFinJeuDonnees
    		);
        
      }
  		
      
  	}

    // Resetting the non-persistant data
    set_fbDbEstDispo(false);
  	set_fichierCSVGenereExiste(false);

  	// Debug logging on console
  	if( appDebugMode ){
  		console.log("\n************* Debug ************"+
  		  "\n\n fichiersGeneres = "+JSON.stringify( get_fichiersGeneres() )+
  		  "\n\n _dernierJeuDeDonneesCsv = "+JSON.stringify( get_dernierJeuDeDonneesCsv() )+
  		  "\n\n get_reglagesApp = "+JSON.stringify( get_reglagesApp() )+
  		  "\n\n ***************\nDonnées volatiles :"+
  		  "\n\n get_fbDbEstDispo = "+JSON.stringify( get_fbDbEstDispo() )+
  		  "\n\n*********************************\n"
  		);
  	}

  	resolve();
  })
}


/**
 * A multi-user feature COULD be implemented with some efforts
 * @param {number} _idUser [description]
 */
function set_idUser( _idUser)
{
   idUser = _idUser;
}
/*function get_idUser()
{
   return idUser;
}*/


/**
 * [set_fichiersGeneres description]
 * @param {string} _JSONContent [description]
 */
function set_fichiersGeneres( _JSONContent ){
  try{
	 localStorageService.setItem( idUser+'-fichiersGeneres', '{"fichiersGeneres":'+_JSONContent+'}');	
	 set_fichiersGeneres;
	}
  catch(err){
  	console.log("set_fichiersGeneres erreur = ", err);
  }
}

/**
 * @Architecture 
 *  When a CSV-text file is generated : a NEW element is pushed on the persistant storage (by get_dernierJeuDeDonneesCsv) 
 *     Then dernierJeuDeDonneesCsv item is cleaned and filled with the NEW content of data
 * @param _nom
 * @param _poids
 * @param _dateCreation
 * @param _nombreSessionsUtilisateurs
 * @param _nombreActionsUtilisateurs
 * @param _dateDebutJeuDonnees
 * @param _dateFinJeuDonnees
 */
function add_fichiersGeneres( _nom=null, _poids=null, _dateCreation=null, _nombreSessionsUtilisateurs=null, _nombreActionsUtilisateurs=null, _dateDebutJeuDonnees=null, _dateFinJeuDonnees=null ){
 try{
    let fichiersGeneres = JSON.stringify(get_fichiersGeneres());
    fichiersGeneres = fichiersGeneres.slice(0, -1);
    
    JSONContent= fichiersGeneres+',{"nom":"'+_nom+'", "poids":"'+_poids+
    '", "dateCreation":"'+_dateCreation+'", "nombreSessionsUtilisateurs":'+_nombreSessionsUtilisateurs+
    ', "nombreActionsUtilisateurs":'+_nombreActionsUtilisateurs+', "dateDebutJeuDonnees":"'+_dateDebutJeuDonnees+
    '" ,"dateFinJeuDonnees":"'+_dateFinJeuDonnees+
    '"}]';
    let resultSetItem = localStorageService.setItem( idUser+'-fichiersGeneres', '{"fichiersGeneres":'+JSONContent+'}');
  }
  catch(err){
    console.log("add_fichiersGeneres erreur = ", err);
  }
}

/**
 * @return {Array<Object>}
 */
function get_fichiersGeneres(){ 
  try{
	 return localStorageService.getItem( idUser+'-fichiersGeneres' ).fichiersGeneres;
  }
  catch(err){
  	console.log("get_fichiersGeneres erreur = ", err);
  }
}


/**
 * @param _nom
 * @param _poids
 * @param _dateCreation
 * @param _nombreSessionsUtilisateurs
 * @param _nombreActionsUtilisateurs
 * @param _dateDebutJeuDonnees
 * @param _dateFinJeuDonnees
 */
function set_dernierJeuDeDonneesCsv(_nom=null, _poids=null, _dateCreation=null, _nombreSessionsUtilisateurs=null, _nombreActionsUtilisateurs=null, _dateDebutJeuDonnees=null, _dateFinJeuDonnees=null ){
  try{
  	let JSONContent;
  	if(_nom==null)
  	  JSONContent = '{}';
  	else{
  	  // TOTEST : échapper les ' :
  	  _nom = _nom.replace(/'/g,"\'"),
  	  JSONContent= '{"nom":"'+_nom+'", "poids":"'+_poids+
  	  '", "dateCreation":"'+_dateCreation+'", "nombreSessionsUtilisateurs":'+_nombreSessionsUtilisateurs+
	    ', "nombreActionsUtilisateurs":'+_nombreActionsUtilisateurs+', "dateDebutJeuDonnees":"'+_dateDebutJeuDonnees+
  	  '" ,"dateFinJeuDonnees":"'+_dateFinJeuDonnees+
    	'"}'
	  }
	localStorageService.setItem( idUser+'-dernierJeuDeDonneesCsv', '{"dernierJeuDeDonneesCsv":'+JSONContent+'}');	
  }
  catch(err){
  	console.log("set_dernierJeuDeDonneesCsv erreur = ", err);
  }
}

/**
 * @return {{Object<dernierJeuDeDonneesCsv:{
 *     nom:string, poids:string, dateCreation:string, nombreActionsUtilisateurs:number, nombreSessionsUtilisateurs:number, 
 *     dateDebutJeuDonnees:string, dateFinJeuDonnees:string
 * }>}
 */
function get_dernierJeuDeDonneesCsv(){ 
  try{
    return localStorageService.getItem( idUser+'-dernierJeuDeDonneesCsv' ).dernierJeuDeDonneesCsv;
  }
  catch(err){
  	console.log("get_dernierJeuDeDonneesCsv erreur = ", err);
  }
}
  

/**
 * @param {string} _modeleFichierCsv
 * @param {string} _databaseUrl
 * @param {string} _serviceAccount
 */
function set_reglagesApp(_modeleFichierCsv=null, _databaseUrl=null, _serviceAccount=null){
  try{
  	let reglagesApp = get_reglagesApp();
    JSONContent= '{"modeleFichierCsv":"'+_modeleFichierCsv+'", "databaseUrl":"'+_databaseUrl+'", "serviceAccount":"'+_serviceAccount+
	  '"}'
	  localStorageService.setItem( idUser+'-reglagesApp', '{"reglagesApp":'+JSONContent+'}');
  }
  catch(err){
  	console.log("set_reglagesApp erreur = ", err);
  }
}

/**
 * @param {string} _modeleFichierCsv
 */
function set_reglagesApp_modelGenerFic(_modeleFichierCsv=null){// TODO : défaut null à supprimer ?
  try{
  	let reglagesApp = get_reglagesApp();
  	JSONContent= '{"modeleFichierCsv":"'+_modeleFichierCsv+'", "databaseUrl":"'+reglagesApp.databaseUrl+'", "serviceAccount":"'+reglagesApp.serviceAccount+
	  '"}'
	  localStorageService.setItem( idUser+'-reglagesApp', '{"reglagesApp":'+JSONContent+'}');
  }
  catch(err){
  	console.log("set_reglagesApp_modelGenerFic erreur = ", err);
  }
}

function set_reglagesApp_FirebaseDB(_databaseUrl=null, _serviceAccount=null){
  try{
  	let JSONContent;
  	if(_databaseUrl==null)
  	  JSONContent = '{}';
  	else{
  	  let reglagesApp = get_reglagesApp();
  	  JSONContent= '{"modeleFichierCsv":"'+reglagesApp.modeleFichierCsv+'","databaseUrl":"'+_databaseUrl+'", "serviceAccount":"'+_serviceAccount+
	  '"}'
	}
	localStorageService.setItem( idUser+'-reglagesApp', '{"reglagesApp":'+JSONContent+'}');
  }
  catch(err){
  	console.log("set_reglagesApp_FirebaseDB erreur = ", err);
  }
}

/**
 * @return {Object} [description]
 */
function get_reglagesApp(){ 
  try{
    return localStorageService.getItem( idUser+'-reglagesApp' ).reglagesApp;
  }
  catch(err){
  	console.log("get_reglagesApp erreur = ", err);
  }
}




function set_fbDbEstDispo( _booleanVal ){
  try{
	localStorageService.setItem( idUser+'-fbDbEstDispo', '{"fbDbEstDispo":'+_booleanVal+'}');
  }
  catch(err){
  	console.log("set_fbDbEstDispo erreur = ", err);
  }
}

/**
 * @return {Boolean}
 */
function get_fbDbEstDispo(){ 
  try{
	return localStorageService.getItem( idUser+'-fbDbEstDispo' ).fbDbEstDispo;
  }
  catch(err){
  	console.log("get_fbDbEstDispo erreur = ", err);
  }
}


function set_fichierCSVGenereExiste( _booleanVal ){
  try{
	localStorageService.setItem( idUser+'-fichierCSVGenereExiste', '{"fichierCSVGenereExiste":'+_booleanVal+'}');
  }
  catch(err){
  	console.log("set_fichierCSVGenereExiste erreur = ", err);
  }
}

/**
 * @return {Boolean}
 */
function get_fichierCSVGenereExiste(){ 
  try{
	  return localStorageService.getItem( idUser+'-fichierCSVGenereExiste' ).fichierCSVGenereExiste;
  }
  catch(err){
  	console.log("get_fichierCSVGenereExiste erreur = ", err);
  }
}


constructor();