<!-- views/scripts/validateurs-input.js -->
<script>


/**
 * _dateFutureEstInterdite:boolean
 * @return {errno:number,dateMaxLimite:string,dateMinLimite:string}
*    NB valeurs pour errno :
 *   -1 Au moins une des saisie attendue est vide
 *   -2 Au moins une des saisie ne correspond pas au format demandé dd-mm-yyyy
 *   -3 Au moins une des saisie contient une date erroné par exemple 32-12-2020
 *   -4 La date de fin est antérieure à la date de début
 *   -5 La date de fin est supérieure à la date d'aujourd'hui
 */
function validateurBtnsImporter(_dateFutureEstInterdite){
  var errno = 0;
  // OK : console.log( "$('#cbToutesDonnees:checked').length =",$('#cbToutesDonnees:checked').length ); 

  console.log("$('#cbToutesDonnees:checked').length = "+ $('#cbToutesDonnees:checked').length );
  if($('#cbToutesDonnees:checked').length==0){//si "cbToutesDonnees" est décoché : vérifier l'existence des deux saisies
    if($('#inpt-dateMaxLimite').val()!="" && $('#inpt-dateMinLimite').val()!=""){
      //console.log("$('#inpt-dateMaxLimite').val().search(/\d\d-\d\d-\d\d\d\d/)  = ",$('#inpt-dateMaxLimite').val().search(/\d\d-\d\d-\d\d\d\d/));
      //console.log("$('#inpt-dateMaxLimite').val() = ",$('#inpt-dateMaxLimite').val());
      if($('#inpt-dateMaxLimite').val().search(/\d\d-\d\d-\d\d\d\d/)==0 && $('#inpt-dateMinLimite').val().search(/\d\d-\d\d-\d\d\d\d/)==0)
      // 1) Tester le pattern des deux saisies
      {
        var aInptDateMaxLimite = $('#inpt-dateMaxLimite').val().split('-');
        //console.log("aInptDateMaxLimite = ", aInptDateMaxLimite );
        var dMax = new Date( Number(aInptDateMaxLimite[2]), Number(aInptDateMaxLimite[1])-1, aInptDateMaxLimite[0] );
        //console.log("dMax = ", dMax );
        //console.log("dMax.getMonth()+ 1 = ",(dMax.getMonth()+ 1) );
        

        var aInptDateMinLimite = $('#inpt-dateMinLimite').val().split('-');
        //console.log("aInptDateMinLimite = ", aInptDateMinLimite );
        var dMin = new Date( Number(aInptDateMinLimite[2]), Number(aInptDateMinLimite[1])-1, aInptDateMinLimite[0] );
        //console.log("dMin = ", dMin );
        //console.log("dMin.getMonth()+ 1 = ",(dMin.getMonth()+ 1) );

        //TODO : selon un argument dateFutureEstValide => errno = -5
        //Tester la cohérence des deux saisies (par ex : 32-12-2020 = NOK ; 31-12-2020 = OK ; 31-02-2020 = NOK)
        if( (dMax && (dMax.getMonth()+ 1) == aInptDateMaxLimite[1]) && (dMin && (dMin.getMonth()+ 1) == aInptDateMinLimite[1]) ){
          // TODO : tester la cohérence des date :  
          if(dMax.getTime()>dMin.getTime()){
            var now = new Date();
            if(_dateFutureEstInterdite==true && dMax.getTime()>now.getTime() ){
              errno = -5;
            }
            else{
              errno = 0;
            }
          } 
          else{//La date de fin est antérieure à la date de début
            errno = -4;
          }
        }
        else{
          errno = -3;//Au moins une des saisie contient une date erroné par exemple 32-12-2020
        }
      }
      else{
        errno = -2;//Au moins une des saisie ne correspond pas au format demandé dd-mm-yyyy
      }
    }
    else{
      errno = -1;//Au moins une des saisie attendue est vide
    }
  }
  console.log("errno = ",errno);
  return errno;

}


//Private
/**
 * [validerMotifsModelFichierCSV description]
 * @param  _str:string [modèle de nom de fichier saisi]
 * @return number      [valeurs possibles : 0=>aucune erreur de syntaxe ; 
 *                                          -1=>L'un des mots est différent de l'ensemble des mots-clés attendus ; ]
 *                                          -2=>L'un des mot a été trouvé PLUSIEURS FOIS
 */
function validerMotifsModelFichierCSV(_str)
{
  // Recherche globale de mot qui NE SONT PAS parmis les mots-clés
  aMotsAutorises = ["dateFr","dateUs","horaire","nbActions","nbSessions"];
  aMotsRefuses = _str.split("-").filter( (motUser)=>{ // Retour du filtrage : array contenant tous les mots qui ne sont pas des mots clés
 	var motUserEstMotCle = false;
  	aMotsAutorises.forEach( (motAutorise)=>{
  	  if(motAutorise==motUser){
  	  	console.log("moCle "+motAutorise+" trouvé !");
  	  	motUserEstMotCle = true;
  	  }
  	});
  	if(!motUserEstMotCle)
  	  return(motUser);
  });

  console.log('validerMotifsModelFichierCSV aMotsRefuses = ',aMotsRefuses);
  if(aMotsRefuses.length>0)// Au moins un mot "intrus" : un des mots est différent de l'ensemble des mots-clés attendus
    return ({errNo: -1, errStr: aMotsRefuses.toString()});
  else{// Aucun mot "intrus" trouvé
    var aMotsClesMultiples = [];
	aMotsAutorises.forEach( (mot)=>{
		var aResult = _str.match( new RegExp(mot,"g") );// new RegExp => permet d'utiliser une variable dans le pattern regex
		if(aResult!=null){// Ce mot A ETE trouvé
		  	console.log("aResult = ",aResult);
		    if(aResult.length>1){
			  aMotsClesMultiples.push( mot );
		      console.log("aResult.length = " + aResult.length);
		    }
		}
	});
    if(aMotsClesMultiples.length>0)// Si au moins un mot, ou plusieurs mots, est/sont multiplié(s)
      return ({errNo:-2,errStr:aMotsClesMultiples.toString()})
    else
      return ({errNo:0})
  }
}
</script>

