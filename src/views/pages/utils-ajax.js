<!-- views/scripts/utils-ajax.js -->
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

/**
 * [postAjaxJQUERY description]
 * @param  {string} strData JSON formatted text
 * @param  {string} responseType Expected values : "xml", "html", "script", "json"
 * @param  {string} url
 * @return {Object|Boolean} Returns Object if it's a success, or boolean if it's a failure
 */
function postAjaxJQUERY(strData, responseType, url) 
{
  return new Promise( resolve=>{
  	console.log("postAjaxJQUERY strData = ",strData)
 	var formData = new FormData(strData);
    formData.append('data', strData);
    
    var posting = $.ajax({
        url: url,
        type:"POST",
        cache : false,
        processType : false, 
        dataType : responseType,
    	contentType: "application/json; charset=utf-8",
        data: strData
    })
    .done( function(response, jqXHR, data) {
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
 * @param  {string} responseType
 * @param  {string} url Expected values : "json"|"text"
 * @return {Object|Boolean} Returns Object if it's a success, or boolean if it's a failure
 */
function getAjaxFunction(responseType, url) 
{
  var xhr = new XMLHttpRequest();
  return new Promise( resolve=>{

	xhr.responseType = responseType;

	xhr.timeout = 25000;
	xhr.addEventListener("timeout", function (event) {// XMLHttpRequest timed out. Do something here.
  		console.log("erreur : xhr.status = "+xhr.status);
  		resolve(-1);//timeout errno = -1
	});

	xhr.addEventListener("load", function (event) {
		if (xhr.status === 200) {
		  resolve( xhr.response )
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
  return new Promise( resolve=>{
  	var urlTransmis = url;
  	// Concatening each parameter of the querystring to set the requesting URL
  	for(i=0; i<params.length; i++){
	  if(i>0)
		urlTransmis = urlTransmis + "&";
	  console.log(" i = "+i + " : " + params[i].key + "=" + params[i].val );
	  urlTransmis = urlTransmis + params[i].key + "=" + params[i].val ;
  	}
	xhr.responseType = responseType;

	xhr.timeout = 25000;
	xhr.addEventListener("timeout", function (event) {// XMLHttpRequest timed out. Do something here.
  		console.log("erreur : xhr.status = "+xhr.status);
  		resolve(-1);//timeout errno = -1
	});

  	xhr.addEventListener("load", function (event) {
		if (xhr.status === 200) {
		  resolve( xhr.response )
		} else {
		  alert("erreur : xhr.status = "+xhr.status);
		  resolve(-2)
		}
	});

	xhr.open("GET", urlTransmis, true);
	xhr.send();
  })
}
</script>