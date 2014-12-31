<!-- 
var wat_cookies_domain = "";                                          //Optional: Domain to store cookies. If BLANK, use current URL's domain
var wat_cookies_expire_days = 365;                                    //Required. Number of days to keep cookies

var wat_website_wid = "2240";                        //Required. 0 or current campaign ID
                                                                  //Scenario 1: This JavaScript is to be INCLUDED by a campaign website. 
                                                                  //            It doesn't matter whether the campaign website owns the whole domain, 
                                                                  //            or the campaign website is a sub-domain, or the campaign website is just a folder. 
                                                                  //            Set the campaign's unique ID to "wat_website_wid".
                                                                  //Scenario 2: This JavaScript is to be INCLUDED by a brand/corporate website. 
                                                                  //            Set a unique ID to "wat_website_wid". The ID should be different any other campaigns' ID.
                                                                  //Scenario 3: This JavaScript is to be INCLUDED by KPI Web pages or sections. 
                                                                  //            For example, member registration, online store, community and transactions are usually marketer's important business objectives and thus KPI. 
                                                                  //            Set "0" to "wat_website_wid", then referring campaign's ID or brand/corporate site's ID will be used and captured by AGENDA Analytics. 

var wat_social_media_domain = "";                //Optional: Special domain for Social Media tracking. NO "http://"
var wat_social_media_tracking_code = "";  //Optional: Tracking code for Social Media

var wat_domain = "test.wunderman-bj.com.cn";                     //Required. AGENDA Analytics Server Domain. NO "http://"
//var wat_domain = "127.0.0.1:8015";    
var wat_runmode = "release";                                          //Required. "release" or anything else (Do NOT call server)

var _wat_image_obj;
var _wat_next_url;

WatQueryString.keys = new Array(); 
WatQueryString.values = new Array(); 


function WatClickEvent(event) {
    event = event.toUpperCase();
    if (event.indexOf("BUT_") != -1) {
        UserClick(event);
		
    }
    else {
        PagerLoad(event);
        
    }
}

function WatQueryString_Parse() { 
    var query = window.location.search.substring(1); 
    var pairs = query.split("&"); 

    for (var i = 0; i < pairs.length; i++) { 
        var pos = pairs[i].indexOf('='); 
        if (pos >= 0) { 
            var argname = pairs[i].substring(0,pos); 
            var value = pairs[i].substring(pos+1); 
            WatQueryString.keys[WatQueryString.keys.length] = argname; 
            WatQueryString.values[WatQueryString.values.length] = value; 
        } 
    } 
}

function WatQueryString(key) { 
    var value = null; 
    for (var i=0; i < WatQueryString.keys.length; i++) { 
        if (WatQueryString.keys[i] == key) { 
            value = WatQueryString.values[i]; 
            break; 
        } 
    } 
    return value; 
} 

function WatGenRandomNumber() {
    var rannum = Math.random() * 100000000;
    rannum = Math.round(rannum);
    var today = new Date();
    var milliseconds = today.getTime();
    return (rannum + "_" + milliseconds);
}

