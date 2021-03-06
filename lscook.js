/**
 * Eeasy work with localStorag/Cookies
 * v.1.0.1
 * 
 * Function lscook() try to read/write JSON data to localStorage (LS) according to HTML-5. 
 * If LS isn't enabled, then JSON-data wii be stored as a Cookie. It is based on 
 * Fluidbyte/SimpleStore.js (https://gist.github.com/Fluidbyte/4718380). The main differences 
 * lie on a deeper analysis of the availability for LS/Cookies and logging possibilities of failures.
 * 
 * Usage: 
 *     lscook(key, dat, cookieOnly);
 *     
 *  where `key` is String and `dat` is JSON. Additional parameter `cookieOnly` tells (if is `true`) to use only Cookies.
 *   
 *  Algoritm: 
 * 
 *  if (key == undefined) or (key == null) then 
 *    nothinf to do
 *  else
 *    if (key == 'NULL') then 
 *      delete all keys with prefix 'lscook_'
 *    else
 *      if (dat== null) or (dat == 'NULL') then 
 *        delete key==('lscook_'+key)
 *      else
 *      if (dat == undefined) then 
 *        return JSON.parse(dat) for  key==('lscook_'+key)
 *      else
 *        store JSON.stringify(dat) for key==('lscook_'+key) 
 * 
 *  Remarks:
 *   - all saved data contain additional prefix 'lscook_', which allows select only necessaries cookies; 
 *   - if window's LS is not available, then data will be saved on document's Cookie until date=31/12/2222;
 *   - data deleted both,- from LS (if is enabled) and from Cookies (always).
 *  
 *  Logging: 
 *    + pseudo-errors loged on 'console':    
 *     - ! localStorage disabled
 *     - ! fact of deleting of all LS/cookies with 'cookj_' prefix       
 *    + foresaw errors loged on 'console':       
 *     - call with (key == nothing) or (key == null)
 *     - fault on conversion to JSON
 *     - case (on save) of summary length for cookie exideed 4k
 *     - case (on save) of summary length for LS exideed 5M
 *     - case when LS is not available and cookies are blocked bu browser 
 */

var lscook = function(key0, dat0, cookieOnly) {
    'use strict'
    if ((key0 == undefined) || (key0 == null)) {
        console.error('(key0 == nothing)||(key0 == null) and dat0="' + dat0 + '"')
        return
    }

    var pref = 'lscook_'
    var ls = window.localStorage
    var lsOK = (ls && !cookieOnly) ? true : false;
    var first = true
    if (!lsOK & first){
        first = false
        console.error('! localStorage disabled')
    }

    if (key0 == 'NULL') {   //  remove all "pref.*" LS and cookies
        var kc =0, kl = 0
        if (lsOK){  // remove from LS
            var i = ls.length
            while (i-- > 0){
                if (ls.key(i).indexOf(pref) == 0){
                    kl++
                    ls.removeItem(ls.key(i));
                }
            }
        }
        var cookies = document.cookie.split(";")    // remove from Cookie (alwajs)
        var i = cookies.length
        if (i > 0){
            while (i-- > 0){
                if (cookies[i].indexOf(pref) == 0){
                    kc++
                    document.cookies[i] = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
        }
        console.error('! ' + kl + '(LS) and ' + kc + '(cookies) with prefix "' + pref + '" were deleted')
        return
    }

    var key = pref + key0
    if ((dat0 === null) || (dat0 === 'NULL')){     //  remove cookie
        if (lsOK) {
            ls.removeItem(key);
        }
        createCookie(key, '', -1);
        return
    }

    if (dat0 === undefined) {  // read data
        var str = ''
        var data = {}
        if (lsOK) { // Native support
            str = ls.getItem(key);
        }
        else { // Use cookie 
            str = readCookie(key);
        }

        try {
            data = JSON.parse(str);
        }
        catch (e) {
            console.error('To JSON: for key0="' + key0 + '": str(read)="' + str + '": e=' + e.toGMTString)
        }
        return data
    }
    else {                  // write data
        var maxDate = "2222-12-31T20:17:40.234 UTC"
        
        var str = JSON.stringify(dat0);
        if (lsOK) { // use localStorage
            var L = 5000000
            if ((key.length + str.length) < L) {
                ls.setItem(key, str);
            }
            else {
                console.error('summary length for ls exideed max= ' + L + ' (nothing saved')
            }
        }
        else { // Use Cookie
            if (window.navigator.cookieEnabled) {
                var L = 4000
                if ((key.length + str.length) < L) {
                    createCookie(key, str, maxDate);
                }
                else {
                    console.error('summary length for cookie exideed max= ' + L + ' (nothing saved')
                }
            }
            else {
                console.error('ls is not available and cookies are blocked')
            }
        }
        return
    }

    /**
     * Creates new cookie or removes cookie with negative expiration
     * @param  key       The key or identifier for the store
     * @param  value     Contents of the store
     * @param  exp       Expiration - creation defaults to 30 days
     */

    function createCookie(key, value, exp) {
        var str = exp
        if (!isNaN(exp) && parseInt(Number(exp)) == exp && !isNaN(parseInt(exp, 10))){ // if 'exp' is integer
            var date = new Date();
            date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000))
            var str = date.toUTCString();
        }
        document.cookie = key + "=" + value + "; expires=" + str + "; path=/";
    }

    /**
     * Returns contents of cookie
     * @param  key       The key or identifier for the store
     */

    function readCookie(key) {
        var nameEQ = key + "=";
        var ca = document.cookie.split(';');
        for (var i = 0, max = ca.length; i < max; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

};