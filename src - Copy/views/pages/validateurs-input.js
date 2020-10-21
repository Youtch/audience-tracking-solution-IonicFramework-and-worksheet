<!-- views/scripts/validateurs-input.js -->
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
 * @param  {string} _str Filename pattern typed
 * @return number Expected values are...
 *  0 => no syntax error found
 * -1 => at least one typed word don't match with the expected keywords
 * -2 => at least one of the typed words is typed several times
 */
function validerMotifsModelFichierCSV(_str)
{
  //Searching globally the words which ARE NOT include among the expected keywords
  aMotsAutorises = ["dateFr","dateUs","horaire","nbActions","nbSessions"];
  aMotsRefuses = _str.split("-").filter( (motUser)=>{
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

  if(aMotsRefuses.length>0)//Use case : one or more words are "unknown" on the expected keywords
    return ({errNo: -1, errStr: aMotsRefuses.toString()});
  else{// No words are unknown
    var aMotsClesMultiples = [];
	aMotsAutorises.forEach( (mot)=>{
		var aResult = _str.match( new RegExp(mot,"g") );
		if(aResult!=null){// This word WAS FOUND
		  	if(aResult.length>1){
			  aMotsClesMultiples.push( mot );
		      console.log("aResult.length = " + aResult.length);
		    }
		}
	});
    if(aMotsClesMultiples.length>0)//Use case : one or more words are multiples times
      return ({errNo:-2,errStr:aMotsClesMultiples.toString()})
    else
      return ({errNo:0})
  }
}
</script>