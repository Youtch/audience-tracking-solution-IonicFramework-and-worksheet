// model/data-model.js
const localStorageService = require('../services/local-storage-service');
const configConstants = require('../config/config-constants');

/////////// Exporter les fonctions publiques
module.exports = {
  init:init,
  
  set_debugMode:set_debugMode,
  get_debugMode:get_debugMode,
  
  set_fichiersGeneres:set_fichiersGeneres,
  get_fichiersGeneres:get_fichiersGeneres,
  add_fichiersGeneres:add_fichiersGeneres,
  set_dernierJeuDeDonneesCsv:set_dernierJeuDeDonneesCsv,
  get_dernierJeuDeDonneesCsv:get_dernierJeuDeDonneesCsv,
  
  get_reglagesApp:get_reglagesApp,
  set_reglagesApp:set_reglagesApp,
    set_reglagesApp_modelGenerFic:set_reglagesApp_modelGenerFic,
  	set_reglagesApp_FirebaseDB:set_reglagesApp_FirebaseDB,
  	set_reglagesApp_UI:set_reglagesApp_UI,

  get_fichierCSVGenereExiste:get_fichierCSVGenereExiste,
  set_fichierCSVGenereExiste:set_fichierCSVGenereExiste,
  set_fbDbEstDispo:set_fbDbEstDispo,
  get_fbDbEstDispo:get_fbDbEstDispo,
  //Inutile ? : set_paramsConfigModif:set_paramsConfigModif,
  //Inutile ? : get_paramsConfigModif:get_paramsConfigModif,*/
};

// TODO : implémenter une struture MVC : en ajoutant un service modèle model.js, il sera initialise ici modeleService.init()
  //   qui permettrait de changer le moteur de database si nécessaire !
  
