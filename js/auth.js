/* Admin login (password fingerprint in js/config.js) and bursar logins (managed by the admin, stored on this device). */
var Auth=(function(){
function hex(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')}
function derive(pw,salt,cb){
 if(!(window.crypto&&crypto.subtle&&window.TextEncoder))return cb(null);
 var e=new TextEncoder();
 try{crypto.subtle.importKey('raw',e.encode(pw),'PBKDF2',false,['deriveBits']).then(function(k){return crypto.subtle.deriveBits({name:'PBKDF2',salt:e.encode(salt),iterations:CFG.iter,hash:'SHA-256'},k,256)}).then(function(b){cb(hex(b))},function(){cb(null)})}catch(x){cb(null)}}
function g(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
var A={
 derive:derive,
 role:function(){return g('sfl_role')},uid:function(){return g('sfl_uid')},name:function(){return g('sfl_name')||g('sfl_role')},
 begin:function(r,id,n){try{sessionStorage.setItem('sfl_role',r);sessionStorage.setItem('sfl_uid',id);sessionStorage.setItem('sfl_name',n)}catch(e){}},
 logout:function(){try{sessionStorage.clear()}catch(e){}setTimeout(function(){location.href='index.html'},250)},
 require:function(){if(!A.role()){location.replace('index.html');return false}return true},
 hash:function(pw,cb){var a=new Uint8Array(8);crypto.getRandomValues(a);var salt=hex(a);derive(pw,salt,function(h){cb(salt,h)})},
 login:function(who,pw,cb){var ad=who==='admin',u=ad?CFG.admin:(DB.kv('bursars')||[]).filter(function(b){return b.id===who&&b.active!==false})[0];if(!u)return cb(false);
  derive(pw,u.salt,function(h){if(h===null)return cb(false,'nocrypto');if(h===u.hash){A.begin(ad?'admin':'bursar',ad?'admin':u.id,ad?'Admin':u.name);cb(true)}else setTimeout(function(){cb(false)},700)})}
};
return A})();
