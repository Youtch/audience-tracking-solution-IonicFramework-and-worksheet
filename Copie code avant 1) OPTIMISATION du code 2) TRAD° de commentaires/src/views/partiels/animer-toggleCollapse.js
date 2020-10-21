<script>
/* views/partiels/bo/animer-toggleCollapse.js
  Gestion de l'interaction visuelles de d'UI "collapse" / UI de contrôle de visibilité des rubriques de page 
*/
function toggleCollapse(_idUIElement)// _idComposant:string
{
  //DEV aNumsEnteteCollapse = ["Un","Deux","Trois"]; //accéder à "#btn-collapseUn-chevron", "#btn-collapseDeux-chevron", "#btn-collapsetrois-chevron"
  $("#"+_idUIElement).toggleClass('animate-collapseUI-deplier animate-collapseUI-plier');
}
</script>