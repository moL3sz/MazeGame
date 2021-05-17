
var debug = false

var collider_rules = [
    [[3,4,5,6,7,8,9,10],[0]],
    [[15,16,17,18,19,20,21,22],[3]],
    [[4,3,2,1,0,23,22,21,20],[2]],
    [[9,10,11,12,13,14,15,16],[1]],

    
    /*
    [[0,1,2,3,4,5,6],[0,2]],
    [[6,7,8,9,10,11,12],[0,1]],
    [[12,13,14,15,16,17,18],[3,1]],
    [[18,19,20,21,22,23,0],[3,2]]*/
]
var parlax_dir = [-3]
var collide_pppp = []
function Player(x,y,lw){
    this.x = x
    this.y = y
    this.r = 25
    this.v = 2.5
    this.canMoveDirs = [1,1,1,1]
    this.lw = lw
    this.collider = []
    angleMode(DEGREES)
    for(var i = 0; i < 360; i+=15){
        var lx = cos(i)*this.r/2    
        var ly = sin(i)*this.r/2*-1
        var p = createVector(lx, ly)
        this.collider.push(p)
    }
    this.move = function(){
        if(keyIsDown(87) && this.canMoveDirs[0]){
            //move up
            this.y -= this.v
        }
        if(keyIsDown(65)  && this.canMoveDirs[1]){
            //move left
            this.x -= this.v
        }   
        if(keyIsDown(68) && this.canMoveDirs[2]){
            //move right
            this.x += this.v
        }
        if(keyIsDown(83) && this.canMoveDirs[3]){
            //move-down
            this.y += this.v
        }


    }
    this.render = function(){
        fill(255,0,0)
        noStroke()
        ellipse(this.x, this.y, this.r)
        if (debug){
            for(var i = 0; i < this.collider.length; i++){
                var cp = this.collider[i]
                stroke(0,255,0)
                strokeWeight(1)
                point(cp.x+this.x,cp.y+this.y)
                noStroke()
                strokeWeight(2)
            }
        }

        
    }
    this.indexOfCell = function(){
        return [Math.floor(this.x/this.lw),Math.floor(this.y/this.lw)]


    }
    this.nextCell = function(){

        return[Math.ceil(this.x/80),Math.ceil(this.y/80)]
    }
    
}
var arr = rd_;
var lw;
var w;
var h;
var player;
var g1;
var rad;
var colors = {"up":"bottom","down":"top","left":"right","right":"left"}
var arrow_codes = {"up":UP_ARROW,"down":DOWN_ARROW,"right":RIGHT_ARROW,"left":LEFT_ARROW}
function drawGradient(x, y,g,r_) {
    let radius = r_;
    g.strokeWeight(1)
    g.noFill()
    for (let r = radius; r > 0; r--) {
      g.stroke(r,r,r,map(r,0,r_,20,0)**2);
        g.ellipse(x, y, r);
      
    }
  }
var f = false
var mic;
var r_amount = 3;
var counter = 0;
var r_arrow = 2
var dir;
var prev_dir = 0
var vision = 100
var r_arrows = [0,1,2,3]
var started = false
var timeStrs = ["3","2","1","GO"]
var ii = 0
var timer = 0;
var ff = false
var disable_move;
var keycodes = [UP_ARROW,DOWN_ARROW,RIGHT_ARROW,LEFT_ARROW]
function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }
function setup(){
    
}








