// views/scripts/ajax-configurer.js
const persistantDataModel = require('../../model/persistant-data-model');
/////////// Exporter les fonctions publiques
module.exports = {
  //init:init,
  // TODO
  setConfiguration:setConfiguration, // ?
  getConfiguration:getConfiguration, // ?
};

// Private
function constructor(){ // émulation du constructor() d'une architecture de code POO
  // ou  dans init(req) si appelé en public
  //console.log("boolServeurFireBDisponibilite = "+boolServeurFireBDisponibilite);
}
// init(req){}

// return : Pas d'objet car on ne passe pas d'objet dans l'appelant app.js::res.write !
function getConfiguration()
{
	//PROD :
	// RECUPERER les globalData
	//DEV TEST :
	/*
	var sa = ("../assets/swmg-meh-firebase-adminsdk-a5wnc-a5788834ef.json").split("/");
	var data = JSON.stringify({ // TODO : bien tester la pertinence d'affectation des 2 données 
		"databaseURL":"https://swmg-meh.firebaseio.com", 
		"serviceAccount": sa[2]
	});*/
	data = persistantDataModel.get_reglagesApp();
	// DEV 
	//console.log("getConfiguration::JSON.stringify(data) = "+data);
	/*return Promise.resolve( "{"+
		"databaseUrl:"+data.databaseUrl+","+ 
		"serviceAccount:"+data.serviceAccount+
	"}");*/
	// idem avec plus de trt CPU : 
	return Promise.resolve( 
		JSON.stringify({"databaseUrl": data.databaseUrl , "serviceAccount":data.serviceAccount}) 
	);
}

 // return : Pas d'objet car on ne passe pas d'objet dans l'appelant app.js::res.write !
function setConfiguration(req)
{
	try{
		//DEV TEST :
		//console.log("setConfiguration req.query = "+JSON.stringify(req.query) );
		//PROD :
		// MODIFIER les données du stockage persistant 
		persistantDataModel.set_reglagesApp_FirebaseDB( req.query.databaseUrl, req.query.serviceAccount)
		// TODO : réinitialiser le serveur !
		//   1) logique métier
		//   2) Repenser l'affichage d'un message informant de la réinitialisation de connexion (info pour éviter la modif sans raison)
		// Codes de retour, de type string obligatoire : 1 ok , 0 erreur
		return Promise.resolve( "1" );
	}
	catch(err){
		return Promise.resolve( "0" );
	}
}

constructor();