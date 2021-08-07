function HistoricalDataService() {
  /**
   * @param  {string} stock key
   * @param  {int} limit
   */
  function getLastestHistoricaldata(key,limit) {
    if (DEBUG) {
      console.info('[HistoricalDataService.getLastestHistoricaldata(%s,%s)]',key,limit);
    }
    var firebaseUrl = SMUtils().getFirebaseUrl("Historicaldata");
    var secret = SMUtils().getSecret();
    var data = null;
    var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
    var year = SMUtils().getCurrentYear();
    var queryParameters = {orderBy:"$key",startAt:key+"",endAt:key+year+"1231",limitToLast:limit};
    data = base.getData("", queryParameters);

    var lastClose = 0;
    var ckKNs = new Array();
    var outerArray = new Array();
    for(var i in data) {
      ckKNs = new Array();
      ckKNs[0] = [[key]];
      ckKNs[1] = [[data[i].date]];
      ckKNs[2] = [[data[i].adjclose-lastClose]];
      if (lastClose == 0) ckKNs[2] = 0;
      ckKNs[3] = [[data[i].open]];
      ckKNs[4] = [[data[i].high]];
      ckKNs[5] = [[data[i].low]];
      ckKNs[6] = [[data[i].close]];
      ckKNs[7] = [[Number((data[i].high+data[i].low+data[i].close)/3).toFixed(0)]];
      ckKNs[8] = [[data[i].adjclose]];
      ckKNs[9] = [[data[i].volume]];
      ckKNs[10] = [[data[i].foreignvolume]];
      ckKNs[11] = [[data[i].foreignroom]];
      lastClose = data[i].close;
      outerArray.push(ckKNs);
    }
    return outerArray;
  }

  /**
   * @param  {string} stock key
   * @param  {string} fromDate YYYYMMDD
   */
  function getLatestPriceByYear(key,year) {
    if (DEBUG) {
      console.info('[HistoricalDataService.getLatestPriceByYear(%s,%s)]',key,year);
    }
    const CACHE_OK_KEY = "LatestPriceByYear_"+key+"_"+year;
    var firebaseUrl = SMUtils().getFirebaseUrl("Historicaldata");
    var secret = SMUtils().getSecret();
    var data = null;
    const cached_data = _getLastCacheResponseOK(CACHE_OK_KEY);
    if (cached_data && Object.keys(cached_data).length) {
      console.log("[HistoricalDataService.getLatestPriceByYear] Return last cached OK response data..  =0");
      data = cached_data;
    } else {
      var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
      var priceArray = new Array();
      
      var queryParameters = {orderBy:"$key",startAt:key+"",endAt:key+year+"1231",limitToLast:1};
      data = base.getData("", queryParameters);
      if (data && Object.keys(data).length) {
        // Keep last OK response
        _setLastCacheResponseOK(CACHE_OK_KEY, data);
      }
    }
    for(var i in data) {
      priceArray = new Array();
      priceArray[0] = data[i].date;
      priceArray[1] = data[i].open;
      priceArray[2] = data[i].high;
      priceArray[3] = data[i].low;
      priceArray[4] = data[i].close;
      priceArray[5] = data[i].adjclose;
      priceArray[6] = data[i].volume;
      priceArray[7] = data[i].foreignvolume;
      priceArray[8] = data[i].foreignroom;
    }
    return priceArray;
  }

  /**
   * 
   */
  function getLastestVNIndexdata(limit) {
    if (DEBUG) {
      console.info('[HistoricalDataService.getLastestVNIndexdata]');
    }
    const CACHE_OK_KEY = "VNIndexdata_"+limit;
    var firebaseUrl = SMUtils().getFirebaseUrl("VNIndexdata");
    var secret = SMUtils().getSecret();
    var data = null;
    var outerArray = new Array();
    const cached_data = _getLastCacheResponseOK(CACHE_OK_KEY);
    if (cached_data && Object.keys(cached_data).length) {
      console.log("[HistoricalDataService.getLastestVNIndexdata] Return last cached OK response data..  =0");
      data = cached_data;
    } else {
      var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
      var queryParameters = {orderBy:"$key",limitToLast:limit};
      data = base.getData("", queryParameters);
      if (data && Object.keys(data).length) {
        // Keep last OK response
        _setLastCacheResponseOK(CACHE_OK_KEY, data);
      }
    }
    for(var i in data) {
      var indexArray = new Array();
      indexArray[0] = data[i].date;
      indexArray[1] = data[i].indexVND;
      indexArray[2] = data[i].indexValue;
      outerArray.push(indexArray);
    }
    return outerArray;
  }

  /**
  * Import today trading data to firebase
  * indexArray contents:
  *     - key
  *     - date YYYY/MM/DD
  *     - indexValue
  *     - indexVND
  */
  function setVNIndexdata(indexArray) {
    var dataToImport = {};
    // For convert date to YYYYMMDD
    var reg = new RegExp('\/', 'gi');
    
    var row = 0;
    for (; row < indexArray.length; row++) {
      var key = indexArray[row][0];
      var date = indexArray[row][1];
      
      if (indexArray[row][2] !== "") {
        dataToImport[key+date.replace(reg, "")] = {
          date:date,
          indexValue:indexArray[row][2],
          indexVND:indexArray[row][3]
        };
      }
    }
    var firebaseUrl = SMUtils().getFirebaseUrl("");
    var secret = SMUtils().getSecret();
    var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
    base.updateData("VNIndexdata", dataToImport);
  }

  /**
   * Delete Historicaldata
   */
  function deleteHistoricaldata(key) {
    if (DEBUG) {
      console.info('[HistoricalDataService.deleteHistoricaldata]');
    }
    var firebaseUrl = SMUtils().getFirebaseUrl("Historicaldata");
    var secret = SMUtils().getSecret();
    var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
    var queryParameters = {orderBy:"$key",startAt:key,endAt:key+'\uf8ff'};
    var data = base.getData("", queryParameters);
    for(var i in data) {
      console.log('Removed: ' + i);
      base.removeData(i,"");
    }
  }

  return {
    getLastestHistoricaldata,
    getLatestPriceByYear,
    getLastestVNIndexdata,
    deleteHistoricaldata,
    setVNIndexdata
  };
  
}
