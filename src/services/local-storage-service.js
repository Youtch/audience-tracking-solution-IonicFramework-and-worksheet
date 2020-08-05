// services/local-storage-service.js
const LocalStorage = require('node-localstorage').LocalStorage;
// BUG : const localStorage = new LocalStorage( "./"+process.env.CHEMIN_LOCAL_STORAGE );
const localStorage = new LocalStorage( "./src/assets/local-storage" );// TODO : résoudre le bug

/////////// Exporter les fonctions publiques
module.exports = {
  setItem:setItem,
  getItem:getItem,
  removeItem:removeItem
};


/*
 @param _idUser:string|number : 
 	en mode monoutilisateur : "userData"
 	TODO = Facultatif, v1.1 à diffuser : Gestion des fichiers multi-utilisateurs . CF DTD STAU 1.0
 @param _contenu:string au format JSON (Attention : le formattage requiert d'encadrer chaque attribut avec des guillemets !)
 => par exemple...
   myLocalStorage.setItem("user2", '{"fichiers":['+
      '{"fichierNom":"truc1.csv", "actionsUtilisateurs":6128, "sessionsUtilisateur":1989} ,'+
      '{"fichierNom":"truc543.csv", "actionsUtilisateurs":200, "sessionsUtilisateur":100}'+
   ']}');
*/
function setItem(_idUser, _contenu)
{
  try{
  	localStorage.setItem(_idUser, _contenu);
  }
  catch(err){
  	console.log("setItem:: erreur = ", err);
  }
}

/*
 @description simple mapping 
 @return object|null
   JSON.stringify(  myLocalStorage.getItem( "user2" ) ) 
   1) Si user2 a été attribué...
   affichera :
   {"fichiers":
    [
   	 {"fichierNom":"truc1.csv", "actionsUtilisateurs":6128, "sessionsUtilisateur":1989},
     fichierNom":"truc543.csv", "actionsUtilisateurs":200, "sessionsUtilisateur":100}
    ]
   } 
   2) Sinon...
   affichera null
*/
function getItem(_idUser)
{
  try{
	var strContenu = localStorage.getItem(_idUser);
	// DEV 
	//console.log("getItem:: typeof strContenu = "+typeof strContenu+" ; strContenu = ", strContenu);
	if(strContenu!=null)
		return JSON.parse( strContenu );
	else
		return null;
  }
  catch(err){
  	console.log("getItem:: erreur = ", err);
  }
}

/* @description simple mapping 
*/
function removeItem(_idUser)
{
  try{
  	localStorage.removeItem(_idUser);
  }
  catch(err){
  	console.log("removeItem :: erreur  = ", err);
  }
}

/*function cleanItem(_idUser)
{
  try{
  	localStorage.setItem(_idUser, '{"fichiers":[]}');
  }
  catch(err){
  	console.log("cleanItem :: erreur  = ", err);
  }
}*/