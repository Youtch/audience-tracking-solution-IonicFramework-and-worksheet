<!-- views/pages/configurer.js 
  Dépendances : TOUPDATE
    utils-ajax.js
      ::getAjaxFunction
      ::setAjaxFunction
    header-loader.js
      ::initHeaderBadges
      ::initHeadersUIs
      ::getAccessFbDbState
      ::getSessionCSVFileExists
-->
<script>
function init(){
    setTimeout( ()=>{
	  activerHeaderMenuBtn(0);// Surligner le bouton de menu activé
	},50);
	
    getConfiguration();
	
	// TODO : unification de getAccessFbDbStatedes et getSessionCSVFileExists, vers la requêtes ajax (déjà unique) !
	/*getHeaderCheckLightStates().then( oResults=>{
		console.log("booAccessFbDbState = "+oResults.booAccessFbDbState+ " ; booSessionCSVFileExists = "+ oResults.booSessionCSVFileExists);
		initHeadersUIs(oResults.booAccessFbDbState, oResults.booSessionCSVFileExists);
	}*/
	getAccessFbDbState().then( booAccessFbDbState=>{
		console.log("checkConfigurationUIs(booAccessFbDbState) lancé !");
		initHeadersUIs(booAccessFbDbState, "booAccessFbDbState");
	})
	getSessionCSVFileExists().then( booSessionCSVFileExists=>{
		console.log("checkConfigurationUIs(booSessionCSVFileExists) lancé !");
		initHeadersUIs(booSessionCSVFileExists, "booSessionCSVFileExists");
	})

    
}

// TODO : implémenter la validation des deux champs à la fin des deux saisie : si invalide 1) bouton enregistrer => disable ; 2) ajouter class "input-typingIsinvalid"
/* TODO :
  	gestion des UI : message en toast : de test de disponibilité du serveur, selon réussite ou échec : 	
    
    logique : changer les var globales + les données stockage persistant
	ui : changer les couleur des "badge" via JQuery => header.ejs ; configurer.ejs
    
    //code d'appel : getFirebaseDBDisponibilite();
*/
function setConfiguration(){
	// Pour ajax méthode GET  : url absolue
	setAjaxFunction("http://localhost:3000/ajax/v1.7/configurer/?setConfiguration=true&", 
	// Pour ajax méthode POST : url relative
	// TODO en correspondance avec le serveur : setAjaxFunction("ajax/v1.7/configurer/?",  
	  [
		{key:"databaseUrl", val:$("#input-databaseUrl").val()},
		{key:"serviceAccount", val:$("#input-serviceAccount").val()}
	  ]
	).then((strResult)=>{
		// TODO : tester l'accès au serveur, puis conserver/modifier les UIs selon la disponibilité du serveur
//		console.log("strResult = "+strResult);
		numResult = Number(strResult);
		// TODO : selon le résultat :
		// Si <=0 alors afficher l'erreur selon son code dans une modal !
		// Si > 0 alors afficher le toast de réussite 5 sec !
		switch(numResult){
		  case 1:
		    console.log("modification réussie !");
			// modifier le style de toastEtatsTrts, titre, contenu
		  break;case 0 :
		    console.log("erreur #0");
		    // modifier le style de toastEtatsTrts, titre, contenu
		  break;case -1 :
		    console.log("erreur #-1");
		    // modifier le style de toastEtatsTrts, titre, contenu
		  break;
		}
		getAccessFbDbState().then( booAccessFbDbState=>{
			console.log("checkConfigurationUIs(booAccessFbDbState) lancé !");
			checkConfigurationUIs(booAccessFbDbState);
		})
  	});
}

////////////////////////////// METHODES METIERS : CONFIGURATION //////////////////////////////
function getConfiguration(){
  getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/configurer/?getConfiguration").then( (objectResult)=>{
    console.log(" objectResult.databaseUrl = "+ objectResult.databaseUrl);
    // NOK : $("#input-databaseUrl").value = objectResult.databaseUrl;
    // $("#input-databaseUrl").text = objectResult.databaseUrl;
    // $("#input-databaseUrl").text(objectResult.databaseUrl);
    // $("#input-databaseUrl").html(objectResult.databaseUrl);
    $("#input-databaseUrl").val(objectResult.databaseUrl);
    $("#input-serviceAccount").val( objectResult.serviceAccount);
  }); 
}



////////////////////////////// METHODES MODIFIANT LES UIS //////////////////////////////
function checkConfigurationUIs(_booAccessFbDbState)
{
  // DEV 
  //console.log("checkConfigurationUIs::_booAccessFbDbState = "+_booAccessFbDbState+ " typeof _booAccessFbDbState="+_booAccessFbDbState);
  initHeadersUIs(_booAccessFbDbState, "booAccessFbDbState");
  if(_booAccessFbDbState){
  	$("#div-msgEchec-validateurCnxFbDb").removeClass("estMontre").addClass("estCache");
	//
	// TODO : modifier style de input-databaseUrl ; input-serviceAccount : ajouter class warning mode ! 
  }
  else{
	$("#div-msgEchec-validateurCnxFbDb").removeClass("estCache").addClass("estMontre");
	//
	// TODO : modifier style de input-databaseUrl ; input-serviceAccount : supprimer class warning mode ! 	
  }
  // modifier le header :
  initHeadersUIs(_booAccessFbDbState, "booAccessFbDbState");

}


init();
</script>