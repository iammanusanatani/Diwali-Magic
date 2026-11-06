const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
const initialName = (params.get("to") || "").trim().slice(0, 32);
const initialWish = params.get("wish") || "blessings";
const messages = {
  blessings: { title: "May your life glow<br>with endless happiness.", body: "Wishing you and your family a beautiful Diwali filled with prosperity, peace and countless reasons to smile.", hindi: "आपके जीवन में सुख, शांति और समृद्धि का प्रकाश हमेशा बना रहे। शुभ दीपावली!" },
  love: { title: "More love, more light,<br>more beautiful moments.", body: "May this Diwali bring warm hugs, happy memories and a thousand little reasons to celebrate. Sending love to you and your family.", hindi: "आपके घर में प्यार, खुशियाँ और अपनापन हमेशा बना रहे। दीपावली की हार्दिक शुभकामनाएँ!" },
  success: { title: "A bright beginning<br>to bigger dreams.", body: "May every diya light a new opportunity and every step take you closer to your dreams. Wishing you growth, courage and success.", hindi: "आपके हर नए कदम के साथ सफलता और खुशियाँ आएँ। शुभ दीपावली!" },
  fun: { title: "Eat sweets, spread smiles,<br>and sparkle all night!", body: "Wishing you a super-fun Diwali full of delicious treats, bright lights, laughter and unforgettable celebrations!", hindi: "मिठाइयाँ खाइए, खूब मुस्कुराइए और खुशियाँ बाँटिए। हैप्पी दिवाली!" }
};
let selectedWish = messages[initialWish] ? initialWish : "blessings";
let currentName = initialName;
let soundOn = false;
let diyaOn = true;
let palette = 0;
let audioContext = null;
let wishIndex = 0;
const wishVariants = ["May your life glow<br>with endless happiness.", "May every diya bring<br>hope and new beginnings.", "May your home shine<br>with peace and prosperity."];

