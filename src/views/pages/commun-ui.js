<!-- views/pages/commun-ui.js-->
<script>

////////////////////////////// METHODES MODIFIANT LES UIS //////////////////////////////
/**
 * @param  txt:string
 * @param  motif:string
 * @param  positionRLDansMotif:number
 * @return string
 */
function ajouterRetourligne(txt, motif, positionRLDansMotif) // EN : retour lign = carriage return
{
  // DEV : console.log( motif.substr(0,positionRLDansMotif) + "\r\n" + motif.substr(positionRLDansMotif));
  const regex = new RegExp(motif,"g");
  return txt.replace(regex , motif.substr(0,positionRLDansMotif) + "\r\n" + motif.substr(positionRLDansMotif) );
}

/**
   * Passe toute valeur numérique ayant soit un soit deux caractère, vers deux caractère
   * @param valeur:number
   * @return string
   */
function masquageDeuxCaract(valeur)
{
  if(valeur<10)
      valeur = "0"+valeur;  
    return valeur;
}

</script>