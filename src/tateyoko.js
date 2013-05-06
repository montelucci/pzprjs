//
// パズル固有スクリプト部 タテボーヨコボー版 tateyoko.js v3.4.0
//
(function(){

var k = pzprv3.consts;

pzprv3.createCustoms('tateyoko', {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.owner.playmode){
			if     (this.mousestart || this.mousemove)  { this.inputTateyoko();}
			else if(this.mouseend && this.notInputted()){ this.clickTateyoko();}
		}
		else if(this.owner.editmode){
			if(this.mousestart){ this.inputqnum();}
		}
	},

	inputTateyoko : function(){
		var cell = this.getcell();
		if(cell.isnull){ return;}

		var pos = cell.getaddr();
		var input=false;

		// 初回はこの中に入ってきます。
		if(this.mouseCell.isnull){ this.firstPoint.set(this.inputPoint);}
		// 黒マス上なら何もしない
		else if(cell.getQues()===1){ }
		// まだ入力されていない(1つめの入力の)場合
		else if(this.inputData===null){
			if(cell===this.mouseCell){
				var mx=Math.abs(this.inputPoint.px-this.firstPoint.px);
				var my=Math.abs(this.inputPoint.py-this.firstPoint.py);
				if     (my>=8){ this.inputData=12; input=true;}
				else if(mx>=8){ this.inputData=13; input=true;}
			}
			else{
				var dir = this.getdir(this.prevPos, pos);
				if     (dir===k.UP || dir===k.DN){ this.inputData=12; input=true;}
				else if(dir===k.LT || dir===k.RT){ this.inputData=13; input=true;}
			}

			if(input){
				if(cell.getQans()===this.inputData){ this.inputData=0;}
				this.firstPoint.reset();
			}
		}
		// 入力し続けていて、別のマスに移動した場合
		else if(cell!==this.mouseCell){
			if(this.inputData==0){ this.inputData=0; input=true;}
			else{
				var dir = this.getdir(this.prevPos, pos);
				if     (dir===k.UP || dir===k.DN){ this.inputData=12; input=true;}
				else if(dir===k.LT || dir===k.RT){ this.inputData=13; input=true;}
			}
		}

		// 描画・後処理
		if(input){
			cell.setQans(this.inputData!==0?this.inputData:0);
			cell.draw();
		}
		this.prevPos   = pos;
		this.mouseCell = cell;
	},
	clickTateyoko : function(){
		var cell  = this.getcell();
		if(cell.isnull || cell.getQues()===1){ return;}

		cell.setQans((this.btn.Left?{0:12,12:13,13:0}:{0:13,12:0,13:12})[cell.getQans()]);
		cell.draw();
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,

	keyinput : function(ca){
		if(this.key_inputqnum_tateyoko(ca)){ return;}
		this.key_inputqnum(ca);
	},
	key_inputqnum_tateyoko : function(ca){
		var cell = this.cursor.getTCC();
		if(ca=='q'||ca=='q1'||ca=='q2'){
			if(ca=='q'){ ca = (cell.getQues()!=1?'q1':'q2');}
			if(ca=='q1'){
				cell.setQues(1);
				cell.setQans(0);
				if(cell.setQnum()>4){ cell.setQnum(-1);}
			}
			else if(ca=='q2'){ cell.setQues(0);}
		}
		else{ return false;}

		this.prev=cell;
		cell.draw();
		return true;
	}
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	nummaxfunc : function(){
		return (cell.ques===1?4:Math.max(this.owner.board.qcols,this.owner.board.qrows));
	},
	minnum : 0
},
Board:{
	getBarInfo : function(){
		var binfo = this.owner.newInstance('AreaCellInfo');
		for(var c=0;c<this.cellmax;c++){
			var cell = this.cell[c];
			binfo.id[c]=((cell.getQues()===1||cell.getQans()===0) ? null : 0);
		}
		for(var c=0;c<this.cellmax;c++){
			var cell = this.cell[c];
			if(!binfo.emptyCell(cell)){ continue;}
			binfo.addRoom();

			var pos=cell.getaddr(), val=cell.qans;
			while(!cell.isnull && cell.qans===val){
				binfo.addCell(cell);
				if(val===12){ pos.move(0,2);}else{ pos.move(2,0);}
				cell = pos.getc();
			}
		}
		return binfo;
	},

	adjustBoardData : function(key,d){
		if(key & k.TURN){ // 回転だけ
			for(var c=0;c<this.cellmax;c++){ this.cell[c].setQans({0:0,12:13,13:12}[this.cell[c].getQans()]);}
		}
	}
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	setColors : function(){
		this.gridcolor = this.gridcolor_LIGHT;
		this.linecolor = this.linecolor_LIGHT;
		this.errbcolor1 = this.errbcolor1_DARK;
	},
	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();

		this.drawTateyokos()

		this.drawBcellsAtNumber();
		this.drawNumbers_tateyoko();

		this.drawChassis();

		this.drawTarget();
	},

	drawTateyokos : function(){
		var g = this.vinc('cell_tateyoko', 'crispEdges');

		var headers = ["c_bar1_", "c_bar2_"];
		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i], id = cell.id;
			var rpx = (cell.bx-1)*this.bw, rpy = (cell.by-1)*this.bh;
			var lw = Math.max(this.cw/6, 3);	//LineWidth
			var lp = (this.bw-lw/2);			//LinePadding

			var err = cell.error;
			if     (err===1||err===4){ g.fillStyle = this.errlinecolor; lw++;}
			else if(err===-1){ g.fillStyle = this.errlinebgcolor;}
			else{ g.fillStyle = this.linecolor;}

			if(cell.qans===12){
				if(this.vnop(headers[0]+id,this.FILL)){
					g.fillRect(rpx+lp, rpy, lw, this.ch+1);
				}
			}
			else{ this.vhide(headers[0]+id);}

			if(cell.qans===13){
				if(this.vnop(headers[1]+id,this.FILL)){
					g.fillRect(rpx, rpy+lp, this.cw+1, lw);
				}
			}
			else{ this.vhide(headers[1]+id);}
		}
	},

	drawBcellsAtNumber : function(){
		var g = this.vinc('cell_bcells', 'crispEdges');

		var header = "c_full_";
		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell=clist[i];
			if(cell.ques===1){
				g.fillStyle = (cell.error===1 ? this.errcolor1 : this.cellcolor);
				if(this.vnop(header+cell.id,this.FILL)){
					var rpx = (cell.bx-1)*this.bw, rpy = (cell.by-1)*this.bh;
					g.fillRect(rpx, rpy, this.cw+1, this.ch+1);
				}
			}
			else{ this.vhide(header+cell.id);}
		}
	},
	drawNumbers_tateyoko : function(){
		var g = this.vinc('cell_number', 'auto');

		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i], key='cell_'+cell.id;
			var num = cell.qnum;
			if(num!==-1){
				var color = (cell.ques!==1 ? this.fontcolor : "white");
				var px = cell.bx*this.bw, py = cell.by*this.bh;
				this.dispnum(key, 1, (num!=-2?""+num:"?"), (num<10?0.8:0.75), color, px, py);
			}
			else{ this.hideEL(key);}
		}
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	pzlimport : function(type){
		this.decodeTateyoko();
	},
	pzlexport : function(type){
		this.encodeTateyoko();
	},

	decodeTateyoko : function(){
		var c=0, i=0, bstr = this.outbstr, bd = this.owner.board;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i), obj=bd.cell[c];

			if     (ca==='x'){ obj.ques = 1;}
			else if(this.include(ca,"o","s")){ obj.ques = 1; obj.qnum = (parseInt(ca,29)-24);}
			else if(this.include(ca,"0","9")||this.include(ca,"a","f")){ obj.qnum = parseInt(ca,16);}
			else if(ca==="-"){ obj.qnum = parseInt(bstr.substr(i+1,2),16); i+=2;}
			else if(ca==="i"){ c+=(parseInt(bstr.charAt(i+1),16)-1); i++;}

			c++;
			if(c>=bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeTateyoko : function(type){
		var cm="", count=0, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var pstr="", qu=bd.cell[c].ques, qn=bd.cell[c].qnum;
			if(qu===0){
				if     (qn===-1){ count++;}
				else if(qn===-2){ pstr=".";}
				else if(qn<  16){ pstr="" +qn.toString(16);}
				else if(qn< 256){ pstr="-"+qn.toString(16);}
				else{ pstr=""; count++;}
			}
			else if(qu===1){
				pstr=(qn>=0 ? (qn+24).toString(29) : "x");
			}

			if(count===0){ cm+=pstr;}
			else if(pstr || count===15){
				if(count===1){ cm+=("n"+pstr);}
				else{ cm+=("i"+count.toString(16)+pstr);}
				count=0;
			}
		}
		if(count===1){ cm+="n";}
		else if(count>1){ cm+=("i"+count.toString(16));}

		this.outbstr += cm;
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCell( function(obj,ca){
			if     (ca>="a"&&ca<='f'){ obj.ques = 1; obj.qnum = {a:1,b:2,c:3,d:4,e:0,f:-1}[ca];}
			else if(ca==="?"){ obj.qnum = -2;}
			else if(ca!=="."){ obj.qnum = parseInt(ca);}
		});
		this.decodeCell( function(obj,ca){
			if     (ca==="1"){ obj.qans = 12;}
			else if(ca==="2"){ obj.qans = 13;}
		});
	},
	encodeData : function(){
		this.encodeCell( function(obj){
			if(obj.ques===1){
				if(obj.qnum==-1||obj.qnum==-2){ return "f ";}
				else{ return {0:"e ",1:"a ",2:"b ",3:"c ",4:"d "}[obj.qnum];}
			}
			else if(obj.qnum===-2){ return "? ";}
			else if(obj.qnum>=  0){ return ""+obj.qnum+" ";}
			else{ return ". ";}
		});
		this.encodeCell( function(obj){
			if(obj.ques!==1){
				if     (obj.qans===0) { return "0 ";}
				else if(obj.qans===12){ return "1 ";}
				else if(obj.qans===13){ return "2 ";}
			}
			return ". ";
		});
	}
},
//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checkAns : function(){
		var bd = this.owner.board;

		if( !this.checkBCell(1) ){ return 90601;}

		var binfo = bd.getBarInfo();
		bd.cell.seterr(-1);
		if( !this.checkDoubleNumber(binfo) ){ return 30018;}
		if( !this.checkNumberAndSize(binfo) ){ return 30024;}
		bd.cell.seterr(0);

		if( !this.checkBCell(2) ){ return 90611;}

		if( !this.checkEmptyCell() ){ return 50141;}

		return 0;
	},
	check1st : function(){ return this.checkAllCell(function(cell){ return (cell.getQues()===0 && cell.getQans()===0);});},

	checkBCell : function(type){
		var result = true, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c], num = cell.getQnum();
			if(cell.getQues()!==1 || num<0){ continue;}

			var cnt1=0, cnt2=0, cell2;
			cell2=cell.up(); if(!cell2.isnull){ if(cell2.getQans()===12){ cnt1++;}else if(cell2.getQans()===13){ cnt2++;} }
			cell2=cell.dn(); if(!cell2.isnull){ if(cell2.getQans()===12){ cnt1++;}else if(cell2.getQans()===13){ cnt2++;} }
			cell2=cell.lt(); if(!cell2.isnull){ if(cell2.getQans()===13){ cnt1++;}else if(cell2.getQans()===12){ cnt2++;} }
			cell2=cell.rt(); if(!cell2.isnull){ if(cell2.getQans()===13){ cnt1++;}else if(cell2.getQans()===12){ cnt2++;} }

			if((type===1 && (num>4-cnt2 || num<cnt1)) || (type===2 && num!==cnt1)){
				if(this.inAutoCheck){ return false;}
				cell.seterr(1);
				result = false;
			}
		}
		return result;
	},
	
	checkEmptyCell : function(){
		return this.checkAllCell(function(cell){ return (cell.getQues()===0 && cell.getQans()===0);});
	}
}
});

})();
