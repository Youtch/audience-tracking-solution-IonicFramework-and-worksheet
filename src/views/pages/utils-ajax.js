<!-- views/scripts/utils-ajax.js -->
<script>

/**
 * @param  strData:string objet au format JSON
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function postAjaxJQUERY(strData, responseType, url) 
{
  return new Promise( resolve=>{

 	var formData = new FormData(strData);
    formData.append('data', strData);
    
    var posting = $.ajax({
        url: url,
        type:"POST",
        cache : false,
        processType : false, 
        dataType : responseType, //(=Return data) Type: String => "xml", "html", "script", "json"
    	contentType: "application/json; charset=utf-8",
        data: strData // Type: PlainObject or String or Array
    })
    // TODO : pour homogénéiser les méthodo : retourner un code status
    .done( function(response, jqXHR, data) {//TOTEST : argument status inconnu en l'absence du paramètre jqXHR
      console.log("postAjaxJQUERY [done] status code = "+data.status+" ; data = ",data);
	  resolve(data);
	})
	.fail( error=> {
	  console.log("postAjaxJQUERY error = ",error);
	  resolve(false);
	})
  });
}

/**
 * @param  url:string
 * @param  responseType:string = "json"|"text"
 * @return void
 */
function getAjaxFunction(responseType, url) 
{
  var xhr = new XMLHttpRequest();
  return new Promise( resolve=>{

	xhr.responseType = responseType;

	xhr.timeout = 25000;
	xhr.addEventListener("timeout", function (event) {
  		// XMLHttpRequest timed out. Do something here.
  		console.log("erreur : xhr.status = "+xhr.status);
  		resolve(-1);//timeout errno = -1
	});

	xhr.addEventListener("load", function (event) {
//		console.log("getAjaxFunction onreadystatechange lancé");
			// DEV :
		//invalide : alert("xhr.responseText = "+JSON.stringify(xhr.responseText)); // Testé OK
		// DEV console.log("typeof xhr.response = "+typeof xhr.response); // tester si string JSON est bien renvoyé !
		// DEV console.log("response = "+JSON.stringify(xhr.response)); // Testé OK
		//console.log("response.computedString = "+response.computedString);
	    // DEV console.log("xhr.getAllResponseHeaders() = "+xhr.getAllResponseHeaders() );// Exemple : xhr.getAllResponseHeaders() = date: Wed, 08 Apr 2020 15:27:40 GMT \n connection: keep-alive \n x-powered-by: Express \n transfer-encoding: chunked \n content-type: application/json
		if (xhr.status === 200) {
		  resolve( xhr.response ) // responseType donc pseudo-type est object
		} 
		else {
		  console.log("erreur : xhr.status = "+xhr.status);
		  resolve(-2)
		}
	});

	xhr.open("GET", url, true);
	xhr.send();
  })
}

function setAjaxFunction(url, params, responseType="text")
{ 
  var xhr = new XMLHttpRequest();
  // TODO : passer vers la méthode ajax POST, plus sécurisée
  return new Promise( resolve=>{
  	var urlTransmis = url;
  	// Concaténer chaque paramètre du querystring pour http de type GET
  	for(i=0; i<params.length; i++){
	  if(i>0)
		urlTransmis = urlTransmis + "&";
	  urlTransmis = urlTransmis + params[i].key + "=" + params[i].val ;
  	}
// 	console.log("urlTransmis = " + urlTransmis);

	xhr.responseType = responseType;

	xhr.timeout = 25000;
	xhr.addEventListener("timeout", function (event) {
  		// XMLHttpRequest timed out. Do something here.
  		console.log("erreur : xhr.status = "+xhr.status);
  		resolve(-1);//timeout errno = -1
	});

  	xhr.addEventListener("load", function (event) {
		// DEV :
		//alert("xhr.responseText = "+JSON.stringify(xhr.responseText)); // Testé OK
		// DEV 
		//console.log("typeof xhr.response = "+typeof xhr.response); // tester si string est bien renvoyé !
		// DEV 
		//console.log("response = "+JSON.stringify(xhr.response)); // Testé OK
		//console.log("response.computedString = "+response.computedString);
	    // DEV console.log("xhr.getAllResponseHeaders() = "+xhr.getAllResponseHeaders() );// Exemple : xhr.getAllResponseHeaders() = date: Wed, 08 Apr 2020 15:27:40 GMT \n connection: keep-alive \n x-powered-by: Express \n transfer-encoding: chunked \n content-type: application/json
		if (xhr.status === 200) {
		  resolve( xhr.response ) // responseType donc pseudo-type est object
		} else {
		  alert("erreur : xhr.status = "+xhr.status);
		  resolve(-2)
		}
	});

	// DEV TEST 
	/*
	// OK
	xhr.onreadystatechange = function() {//xhr.addEventListener("load", function() {
		// A chaque nouvel évent : déclenché
    };
	// OK
	xhr.addEventListener("complete", function (oEvent) {
	   console.log("onCompleteonProgress = " + oEvent.loaded / oEvent.total * 100 );
	});
	// TOTEST
	xhr.addEventListener("progress", function (oEvent) {
		if (oEvent.lengthComputable)
		  console.log("onProgress = " + oEvent.loaded / oEvent.total * 100 );
	});*/
    /* NOK !
	xhr.addEventListener("error", function (event) {
		console.log("An error occurred while transferring the file.");
	});*/
	/* NOK !
	xhr.addEventListener("abort", function (event) {
		console.log("The transfer has been canceled by the user.");
	});*/

	// SOL A : méthode GET 
	xhr.open("GET", urlTransmis, true);
	xhr.send();
	// SOL B : méthode POST, plus sécurisée => en erreur 500, 
	// TODO implémenter la correspondance avec le serveur : setAjaxFunction("ajax/v1.7/configurer/?",  
	/* var urlTronque = url;
	xhr.open("POST", urlTronque, true);
	xhr.setRequestHeader("Content-type", "application/json");
    var query =  { setConfiguration:true, databaseUrl: "https://truc%20muche.com", serviceAccount: "truc_muche.json"};
	xhr.send( query );*/
  })
}
</script>