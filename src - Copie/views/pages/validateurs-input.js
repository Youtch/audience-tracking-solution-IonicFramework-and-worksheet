<!-- views/scripts/validateurs-input.js -->
<script>
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
		  	//console.log("aResult = ",aResult);
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