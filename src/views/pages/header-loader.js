<!-- views/pages/header-loader.js-->
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

////////////////////////////// UI FEATURES //////////////////////////////

/**
 * Display badge information on the top of the page, about data source and data availability
 * @param  {[type]} _valueToEval [description]
 * @param  {[type]} _valueType   [description]
 * @return {[type]}              [description]
 */
function initHeadersBadges(_valueToEval, _valueType)
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
  
  }
  else if(_valueType=="booSessionCSVFileExists"){
	
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

function overliningActualMenuButton(_btnIndex)
{
  switch(_btnIndex){
    case 0:
      $("#menuBtn1").addClass("btn-topMenu-active");
      $("#btn-genererCSV-attente, #btn-genererCSV-danger, #btn-genererCSV-success, #btn-telechargerHistorique-warning, #btn-telechargerHistorique-success").removeClass("btn-topMenu-active");
    break;
    case 1:
      $("#btn-genererCSV-attente, #btn-genererCSV-danger, #btn-genererCSV-success").addClass("btn-topMenu-active");
      $("#menuBtn1, #btn-telechargerHistorique-warning, #btn-telechargerHistorique-success").removeClass("btn-topMenu-active");
    break;
    case 2:
      $("#btn-telechargerHistorique-warning, #btn-telechargerHistorique-success").addClass("btn-topMenu-active");
      $("#menuBtn1, #btn-genererCSV-attente, #btn-genererCSV-danger, #btn-genererCSV-success").removeClass("btn-topMenu-active");
    break;
  }
}

////////////////////////////// BUSINESS FEATURES ////////////////////////////// 

/**
 * Get the state of the connection at Firebase Database
 * @return {Promise<Boolean}
 */
function getAccessFbDbState()
{
  return new Promise( resolve =>{
    getAjaxFunction("text", "http://localhost:3000/ajax/v1.7/commun/?t=getAccessFbDbState").then( (strResult)=>{
      console.log("getAccessFbDbState :: strResult = "+ strResult+ " ; Boolean(strResult) = "+Boolean(strResult));
      if(strResult=="true")
       resolve(true)
      else
        resolve(false);
    });
  });
}

/**
 * Get the state of the CSV-text file generated on this session
 * @return {Promise<Boolean>}
 */
function getSessionCSVFileExists()
{
  return new Promise( resolve =>{
  	getAjaxFunction("text" ,"http://localhost:3000/ajax/v1.7/commun/?t=getSessionCSVFileExists").then( (strResult)=>{
  	  if(strResult=="true")
        resolve(true)
      else
        resolve(false);
  	});
  });
}

</script>