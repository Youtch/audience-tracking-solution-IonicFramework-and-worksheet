<script>
/*MIT License

Copyright (c) 2020 FRANÇOIS GARDIEN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

/* views/partiels/bo/peupler-modale.ejs

  Description: Modals features to display messages about server's working
    
  NB : the events below are triggerd by the modal's buttons clicking
      modalEtatsTrts-btnValider => ctaValiderModalEtatsTrt(<numPageModalId>)
      modalEtatsTrts-btnAnnuler => ctaAnnulerModalEtatsTrt(<numPageModalId>)
 **/

function afficherModalEtat(_numPageModalId, _titre, _iconeTitre, _contenuHtml, _btnValider, _btnAnnuler, _btnValiderLabel, _btnAnnulerLabel)
{
  /**
   * It defines the id of the modal to build. It will be used to launch the binded process ON THE PAGE's script, 
   *   when the user triggers an event on the modal UI.
   * @type {number}
   */
  numPageModalId = _numPageModalId;
  
  //Show the modal
  $("#modalEtatsTrts").modal("show");

  //Define the modal's elements
  $("#modalEtatsTrts-titre").text( _titre );
  if(_iconeTitre!="")
  	$("#modalEtatsTrts-iconeTitre").attr("class", "fas "+ _iconeTitre );
  $("#modalEtatsTrts-contenu").html(_contenuHtml);

  if(_btnValider)
    $("#modalEtatsTrts-btnValider").removeClass("estCache");
  if(_btnAnnuler)
    $("#modalEtatsTrts-btnAnnuler").removeClass("estCache");

  if(_btnValiderLabel!="")
    $("#modalEtatsTrts-btnValider").text(_btnValiderLabel);
  if(_btnAnnulerLabel!="")
    $("#modalEtatsTrts-btnAnnuler").text(_btnAnnulerLabel);
}

//Handler closing the modal
function fermerModal(){
  $("#modalEtatsTrts").modal("hide");
}
</script>