function constructor()
{
  set_idUser(1); // Pourra être modifié dans une version multi-utilisateur
}
function init() // Doit être appelé au démarrage de l'application (app.js)
{
  return new Promise( resolve=>{
	/////////////// # VERSION AVEC ORM /////////////////////
 	////////////////// Gestion de données persistantes //////////////////////////    
	console.log("localStorageService.getItem(idUser+'fichiersGeneres') = ", localStorageService.getItem(idUser+'-fichiersGeneres') );
	if(localStorageService.getItem(idUser+'-fichiersGeneres')==null){ //  Tester dans le cas de premier lancement de l'appli, l'une des variable stockée, arbitrairement choisie
		// NB : ATTENTION : ne pas utiliser ...
		//     if(get_fichiersGeneres()==undefined)  
		//     ... sous peine d'obtenir get_fichiersGeneres erreur =  TypeError: Cannot read property 'fichiersGeneres' of null 
		// PROD :
		//set_fichiersGeneres("{}");
		// MOCK début :
    var strDataMock ="";
    i=0;
    configConstants.MOCK_FICHIERS_GENERES.forEach( item=>{
      strDataMock += '{"nom":"'+item.nom+'", "poids":"'+item.poids+
      '", "dateCreation":"'+item.dateCreation+'", "nombreSessionsUtilisateurs":'+item.nombreSessionsUtilisateurs+
      ', "nombreActionsUtilisateurs":'+item.nombreActionsUtilisateurs+', "dateDebutJeuDonnees":"'+item.dateDebutJeuDonnees+
      '" ,"dateFinJeuDonnees":"'+item.dateFinJeuDonnees+'"}';
      if(i<configConstants.MOCK_FICHIERS_GENERES.length-1)
        strDataMock += ",";
      i++;
    }) 
    strDataMock = '['+
      strDataMock+
    ']';
    // dev
    console.log("strDataMock = ",strDataMock);
		set_fichiersGeneres(strDataMock);

		// PROD :
		//set_dernierJeuDeDonneesCsv();
		// MOCK début :
		set_dernierJeuDeDonneesCsv( configConstants.MOCK_DERNIER_FICHIER.nom, configConstants.MOCK_DERNIER_FICHIER.poids,
		  configConstants.MOCK_DERNIER_FICHIER.dateCreation, configConstants.MOCK_DERNIER_FICHIER.nombreSessionsUtilisateurs,
		  configConstants.MOCK_DERNIER_FICHIER.nombreActionsUtilisateurs, configConstants.MOCK_DERNIER_FICHIER.dateDebutJeuDonnees,
		  configConstants.MOCK_DERNIER_FICHIER.dateFinJeuDonnees
		);
		// : MOCK fin.
			set_reglagesApp("dateFr-horaire", "https://swmg-meh.firebaseio.com", "swmg-meh-firebase-adminsdk-a5wnc-a5788834ef.json", 1);
			set_debugMode(configConstants.DEBUG_MODE);
	}
	////////////////////////// Gestion de données volatiles //////////////////////////  
	// Tous les cas : nettoyage des données volatiles
	set_fbDbEstDispo(false);

	set_fichierCSVGenereExiste(false);
//inutile?	set_paramsConfigModif(false);*
//	setGlobalData("{}");

	////////////////////////// Debug logging sur console //////////////////////////
	if( get_debugMode() ){
		console.log("\n************* Debug ************"+
		  "\n\n fichiersGeneres = "+JSON.stringify( get_fichiersGeneres() )+
		  "\n\n _dernierJeuDeDonneesCsv = "+JSON.stringify( get_dernierJeuDeDonneesCsv() )+
		  "\n\n _debugMode = "+get_debugMode()+
//		  "\n\n globalData = "+JSON.stringify( getGlobalData() )+
		  "\n\n get_reglagesApp = "+JSON.stringify( get_reglagesApp() )+
		  "\n\n ***************\nDonnées volatiles :"+
		  "\n\n get_fbDbEstDispo = "+JSON.stringify( get_fbDbEstDispo() )+
		  "\n\n*********************************\n"
		);
	}

	/*
	///////////////////// # VERSION SANS ORM /////////////////////
	////////////////////////// Gestion de données persistantes //////////////////////////    
	if(localStorageService.getItem( idUser+"fichiersGeneres")==null){ // Tester le cas de premier lancement de l'appli
	localStorageService.setItem( idUser+"-fichiersGeneres", '{"fichiersGeneres":{}}');
	localStorageService.setItem( idUser+"-fbDbEstDispo", '{"fbDbEstDispo":false}');

	localStorageService.setItem( idUser+"-dernierJeuDeDonneesCsv", '{"dernierJeuDeDonneesCsv":{}}');

	// PROD :
	//localStorageService.setItem("debugMode", '{"debugMode":false}');
	//DEBUG :
	localStorageService.setItem( idUser+"-debugMode", '{"debugMode":true}');

	////////////////////////// Gestion de données volatiles //////////////////////////  
	// Tous les cas : nettoyage des données volatiles
	localStorageService.setItem( idUser+"-globalData", '{"globalData":{}}');

	////////////////////////// Debug logging sur console //////////////////////////
	if( localStorageService.getItem( idUser+"-debugMode") ){
		console.log("\n************* Debug ************"+
		  "\n\n fbDbEstDispo = "+localStorageService.getItem("fbDbEstDispo").fbDbEstDispo+
		  "\n\n fichiersGeneres = "+JSON.stringify( localStorageService.getItem("fichiersGeneres") )+
		  "\n\n dernierJeuDeDonneesCsv = "+JSON.stringify( localStorageService.getItem("dernierJeuDeDonneesCsv") )+
		  "\n\n debugMode = "+localStorageService.getItem("debugMode").debugMode+
		  "\n\n globalData = "+JSON.stringify( localStorageService.getItem("globalData") )+
		  "\n\n*********************************\n"
		);
	}
	}*/
	resolve();
  })
}



/** v1 : l'appli étant mono-utilisateur, cette méthode sera surtout utile si la structure de l'appli est revue, pour restreindre l'accès aux données appartenant à l'utilisateur connecté */
function set_idUser( _idUser)
{
   idUser = _idUser;
}
/*function get_idUser()
{
   return idUser;
}*/



function set_fichiersGeneres( _JSONContent ){
  try{
	localStorageService.setItem( idUser+'-fichiersGeneres', '{"fichiersGeneres":'+_JSONContent+'}');	
	// Conception : voir comment modifier le format de param1 : JSON deviendrait Array<Object>
	set_fichiersGeneres// ? JSON.stringify(_content) ... quid des "" des nom d'attributs ?
	// ex de _content fournis : 1) []  2) [{nom:"trucMuche.csv","poids:144ko" ... }, {nom:"trucChose.csv","poids:244ko" ... }]
  }
  catch(err){
  	console.log("set_fichiersGeneres erreur = ", err);
  }
}

