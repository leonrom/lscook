# lscook
JavaScript function for preservation in window.localStorage or (as a fallback) in document.cookie  

Function lscook() try to read/write JSON data from/to localStorage (LS) under HTML-5. 
If LS isn't enabled, then JSON-data stored as a cookie. 

lscook() is based on Fluidbyte/SimpleStore.js (https://gist.github.com/Fluidbyte/4718380).
The main difference lies in a deeper analysis of the availability LS/Cookies and logging possibilities of failures.

Usage:
    cookj(key, dat, cookieOnly);
 where 'key' is String and 'dat' is JSON. Additional parameter 'cookieOnly' tells (if it is used and equal 'true') to use only Cookies/
  
Algoritm:  
 if (key == undefined) or (key == null) then 
   nothinf to do
 else
   if (key == 'NULL') then 
     delete all keys with prefix 'cookj_'
   else
     if (dat== null) or (dat == 'NULL') then 
       delete key==('cookj_'+key)
     else
     if (dat == undefined) then 
       return JSON.parse(dat) for  key==('cookj_'+key)
     else
       store JSON.stringify(dat) for key==('cookj_'+key) 
  
 Remarks:
  - all saved data contan addition prefix 'lscook_', which allows select only necessaries cookies; 
  - if window's LS is not available, then data saved on document's Cookie until 31/12/2222
  - data deleted both,- from LS (if is enabled) and Cookies (always)
 
 Logging: 
   1) function save on 'console' psewdo-errors:
     - '!' localStorage disabled;
     - '!' fact of deleting of all LS/cookies with 'cookj_' prefix
 
   2) function save on 'console' foreseen errors:
     - call with (key == nothing) or (key == null);
     - fault on conversion to JSON
     - case (on save) of summary length for cookie exideed 4k
     - case (on save) of summary length for LS exideed 5M
     - case when LS is not available and cookies are blocked bu browser
