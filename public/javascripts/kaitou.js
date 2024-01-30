//指定した時間ごとに変数に記録されている処理を起動している。
var socket = io();
var f = document.forms.s1;
var mydiv = document.getElementById("myid");
console.log(mydiv.innerText);

var log = function(){
    window.location.href ='/kaitou2?name=' + encodeURIComponent(mydiv.innerText);
}

setInterval(log,5000);
//ボタンが押されたらログイン画面に戻る
f.modoru.addEventListener('click',function(e){
    e.preventDefault();
    window.location.href='/login';
})