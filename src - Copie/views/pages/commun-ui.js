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
</script>