function renderGreeting() {
  const safeName = currentName || "someone special";
  $("greetingTitle").textContent = currentName ? `Happy Diwali, ${currentName}!` : "Happy Diwali!";
  $("greetingSubtitle").textContent = currentName ? `A little festive surprise made especially for ${currentName}.` : "May your world be filled with light, love and new beginnings.";
  $("wishTo").textContent = `To ${safeName}`;
  $("wishHeadline").innerHTML = messages[selectedWish].title;
  $("wishMessage").textContent = `${messages[selectedWish].body} ${messages[selectedWish].hindi}`;
  $("recipientName").value = currentName;
  $("wishSelect").value = selectedWish;
}
function makeShareUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  if (currentName) url.searchParams.set("to", currentName);
  url.searchParams.set("wish", selectedWish);
  return url.toString();
}
function showStatus(message) { $("statusMessage").textContent = message; }
function burst(x = innerWidth/2, y = innerHeight*.35, count = 85) {
  const canvas = $("fireworks"), ctx = canvas.getContext("2d");
  const colors = ["#ffd36e","#ff8ba7","#b8a0ff","#fff1c7","#8de3d2"];
  const particles = Array.from({length:count}, () => {
    const angle = Math.random()*Math.PI*2, speed = 1.5+Math.random()*5;
    return {x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:45+Math.random()*35,color:colors[Math.floor(Math.random()*colors.length)],size:1+Math.random()*2};
  });
  activeBursts.push(...particles);
}
let activeBursts = [];
function resizeCanvas(){const c=$("fireworks");c.width=innerWidth*devicePixelRatio;c.height=innerHeight*devicePixelRatio;c.style.width=innerWidth+"px";c.style.height=innerHeight+"px";c.getContext("2d").setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
function animateFireworks(){
  const ctx=$("fireworks").getContext("2d");ctx.clearRect(0,0,innerWidth,innerHeight);
  activeBursts=activeBursts.filter(p=>p.life>0);
  for(const p of activeBursts){ctx.globalAlpha=Math.min(1,p.life/35);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.vx*=.985;p.life--}
  ctx.globalAlpha=1;requestAnimationFrame(animateFireworks);
}
function sparkle(){
  const el=document.createElement("span");el.className="sparkle";el.textContent=["✦","✧","✨","⭐"][Math.floor(Math.random()*4)];
  el.style.left=(15+Math.random()*70)+"vw";el.style.top=(55+Math.random()*30)+"vh";el.style.color=["#ffd36e","#ff8ba7","#b8a0ff"][Math.floor(Math.random()*3)];
  document.body.appendChild(el);setTimeout(()=>el.remove(),1900);
}
function playTone(freq=660,duration=.16){
  if(!soundOn)return;
  try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.frequency.value=freq;osc.type="sine";gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.08,audioContext.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+duration)}catch(e){}
}
function celebrate(){for(let i=0;i<4;i++)setTimeout(()=>{burst(innerWidth*(.2+Math.random()*.6),innerHeight*(.15+Math.random()*.35),65);playTone(440+i*110,.22)},i*220);for(let i=0;i<12;i++)setTimeout(sparkle,i*100)}
function lightDiya(){diyaOn=!diyaOn;$("mainFlame").classList.toggle("off",!diyaOn);document.querySelector(".lamp-glow").style.opacity=diyaOn?".18":".03";$("diyaToggle").querySelector("small").textContent=diyaOn?"The diya is glowing":"The diya is resting";playTone(diyaOn?740:260,.2);if(diyaOn)burst(innerWidth/2,innerHeight*.4,40)}
async function copyLink(){const url=makeShareUrl();try{await navigator.clipboard.writeText(url);showStatus("Greeting link copied. Send it to your friends!")}catch(e){showStatus("Copy is not supported here. Copy this link from your browser: "+url)}}
function shareWhatsApp(){const name=currentName||"you";const msg=`🪔 Happy Diwali, ${name}! ✨\n${messages[selectedWish].body}\nआपको और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ!\n\nOpen your surprise: ${makeShareUrl()}`;window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank","noopener");}
function downloadCard(){
  const c=document.createElement("canvas");c.width=1200;c.height=1500;const ctx=c.getContext("2d");
  const g=ctx.createLinearGradient(0,0,1200,1500);g.addColorStop(0,"#34204c");g.addColorStop(1,"#100923");ctx.fillStyle=g;ctx.fillRect(0,0,1200,1500);
  ctx.strokeStyle="#f6c66a";ctx.lineWidth=4;ctx.strokeRect(45,45,1110,1410);ctx.strokeRect(65,65,1070,1370);
  ctx.textAlign="center";ctx.fillStyle="#f6c66a";ctx.font="bold 34px Georgia";ctx.fillText("✦  THE FESTIVAL OF LIGHTS  ✦",600,190);
  ctx.font="120px serif";ctx.fillText("🪔",600,440);
  ctx.fillStyle="#fff8ed";ctx.font="bold 76px Georgia";ctx.fillText("Happy Diwali!",600,600);
  ctx.fillStyle="#f6c66a";ctx.font="bold 48px Georgia";ctx.fillText(currentName?`Dear ${currentName}`:"To someone special",600,700);
  ctx.fillStyle="#fff8ed";ctx.font="36px Georgia";wrapText(ctx,messages[selectedWish].body,600,830,900,58);
  ctx.fillStyle="#ffd36e";ctx.font="34px sans-serif";ctx.fillText(messages[selectedWish].hindi,600,1120);
  ctx.fillStyle="#c9bfd1";ctx.font="28px Georgia";ctx.fillText("With warm wishes  ♥",600,1280);
  ctx.fillStyle="#f6c66a";ctx.font="36px Georgia";ctx.fillText("✧   ✦   ✧",600,1370);
  const a=document.createElement("a");a.download="diwali-greeting.png";a.href=c.toDataURL("image/png");a.click();showStatus("Your greeting card has been saved as an image.");
}
function wrapText(ctx,text,x,y,maxWidth,lineHeight){const words=text.split(" ");let line="";for(const word of words){const test=line+word+" ";if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line.trim(),x,y);line=word+" ";y+=lineHeight}else line=test}ctx.fillText(line.trim(),x,y)}
$("greetingForm").addEventListener("submit",e=>{e.preventDefault();currentName=$("recipientName").value.trim().slice(0,32);selectedWish=$("wishSelect").value;renderGreeting();history.replaceState({}, "", makeShareUrl());showStatus("Your greeting is ready. Share it with someone special!");$("greeting").scrollIntoView({behavior:"smooth"});celebrate()});
$("whatsappBtn").addEventListener("click",shareWhatsApp);$("copyBtn").addEventListener("click",copyLink);$("downloadBtn").addEventListener("click",downloadCard);
$("celebrateBtn").addEventListener("click",celebrate);$("burstBtn").addEventListener("click",celebrate);
$("diyaToggle").addEventListener("click",lightDiya);
$("wishBtn").addEventListener("click",()=>{burst(innerWidth/2,innerHeight*.25,110);for(let i=0;i<18;i++)setTimeout(sparkle,i*70);showStatus("Your wish is on its way into the Diwali sky ✨");playTone(880,.4)});
$("rangoliBtn").addEventListener("click",()=>{palette=(palette+1)%3;document.body.classList.toggle("warm-theme",palette===1);document.body.style.filter=palette===2?"hue-rotate(35deg)":"";showStatus(["The classic Diwali colors are back.","A warmer festive glow is on.","A colorful new mood is on."][palette]);playTone(520,.18)});
$("newWishBtn").addEventListener("click",()=>{wishIndex=(wishIndex+1)%wishVariants.length;$("wishHeadline").innerHTML=wishVariants[wishIndex];burst(innerWidth/2,innerHeight*.35,35);playTone(620,.2)});
$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("warm-theme");playTone(500,.15)});
$("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("soundLabel").textContent=soundOn?"Sound on":"Sound off";if(soundOn)playTone(660,.2)});
window.addEventListener("resize",resizeCanvas);
renderGreeting();resizeCanvas();animateFireworks();
if(initialName){setTimeout(()=>{burst(innerWidth/2,innerHeight*.27,95);setTimeout(()=>burst(innerWidth*.75,innerHeight*.2,55),350)},550)}
