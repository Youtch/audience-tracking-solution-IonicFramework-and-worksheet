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

// services/date-operations-service.js 

const daysOfWeekHumanText_fr_short = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const daysOfWeekHumanText_fr_long = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const monthsHumanText_fr_short = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Aoû","Sept","Oct","Nov","Déc"];
const monthsHumanText_fr_long = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const daysOfWeekHumanText_en_short = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const daysOfWeekHumanText_en_long = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthsHumanText_en_short = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthsHumanText_en_long = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const SEPARATOR_OF_NUMERIC_DATE_FORMAT = "-";

module.exports = class DateOperationsService {
	
	// /!\ public constants or variables are forbbiden
	constructor() 
    {}

    /** conversion from date to ISO string, without any timezone offset (date & hours) */
	getDateToISOWithoutOffset(_date)
	{
		var tzoffset = (_date).getTimezoneOffset() * 60000; //offset in milliseconds
		var localISOTime = (new Date(_date.getTime() - tzoffset)).toISOString().slice(0,-1);
		return localISOTime;
	}

    /**
    * @param input:number
    * @return string
    **/
	getNumberToTwoDigitsString(input)
	{
		if((input).toString().length<2)
			return ("0"+input).toString();
		else
			return input.toString();
	}
	
	/**
	** @param strDate:Date (format = 24:00)
	** @return Date
	**/
	getHoursFromString(strDate)
	{
		let aDate = strDate.split( ":" );
		return new Date(0, 0, 0, Number(aDate[0]) , Number(aDate[1]), 0);
	}

	/**
	** @param date1:Date
	** @param date2:Date
	** @param typeOutput:string
	** @return number
	**/
	getDateDiff(dateMax, dateMin, typeOutput)
	{
		let diff;
		diff = dateMax.getTime() - dateMin.getTime();
		switch(typeOutput){
			/* case "ms": // to get number of milliseconds
			  // Nothing to do
			break;*/
			case "sec": // to get number of seconds
			  diff = diff / 1000;
			break;
			case "min": // to get number of minutes
			  diff = diff / 1000 / 60;
			break;
			case "hour": // to get number of hours
			  diff = diff / 1000 / 60 / 60;
			break;
			case "days": // to get number of days
			  diff = diff / 1000 / 60 / 60 / 24;
			break;
			case "weeks": // to get number of weeks;
			  diff = diff / 1000 / 60 / 60 / 24 / 7;
			break;
		}
		console.log("[after] diff ="+diff);
		return diff;
	}

	/**
	** @param date:string (pattern : "##-##-####-##:##:##"|"####-##-##-##:##:##")
	** @param convertType:string (values : "frToUs", "usToFr")
	** @param showTime:Boolean
	** @return string
	**/
	convertStringDateToLocal(date, convertType, showTime=false)
	{
		const aTempDate = (dateStringType).split("-");
		console.log("convertStringDateToLocal :: aTempDate = ",aTempDate);
		let strDateFormatee;
        if(convertType=="usToFr")
			strDateFormatee = aTempDate[2] + "-" + aTempDate[1]+ "-" + aTempDate[0]+ " "+aTempDate[3];
		else//if(conversionType=="frToUs")
			strDateFormatee = aTempDate[0] + "-" + aTempDate[1]+ "-" + aTempDate[2]+ " "+aTempDate[3];
		return strDateFormatee;
	}
		
	/**
	** @param date:Date
	** @param numberOfDays:number
	** @return Date
	**/
	dateAddSomeDays(date,numberOfDays)
	{
		let newDate = new Date( date.getTime() + numberOfDays*24*60*60*1000);
		//console.log("BOUtils::date = "+this.getDateToISOWithoutOffset(date)+" ; BOUTILS::newDate = "+this.getDateToISOWithoutOffset(newDate) );
		return newDate;
	}

	/** 
	  #About english translations of dates
	    CF  : https://bilingueanglais.com/blog/2788/les-dates-en-anglais/ et bbc.co.uk 
	    1) short US format the more used is : mm/dd/yyyy or month/day/year 
		e.g.: 12/31/17 explains the december 31th of 2017.
	    2) British format :
	    "Wed 07 Aug" or "Wed 07 Aug 2018"
		The short british format is : dd/mm/yyyy or day/month/year : it's similar to the french format
		e.g.: 31/12/2017 explains the december 31th of 2017.
	 **/

	/**
	 * @param date:Date
	 * @param langIsFr:Boolean
	 * @param displayYear:Boolean
	 * @param dateFormat:number 
	 *        examples, with langIsFr = false and shortFullYear = true 
	 *        - when dateFormat=0 : Saturday 4 January 2020 ; 
	 *        - when dateFormat=1 : Sat 4th Jan 2020 ; 
	 *        - when dateFormat=2 : 13-01-2020 
	 * @param shortFullYear:Boolean 
	 * @param showTime:Boolean
	 * @param timeFormat:number
	 * @param ajoutArticles:Boolean
	 * @return string
	 *
	 * @DEV : bug lors de l'exploitation sur STAU, cas : importer un jeu de données, lire les metadata obtenues :-( 
	 * 
	 */
	getDateToShortHumanText_i18n(date, langIsFr=true, displayYear=true, dateFormat=0, shortFullYear=false, showTime=false, timeFormat=1, ajoutArticles=false)
	{ 
		let formatedYear;
		let separator;
		let strDate;
		console.log("date = "+JSON.stringify(date)+" , langIsFr  =" +langIsFr+" , displayYear = " +displayYear + ", dateFormat= "+dateFormat+", shortFullYear = "+shortFullYear+", showTime = "+showTime+", timeFormat = "+timeFormat+", ajoutArticles = "+ajoutArticles);
		if(langIsFr){// Language is french
			(shortFullYear==true)? formatedYear = date.getFullYear().toString().substr(2) : formatedYear = date.getFullYear().toString();
			
			switch(dateFormat)
			{
				case 0:
					strDate = daysOfWeekHumanText_fr_short[Number(date.getDay())]+" "+ date.getDate() +" "+monthsHumanText_fr_short[date.getMonth()];
					separator = " ";
				break;
				case 1:
					strDate = daysOfWeekHumanText_fr_long[Number(date.getDay())]+" "+ date.getDate() +" "+monthsHumanText_fr_long[date.getMonth()];
					separator = " ";
				break;
				case 2:
					strDate = this.getNumberToTwoDigitsString( date.getDate() )+ SEPARATOR_OF_NUMERIC_DATE_FORMAT + this.getNumberToTwoDigitsString(date.getMonth()+1) ;
					separator = SEPARATOR_OF_NUMERIC_DATE_FORMAT;
				break;
			}
			if(displayYear==true)
				strDate = strDate + separator +formatedYear;
			//Then add an article to the statement's part
	    	if(ajoutArticles)
          		strDate = "le " + strDate;
		}
		else{// Language is english
			(shortFullYear==true)? formatedYear = date.getFullYear().toString().substr(2) : formatedYear = date.getFullYear().toString();
			switch(dateFormat)
			{
				case 0:
					strDate = daysOfWeekHumanText_en_short[Number(date.getDay())]+" "+this.getNumberToTwoDigitsString( date.getDate() )+" "+monthsHumanText_en_short[date.getMonth()];
					separator = " ";
				break;
				case 1:
					strDate = daysOfWeekHumanText_en_long[Number(date.getDay())]+" "+this.getNumberToTwoDigitsString( date.getDate() )+" "+monthsHumanText_en_long[date.getMonth()];
					separator = " ";
				break;
				case 2:
					strDate = this.getNumberToTwoDigitsString( date.getDate() )+ SEPARATOR_OF_NUMERIC_DATE_FORMAT + this.getNumberToTwoDigitsString(date.getMonth()+1) ;
					separator = SEPARATOR_OF_NUMERIC_DATE_FORMAT;
				break;
				
			}
			if(displayYear==true)		
				strDate = strDate + separator +formatedYear;
			//Then add an article to the statement's part
	    	if(ajoutArticles)
          		strDate = "the " + strDate;
		}
		
		
		if(showTime)
		{
			//Setting time with 24h format
			var minutes = date.getMinutes();
			if(date.getMinutes()<10)
				minutes = "0"+minutes ;
			var h;
			switch(timeFormat){
			  case 1:
			    h = this.getNumberToTwoDigitsString(date.getHours()) + ":" + this.getNumberToTwoDigitsString(minutes);
			  break;
			  case 2:
			    h = this.getNumberToTwoDigitsString(date.getHours()) + " h " + this.getNumberToTwoDigitsString(minutes)+" min";
			  break;
			}

			//Adding or not an article to the string
			if(!ajoutArticles){ // If article MUST NOT be added
				strDate = strDate.concat( " " + h);
			}
			else{ // If article MUST be added

			    if(langIsFr)// Language is french
				   strDate = strDate.concat( " à ", h);
				else // Language is english
				   strDate = strDate.concat( " at ", h);
			}
			
		}
		return strDate;
	}

	/**
	 * Add a two-digit mask to numeric value : (e.g. : 1 returns 01, and 20 returns 20). 
	 * 	This format is smarter when you're sorting in the filesystem some named-with-date formatted files.
	 * @param valeur:number
 	 * @return string
	 */
	masquageDeuxCaract(valeur)
	{
	  return( (valeur<10)? "0"+valeur : valeur);
	}

}