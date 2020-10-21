// services/utils-service.js

/////////// Exporter les fonctions publiques
module.exports = {
  sortArrayOfObject:sortArrayOfObject,
  getHumanReadableFileSize:getHumanReadableFileSize
}
/** 
  *
*/
// params list : values: any[], orderType:any, orderByAscendant:boolean=true
// return Array<any>
/**
  Exemples : 
    console.log("aObject  = test ordre ascendant #1:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "id", true))  );
    console.log("aObject  = test ordre ascendant #2:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "gain", true)) );
    console.log("aObject  = test ordre descendant #1:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "id", false)) );
    console.log("aObject  = test ordre descendant #2:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "gain", false)) );
 *
  Retours d'exemples :
    aObject  = test ordre ascendant #1:[{"id":1,"gain":"Cachalot"},{"id":2,"gain":"Dauphin"},{"id":10,"gain":"Dorade"}]
    aObject  = test ordre ascendant #2:[{"id":1,"gain":"Cachalot"},{"id":2,"gain":"Dauphin"},{"id":10,"gain":"Dorade"}]
    aObject  = test ordre descendant #1:[{"id":10,"gain":"Dorade"},{"id":2,"gain":"Dauphin"},{"id":1,"gain":"Cachalot"}]
    aObject  = test ordre descendant #2:[{"id":10,"gain":"Dorade"},{"id":2,"gain":"Dauphin"},{"id":1,"gain":"Cachalot"}]*
 *
 * @param  {Object}  values
 * @param  {string}  orderType
 * @param  {Boolean} orderByAscendant
 * @return {Array}
 */
function sortArrayOfObject(values, orderType, orderByAscendant=true)
{
  if(orderByAscendant){
    return values.sort((a, b) => {
      if (a[orderType] < b[orderType]) {
        return -1;
      }

      if (a[orderType] > b[orderType]) {
        return 1;
      }

      return 0
    });
  }else{
    return values.sort((a, b) => {
      if (a[orderType] < b[orderType]) {
        return -1;
      }

      if (a[orderType] > b[orderType]) {
        return 1;
      }

      return 0
    }).reverse();
  }
}

/**
 * Convertir à l'unité de capacité la plus simple humainement
 * @param _poids:number
 * @return Object{poidsHR:string|number, uniteHR:string}
 */
function getHumanReadableFileSize(_poids) // _poids = poids en OCTETS
{
  if(_poids==0){
    data = { poidsHR: "0" , uniteHR: "o" }
  } else if(_poids/1099511627776>=1){
    data = {
      poidsHR: (_poids/1099511627776).toFixed(2), // si >= 1 Tb
        uniteHR: "To" }
  } else if(_poids/1073741824>=1){
    data = {
      poidsHR: (_poids/1073741824).toFixed(2),// si >= 1 Gb
        uniteHR: "Go" }
  } else if(_poids/1048576>=1){
   data = {
      poidsHR: (_poids/1048576).toFixed(2),// si >= 1 Mb
        uniteHR: "Mo" }
  } else if(_poids/1024>=1){
   data = {
      poidsHR: (_poids/1024).toFixed(0),// si >= 1 Kb
        uniteHR: "Ko" }
  } else{
   data = { // si >= 1 Kb
      poidsHR: _poids, uniteHR: "o" }
  }
  return data;
}

