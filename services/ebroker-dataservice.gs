function EbrokerDataService() {
  /**
   * @param  {string} stock key
   * @param  {string} fromDate YYYYMMDD
   */
  function getLatestEbrokerByYear(key,year) {
    if (DEBUG) {
      console.info('[EbrokerDataService.getLatestEbrokerByYear(%s,%s)]',key,year);
    }
    var firebaseUrl = SMUtils().getFirebaseUrl("Ebroker");
    var secret = SMUtils().getSecret();
    var data = null;
    var outerArray = new Array();
    var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
    var queryParameters = {orderBy:"$key",startAt:key+"",endAt:key+year+"1231",limitToLast:1};
    data = base.getData("", queryParameters);

    for(var i in data) {
      outerArray[0] = data[i].weeks52low;
      outerArray[1] = data[i].weeks52high;
      outerArray[2] = data[i].ma20;
      outerArray[3] = data[i].ma50;
      outerArray[4] = data[i].ma100;
      if(data[i].ebroker == "Giữ") {
        outerArray[5] = "";
      } else {
        outerArray[5] = data[i].ebroker;
      }
      outerArray[6] = data[i].price;
      outerArray[7] = data[i].todaychg;
      outerArray[8] = data[i].weekchg;
      outerArray[9] = data[i].monthchg;
      outerArray[10] = SMUtils().calcEbrokerPoint(data[i]);
      //foreigntrade
      outerArray[11] = data[i].foreign5daysvol;
      outerArray[12] = data[i].foreignhold;
      //Chaikin Money Flow
      outerArray[13] = data[i].cmf;
      //beta
      outerArray[14] = data[i].beta;
    }
    return outerArray;
  }

  /**
   * Get today eboker data
   * @param  {String} today
   */
  function getTodayBroker(today) {
    if (DEBUG) {
      console.info('[EbrokerDataService.getTodayBroker]');
    }
    const CACHE_OK_KEY = "Ebroker_"+today.replace(/\//g,"");
    var firebaseUrl = SMUtils().getFirebaseUrl("Ebroker");
    var secret = SMUtils().getSecret();
    var data = null;
    const cached_data = _getLastCacheResponseOK(CACHE_OK_KEY);
    if (cached_data && Object.keys(cached_data).length) {
      console.log("[EbrokerDataService.getTodayBroker] Return last cached OK response data..  =0");
      data = cached_data;
    } else {
      var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
      var queryParameters = {orderBy:"date", equalTo: today};
      var data = base.getData("", queryParameters);
      if (data && Object.keys(data).length) {
        // Keep last OK response
        _setLastCacheResponseOK(CACHE_OK_KEY, data);
      }
    }
    var outerArray = new Array();
    var ebrokerArray = new Array();
    
    for(var i in data) {
      ebrokerArray = new Array();
      ebrokerArray[0] = i.substring(0,3); //Key
      ebrokerArray[1] = data[i].date;
      ebrokerArray[2] = data[i].ebroker;
      ebrokerArray[3] = data[i].price;
      ebrokerArray[4] = SMUtils().calcEbrokerPoint(data[i]);
      outerArray.push(ebrokerArray);
    }
    return outerArray;
  }

  return {
    getLatestEbrokerByYear,
    getTodayBroker
  };

  
}
