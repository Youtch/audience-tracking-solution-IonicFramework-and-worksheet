<!-- views/pages/header-loader.js-->
<script>

////////////////////////////// METHODES MODIFIANT LES UIS //////////////////////////////

/** Load the check lights in the header menu
 **/
 /* TODO : nok !
function initHeaderBadges(){
  getAccessFbDbState().then( booAccessFbDbState=>{
    console.log("checkConfigurationUIs(booAccessFbDbState) lancé !");
    initHeadersUIs(booAccessFbDbState);
  })
  getSessionCSVFileExists().then( booSessionCSVFileExists=>{
    console.log("checkConfigurationUIs(booSessionCSVFileExists) lancé !");
    initHeadersUIs(booSessionCSVFileExists, true);
  })
}*/
/* _valueToEval:boolean contient true ou false
   _valueType:string contient "booAccessFbDbState" ou "booSessionCSVFileExists"
 */
function initHeadersUIs(_valueToEval, _valueType)
{
  if(_valueType=="booAccessFbDbState"){
	  if(_valueToEval){
		$("#btn-genererCSV-success").removeClass("estCache").addClass("estMontre");
		$("#btn-genererCSV-danger").removeClass("estMontre").addClass("estCache");
	  }
	  else{
	  	$("#btn-genererCSV-danger").removeClass("estCache").addClass("estMontre");
	  	$("#btn-genererCSV-success").removeClass("estMontre").addClass("estCache");
	  }
	  $("#btn-genererCSV-attente").addClass("estCache");
  }else if(_valueType=="booSessionCSVFileExists"){
	  if(_valueToEval){
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
    getAjaxFunction("text", "http://localhost:3000/ajax/v1.7/commun/?t=getAccessFbDbState").then( (strResult)=>{
      //console.log("getAccessFbDbState :: strResult = "+ strResult+ " ; Boolean(strResult) = "+Boolean(strResult));
      if(strResult=="true")
       resolve(true)
      else
        resolve(false);
    });
  });
}

////////////////////////////// METHODES METIERS : ETAT FICHIER CSV DE SESSION //////////////////////////////
// return Boolean
function getSessionCSVFileExists()
{ // TODO : à dupliquer dans init() de page importer = première page routée de l'appli.
  return new Promise( resolve =>{
  	getAjaxFunction("text" ,"http://localhost:3000/ajax/v1.7/commun/?t=getSessionCSVFileExists").then( (strResult)=>{
  	  //console.log("getSessionCSVFileExists :: strResult = "+ strResult+ " ; Boolean(strResult) = "+Boolean(strResult));
  	  if(strResult=="true")
        resolve(true)
      else
        resolve(false);
  	});
  });
}

</script>