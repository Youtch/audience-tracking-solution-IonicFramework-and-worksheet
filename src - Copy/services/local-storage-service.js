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

// services/local-storage-service.js

const LocalStorage = require('node-localstorage').LocalStorage;
const dotenv = require('dotenv').config();//It's required to load process.env in a global variable or constant
const localStorage = new LocalStorage( process.env.CHEMIN_LOCAL_STORAGE );

module.exports = {
  setItem:setItem,
  getItem:getItem,
};


/**
 * Save data to a local-storage file
 * 
 * @param {string} _idUser 
 * @param {string} _contenu a JSON formatted content - NB: parameters names are expected to be wrapped with quotes
 */
function setItem(_idUser, _contenu)
{
  try{
  	localStorage.setItem(_idUser, _contenu);
  }
  catch(err){
  	console.log("setItem:: erreur = ", err);
  }
}

/**
 * Get data from a local-storage file
 * 
 * @param  {string} _idUser
 * @return {string} _contenu a JSON formatted content
 **/
function getItem(_idUser)
{
  try{
	var strContenu = localStorage.getItem(_idUser);
	if(strContenu!=null)
		return JSON.parse( strContenu );
	else
		return null;
  }
  catch(err){
  	console.log("getItem:: erreur = ", err);
  }
}