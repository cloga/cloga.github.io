<!-- 
var COOKIES_DOMAIN = "";                                          //Optional: Domain to store cookies. If BLANK, use current URL's domain
var COOKIES_EXPIRE_DAYS = 365;                                    //Required. Number of days to keep cookies

var WEBSITE_CAMPAIGN_ID = "547";                        //Required. 0 or current campaign ID
                                                                  //Scenario 1: This JavaScript is to be INCLUDED by a campaign website. 
                                                                  //            It doesn't matter whether the campaign website owns the whole domain, 
                                                                  //            or the campaign website is a sub-domain, or the campaign website is just a folder. 
                                                                  //            Set the campaign's unique ID to "WEBSITE_CAMPAIGN_ID".
                                                                  //Scenario 2: This JavaScript is to be INCLUDED by a brand/corporate website. 
                                                                  //            Set a unique ID to "WEBSITE_CAMPAIGN_ID". The ID should be different any other campaigns' ID.
                                                                  //Scenario 3: This JavaScript is to be INCLUDED by KPI Web pages or sections. 
                                                                  //            For example, member registration, online store, community and transactions are usually marketer's important business objectives and thus KPI. 
                                                                  //            Set "0" to "WEBSITE_CAMPAIGN_ID", then referring campaign's ID or brand/corporate site's ID will be used and captured by AGENDA Analytics. 

var SOCIAL_MEDIA_DOMAIN = "";                //Optional: Special domain for Social Media tracking. NO "http://"
var SOCIAL_MEDIA_TRACKING_CODE = "";  //Optional: Tracking code for Social Media

var AA_DOMAIN = "analytics.bj.agenda-asia.com"                       //Required. AGENDA Analytics Server Domain. NO "http://"
var RUNMODE = "release";                                          //Required. "release" or anything else (Do NOT call server)

var _imageObj;
var _nextUrl;

QueryString.keys = new Array(); 
QueryString.values = new Array(); 


function ClickEvent(event,oid) {
	event = event.toUpperCase();
    if (event.indexOf("BUT_") != -1) {
		UserClick(event,oid);
    }
    else {
        PagerLoad(event,oid);
    }
}

function QueryString_Parse() { 
  var query = window.location.search.substring(1); 
  var pairs = query.split("&"); 

  for (var i = 0; i < pairs.length; i++) { 
    var pos = pairs[i].indexOf('='); 
    if (pos >= 0) { 
      var argname = pairs[i].substring(0,pos); 
      var value = pairs[i].substring(pos+1); 
      QueryString.keys[QueryString.keys.length] = argname; 
      QueryString.values[QueryString.values.length] = value; 
    } 
  } 
}

function QueryString(key) { 
  var value = null; 
  for (var i=0; i < QueryString.keys.length; i++) { 
    if (QueryString.keys[i] == key) { 
      value = QueryString.values[i]; 
      break; 
    } 
  } 
  return value; 
} 

function GenRandomNumber() {
  var rannum = Math.random() * 100000000;
  rannum = Math.round(rannum);
  var today = new Date();
  var milliseconds = today.getTime();
  return (rannum + "_" + milliseconds);
}

function GetCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
   }
   else {
     begin += 2;
   }
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return decodeURIComponent(dc.substring(begin + prefix.length, end));  
}

function SetCookie(name, value, expires, path, domain, secure) {
  var today = new Date();
  today.setTime(today.getTime());
  if (expires) {
    expires = expires * 1000 * 60 * 60 * 24;
  }
  var expires_date = new Date(today.getTime()+(expires));
  document.cookie = name + "=" + encodeURIComponent(value) + 
  ((expires)? ";expires=" + expires_date.toGMTString() : "") + 
  ((path)   ? ";path=" + path : "" ) + 
  ((domain) ? ";domain=" + domain : "" ) +
  ((secure) ? ";secure" : "" );
}

function IsEmpty(string) {
  if(string == null || string == "") 
    return true;
  else
    return false;
}

function GetDomain(url) {
  var domain;
  
  if (url.indexOf("http://") == 0) {
    domain = url.substring(7, url.indexOf("/", 7));
  } 
  else
  if (url.indexOf("https://") == 0) {
    domain = url.substring(8, url.indexOf("/", 8));
  }
  else {
    domain = "";
  }
    
  
  return domain;
}

function GotoPage() {
  this.location.href = _nextUrl;
}

