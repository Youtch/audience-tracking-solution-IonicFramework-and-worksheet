<!-- views/scripts/header-loader.js-->
<script>

////////////////////////////// METHODES MODIFIANT LES UIS //////////////////////////////

/** Load the check lights in the header menu
 **/
initHeaderBadges(){
  getAccessFbDbState().then( booAccessFbDbState=>{
    console.log("checkConfigurationUIs(booAccessFbDbState) lancé !");
    initHeadersUIs(booAccessFbDbState);
  })
  getSessionCSVFileExists().then( booSessionCSVFileExists=>{
    console.log("checkConfigurationUIs(booSessionCSVFileExists) lancé !");
    initHeadersUIs(booSessionCSVFileExists, true);
  })
}

/*
TODO : unification (SOLID)
function initHeadersUIs(_booAccessFbDbState, _booSessionCSVFileExists)
{
	// DEV 
  //console.log("checkConfigurationUIs::_booAccessFbDbState = "+_booAccessFbDbState+ " typeof _booAccessFbDbState="+_booAccessFbDbState);
  if(_booAccessFbDbState){
	$("#btn-genererCSV-success").removeClass("estCache").addClass("estMontre");
	$("#btn-genererCSV-warning").removeClass("estMontre").addClass("estCache");
  }
  else{
  	$("#btn-genererCSV-warning").removeClass("estCache").addClass("estMontre");
  	$("#btn-genererCSV-success").removeClass("estMontre").addClass("estCache");
  }

  if(_booSessionCSVFileExists){
	$("#btn-telechargerHistorique-success").removeClass("estCache").addClass("estMontre");
	$("#btn-telechargerHistorique-warning").removeClass("estMontre").addClass("estCache");
  }
  else{
  	$("#btn-telechargerHistorique-warning").removeClass("estCache").addClass("estMontre");
  	$("#btn-telechargerHistorique-success").removeClass("estMontre").addClass("estCache");
  }
}*/

/* _valueToEval contient _booAccessFbDbState ou _booSessionCSVFileExists
   _valueType contient 1=> _booAccessFbDbState ou 2=> _booSessionCSVFileExists
 */
function initHeadersUIs(_valueToEval, _valueType)
{
  if(_valueType==false){
	  if(_valueToEval){// cas : _booAccessFbDbState
		$("#btn-genererCSV-success").removeClass("estCache").addClass("estMontre");
		$("#btn-genererCSV-warning").removeClass("estMontre").addClass("estCache");
	  }
	  else{
	  	$("#btn-genererCSV-warning").removeClass("estCache").addClass("estMontre");
	  	$("#btn-genererCSV-success").removeClass("estMontre").addClass("estCache");
	  }
  }else{
	  if(_valueToEval){// cas : _booSessionCSVFileExists
		$("#btn-telechargerHistorique-success").removeClass("estCache").addClass("estMontre");
		$("#btn-telechargerHistorique-warning").removeClass("estMontre").addClass("estCache");
	  }
	  else{
	  	$("#btn-telechargerHistorique-warning").removeClass("estCache").addClass("estMontre");
	  	$("#btn-telechargerHistorique-success").removeClass("estMontre").addClass("estCache");
	  }
  }
}

////////////////////////////// METHODES METIERS : ETAT FIREBASE DATABASE //////////////////////////////
// return Boolean
function getAccessFbDbState()
{ // TODO : à dupliquer dans init() de page importer = première page routée de l'appli.
  return new Promise( resolve =>{
    getAjaxFunction("http://localhost:3000/ajax/v1.7/commun/?t=getAccessFbDbState").then( (strResult)=>{
      console.log("getAccessFbDbState :: strResult = "+ strResult+ " ; Boolean(strResult) = "+Boolean(strResult));
      resolve(Boolean(strResult));
    });
  });
}

////////////////////////////// METHODES METIERS : ETAT FICHIER CSV DE SESSION //////////////////////////////
// return Boolean
function getSessionCSVFileExists()
{ // TODO : à dupliquer dans init() de page importer = première page routée de l'appli.
  return new Promise( resolve =>{
  	getAjaxFunction("http://localhost:3000/ajax/v1.7/commun/?t=getSessionCSVFileExists").then( (strResult)=>{
  	  console.log("getSessionCSVFileExists :: strResult = "+ strResult+ " ; Boolean(strResult) = "+Boolean(strResult));
  	  resolve(Boolean(strResult));
  	});
  });
}

</script>