var BS = 15; //BOARD SIZE
var BT = 17;
var DS = 289; //17*17
var CENTER = 8;
var BLACK = 1;
var WHITE = 2;
var BORDER = -1;
var bd = new Board();
var CW = 40; //CELL WIDTH
var OS = 40; //OFFSET
var bgColor = "Chocolate";
var cellColor = "#000";
var highlightCellColor = "red";
var lastStep = [0,0];
var showOrder = false;
var zong = new Array('天','地','位','山','澤','气','雷','風','薄','水','火','不','射','順','逆');
var heng = new Array('出','震','齊','巽','見','離','役','坤','說','戰','乾','勞','坎','成','艮');

function pos(x,y){
	return x+y*17;
}

function Board(){
	var data = new Array(DS);
	var currentPlayer = 0;
	var history = [];
	
	var trogglePlayer = function(){
		currentPlayer = 3 - currentPlayer;
	};
	
	this.init = function(){
		for(var i=0;i<DS;++i){
			data[i] = 0;
		}
	}
	
	this.reset = function(){
		this.init();
		for(var i=0;i<BS+2;++i){
			data[i] = data[DS-i] = data[i*(BS+2)] = data[(i+1)*(BS+2)-1] = BORDER;
		}
		currentPlayer = BLACK;
		history = [];
	};
	
	this.getChess = function(x,y){
		return data[pos(x,y)];
	};
	
	this.getPlayer = function(){
		return currentPlayer;
	};
	
	var check = function(x,y,dx,dy,chess){
		var result = 0;
		for(var i=0;i<4;++i){
			x += dx;
			y += dy;
			if( x<1 || x>BS || y<1 || y>BS){
				break;
			}
			if(data[pos(x,y)]==chess){
				++result;
			}
			else{
				break;
			}
		}
		return result;
	};
	
	this.isGameOver = function(){
		if(history.length>0){
			var chess = (history.length%2==1)?BLACK:WHITE;
			var laststep = history[history.length-1];
			var x = laststep[0];
			var y = laststep[1];
			if(check(x,y,1,0,chess)+check(x,y,-1,0,chess)>=4){
				return chess;
			}
			if(check(x,y,0,1,chess)+check(x,y,0,-1,chess)>=4){
				return chess;
			}
			if(check(x,y,1,1,chess)+check(x,y,-1,-1,chess)>=4){
				return chess;
			}
			if(check(x,y,1,-1,chess)+check(x,y,-1,1,chess)>=4){
				return chess;
			}
		}
		for(var i=0;i<DS;++i){
			if(data[i]==0){
				return 0;
			}
		}
		return 3;
	}
	
	this.putChess = function(x,y){
		if(data[pos(x,y)]==0){
			data[pos(x,y)] = currentPlayer;
			history.push([x,y]);
			trogglePlayer();
			return true;
		}
		return false;
	};
	
	this.getChessCount= function(){
		return history.length+1;
	}
	
	this.undo = function(){
		if(history.length>0){
			var step = history.pop();
			data[pos(step[0],step[1])] = 0;
			currentPlayer = (history.length%2==1)?WHITE:BLACK;
			return true;
		}
		return false;
	};
	
	this.getHistory = function(){
		return history.slice(0);
	}
	
	this.getData = function(){
		return data.slice(0);
	}
	
	this.init();
}

function drawChess(cx,cy,player){
	if(player == 0) return;
	var size = CW*9/10;
	$("canvas").drawImage({
		source: (player == BLACK?$("#chessBlack")[0]:$("#chessWhite")[0]),
		x: (cx-1)*CW+OS, y:(cy-1)*CW+OS,
		width: size, height: size
	});
}

function drawStar(cx,cy){
	$("canvas").drawEllipse({
		fillStyle: "black",
		x: (cx-1)*CW+OS, y:(cy-1)*CW+OS,
		width: 8, height: 8
	});
}

function drawOrder(){
	var history = bd.getHistory();
	if(history.length>0){
		for(var i=0;i<history.length;++i){
			var step = history[i];
			var x = step[0];
			var y = step[1];
			$("canvas").drawText({
				fillStyle: "red",
				strokeStyle: "red",
				strokeWidth: 1,
				x: (x-1)*CW+OS, y:(y-1)*CW+OS,
				font: "8pt Arial",
				text: i+1
			});
		}
	}
}

function drawBoard(){
	$("canvas").drawRect({
		fillStyle: bgColor,
		x: 0, y: 0,
		width: CW*(BS-1)+OS*2,
		height: CW*(BS-1)+OS*2,
		fromCenter: false
	});
	
	for(var i=1;i<=BS;++i){
		$("canvas").drawText({
			fillStyle: "Red",
			strokeStyle: "DarkRed",
			strokeWidth: 1,
			x: OS+(CW*(i-1)), y: OS*3/8,
			fontSize: "12pt",
			fontFamily: "Meiryo",
			text: (zong[BS-i])
		});
		$("canvas").drawText({
			fillStyle: "DarkBlue",
			strokeStyle: "DarkBlue",
			strokeWidth: 1,
			x: OS*5/8+OS+CW*(BS-1), y: OS+(CW*(i-1)),
			fontSize: "12pt",
			fontFamily: "Meiryo",
			text: (heng[i-1])
		});
	}
	
	//draw lines
	for(var x = 0; x < BS; ++x){
		$("canvas").drawLine({
			strokeStyle: cellColor,
			strokeWidth: 2,
			x1: x*CW+OS, y1: OS,
			x2: x*CW+OS, y2: (BS-1)*CW+OS
		});
	}
	for(var y = 0; y < BS; ++y){
		$("canvas").drawLine({
			strokeStyle: cellColor,
			strokeWidth: 2,
			x1: OS, y1: y*CW+OS,
			x2: (BS-1)*CW+OS, y2: y*CW+OS
		});
	}
	
	//mark the star position
	drawStar(CENTER,CENTER);
	drawStar((BS+1)/4,(BS+1)/4);
	drawStar((BS+1)/4,(BS+1)*3/4);
	drawStar((BS+1)*3/4,(BS+1)/4);
	drawStar((BS+1)*3/4,(BS+1)*3/4);
	
	for(var x = 1; x <= BS; ++x){
		for(var y = 1; y <= BS; ++y){
			drawChess(x,y,bd.getChess(x,y));
		}
	}
	
	if(showOrder){
		drawOrder();
	}
	else {//mark the last chess
		if(lastStep[0]>0 && lastStep[1]>0){
			$("canvas").drawRect({
				fillStyle: "red",
				x: (lastStep[0]-1)*CW+OS, y:(lastStep[1]-1)*CW+OS,
				width: CW/6,
				height: CW/6,
				fromCenter: true
			});
		}
	}
}

