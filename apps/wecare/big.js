(() => {

    function getFace(){

    function drawTime(d) {
        g.reset();
        var da = d.toString().split(" ");
        var time = da[4].substr(0, 5).split(":");
        var hours = time[0],
          minutes = time[1];
        g.clearRect(0,24,175,175);
        g.setColor(7);
        g.setFontAlign(0,-1);
        g.setFont("Vector",90);
        g.drawString(hours,88,24,true);
        g.drawString(minutes,88,100,true);
        g.flip();
      }

    function onSecond(){
       var t = new Date();
       if (t.getSeconds() === 0) drawTime(t);
    }

    function drawAll(){
       drawTime(new Date());
    }

    return {init:drawAll, tick:onSecond};
    }

  return getFace;

})();