var d;
var line_points = []
var current_disbles ;
var ncellIndex;
var nextCell;
var nextCcell;
var avoid_dir;
var bg_img;
var c;
function draw(){
    if(arr){
        if(!f){
            w = arr["W"]
            h = arr["H"]
            lw = 50
            rad = 100
            if(!ff){
                c = createCanvas(w*lw+10, h*lw+10)
                player = new Player(lw/2,lw/2,lw)
                g1 = createGraphics(w*lw+10, h*lw+10)
                c.parent("game-screen")
                ff = true
                bg_img = loadImage("static/canvas_bg_1.png")
                var canvas = document.getElementById('defaultCanvas0');
                ctx = canvas.getContext('2d');
                ctx.shadowBlur = 2;
            }
            


            
            //generate
            for(var i = 0; i < h; i++){
                for(var j = 0; j < w; j++){
                    var ccell = arr["cells"][i][j]
                    var cell_points = [0,0,0,0]
                    for(var k = 0; k < 4; k++){
                        if(ccell[k] == false){
                            var cx = j*lw;
                            var cy = i*lw;
                            switch(k){
                                case 0:
                                    var p = []
                                    for(var l = 0; l <= lw; l+=Math.floor(lw/40)){
                                        p.push(createVector(cx+l, cy))
                                    }
                                    cell_points[k] = p
                                    break;
                                case 1:
                                    var p = []
                                    for(var l = 0; l <= lw; l+=Math.floor(lw/40)){
                                        p.push(createVector(cx+lw, cy+l))
                                    }
                                    cell_points[k] = p
                                    break;
                                case 2:
                                    var p = []
                                    for(var l = 0; l <= lw; l+=Math.floor(lw/40)){
                                        p.push(createVector(cx+l, cy+lw))
                                    }
                                    cell_points[k] = p
                                    break;
                                case 3:
                                    var p = []
                                    for(var l = 0; l <= lw; l+=Math.floor(lw/40)){
                                        p.push(createVector(cx, cy+l))
                                    }
                                    cell_points[k] = p
                                    break;             
                            }
                        }



                    }
                    line_points.push(cell_points)
                }
            }



            textSize(100)
            textAlign(CENTER)
            
            fill(255)
            frameRate(1)
            var cc = timeStrs[ii]
            background(42, 53, 75)
            text(cc, 0, height/2-100, width, height)
            if (cc == "GO"){
                started=true
                frameRate(100)
                f = true
            }
            else{
                ii++;
            }
        }
    }
    else{
        return
    }
    if(!started){
        return
    }
    var arrows = $(".arrow-up, .arrow-down,.arrow-right,.arrow-left")
    $(arrows).each(function(indes,e){
        var cname = "border-"+colors[$(e).attr("class").split("-")[1]]+"-color"
        $(e).css(cname,"black")
    })
    var currentArrow = arrows[r_arrow]
    dir = $(currentArrow).attr("class").split("-")[1]
    var b_cname = "border-"+colors[$(currentArrow).attr("class").split("-")[1]]+"-color"
    $(currentArrow).css(b_cname,"red")
    
    if(counter == r_amount){
        counter = 0
        prev_dir = r_arrow
        r_amount = Math.floor(Math.random()*3)+1
        r_arrow =  choose(r_arrows.filter(function(e){
            return e != prev_dir;
        }))
    }
    $(".amount").html(r_amount-counter)

    g1.background(42, 53, 75)
    g1.blendMode(REMOVE)
    drawGradient(player.x,player.y,g1,vision)
    g1.blendMode(BLEND)



    image(bg_img, 0, 0, bg_img.width*height/bg_img.height, height);
    background(0,0,0,150)
    stroke(255)
    noFill()
    
    strokeWeight(2)
    if (vision >= 100){
        vision *= 0.995;
    }
    var m = "0"
    if (Math.floor(timer/6000) > 9  ){
        m = Math.floor(timer/6000).toString()
    }
    else{
        m += Math.floor(timer/6000).toString()
    }

    var parsedTime = m+":"+Math.floor(timer/100)%60+"."+Math.round(timer%100)
    $(".timer").html(parsedTime)
    translate(5, 5)




    if (arr){
        
        currentCellIndexes = player.indexOfCell()
        if (currentCellIndexes[0] == w-1 && currentCellIndexes[1] == h-1){
            add_to()
            remove()
        }
        currentCell = arr["cells"][currentCellIndexes[1]][currentCellIndexes[0]]
        fill(0,255,0,50)
        
        noStroke()
        if(debug){
            rect(currentCellIndexes[0]*lw, currentCellIndexes[1]*lw, lw, lw)
        }
        
        //console.log(currentCell)

        //next cell
        
        if(player.x % lw > lw/2+10){
            nextCell = [[currentCellIndexes[1]],[currentCellIndexes[0]+1]]
            ncellIndex = 2
        }

        if(player.y % lw > lw/2+10){
            nextCell = [[currentCellIndexes[1]+1],[currentCellIndexes[0]]]
            ncellIndex = 4
        }
        if(player.y % lw < lw/2-10){
            nextCell = [[currentCellIndexes[1]-1],[currentCellIndexes[0]]]
            ncellIndex = 0
        }
        if(player.x % lw < lw/2-10){
            nextCell = [[currentCellIndexes[1]],[currentCellIndexes[0]-1]]
            ncellIndex = 6
        }
        if(player.x % lw > lw/2+10 && player.y % lw > lw/2+10){
            nextCell = [[currentCellIndexes[1]+1],[currentCellIndexes[0]+1]]
            ncellIndex = 3
        }
        if(player.x % lw > lw/2+10 && player.y % lw < lw/2-10){
            nextCell = [[currentCellIndexes[1]-1],[currentCellIndexes[0]+1]]
            ncellIndex = 1
        }
        if(player.x % lw < lw/2-10 && player.y % lw > lw/2+10){
            nextCell = [[currentCellIndexes[1]+1],[currentCellIndexes[0]-1]]
            ncellIndex = 5
        }
        if(player.x % lw < lw/2-10 && player.y % lw < lw/2-10){
            nextCell = [[currentCellIndexes[1]-1],[currentCellIndexes[0]-1]]
            ncellIndex = 7
            
        }
        player.canMoveDirs=[1,1,1,1]
        stroke(0,255,0)
        strokeWeight(3)
        var ciii = currentCellIndexes[1]
        var cjjj = currentCellIndexes[0]
        var next_cell_points;
        if(nextCell){
            if(nextCell[0][0] >= 0 && nextCell[1][0] >= 0 && nextCell[1][0] < w && nextCell[0][0] < h){
                var iii = nextCell[0][0]
                var jjj = nextCell[1][0]

                //nextcell
                next_cell_points = line_points[iii*w+jjj]
                /*for(var k = 0; k < 4; k++){
                    if(next_cell_points[k] != 0){
                        var ll = next_cell_points[k]
                        for(var pp = 0; pp < ll.length; pp++){
                            var cp = ll[pp]
                            point(cp.x, cp.y)
                        }
                    }
                }*/
            }
        }
        var current_cell_points = line_points[ciii*w+cjjj]

        var check_points = current_cell_points
        if(next_cell_points){
            check_points = check_points.concat(next_cell_points);
        }


        if(debug){
            for(var k = 0; k < check_points.length; k++){
                if(check_points[k] != 0){
                    var ll = check_points[k]
                    for(var pp = 0; pp < ll.length; pp++){
                        var cp = ll[pp]
                        point(cp.x, cp.y)
                    }
                }
            }
        }

        disable_move = null;
        for(var i = 0; i < player.collider.length; i++){
            var player_collide_point = player.collider[i];
            for(var j = 0; j < check_points.length; j++){
                if(check_points[j] != 0){
                    var ll = check_points[j]
                    for(var pp = 0; pp < ll.length; pp++){
                        var cp = ll[pp]
                        strokeWeight(0.5)
                        stroke(0,0,255)
                        if(debug){
                            
                            line(cp.x,cp.y,player_collide_point.x+player.x,player_collide_point.y+player.y)
                        }
                        
                        if(dist(cp.x,cp.y,player_collide_point.x+player.x,player_collide_point.y+player.y) < 4){
                            collide_pppp = []
                            d =dist(cp.x,cp.y,player_collide_point.x+player.x,player_collide_point.y+player.y)
                            collide_pppp.push(d)
                            for(var kk = 0; kk < collider_rules.length;kk++){
                                if(collider_rules[kk][0].includes(i)){
                                    disable_move = collider_rules[kk][1]
                                    for(var dl = 0; dl < disable_move.length; dl++){
                                        player.canMoveDirs[disable_move[dl]] = 0
                                    }
                                }
                            }
                            continue;
                        }
                    }
                }
            }
        }


    }

    player.move()
    player.render()
    strokeWeight(4)
    stroke(3, 236, 252)
        for(var y = 0; y < h; y++){
            for(var x = 0; x < w; x++){
                let ws= arr["cells"][y][x]
                for(var k = 0; k < ws.length; k++){
                    if(ws[k] == false){
                        
                        switch(k){
                            case 0:
                                line(lw*x, lw*y, lw*x+lw, lw*y)
                                break;
                            case 1:
                                line(lw*x+lw, lw*y, lw*x+lw, lw*y+lw)
                                break;
                            case 2:
                                line(lw*x, lw*y+lw, lw*x+lw, lw*y+lw)
                                break;
                            case 3:
                                line(lw*x, lw*y, lw*x, lw*y+lw)
                                break;
                        }
                    }

                }
            }
    }
    noFill()
    strokeWeight(3)
    stroke(0,255,0)

    strokeWeight(8)
    if(!debug){
        image(g1,0,0)
       } 
    stroke(3, 236, 252)
    rect(-2,-2,width-6, height-6)

   
   timer+=100/60;
}
function keyPressed(){
    if(keyCode == 79){
        if(debug){
            debug = false
        }
        else{
            debug = true
        }
    }
    if(!keycodes.includes(keyCode)){
        return
    }
    if(keyCode == arrow_codes[dir]){
        if (vision <= 600){
            vision += 80;
        }
        $(".amount").html(r_amount-counter)
        counter++;
        return
    }


    else{
        if(vision >= 100){
            vision -=40;
        }
    }
}
function keyTyped(){
    if(keyCode == 84 && player.canMoveDirs[0]){
        //move up
        player.y -= 1
        return
    }
    if(keyCode == 70  && player.canMoveDirs[1]){
        //move left
        player.x -= 1
    }   
    if(keyCode == 72 && player.canMoveDirs[2]){
        //move right
        player.x += 1
    }
    if(keyCode == 71 && player.canMoveDirs[3]){
        //move-down
        player.y += 1
    }
}