function WatGetCookie(name) {
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

function WatSetCookie(name, value, expires, path, domain, secure) {
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

function WatIsEmpty(string) {
    if(string == null || string == "") 
        return true;
    else
        return false;
}

function WatGetDomain(url) {
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

function WatGotoPage() {
    this.location.href = _wat_next_url;
}

function WatTriggerEvent(url, t, next_url) {
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
    var wid = wat_website_wid;
    var sid = "";
    var rurl = "";
    var purl = "";
    var oid="111";
    var pid="222";
    var wt = document.title;
    if (!WatIsEmpty(WatQueryString("uid"))) {
        //Case:   A visit WITH "uid" parameter, likely EDM
        //Action: Use "uid" from request parameter and store the specified value to Cookies
        uid = WatQueryString("uid");
        WatSetCookie('uid', uid, wat_cookies_expire_days, '/', wat_cookies_domain, '');
    }
    else if (WatIsEmpty(WatGetCookie("uid"))) {
        //Case:   Cookies have no "uid" = a new visit
        //Action: Generate a new "uid" and store the newly-generated value to Cookies
        uid = WatGenRandomNumber();
        WatSetCookie('uid', uid, wat_cookies_expire_days, '/', wat_cookies_domain, '');
    }
    else {
        //Case:   A return visit or a subsequent page request after landing
        //Action: Use "uid" from Cookies
        uid = WatGetCookie('uid');
    }


    //if (!WatIsEmpty(WatQueryString("oid"))) {
    //    //Case:   A visit WITH "uid" parameter, likely EDM
    //    //Action: Use "uid" from request parameter and store the specified value to Cookies
    //    oid = WatQueryString("oid");
    //    WatSetCookie('oid', oid, wat_cookies_expire_days, '/', wat_cookies_domain, '');

    //}
    //else 
    //{
    //    oid=WatGetCookie('oid');
    //}

   


  
    if (!WatIsEmpty(WatQueryString("sid"))) {
        //Case:   This request is a click-through from a known "Path" (usually media placement).
    
        //Action: Use "sid" from request parameter and store the specified value to Cookies
        sid = WatQueryString("sid");
      
        WatSetCookie('sid', sid, wat_cookies_expire_days, '/', wat_cookies_domain, '');
    
        //Action: Clear stored "rurl" and use new "rurl" from either HTTP parameter or HTTP header
        if (!WatIsEmpty(WatQueryString("rurl"))) {
            rurl = WatQueryString("rurl");
        }
        else {
            rurl = document.referrer;
        }
        WatSetCookie('rurl', rurl.substring(0, 255), wat_cookies_expire_days, '/', wat_cookies_domain, '');
    }
    else if ((!WatIsEmpty(wat_social_media_domain)) &&
            (!WatIsEmpty(wat_social_media_tracking_code)) &&
            (WatGetDomain(url) == wat_social_media_domain)) {
        //Case:   Visitor is visiting special Social Media domain (Visitor comes from PAID Social Media WOM or "Managed Social Network")
    
        //Action: Use specified Social Media "sid" and store the specified value to Cookies
        sid = wat_social_media_tracking_code;
        WatSetCookie('sid', sid, wat_cookies_expire_days, '/', wat_cookies_domain, '');
    
        if (!WatIsEmpty(WatQueryString("rurl"))) {
            //Case:   Initial landing from PAID Social Media WOM or "Managed Social Network" WITH an incoming "rurl" parameter (likely from redirection page)
            //Action: Use "rurl" from request parameter and store the specified value to Cookies
            rurl = WatQueryString("rurl");
            WatSetCookie('rurl', rurl.substring(0, 255), wat_cookies_expire_days, '/', wat_cookies_domain, '');
        }
        else
            if ((!WatIsEmpty(document.referrer)) &&
               (WatGetDomain(document.referrer) != WatGetDomain(url))) {
                //Case:   Initial landing from PAID Social Media WOM or "Managed Social Network" WITHOUT an incoming "rurl" parameter (likely from BBS)
                //Action: Use "rurl" from request (document) and store the value to Cookies
                rurl = document.referrer;
                WatSetCookie('rurl', rurl.substring(0, 255), wat_cookies_expire_days, '/', wat_cookies_domain, '');
            } 
            else {
                //Action: Retrieve "rurl" to Cookies
                rurl = WatGetCookie('rurl');
            }
    }
    else if (!WatIsEmpty(WatQueryString("rurl"))) {
        //Case:   Initial landing from Organic Social Media WITH an incoming "rurl" parameter (likely through a redirection page)
        //Action: Use "rurl" from request parameter and store the specified value to Cookies
        rurl = WatQueryString("rurl");
        WatSetCookie('rurl', rurl.substring(0, 255), wat_cookies_expire_days, '/', wat_cookies_domain, '');
    }
    else if ((!WatIsEmpty(document.referrer)) &&
            (WatGetDomain(document.referrer) != WatGetDomain(url))) {
        //Case:   Initial landing from Organic Social Media WITHOUT an incoming "rurl" parameter (likely from BBS)
    
        //Situation: Normal
        //Action: Clear stored "sid"
        WatSetCookie('sid', '', wat_cookies_expire_days, '/', wat_cookies_domain, '');
    
        //Situation: Jump to Login page and then come back
        //Action: Get the Cookie stored "sid"
        //if (!WatIsEmpty(WatGetCookie('sid'))) {
        //	sid = WatGetCookie('sid');
        //}
    
        //Action: Use "rurl" from request (document) and store the value to Cookies
        rurl = document.referrer;
        WatSetCookie('rurl', rurl.substring(0, 255), wat_cookies_expire_days, '/', wat_cookies_domain, '');
    }
    else if ((WatGetDomain(url) != WatGetDomain(document.referrer)) && 
            (!WatIsEmpty(WatGetCookie("wid"))) &&
            (WatGetCookie("wid") != wat_website_wid)&&
            (wat_website_wid != "0")) {
        //Case:   Initial landing to this website but ther visitor went to another campaign website before, then the visit is regarded as "Affiliate".
        //Action: Pass "AFFILIATE" as the tracking code to Tracking website and store to Cookies
        sid = "AFFILIATE";
        WatSetCookie('sid', sid, wat_cookies_expire_days, '/', wat_cookies_domain, '');
    }
    else {
        //Case:   A visit from (1) Direct URL or (2) Bookmark or (3) a subsequent page view after initial landing
    
        if ((wat_website_wid == "0") &&
            (!WatIsEmpty(WatGetCookie("wid"))) &&
            (WatGetCookie("wid") != "0")) {
            //Case:   Scenario 3: This is a KPI Web page or a common section that doesn't belong to any 1 campaign, so default wat_website_wid is 0
      
            //Action: Use referring campaign's ID or brand/corporate site's ID from browser cookies
            wid = WatGetCookie("wid");
        }
    
        //Action: Retrieve "sid" to Cookies
        sid = WatGetCookie('sid');
    
        //Action: Retrieve "rurl" to Cookies
        rurl = WatGetCookie('rurl');
    } 
  
    if (WatGetDomain(document.referrer) == WatGetDomain(url)) {
        //Case:   Same domain
        //Action: Record Previous URL
        purl = document.referrer;
    }
  
    //Action: Remember visitor's LAST entered campaign website
    WatSetCookie('wid', wid, wat_cookies_expire_days, '/', wat_cookies_domain, '');
  

    var queryStr = "";
    queryStr = queryStr + "?uid=" + encodeURIComponent(uid);
    queryStr = queryStr + "&wid=" + wid;
    queryStr = queryStr + "&sid=" + encodeURIComponent(sid);
    queryStr = queryStr + "&rurl=" + encodeURIComponent(rurl);
    queryStr = queryStr + "&url=" + encodeURIComponent(url);
    queryStr = queryStr + "&t=" + t;
    queryStr = queryStr + "&purl=" + encodeURIComponent(purl);
    queryStr = queryStr + "&oid=" + encodeURIComponent(oid);
    queryStr = queryStr + "&pid=" + encodeURIComponent(pid);
    queryStr = queryStr + "&wt=" + encodeURIComponent(wt);
    queryStr = queryStr + "&rnd=" + WatGenRandomNumber();
  
    var imageUrl = GetServerDomain() + queryStr;
  
    if(wat_runmode == "release") {
        _wat_image_obj = new Image();
        if (!WatIsEmpty(next_url)) {
            var alertTimerId = 0;
            _wat_next_url = next_url;      
            _wat_image_obj.onload = function() {
                clearTimeout(alertTimerId);
                WatGotoPage();
            };
        }
        _wat_image_obj.src = imageUrl;
        if (!WatIsEmpty(next_url)) {
            alertTimerId = setTimeout("WatGotoPage()", 10000);
        }
    }
}

function UserClickAndGotoPage(event, next_url) {
    WatTriggerEvent(event, 1, next_url);
}

function UserClick(event) {
    WatTriggerEvent(event, 1, "");
}

function GetServerDomain() {
    var imageDomain;
  
    if (window.location.protocol.indexOf("https:") == 0) {
        imageDomain = "https://" + wat_domain + "/tr";
    } 
    else {
        imageDomain = "http://"  + wat_domain + "/tr";
    }

    return imageDomain;
}

function PagerLoad(event) {
    WatTriggerEvent(event, 0, "");
}

WatQueryString_Parse();

WatTriggerEvent(window.location.href, 0, "");

//-->
