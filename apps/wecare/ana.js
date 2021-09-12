(() => {

    function getFace(){

    facename = "call";

    function onSecond() {

    }

    function drawAll() {
      g.drawImage(require("Storage").read("call1.img"),25,30);
    }

    return {init:drawAll, tick:onSecond};
 }

return getFace;

})();
