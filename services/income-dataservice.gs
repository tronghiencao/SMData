function IncomeDataService() {
  /**
   * key: stockid + year + quater (AAA2017Q2)
   * cnt: limitToLast 1 for 1quater or 1year
   * searchType: 0->yearly, 1->quaterly, 2->equalTo
  */
  function getIncomeBykey(key,cnt,type) {
    if (DEBUG) {
      console.info('[IncomeDataService.getIncomeBykey]');
    }
    const CACHE_OK_KEY = "IncomeData_"+key+"_"+cnt+"_"+type;
    var firebaseUrl = SMUtils().getFirebaseUrl("IncomeData");
    var secret = SMUtils().getSecret();
    var data = null;
    const cached_data = _getLastCacheResponseOK(CACHE_OK_KEY);
    if (cached_data && Object.keys(cached_data).length) {
      console.log("[IncomeDataService.getIncomeBykey] Return last cached OK response data..  =0");
      data = cached_data;
    } else {
      var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
      var queryParameters;
      var startAt;
      
      //substring to keyid, remove year
      if (type == 0) {
        // Ex: AAA2017
        startAt = key.substring(0,7);
        queryParameters = {orderBy:"$key",startAt:startAt,endAt:key,limitToLast:cnt};
      } else if(type == 1) {
        // Ex: AAA
        startAt = key.substring(0,3);
        queryParameters = {orderBy:"$key",startAt:startAt,endAt:key,limitToLast:cnt};
      } else {
        // Ex: AAA2017Q2
        queryParameters = {orderBy:"$key",equalTo:key};
      }
      data = base.getData("", queryParameters);
      if (data && Object.keys(data).length) {
        // Keep last OK response
        _setLastCacheResponseOK(CACHE_OK_KEY, data);
      }
    }
    var ckKNs = new Array();
    var outerArray = new Array();
    for (n in data) {
      if (data[n] !== "") {
        ckKNs = new Array();
        ckKNs[0] = [[data[n].cost]];
        ckKNs[1] = [[data[n].grossfrofit]];
        ckKNs[2] = [[data[n].incometax]];
        ckKNs[3] = [[data[n].netincome]];
        ckKNs[4] = [[data[n].pretaxincome]];
        ckKNs[5] = [[data[n].sales]];
        ckKNs[6] = [[data[n].stage]];
        outerArray.push(ckKNs);
      }
    }
    return outerArray;
  }

  return {
    getIncomeBykey
  };
}
