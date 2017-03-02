# lscook
## JavaScript function for preservation in LocalStorage or (as a fallback) Cookie  

Function ***lscook()*** try to read/write JSON data to localStorage (LS) under HTML-5. 
If LS isn't enabled, then JSON-data wii be stored as a cookie. 

***lscook()*** is based on [Fluidbyte/SimpleStore.js](https://gist.github.com/Fluidbyte/4718380).
The main difference lies in a deeper analysis of the availability for LS/Cookies and logging possibilities of failures.

Usage:
    lscook(key, dat, cookieOnly);
    
 where `key` is String and `dat` is JSON. Additional parameter `cookieOnly` tells (if is 'true') to use only Cookies/
  
### Algoritm: 
```
 if (key == undefined) or (key == null) then 
   nothinf to do
 else
   if (key == 'NULL') then 
     delete all keys with prefix 'lscook_'
   else
     if (dat== null) or (dat == 'NULL') then 
       delete key==('lscook_'+key)
     else
     if (dat == undefined) then 
       return JSON.parse(dat) for  key==('lscook_'+key)
     else
       store JSON.stringify(dat) for key==('lscook_'+key) 
```   
#
### Remarks:
 
  - all saved data contain additional prefix 'lscook_', which allows select only necessaries cookies; 
  - if window's LS is not available, then data will be saved on document's Cookie until date=31/12/2222
  - data deleted both,- from LS (if is enabled) and from Cookies (always)
  
 #
 ### Logging: 
   + *pseudo-errors loged on 'console' *:
```   
    - ! localStorage disabled;
    - ! fact of deleting of all LS/cookies with 'cookj_' prefix 
 ```    
   + *foresaw errors loged on 'console' *:
```      
    - call with (key == nothing) or (key == null);
    - fault on conversion to JSON
    - case (on save) of summary length for cookie exideed 4k
    - case (on save) of summary length for LS exideed 5M
     - case when LS is not available and cookies are blocked bu browser
```