function newGame(){
	lastStep=[0,0];
	bd.reset();
	drawBoard();
	$("#currentPlayer").attr("src","images/white.png");
	$("#currentPlayer").css("opacity","1");
	turn();
}

function regret(){
	if(!bd.isGameOver()){
		if(bd.undo()){
			lastStep=[0,0];
			if($('#soundEffectChk').is(':checked')){
				$("#regretSound").get(0).load();
				$("#regretSound").get(0).play();
			}
			drawBoard();
			turn();
		}
	}
}

function putChess(cx,cy){
	if(cx>=1 && cx<=BS && cy>=1 && cy<=BS){
		if(bd.putChess(cx,cy)){
			lastStep[0]=cx;lastStep[1]=cy;
			if($('#soundEffectChk').is(':checked')){
				$("#putSound").get(0).load();
				$("#putSound").get(0).play();
			}
			drawBoard();
			window.setTimeout(turn,100);
		}
	}
}

function drawCell(x,y,c){
	var length = CW/4;
	var xx = (x-1)*CW+OS;
	var yy = (y-1)*CW+OS;
	var x1,y1,x2,y2,x3,y3,x4,y4;
	x1 = x4 = xx-CW/2;
	x2 = x3 = xx+CW/2;
	y1 = y2 = yy-CW/2;
	y3 = y4 = yy+CW/2;
	$("canvas").drawLine({
		strokeStyle: c,
		strokeWidth: 2,
		x1: x1+length, y1: y1,
		x2: x1, y2: y1,
		x3: x1, y3: y1+length,
	});
	$("canvas").drawLine({
		strokeStyle: c,
		strokeWidth: 2,
		x1: x2-length, y1: y2,
		x2: x2, y2: y2,
		x3: x2, y3: y2+length,
	});
	$("canvas").drawLine({
		strokeStyle: c,
		strokeWidth: 2,
		x1: x3-length, y1: y3,
		x2: x3, y2: y3,
		x3: x3, y3: y3-length,
	});
	$("canvas").drawLine({
		strokeStyle: c,
		strokeWidth: 2,
		x1: x4+length, y1: y4,
		x2: x4, y2: y4,
		x3: x4, y3: y4-length,
	});
}

var lastCX=-1,lastCY=-1;
function highlightCell(cx,cy){
	if(lastCX==cx && lastCY==cy){
		return;
	}
	if(lastCX>=1 && lastCX<=BS && lastCX>=1 && lastCX<=BS){
		drawCell(lastCX,lastCY,bgColor);
	}
	if(cx>=1 && cx<=BS && cy>=1 && cy<=BS){
		drawCell(cx,cy,highlightCellColor);
	}
	lastCX=cx;
	lastCY=cy;
}

function turn(){
	$("canvas").unbind();
	if($("#currentPlayer").attr("src")=="images/black.png"){
		$("#currentPlayer").attr("src","images/white.png");
	}
	else{
		$("#currentPlayer").attr("src","images/black.png");
	}
	var winSide=bd.isGameOver();
	if(winSide>0){
		if($('#soundEffectChk').is(':checked')){
			$("#winSound").get(0).load();
			$("#winSound").get(0).play();
		}
		$("#currentPlayer").css("opacity","0");
		if(!showOrder){
			showOrder = true;
			drawBoard();
			showOrder = false;
		}
		if(winSide == BLACK){
			window.alert("黑棋獲勝!");
		}
		else if(winSide == WHITE){
			window.alert("白棋獲勝!");
		}
		else{
			window.alert("雙方平手!");
		}
		return;
	}
	drawCell(lastCX,lastCY,highlightCellColor);
	$("canvas").mousemove(function(event) {
		var position = $("canvas").position();
		var cx = Math.round((event.pageX - position.left - OS)/CW)+1;
		var cy = Math.round((event.pageY - position.top - OS)/CW)+1;
		if(cx>=1 && cx<=BS && cy>=1 && cy<=BS){
			highlightCell(cx,cy);
		}
	});
	$("canvas").click(function(event) {
		var position = $("canvas").position();
		var cx = Math.round((event.pageX - position.left - OS)/CW)+1;
		var cy = Math.round((event.pageY - position.top - OS)/CW)+1;
		putChess(cx,cy);
	});
}

function troggleOrder(){
	showOrder = $('#orderChk').is(':checked');
	drawBoard();
}
function troggleBgSound(){
	if($('#bgSoundChk').is(':checked')) {
		$("#bgSound").get(0).play();
	}
	else {
		$("#bgSound").get(0).pause();
	}
}

$(function(){
	drawBoard();
});