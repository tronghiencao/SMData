function SMUtils() {
  /**
  * Reads now buying BrokingInfo data.
  */
  function isValueInArrays(value,array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] != "" && array[i] == value) return true;
    }
    return false;
  }

  function isTimeUp(start) {
    var today = new Date();
    return today.getTime() - start.getTime() > MAX_RUN_TIME; // 5 minutes
  }

  /**
   * From https://stackoverflow.com/questions/43671564
   */
  function isHoliday(d) {
    if (d.getDay() == 0 || d.getDay() == 6) return true;
    var inogreEvent = 'Christmas';
    var cal = CalendarApp.getCalendarById("en.vietnamese#holiday@group.v.calendar.google.com");
    var events =  cal.getEventsForDay(d);
    if (events && events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        if (events[i].getTitle().indexOf(inogreEvent) == -1) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 
   */
  function isInBuyingArrays(value,array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][0] != "" && array[i][0] == value) return i;
    }
    return -1;
  }

  /**
  * Reads now buying BrokingInfo data.
  */
  function getFirebaseUrl(jsonPath) {
    /*
    We then make a URL builder
    This takes in a path, and
    returns a URL that updates the data in that path
    */
    var scriptProperties = PropertiesService.getScriptProperties();
    var baseUrl = scriptProperties.getProperty("FIREBASE_URL");
    return baseUrl + jsonPath;
  }

  /**
   * Returns a SECRET to connect data
  */
  function getSecret() {
    var scriptProperties = PropertiesService.getScriptProperties();
    var secret = scriptProperties.getProperty("SECRET");
    return secret;
  }

  function getCurrentYear() {
    var today = new Date();
    return today.getFullYear();
  }


  /**
   * https://stockmaster-471aa.firebaseio.com/Ebroker/
   * @param  {string} firebase json
   */
  function calcEbrokerPoint(ebrokerData) {
    var ebrokerPoint = 0;
    // //Long Term
    // if(Number(ebrokerData.macd50) > 0) ebrokerPoint = ebrokerPoint + (3.34/3);
    // if(Number(ebrokerData.ma100) > 0.02) ebrokerPoint = ebrokerPoint + (3.34/3);
    // if(Number(ebrokerData.cci60) > 0) ebrokerPoint = ebrokerPoint + (3.34/3);
    // //Medium Term
    // if(Number(ebrokerData.sar50) > 0) ebrokerPoint = ebrokerPoint + (3.33/4);
    // if(Number(ebrokerData.macd26) > 0) ebrokerPoint = ebrokerPoint + (3.33/4);
    // if(Number(ebrokerData.ma50) > 0.02) ebrokerPoint = ebrokerPoint + (3.33/4);
    // if(Number(ebrokerData.cci40) > 0) ebrokerPoint = ebrokerPoint + (3.33/4);
    // //Short Term
    // if(Number(ebrokerData.blg20) > 0) ebrokerPoint = ebrokerPoint + (3.33/5);
    // if(Number(ebrokerData.macd12) > 0) ebrokerPoint = ebrokerPoint + (3.33/5);
    // if(Number(ebrokerData.ma20) > 0.02) ebrokerPoint = ebrokerPoint + (3.33/5);
    // if(Number(ebrokerData.ghilo10) > 0) ebrokerPoint = ebrokerPoint + (3.33/5);
    // if(Number(ebrokerData.dmi7) > 0) ebrokerPoint = ebrokerPoint + (3.33/5);
    //Long Term
    if(ebrokerData[10] > 0) ebrokerPoint = ebrokerPoint + (3.34/3); //50-100 MACD
    if(ebrokerData[13] > 0.02) ebrokerPoint = ebrokerPoint + (3.34/3); //MA100 vs Price
    if(ebrokerData[16] > 0) ebrokerPoint = ebrokerPoint + (3.34/3); //60 Day CCI
    //Medium Term
    if(ebrokerData[18] > 0) ebrokerPoint = ebrokerPoint + (3.33/4); //50 Day Parabolic Time/Price
    if(ebrokerData[11] > 0) ebrokerPoint = ebrokerPoint + (3.33/4); //26-100 MACD
    if(ebrokerData[14] > 0.02) ebrokerPoint = ebrokerPoint + (3.33/4); //MA50 vs Price
    if(ebrokerData[17] > 0) ebrokerPoint = ebrokerPoint + (3.33/4); //40 Day CCI
    //Short Term
    if(ebrokerData[19] > 0) ebrokerPoint = ebrokerPoint + (3.33/5); //20 Day BLG
    if(ebrokerData[12] > 0) ebrokerPoint = ebrokerPoint + (3.33/5); //12-26 MACD
    if(ebrokerData[15] > 0.02) ebrokerPoint = ebrokerPoint + (3.33/5); //MA20 vs Price
    if(ebrokerData[20] > 0) ebrokerPoint = ebrokerPoint + (3.33/5); //10-8 Gann HiLo
    if(ebrokerData[21] > 0) ebrokerPoint = ebrokerPoint + (3.33/5); //7 Day DMI
    
    return ebrokerPoint.toFixed(2);
  }

  /**
   * IN/OUT type YYYY/MM/DD
   */
  function calcCanSellDate(buydate) {
    var saleFrom = new Date(buydate);
    var datecount = SSC_T2;
    while (datecount >= 0) {
      saleFrom.setDate(saleFrom.getDate() + 1);
      if (!isHoliday(saleFrom)) {
        datecount--;
      }
    }
    return formatDate(saleFrom, COMMON_DATE_FORMAT);
  }

  /**
   * 
   */
  function calcStatisticsArray(bSheetArray,incomeArray) {
    //Init data for 3y and 4Q value = 0
    var EPSYearly = new Array();
    var yearlyCnt = 12;
    //Init data for 1year
    var cnt=0;
    for (cnt=0; cnt<yearlyCnt; cnt++) {
      EPSYearly[cnt] = [[0]];
    }
    cnt = bSheetArray.length;
    if(cnt !== incomeArray.length) cnt = 0;
    if(cnt > 0) {
      var Equity = 0;
      var Rev = 0;
      var Cost = 0;
      var Inc = 0;
      var EPS = 0;
      var Rate = 0;
      var pos = 4+(4-cnt)*2;
      cnt = cnt - 1;
      Equity = Number(bSheetArray[cnt][4]);
      Rate = bSheetArray[cnt][2]/bSheetArray[cnt][6];
      for (; cnt >= 0; cnt--) {
        Rev = Rev + Number(incomeArray[cnt][5]);
        Cost = Cost + Number(incomeArray[cnt][0]);
        Inc = Inc + Number(incomeArray[cnt][3]);
        EPS = incomeArray[cnt][3]/(bSheetArray[cnt][3]/10000);
        EPSYearly[pos] = [[EPS.toFixed(0)]];
        //EPS Growth
        EPSYearly[pos+1] = [[0]];
        pos = pos + 2;
      }
      EPSYearly[0] = [[Inc]];
      EPSYearly[1] = [[(Inc/Equity).toFixed(2)]];
      EPSYearly[2] = [[(Inc/Cost).toFixed(2)]];
      EPSYearly[3] = [[Rate.toFixed(2)]];
    }
    return EPSYearly;
  };

  /**
   * 
   */
  function formatDate(dateStr,format){
    if (dateStr ==="") return "";
    var date;
    if(!isValidDate(dateStr)) {
      var dateArr = [{}];
      dateArr = dateStr.split("/");
      var day = dateArr[0];
      var month = dateArr[1];
      var year = dateArr[2];
      date = new Date(year+"/"+month+"/"+day);
      console.log('Formated: ' + date);
    } else {
      date = dateStr;
    }
    var formattedDate = Utilities.formatDate(date, "JST", format);
    return formattedDate;
  }

  /**
   * 
   */
  function isValidDate(d) {
    if (Object.prototype.toString.call(d) !== "[object Date]")
      return false;
    return !isNaN(d.getTime());
  }

  /**
   * 
   */
  function formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  }

  return {
    isValueInArrays,
    isTimeUp,
    isHoliday,
    isInBuyingArrays,
    calcEbrokerPoint,
    calcCanSellDate,
    calcStatisticsArray,
    getFirebaseUrl,
    getSecret,
    getCurrentYear,
    formatDate,
    formatNumber,
    isValidDate
  }
}

