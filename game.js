var awardLst = [["環保吸管組",80],["時尚露營燈",20]];
var initBottlePost = 1;
var globalDistY = 0;
document.addEventListener("touchmove", function(event){
    event.preventDefault();
}, false);
$( document ).ready(function() {
    
    scaleSvgSize("#playground");
    $("#gainText").hide();
    $("#restartBtn").hide();
    
    
    window.scrollTo( 0, window.innerHeight );
    
    $(window).on('resize', function() {
        scaleSvgSize("#playground");
    });
//    var roadSize = 500;
//    d3.select("#playground").append('svg:image')
//    .attr({
//      'xlink:href': 'img/road.png',  
//      x: parseInt(window.innerWidth/2)-roadSize/2,
//      y: roadSize/4,
////      width: roadSize,
//      height: roadSize,
//    id: "roadImg"
//    });
    var bottleSize = 256;
    d3.select("#playground").append('svg:image')
    .attr({
      'xlink:href': 'img/bottle.png',  
      x: parseInt(window.innerWidth/2)-bottleSize/2,
      y: window.innerHeight-initBottlePost*bottleSize,
      width: bottleSize,
      height: bottleSize,
    id: "bottleImg"
    });
    
    $("#restartBtn").on("click",function(){
        $("#gainText").hide();
        $("#restartBtn").hide();
        d3.select("#bottleImg").attr({ 
        x: parseInt(window.innerWidth/2)-bottleSize/2,
          y: window.innerHeight-initBottlePost*bottleSize,
          width: bottleSize,
          height: bottleSize
        });
        $("#hintText").show();
    })
    
    var el = document.getElementById('playground')
    swipedetect(el, function(swipedir){
//        swipedir contains either "none", "left", "right", "up", or "down"
        if (swipedir =='up'){
//            console.log("up");
            $("#hintText").fadeOut();
            var randVal = 1.5-2.5*globalDistY/window.innerHeight;
            console.log(randVal,globalDistY/window.innerHeight);
            d3.select("#bottleImg")
                .transition()
                .duration(3500)
                .ease("exp-out")
//                .delay(200)
                .attr({
                x: parseInt(window.innerWidth/2)-bottleSize/2/randVal*1.4,
                y: window.innerHeight-randVal*bottleSize/randVal*1.4,
                width: bottleSize/randVal*1.4,
                height: bottleSize/randVal*1.4,
            }).each("end", function(){
                var resRanVal = randomRound(0,100);
                var remainVal = resRanVal;
                var idx = 0;
                
                for(var i=0;i<awardLst.length;i++){
                    if(remainVal<=awardLst[i][1]){
                        idx = i;
                        break;
                    }
                    else{
                        remainVal-=awardLst[i][1];
                    }
                }
                
                
//                console.log("resRanVal",resRanVal,"idx",idx);
                $("#gainText>p").text(awardLst[idx][0]);
        $("#gainText").fadeIn();
            $("#restartBtn").fadeIn();
      	
      });
        }
            
    })
                    
});
function scaleSvgSize(element){
    d3.select(element).attr({
        width: window.innerWidth,
        height: window.innerHeight
    });
}

function swipedetect(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 20, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
  
    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        
        globalDistY = distY;
        
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

$(document).ready(function () {
    
    var counter = 0;
    
    awardLst.forEach(function(eachItem){
        counter = initNewRow(eachItem,counter);
    })
    
    $("#addrow").on("click", function () {
        var newRow = $("<tr>");
        var cols = "";

        cols += '<td><input type="text" class="form-control" name="name' + counter + '" value="XXX" /></td>';
        cols += '<td><input type="text" class="form-control" name="probability' + counter + '" value="30"/></td>';
        

        cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
        newRow.append(cols);
        $("table.order-list").append(newRow);
        counter++;
    });

    $("#modalDataSave").on("click", function () {
        var tmpLst = [];
        //Iterate all td's in second column
        $('#myModal table tr:nth-child(n+2) td:nth-child(1) input').each( function(){
           //add item to array
            console.log($(this).val())
           tmpLst.push([$(this).val(),parseInt($(this).parent().next().children("input").val())]);       
        });
        awardLst = tmpLst;
        console.log(tmpLst);
    });
    


    $("table.order-list").on("click", ".ibtnDel", function (event) {
        $(this).closest("tr").remove();       
        counter -= 1
    });


});

function initNewRow(eachItem,counter) {
    var newRow = $("<tr>");
    var cols = "";

    cols += '<td><input type="text" class="form-control" name="name' + counter + '" value="'+eachItem[0]+'" /></td>';
    cols += '<td><input type="text" class="form-control" name="probability' + counter + '" value="'+eachItem[1]+'"/></td>';


    cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
    newRow.append(cols);
    $("table.order-list").append(newRow);
    counter++;
    return counter;
}

function calculateRow(row) {
    var price = +row.find('input[name^="price"]').val();

}

function calculateGrandTotal() {
    var grandTotal = 0;
    $("table.order-list").find('input[name^="price"]').each(function () {
        grandTotal += +$(this).val();
    });
    $("#grandtotal").text(grandTotal.toFixed(2));
}
var random = function(N,M){
	return Math.floor((Math.random()*(M-N+1)+N)*100)/100;
}
var randomRound = function(N,M){
	return Math.floor((Math.random()*(M-N+1)+N));
}
//var winHeight = window.outerHeight;
//var winWidth = window.outerWidth;
//
//console.log(winWidth, winHeight);
//d3.select("#playground").attr({
//    width: winWidth,
//    height: winHeight
//});

//d3.select("#playground")