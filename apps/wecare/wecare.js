var FACES = [];
var STOR = require("Storage");
STOR.list(/\.face\.js$/).forEach(face=>FACES.push(eval(require("Storage").read(face))));
var lastface = STOR.readJSON("wecare.json")||{pinned:0};
var iface = lastface.pinned;
var face = FACES[iface]();
var intervalRefSec;

function stopdraw() {
  if (face.kill) face.kill();
  if(intervalRefSec) {intervalRefSec=clearInterval(intervalRefSec);}
  g.clear();
}

function startdraw() {
  g.clear();
  g.reset();
  Bangle.drawWidgets();
  face.init();
  if (face.tick) intervalRefSec = setInterval(face.tick,1000);
}

global.SCREENACCESS = {
  withApp:true,
  request:function(){
    this.withApp=false;
    stopdraw();
  },
  release:function(){
    this.withApp=true;
    startdraw(); 
  }
}; 

function setControl(){
  function newFace(inc){
    var n = FACES.length-1;
    iface+=inc;
    iface = iface>n?0:iface<0?n:iface;
    stopdraw();
    face = FACES[iface]();
    startdraw();
  }
  function finish(){
    if (lastface.pinned!=iface){
        lastface.pinned=iface;
        STOR.write("multiclock.json",lastface);
    }
    Bangle.showLauncher();
  }
  Bangle.on('swipe',(dir)=>{
    if (SCREENACCESS.withApp)
      newFace(dir);
  });
  setWatch(finish,BTN1,{edge:"falling"});
}

Bangle.loadWidgets();
g.clear();
startdraw();
setControl();