// TODO : A tester et finir =>
//  Note d'archi : dès qu'un fichier est généré, le stockage persistant de fichiersGeneres est incrémenté d'un élément A LA FIN, celui présent dans dernierJeuDeDonneesCsv (via  get_dernierJeuDeDonneesCsv) . dernierJeuDeDonneesCsv est vidé et remplacé par le nouveau. 
//  De plus : affichage dans telechargerPage du dernierJeuDeDonneesCsv seulemnt si la variable global indique un import ET une generation de fichier réussis.
//
function add_fichiersGeneres( _nom=null, _poids=null, _dateCreation=null, _nombreSessionsUtilisateurs=null, _nombreActionsUtilisateurs=null, _dateDebutJeuDonnees=null, _dateFinJeuDonnees=null ){ 
  // ... CF précision sur les formats des types : cf config-constants.js > MOCK_DERNIER_FICHIER
 try{
    var fichiersGeneres = JSON.stringify(get_fichiersGeneres());// format objet => format string
    fichiersGeneres = fichiersGeneres.slice(0, -1);//fichiersGeneres.substr(0, fichiersGeneres.length-1);
    
    JSONContent= fichiersGeneres+',{"nom":"'+_nom+'", "poids":"'+_poids+
    '", "dateCreation":"'+_dateCreation+'", "nombreSessionsUtilisateurs":'+_nombreSessionsUtilisateurs+
    ', "nombreActionsUtilisateurs":'+_nombreActionsUtilisateurs+', "dateDebutJeuDonnees":"'+_dateDebutJeuDonnees+
    '" ,"dateFinJeuDonnees":"'+_dateFinJeuDonnees+
    '"}]';
    //console.log("add_fichiersGeneres :: JSONContent = ",JSONContent);
    var resultSetItem = localStorageService.setItem( idUser+'-fichiersGeneres', '{"fichiersGeneres":'+JSONContent+'}');
  }
  catch(err){
    console.log("add_fichiersGeneres erreur = ", err);
  }
}

/** return array<object>|undefined **/
function get_fichiersGeneres(){ 
  try{
	return localStorageService.getItem( idUser+'-fichiersGeneres' ).fichiersGeneres;
  }
  catch(err){
  	console.log("get_fichiersGeneres erreur = ", err);
  }
}


