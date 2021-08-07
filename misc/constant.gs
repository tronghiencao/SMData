const DEBUG = false;
const BUY_POINT = 7.9;
const BUY_VOLUME = 30000;
const SEL_POINT = 4.9;
const EXP_HISTORY_CNT = 265;
const COMMON_DATE_FORMAT = 'yyyy/MM/dd';
const APP_START_DATE = '2017/01/01';
const SEARCH_TYPE_YEARLY = 0;
const SEARCH_TYPE_QUATERLY = 1;
const SEARCH_TYPE_EQUALTO = 2;
//Shortening of Stock Settlement Cycle (T+2)
const SSC_T2 = 2;
const MAX_RUN_TIME = 5*60*1000;// Time in ms for max execution. 5 minutes is a good start.
