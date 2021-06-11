

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }
function arrayMatch(arr1, arr2) {

	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;

};
function Pisti(x,y,lw){
    this.x = x;
    this.y = y;
    this.canMove = true
    this.px = 0
    this.py = 0
    this.lw = lw
    this.cellVisited = []
    this.check_around = function(x,y,cells){
        var arounds = [0,0,0,0]
        var w = cells[0].length
        var h = 9
        if (x-1 >= 0)
            arounds[3]=[y,x-1]
        if (x+1 < w)
            arounds[1]=[y,x+1]
        if (y-1 >= 0)
            arounds[0]=[y-1,x]
        if (y+1 < h)
            arounds[2]=[y+1,x]
        return arounds


    }
    this.move = function(cell,cells){
        var ij = this.indexOfCell()
        var i= ij[0];
        var j= ij[1];
        
        var op = []
        var arounds = this.check_around(i,j,cells)
        var ppos = [this.px,this.py]
        this.cellVisited.push(ppos)
        var miss = false
        for(var k = 0; k < 4;++k){
            miss = true
            if(cell[k] == true && arounds[k] != 0 ){
                var cpos = [arounds[k][1],arounds[k][0]]
                for(var l = 0; l < this.cellVisited.length; l++){
                    if(arrayMatch(this.cellVisited[l],cpos)){
                        miss = false
                        break
                    }
                }
               if(miss){
                op.push(createVector(this.lw*(arounds[k][1]-i), this.lw*(arounds[k][0]-j)))
               }
                    
 
                
            }
        }
        if(op == false){
            this.choosed = createVector((this.px-i)*this.lw,(this.py-j)*this.lw)
        }
        else{
            this.choosed = choose(op)
        }
        this.dv = p5.Vector.div(this.choosed,20)
        this.px = i
        this.py = j
        this.cellVisited.splice(0,1)
    }

    this.moving = function(){
        this.x += this.dv.x
        this.y += this.dv.y

    }
    this.indexOfCell = function(){
        return [Math.floor(this.x/this.lw),Math.floor(this.y/this.lw)]
    }
    this.render = function(){
        ellipse(this.x,this.y,30)
    }

}


var maze;
var lw;
var w;
var h;
var g2;
var ctx;
var pisti;
var maze1;
var cells;
var res = $.get("/maze-data")
res.done(function(rd){
    maze1 = rd;
    w = maze1["W"]
    h = maze1["H"]
    cells = maze1["cells"]

})
var p1;
var p2;
var p3;
var p4;
var p5;
var p6;
var pistis = []
function drawGradient(x, y,g,r_) {
    let radius = r_;
    g.strokeWeight(1)
    g.noFill()
    for (let r = radius; r > 0; r--) {
      g.stroke(r,r,r,map(r,0,r_,20,0)**2);
        g.ellipse(x, y, r);
      
      
    }
  }
var wss;
function drawMaze1(lg){
        for(var y = 0; y < h; y++){
            for(var x = 0; x < w; x++){
                wss = cells[y][x]
                for(var k = 0; k < 4; k++){
                    if(wss[k] == false){
                        switch(k){
                            case 0:
                                lg.line(lw*x, lw*y, lw*x+lw, lw*y)
                                break;
                            case 1:
                                lg.line(lw*x+lw, lw*y, lw*x+lw, lw*y+lw)
                                break;
                            case 2:
                                lg.line(lw*x, lw*y+lw, lw*x+lw, lw*y+lw)
                                break;
                            case 3:
                                lg.line(lw*x, lw*y, lw*x, lw*y+lw)
                                break;
                            default:
                                break;
                        }
                    }

                }
            }
        }

}
var f1 = false;
var line_graph;
function draw(){

}
/*
function draw(){

    if(!cells){
        return
    }
    else{
        if(!f1){
            lw = 60;
            
            var c = createCanvas(w*lw, 9*lw)
           
            g2 = createGraphics(w*lw, 9*lw)
    
            var canvas = document.getElementById('defaultCanvas0');
            ctx = canvas.getContext('2d');
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
            p1 = new Pisti(lw/2,lw/2,lw)
            p1 = new Pisti(w*lw-lw/2,lw/2,lw)
            p3 = new Pisti(lw/2,9*lw-lw/2,lw)
            p4 = new Pisti(w*lw-lw/2,9*lw-lw/2,lw)
            p6 = new Pisti(3*lw-lw/2,(2*lw)-lw/2,lw)
            ctx.shadowColor = "rgb(3, 236, 252)";
            pistis = [p1,p3,p4]
            ctx.shadowColor = "black";
            c.parent("background_motion")
            line_graph = createGraphics(w*lw, 9*lw)
            line_graph.stroke(3, 236, 252)
            line_graph.strokeWeight(3)
            drawMaze1(line_graph)
            f1 = true
        }
    }
    background(26, 40, 59)
    g2.stroke(255)
    noFill()
    g2.background(26, 40, 59)
    g2.blendMode(REMOVE)

    image(line_graph,0,0)
    //drawMaze1()
    for(var i = 0; i < pistis.length; i++){
        var pisti = pistis[i]
        drawGradient(pisti.x,pisti.y,g2,lw*5)
        pistiCell = pisti.indexOfCell()
        if (pistiCell[0] > w-1 || pistiCell[1] > h-1 || pistiCell[0] < 0 ||pistiCell[1] < 0){
            return
        }
        pistiCell_ = cells[pistiCell[1]][pistiCell[0]]
        if(pisti.x % (lw/2+pistiCell[0]*lw) == 0 && pisti.y % (lw/2+pistiCell[1]*lw) == 0){
            pisti.move(pistiCell_,cells)
        }
        
        pisti.moving();
        pisti.render()
    }
    g2.blendMode(BLEND)


    //rect(pistiCell[0]*lw, pistiCell[1]*lw, lw, lw)
    stroke(3, 236, 252)
    strokeWeight(8)
    noFill()
    rect(0,0,width,height)
    image(g2,0,0)

    



}*/