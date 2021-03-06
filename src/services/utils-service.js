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

// services/utils-service.js

module.exports = {
  sortArrayOfObject:sortArrayOfObject,
  getHumanReadableFileSize:getHumanReadableFileSize
}

/**
  E.g.:
    let aObject = [{id: 1, val: Mango},{id: 2, val: Banana},{id: 10, val: Strawberry}];
    console.log("aObject  = ascendant order #1:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "id", true))  );
      RETURNS => aObject  = [{"id":1,"val":"Mango"},{"id":2,"val":"Banana"},{"id":10,"val":"Strawberry"}]
    console.log("aObject  = ascendant order #2:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "val", true)) );
      RETURNS => aObject  = [{"id":2,"val":"Banana"},{"id":1,"val":"Mango"},{"id":10,"val":"Strawberry"}]
    console.log("aObject  = descendant order #1:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "id", false)) );
      RETURNS => aObject  = [{"id":10,"val":"Strawberry"},{"id":2,"val":"Banana"},{"id":1,"val":"Mango"}]
    console.log("aObject  = descendant order #2:"+JSON.stringify( this.BOUtils.sortArrayOfObject(aObject, "val", false)) );
      RETURNS => aObject  = [{"id":10,"val":"Strawberry"},{"id":1,"val":"Mango"},{"id":2,"val":"Banana"}]
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
 * Convert size in bytes to the human readable best unit of measure
 * @param  {number} _size Number in bytes
 * @return {Object< size:string, unitOfMeasure:string >}
 */
function getHumanReadableFileSize(_size)
{
  let output;
  if(_size==0){
    output = { size: "0" , unitOfMeasure: "o" }
  } else if(_size/1099511627776>=1){//else if _size >= 1 Tb
    output = {
      size: (_size/1099511627776).toFixed(2),
        unitOfMeasure: "To" }
  } else if(_size/1073741824>=1){//else if _size >= 1 Gb
    output = {
      size: (_size/1073741824).toFixed(2),
        unitOfMeasure: "Go" }
  } else if(_size/1048576>=1){//else if _size >= 1 Mb
   output = {
      size: (_size/1048576).toFixed(2),
        unitOfMeasure: "Mo" }
  } else if(_size/1024>=1){//else if _size >= 1 Kb
   output = {
      size: (_size/1024).toFixed(2),
        unitOfMeasure: "Ko" }
  } else{
   output = {//if _size < 1 Kb
      size: _size.toString(), unitOfMeasure: "o" }
  }
  return output;
}