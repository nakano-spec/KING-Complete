var socket = io();
var n = document.forms.f1;
var s = document.f1.mo1; 
var flag = false;
var m = document.f1.hantei;
var o = 0;
for(var i = 0;i<m.length;i++){
 if(m[i].checked){
   flag = true;
   o = m[i].value;
 }
}

n.okuru.addEventListener('click',function(e){
 e.preventDefault();
 for(var i = 0;i<m.length;i++){
 if(m[i].checked){
   flag = true;
   o = m[i].value;
 }
}
 let element= s.selectedIndex;
 var a = s.options[element].innerText;
 //let newwin = open("/h");
 socket.emit('mondai_btnclick',a,o); //mondai
})

n.kakunin.addEventListener('click',function(e){
 e.preventDefault();
 let element= s.selectedIndex;
 var a = s.options[element].innerText;
 window.location.href = "/kakunin?data=" + encodeURIComponent(a);
})

n.tuika.addEventListener('click',function(e){
 e.preventDefault();
 window.location.href="/tuika";
})



socket.on('mondai_kekka',function(flag){
 if(flag = 1){
   var w = n.time2.value;
     window.location.href = '/mondai2?byou=' + encodeURIComponent(w);
 }else{
 window.location.href = '/hello'
}
}
)

//ハンバーガーメニュー用

document.getElementById("hambtn").onclick = function(){
  document.querySelector('html').classList.toggle('open');
}