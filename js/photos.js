App.start('photos',function(){var A=App,items=[];
 A.$('app').innerHTML='<h2>Student photos</h2><div class="card"><div id="cnt" class="mu"></div><label>Choose one or many images</label><input id="pf" type="file" accept="image/*" multiple><div class="mu">Tip: name each file after the student (for example <i>Mary Nakato.jpg</i>) or their pay code, and they will be matched automatically.</div></div><div id="bar"></div><div id="pl"></div>';
 function count(){var n=DB.get('students').filter(function(s){return s.active!==false&&!DB.photo(s.id)}).length;A.$('cnt').innerHTML='Active students without a photo: <b>'+n+'</b>'}
 function guess(name){var b=name.replace(/\.[^.]+$/,'').trim().toLowerCase();var m=DB.get('students').filter(function(s){return s.active!==false&&(s.name.toLowerCase()===b||s.code.toLowerCase()===b)})[0];return m?m.id:''}
 A.$('pf').onchange=function(){var fl=[].slice.call(this.files),k=0;if(!fl.length)return;
  fl.forEach(function(f){A.shrink(f,function(u){k++;if(u)items.push({id:A.uid(),url:u,name:f.name,sid:guess(f.name)});if(k===fl.length){draw()}})});this.value=''};
 function draw(){var m=items.filter(function(i){return i.sid}).length;
  A.$('bar').innerHTML=items.length?'<div class="card"><b>'+items.length+' image'+(items.length>1?'s':'')+' ready</b> · '+m+' matched<br><button class="acc" id="aa">Assign all matched ('+m+')</button></div>':'';
  A.$('pl').innerHTML=items.map(function(i){var s=i.sid&&A.student(i.sid);return '<div class="card"><div class="rw"><img class="av" style="width:64px;height:64px" alt="" src="'+i.url+'"><div style="flex:1"><div class="mu">'+A.esc(i.name)+'</div><div class="sw"><input data-i="'+i.id+'" placeholder="Type the student name" value="'+A.esc(s?s.name:'')+'" autocomplete="off"></div></div></div><button class="pri" data-a="as" data-id="'+i.id+'">Assign</button><button data-a="rm" data-id="'+i.id+'">Discard</button></div>'}).join('');
  [].forEach.call(A.$('pl').querySelectorAll('input[data-i]'),function(inp){A.suggest(inp,function(id){var it=items.filter(function(x){return x.id===inp.getAttribute('data-i')})[0];it.sid=id;inp.value=A.student(id).name;draw()})});
  var aa=A.$('aa');if(aa)aa.onclick=function(){items.filter(function(i){return i.sid}).forEach(function(i){DB.setPhoto(i.sid,i.url)});A.log('Assigned photos',m+' students');A.toast(m+' photos assigned.');items=items.filter(function(i){return !i.sid});draw();count()}}
 A.$('pl').onclick=function(e){var b=e.target.closest('[data-a]');if(!b)return;var id=b.getAttribute('data-id'),it=items.filter(function(x){return x.id===id})[0];
  if(b.getAttribute('data-a')==='rm')items=items.filter(function(x){return x.id!==id});
  else{if(!it.sid)return A.toast('Pick a student first.');DB.setPhoto(it.sid,it.url);A.log('Assigned photo',(A.student(it.sid)||{}).name);A.toast('Photo assigned.');items=items.filter(function(x){return x.id!==id})}
  draw();count()};
 count();draw()});