function set_dernierJeuDeDonneesCsv(_nom=null, _poids=null, _dateCreation=null, _nombreSessionsUtilisateurs=null, _nombreActionsUtilisateurs=null, _dateDebutJeuDonnees=null, _dateFinJeuDonnees=null ){ // _nom:string, _poids:string, _dateCreation:string, _nombreessionsUtilisateurs:number, _nombreActionsUtilisateurs:string, _dateDebutJeuDonnees:string, _dateFinJeuDonnees:string
  // ... CF précision sur les formats des types : cf config-constants.js > MOCK_DERNIER_FICHIER
  try{
  	var JSONContent;
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
/** return object|undefined**/
function get_dernierJeuDeDonneesCsv(){ 
  try{
    return localStorageService.getItem( idUser+'-dernierJeuDeDonneesCsv' ).dernierJeuDeDonneesCsv;
  }
  catch(err){
  	console.log("get_dernierJeuDeDonneesCsv erreur = ", err);
  }
}
  


function set_debugMode( _booleanVal ){
  try{
	localStorageService.setItem( idUser+'-debugMode' , '{"debugMode":'+_booleanVal+'}');
  }
  catch(err){
  	console.log("set_debugMode erreur = ", err);
  }
}
/** return boolean|undefined **/
function get_debugMode(){ 
  try{
	return localStorageService.getItem( idUser+'-debugMode' ).debugMode;
  }
  catch(err){
  	console.log("get_debugMode erreur = ", err);
  }
}




function set_reglagesApp(_modeleGenerationFichierCsv=null, _databaseUrl=null, _serviceAccount=null, _UITheme=null){
  // modeleGenerationFichierCsv:string, databaseUrl:string, serviceAccount:string, UITheme:number
  try{
  	var JSONContent;
  	if(_UITheme==null)
  	  JSONContent = '{}';
  	else{
  	  var reglagesApp = get_reglagesApp();
  	  JSONContent= '{"modeleGenerationFichierCsv":"'+_modeleGenerationFichierCsv+'", "databaseUrl":"'+_databaseUrl+'", "serviceAccount":"'+_serviceAccount+
	  '", "UITheme":"'+_UITheme +
	'"}'
	}
	localStorageService.setItem( idUser+'-reglagesApp', '{"reglagesApp":'+JSONContent+'}');
  }
  catch(err){
  	console.log("set_reglagesApp erreur = ", err);
  }
}
function set_reglagesApp_modelGenerFic(_modeleGenerationFichierCsv=null){// TODO : défaut null à supprimer ?
  // modeleGenerationFichierCsv:string, databaseUrl:string, serviceAccount:string, UITheme:number
  try{
  	var JSONContent;
  	if(_modeleGenerationFichierCsv==null)
  	  JSONContent = '{}';
  	else{
  	  var reglagesApp = get_reglagesApp();
  	  JSONContent= '{"modeleGenerationFichierCsv":"'+_modeleGenerationFichierCsv+'", "databaseUrl":"'+reglagesApp.databaseUrl+'", "serviceAccount":"'+reglagesApp.serviceAccount+
	      '", "UITheme":"'+reglagesApp.UITheme +
	    '"}'
	  }
	  localStorageService.setItem( idUser+'-reglagesApp', '{"reglagesApp":'+JSONContent+'}');
  }
  catch(err){
  	console.log("set_reglagesApp_modelGenerFic erreur = ", err);
  }
}
function set_reglagesApp_FirebaseDB(_databaseUrl=null, _serviceAccount=null){// TODO : défaut null à supprimer ?
  // ... CF précision sur les formats des types : cf config-constants.js > MOCK_DERNIER_FICHIER
  try{
  	var JSONContent;
  	if(_databaseUrl==null)
  	  JSONContent = '{}';
  	else{
  	  var reglagesApp = get_reglagesApp();
  	  JSONContent= '{"modeleGenerationFichierCsv":"'+reglagesApp.modeleGenerationFichierCsv+'","databaseUrl":"'+_databaseUrl+'", "serviceAccount":"'+_serviceAccount+
	  '", "UITheme":"'+reglagesApp.UITheme +
	'"}'
	}
	localStorageService.setItem( idUser+'-reglagesApp', '{"reglagesApp":'+JSONContent+'}');
  }
  catch(err){
  	console.log("set_reglagesApp_FirebaseDB erreur = ", err);
  }
}
function set_reglagesApp_UI(_UITheme=null){ // TODO : défaut null à supprimer ?
  // ... CF précision sur les formats des types : cf config-constants.js > MOCK_DERNIER_FICHIER
  try{
  	var JSONContent;
  	if(_UITheme==null)
  	  JSONContent = '{}';
  	else{
  	  var reglagesApp = get_reglagesApp();
  	  JSONContent= '{"modeleGenerationFichierCsv":"'+reglagesApp.modeleGenerationFichierCsv+'", "databaseUrl":"'+reglagesApp.databaseUrl+'", "serviceAccount":"'+reglagesApp.serviceAccount+
	  '", "UITheme":"'+_UITheme +
	'"}'
	}
	localStorageService.setItem( idUser+'-reglagesApp', '{"reglagesApp":'+JSONContent+'}');
  }
  catch(err){
  	console.log("set_reglagesApp_UI erreur = ", err);
  }
}
/** return object|undefined**/
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
/** return boolean|undefined **/
function get_fbDbEstDispo(){ 
  try{
	return localStorageService.getItem( idUser+'-fbDbEstDispo' ).fbDbEstDispo;
  }
  catch(err){
  	console.log("get_fbDbEstDispo erreur = ", err);
  }
}


/*
function set_donneesFbDb( _stData ){
  try{
	localStorageService.setItem( idUser+'-donneesFbDb', '{"donneesFbDb":'+_stData+'}');
  }
  catch(err){
  	console.log("set_donneesFbDb erreur = ", err);
  }
}*/



function set_fichierCSVGenereExiste( _booleanVal ){
  try{
	localStorageService.setItem( idUser+'-fichierCSVGenereExiste', '{"fichierCSVGenereExiste":'+_booleanVal+'}');
  }
  catch(err){
  	console.log("set_fichierCSVGenereExiste erreur = ", err);
  }
}
/** return boolean|undefined **/
function get_fichierCSVGenereExiste(){ 
  try{
	return localStorageService.getItem( idUser+'-fichierCSVGenereExiste' ).fichierCSVGenereExiste;
  }
  catch(err){
  	console.log("get_fichierCSVGenereExiste erreur = ", err);
  }
}



/*function set_paramsConfigModif( _booleanVal ){
  try{
	localStorageService.setItem( idUser+'-paramsConfigModif', '{"paramsConfigModif":'+_booleanVal+'}');
  }
  catch(err){
  	console.log("set_paramsConfigModif erreur = ", err);
  }
}*/
/** return boolean|undefined **/
/*function get_paramsConfigModif(){ 
  try{
	return localStorageService.getItem( idUser+'-paramsConfigModif' ).paramsConfigModif;
  }
  catch(err){
  	console.log("get_paramsConfigModif erreur = ", err);
  }
}*/

constructor();