// views/scripts/ajax-commun.js

const persistantDataModel = require('../../model/persistant-data-model');
/////////// Exporter les fonctions publiques
module.exports = {
  getServeurFireBDisponibilite:getServeurFireBDisponibilite,
  getSessionCSVFileExists:getSessionCSVFileExists
};

/* un getter qui retourne un résultat "estDisponible?true|false' , 
 et qui se intégre à l'intérieur un setter de modification de variable du stockage volatile*/
function getServeurFireBDisponibilite(_firebaseService){
  return new Promise( resolve=> {
    //Tester la connexion à Firebase DB
    var oReglagesApp = persistantDataModel.get_reglagesApp();
     /////Réinitialisation des params de configuration, puis requêtage/////
     // TODO lancé seulement si a été enregistré une modification des paramètres via Configurer-page PENDANT CETTE SESSION, cf stockage volatile sessParamsConfigModif:Boolean :
    _firebaseService.init(oReglagesApp.databaseUrl, oReglagesApp.serviceAccount).then( result=>{
    	// DEV
    	console.log("getServeurFireBDisponibilite:: _firebaseService.init => result = "+result);
	    _firebaseService.checkFbCnxWithTypedDatabaseUrl().then( servFbDbEstDispo =>{
	      // Modifier le stockage volatile 
	      persistantDataModel.set_fbDbEstDispo(servFbDbEstDispo);
	      // Return
	      resolve( servFbDbEstDispo.toString() );	
	    })
    });
  });
}

function getSessionCSVFileExists(){
  return new Promise( resolve=> {
  	// Return
	resolve(persistantDataModel.get_fichierCSVGenereExiste().toString());
  });
}