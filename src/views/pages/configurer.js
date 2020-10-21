<!-- views/pages/configurer.js 
  Dépendances
    header-loader.js
      ::initHeadersBadges
      ::overliningActualMenuButton
      ::getAccessFbDbState
      ::getSessionCSVFileExists
    utils-ajax.js
      ::getAjaxFunction
      ::setAjaxFunction
-->
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

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// INITIALIZING FUNCTIONS //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
function init(){
    getConfiguration().then( ()=>{
	    setTimeout( ()=>{
		  overliningActualMenuButton(0);
		},50);
	
		getAccessFbDbState().then( booAccessFbDbState=>{
			console.log("checkConfigurationUIs(booAccessFbDbState) lancé !");
			initHeadersBadges(booAccessFbDbState, "booAccessFbDbState");
		})
		getSessionCSVFileExists().then( booSessionCSVFileExists=>{
			console.log("checkConfigurationUIs(booSessionCSVFileExists) lancé !");
			initHeadersBadges(booSessionCSVFileExists, "booSessionCSVFileExists");
		})

	});		
    
}

function setConfiguration(){
	let data = 	[
		{key:"databaseUrl", val:$("#input-databaseUrl").val()},
		{key:"serviceAccount", val:$("#input-serviceAccount").val()}
	];
	setAjaxFunction("http://localhost:3000/ajax/v1.7/configurer/?setConfiguration=true&", 

	  data
	).then((strResult)=>{
		numResult = Number(strResult);
		switch(numResult){
		  case 1:
		    console.log("modification réussie !");
		  break;case 0 :
		    console.log("erreur #0");
		  break;case -1 :
		    console.log("erreur #-1");
		  break;
		}
		getAccessFbDbState().then( booAccessFbDbState=>{
			console.log("checkConfigurationUIs(booAccessFbDbState) lancé !");
			checkConfigurationUIs(booAccessFbDbState);
		})
  	});
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// BUSINESS FEATURES //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
function getConfiguration(){
  return new Promise( resolve=>{
  	getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/configurer/?getConfiguration").then( (objectResult)=>{
	    $("#input-databaseUrl").val(objectResult.databaseUrl);
	    $("#input-serviceAccount").val( objectResult.serviceAccount);
	    resolve(true);
	});
  }); 

}


/////////////////////////////////////////////////////////////////////////
////////////////////////////// UI FEATURES //////////////////////////////
/////////////////////////////////////////////////////////////////////////

function checkConfigurationUIs(_booAccessFbDbState)
{
  initHeadersBadges(_booAccessFbDbState, "booAccessFbDbState");
  if(_booAccessFbDbState){
  	$("#div-msgEchec-validateurCnxFbDb").removeClass("estMontre").addClass("estCache");
  }
  else{
	$("#div-msgEchec-validateurCnxFbDb").removeClass("estCache").addClass("estMontre");
  }
  // Change header
  initHeadersBadges(_booAccessFbDbState, "booAccessFbDbState");

}


init();
</script>