function TriggerEvent(url, is_multimedia_click, next_url,oid) {
  if (url.indexOf("file://" ) == 0) {
    return;
  }
  
  
  if ((url.indexOf("http://" ) != 0) && 
      (url.indexOf("https://") != 0)) {
    //Case:   NOT a full URL, likely a Flash click event
    //Action: Add "protocal://domain_name/" before "click event" to emulate a full URL
    if (window.location.href.indexOf("?") == -1) {
      //NO query string
      url = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + url;
    }
    else {
      //Query string
      url = window.location.href.substring(0, window.location.href.lastIndexOf('/', window.location.href.indexOf("?")) + 1) + url;
    }
  }
  

  var uid = "";
  var campaign_id = WEBSITE_CAMPAIGN_ID;
  var ctpath = "";
  var referrer = "";
  var previous_url = "";

  if (!IsEmpty(QueryString("uid"))) {
    //Case:   A visit WITH "uid" parameter, likely EDM
    //Action: Use "uid" from request parameter and store the specified value to Cookies
    uid = QueryString("uid");
    SetCookie('uid', uid, COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
  }
  else
  if (IsEmpty(GetCookie("uid"))) {
    //Case:   Cookies have no "uid" = a new visit
    //Action: Generate a new "uid" and store the newly-generated value to Cookies
    uid = GenRandomNumber();
    SetCookie('uid', uid, COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
  }
  else {
    //Case:   A return visit or a subsequent page request after landing
    //Action: Use "uid" from Cookies
    uid = GetCookie('uid');
  }
   if (!IsEmpty(oid)) {
      
      SetCookie('uid', oid, COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
        uid = GetCookie('uid');
    }
  
  if ((!IsEmpty(QueryString("ctpath"))) ||
      (!IsEmpty(QueryString("cid"))) ||
      (!IsEmpty(QueryString("utm_source")))) {
    //Case:   This request is a click-through from a known "Path" (usually media placement).
    
    //Action: Use "ctpath" from request parameter and store the specified value to Cookies
    ctpath = QueryString("ctpath");
    if (IsEmpty(ctpath)) {
      ctpath = QueryString("cid");
    }
    if (IsEmpty(ctpath)) {
      ctpath = QueryString("utm_source");
    }
    SetCookie('ctpath', ctpath, COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
    
    //Action: Clear stored "referrer" and use new "referrer" from either HTTP parameter or HTTP header
    if (!IsEmpty(QueryString("referrer"))) {
      referrer = QueryString("referrer");
    }
    else {
      referrer = document.referrer;
    }
    SetCookie('referrer', referrer.substring(0, 255), COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
  }
  else
  if ((!IsEmpty(SOCIAL_MEDIA_DOMAIN)) &&
      (!IsEmpty(SOCIAL_MEDIA_TRACKING_CODE)) &&
      (GetDomain(url) == SOCIAL_MEDIA_DOMAIN)) {
    //Case:   Visitor is visiting special Social Media domain (Visitor comes from PAID Social Media WOM or "Managed Social Network")
    
    //Action: Use specified Social Media "ctpath" and store the specified value to Cookies
    ctpath = SOCIAL_MEDIA_TRACKING_CODE;
    SetCookie('ctpath', ctpath, COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
    
    if (!IsEmpty(QueryString("referrer"))) {
      //Case:   Initial landing from PAID Social Media WOM or "Managed Social Network" WITH an incoming "referrer" parameter (likely from redirection page)
      //Action: Use "referrer" from request parameter and store the specified value to Cookies
      referrer = QueryString("referrer");
      SetCookie('referrer', referrer.substring(0, 255), COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
    }
    else
    if ((!IsEmpty(document.referrer)) &&
       (GetDomain(document.referrer) != GetDomain(url))) {
      //Case:   Initial landing from PAID Social Media WOM or "Managed Social Network" WITHOUT an incoming "referrer" parameter (likely from BBS)
      //Action: Use "referrer" from request (document) and store the value to Cookies
      referrer = document.referrer;
      SetCookie('referrer', referrer.substring(0, 255), COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
    } 
    else {
      //Action: Retrieve "referrer" to Cookies
      referrer = GetCookie('referrer');
    }
  }
  else
  if (!IsEmpty(QueryString("referrer"))) {
    //Case:   Initial landing from Organic Social Media WITH an incoming "referrer" parameter (likely through a redirection page)
    //Action: Use "referrer" from request parameter and store the specified value to Cookies
    referrer = QueryString("referrer");
    SetCookie('referrer', referrer.substring(0, 255), COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
  }
  else
  if ((!IsEmpty(document.referrer)) &&
      (GetDomain(document.referrer) != GetDomain(url))) {
    //Case:   Initial landing from Organic Social Media WITHOUT an incoming "referrer" parameter (likely from BBS)
    
    //Situation: Normal
    //Action: Clear stored "ctpath"
    SetCookie('ctpath', '', COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
    
    //Situation: Jump to Login page and then come back
    //Action: Get the Cookie stored "ctpath"
    //if (!IsEmpty(GetCookie('ctpath'))) {
  	//	ctpath = GetCookie('ctpath');
  	//}
    
    //Action: Use "referrer" from request (document) and store the value to Cookies
    referrer = document.referrer;
    SetCookie('referrer', referrer.substring(0, 255), COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
  }
  else
  if ((GetDomain(url) != GetDomain(document.referrer)) && 
      (!IsEmpty(GetCookie("campaignid"))) &&
      (GetCookie("campaignid") != WEBSITE_CAMPAIGN_ID)&&
      (WEBSITE_CAMPAIGN_ID != "0")) {
    //Case:   Initial landing to this website but ther visitor went to another campaign website before, then the visit is regarded as "Affiliate".
    //Action: Pass "AFFILIATE" as the tracking code to Tracking website and store to Cookies
    ctpath = "AFFILIATE";
    SetCookie('ctpath', ctpath, COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
  }
  else {
    //Case:   A visit from (1) Direct URL or (2) Bookmark or (3) a subsequent page view after initial landing
    
    if ((WEBSITE_CAMPAIGN_ID == "0") &&
        (!IsEmpty(GetCookie("campaignid"))) &&
        (GetCookie("campaignid") != "0")) {
      //Case:   Scenario 3: This is a KPI Web page or a common section that doesn't belong to any 1 campaign, so default WEBSITE_CAMPAIGN_ID is 0
      
      //Action: Use referring campaign's ID or brand/corporate site's ID from browser cookies
      campaign_id = GetCookie("campaignid");
    }
    
    //Action: Retrieve "ctpath" to Cookies
    ctpath = GetCookie('ctpath');
    
    //Action: Retrieve "referrer" to Cookies
    referrer = GetCookie('referrer');
  }  
  
  if (GetDomain(document.referrer) == GetDomain(url)) {
    //Case:   Same domain
    //Action: Record Previous URL
    previous_url = document.referrer;
  }
  
  //Action: Remember visitor's LAST entered campaign website
  SetCookie('campaignid', campaign_id, COOKIES_EXPIRE_DAYS, '/', COOKIES_DOMAIN, '');
  

  var queryStr = "";
  queryStr = queryStr + "?uid=" + encodeURIComponent(uid);
  queryStr = queryStr + "&campaignid=" + campaign_id;
  queryStr = queryStr + "&ctpath=" + encodeURIComponent(ctpath);
  queryStr = queryStr + "&referrer=" + encodeURIComponent(referrer);
  queryStr = queryStr + "&url=" + encodeURIComponent(url);
  queryStr = queryStr + "&ismultimediaclick=" + is_multimedia_click;
  queryStr = queryStr + "&previousurl=" + encodeURIComponent(previous_url);
  queryStr = queryStr + "&rnd=" + GenRandomNumber();
  
  var imageUrl = GetServerDomain() + queryStr;
  
  if(RUNMODE == "release") {
    _imageObj = new Image();
    if (!IsEmpty(next_url)) {
      var alertTimerId = 0;
      _nextUrl = next_url;      
      _imageObj.onload = function() {
        clearTimeout(alertTimerId);
        GotoPage();
      };
    }
    _imageObj.src = imageUrl;
    if (!IsEmpty(next_url)) {
      alertTimerId = setTimeout("GotoPage()", 10000);
    }
  }
}

function UserClickAndGotoPage(event, next_url) {
  TriggerEvent(event, 1, next_url);
}

function UserClick(event,oid) {
  TriggerEvent(event, 1, "",oid);
}

function GetServerDomain() {
  var imageDomain;
  
  if (window.location.protocol.indexOf("https:") == 0) {
    imageDomain = "https://" + AA_DOMAIN + "/images/tr.gif";
  } 
  else {
    imageDomain = "http://"  + AA_DOMAIN + "/images/tr.gif";
  }

  return imageDomain;
}

function PagerLoad(event,oid) {
  TriggerEvent(event, 0, "",oid);
}

QueryString_Parse();
var aa_oid = aa_oid || "";
TriggerEvent(window.location.href, 0, "",aa_oid);

//-->
