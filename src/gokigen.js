//
// パズル固有スクリプト部 ごきげんななめ版 gokigen.js v3.2.3
//
Puzzles.gokigen = function(){ };
Puzzles.gokigen.prototype = {
	setting : function(){
		// グローバル変数の初期設定
		if(!k.qcols){ k.qcols = 7;}	// 盤面の横幅
		if(!k.qrows){ k.qrows = 7;}	// 盤面の縦幅
		k.irowake = 0;			// 0:色分け設定無し 1:色分けしない 2:色分けする

		k.iscross      = 1;		// 1:Crossが操作可能なパズル
		k.isborder     = 0;		// 1:Border/Lineが操作可能なパズル
		k.isextendcell = 0;		// 1:上・左側にセルを用意するパズル 2:四方にセルを用意するパズル

		k.isoutsidecross  = 1;	// 1:外枠上にCrossの配置があるパズル
		k.isoutsideborder = 0;	// 1:盤面の外枠上にborderのIDを用意する
		k.isLineCross     = 0;	// 1:線が交差するパズル
		k.isCenterLine    = 0;	// 1:マスの真ん中を通る線を回答として入力するパズル
		k.isborderAsLine  = 0;	// 1:境界線をlineとして扱う

		k.dispzero      = 1;	// 1:0を表示するかどうか
		k.isDispHatena  = 0;	// 1:qnumが-2のときに？を表示する
		k.isAnsNumber   = 0;	// 1:回答に数字を入力するパズル
		k.isArrowNumber = 0;	// 1:矢印つき数字を入力するパズル
		k.isOneNumber   = 0;	// 1:部屋の問題の数字が1つだけ入るパズル
		k.isDispNumUL   = 0;	// 1:数字をマス目の左上に表示するパズル(0はマスの中央)
		k.NumberWithMB  = 0;	// 1:回答の数字と○×が入るパズル

		k.BlackCell     = 0;	// 1:黒マスを入力するパズル
		k.NumberIsWhite = 0;	// 1:数字のあるマスが黒マスにならないパズル
		k.RBBlackCell   = 0;	// 1:連黒分断禁のパズル

		k.ispzprv3ONLY  = 0;	// 1:ぱずぷれv3にしかないパズル
		k.isKanpenExist = 0;	// 1:pencilbox/カンペンにあるパズル

		k.fstruct = ["crossnum","cellqanssub"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// areaオブジェクトで領域を生成する

		base.setTitle("ごきげんななめ","Gokigen-naname");
		base.setExpression("　マウスで斜線を入力できます。",
						   " Click to input slashes.");
		base.setFloatbgcolor("rgb(0, 127, 0)");
		base.proto = 1;
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedLineToFlags();
	},
	protoChange : function(){
	},
	protoOriginal : function(){
		ee('btnclear2').el.style.display = 'inline';
	},

	//---------------------------------------------------------
	//入力系関数オーバーライド
	input_init : function(){
		// マウス入力系
		mv.mousedown = function(){
			if(k.playmode){
				if(!(kc.isZ ^ pp.getVal('dispred'))){ this.inputslash();}
				else{ this.dispBlue();}
			}
			else if(k.editmode){
				if(!kp.enabled()){ this.inputcross();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){ };
		mv.dispBlue = function(){
			var cc = this.cellid();
			if(cc==-1 || bd.QaC(cc)==-1){ return;}

			var check = [];
			for(var i=0;i<bd.crossmax;i++){ check[i]=0;}

			var fc = bd.xnum(bd.cell[cc].cx+(bd.QaC(cc)==1?0:1),bd.cell[cc].cy);
			ans.searchline(check, 0, fc);
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QaC(c)==1 && check[bd.xnum(bd.cell[c].cx  ,bd.cell[c].cy)]==1){ bd.sErC([c],2);}
				if(bd.QaC(c)==2 && check[bd.xnum(bd.cell[c].cx+1,bd.cell[c].cy)]==1){ bd.sErC([c],2);}
			}

			ans.errDisp = true;
			pc.paintAll();
		};
		mv.inputslash = function(){
			var cc = this.cellid();
			if(cc==-1){ return;}

			if     (k.use==1){ bd.sQaC(cc, (bd.QaC(cc)!=(this.btn.Left?1:2)?(this.btn.Left?1:2):-1));}
			else if(k.use==2){
				if(bd.QaC(cc)==-1){ bd.sQaC(cc, (this.btn.Left?1:2));}
				else{ bd.sQaC(cc, (this.btn.Left?{1:2,2:-1}:{1:-1,2:1})[bd.QaC(cc)]);}
			}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
		};

		// キーボード入力系
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.playmode){ return;}
			if(this.moveTCross(ca)){ return;}
			this.key_inputcross(ca,4);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;} };

		kc.isZ = false;

		if(k.EDITOR){
			kp.generate(4, true, false, '');
			kp.ctl[1].target = k.CROSS;
			kp.kpinput = function(ca){
				kc.key_inputcross(ca,4);
			};
		}

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			if(type>=1 && type<=4){ // 反転・回転全て
				for(var c=0;c<bd.cellmax;c++){ if(bd.QaC(c)!=-1){ bd.sQaC(c,{1:2,2:1}[bd.QaC(c)]); } }
			}
			um.enableRecord();
		};

		ee('btnclear2').el.style.display = 'none';

		tc.minx = 0;
		tc.miny = 0;
		tc.maxx = 2*k.qcols;
		tc.maxy = 2*k.qrows;
		tc.setTXC(0);
	},

	//---------------------------------------------------------
	//画像表示系関数オーバーライド
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;

		pc.crosssize = 0.33;
		pc.chassisflag = false;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBGCells(x1,y1,x2,y2);

			this.drawSlashes(x1,y1,x2,y2);

			this.drawCrosses(x1,y1,x2+1,y2+1);
			this.drawTarget_gokigen(x1,y1,x2,y2);
		};

		// オーバーライド
		pc.setBGCellColor = function(c){
			if(bd.cell[c].qans===-1 && bd.cell[c].error===1){
				g.fillStyle = this.errbcolor1;
				return true;
			}
			return false;
		};

		pc.drawSlashes = function(x1,y1,x2,y2){
			var headers = ["c_sl1_", "c_sl2_"];
			g.lineWidth = (mf(k.cwidth/8)>=2?mf(k.cwidth/8):2);

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				if(bd.cell[c].qans!=-1){
					if     (bd.cell[c].error==1){ g.strokeStyle = this.errcolor1;}
					else if(bd.cell[c].error==2){ g.strokeStyle = this.errcolor2;}
					else                        { g.strokeStyle = this.Cellcolor;}

					if(bd.cell[c].qans==1){
						if(this.vnop(headers[0]+c,0)){
							this.inputPath([bd.cell[c].px,bd.cell[c].py, 0,0, k.cwidth,k.cheight], true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[0]+c);}

					if(bd.cell[c].qans==2){
						if(this.vnop(headers[1]+c,0)){
							this.inputPath([bd.cell[c].px,bd.cell[c].py, k.cwidth,0, 0,k.cheight], true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[1]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c]);}
			}
			this.vinc();
		};

		pc.drawTarget_gokigen = function(x1,y1,x2,y2){
			if(k.editmode){ this.drawTCross(x1,y1,x2+1,y2+1);}
			else{ this.hideTCross();}
		};
	},

	//---------------------------------------------------------
	// URLエンコード/デコード処理
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if((type==1 && this.checkpflag("c")) || (type==0 && !this.checkpflag("d"))){
				bstr = this.decode4Cross(bstr);
			}
			else{ bstr = this.decodecross_old(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encode4Cross();
		};
	},

	//---------------------------------------------------------
	// 正解判定処理実行部
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLoopLine() ){
				this.setAlert('斜線で輪っかができています。', 'There is a loop consisted in some slashes.'); return false;
			}

			if( !this.checkQnumCross() ){
				this.setAlert('数字に繋がる線の数が間違っています。', 'A number is not equal to count of lines that is connected to it.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QaC(c)==-1);}) ){
				this.setAlert('斜線がないマスがあります。','There is a empty cell.'); return false;
			}

			return true;
		};

		ans.scntCross = function(id){
			if(id==-1){ return -1;}
			var xx=bd.cross[id].cx, xy=bd.cross[id].cy;
			var cc, cnt=0;
			cc=bd.cnum(xx-1,xy-1); if(cc!=-1 && bd.QaC(cc)==1){ cnt++;}
			cc=bd.cnum(xx  ,xy-1); if(cc!=-1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx-1,xy  ); if(cc!=-1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx  ,xy  ); if(cc!=-1 && bd.QaC(cc)==1){ cnt++;}
			return cnt;
		};
		ans.scntCross2 = function(id){
			if(id==-1){ return -1;}
			var xx=bd.cross[id].cx, xy=bd.cross[id].cy;
			var cc, cnt=0;
			cc=bd.cnum(xx-1,xy-1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==1){ cnt++;}
			cc=bd.cnum(xx  ,xy-1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx-1,xy  ); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx  ,xy  ); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==1){ cnt++;}
			return cnt;
		};

		ans.checkLoopLine = function(){
			var check = [], result = true;
			for(var i=0;i<bd.crossmax;i++){ check[i]=0;}

			while(1){
				var fc=-1;
				for(var i=0;i<bd.crossmax;i++){ if(check[i]==0){ fc=i; break;}}
				if(fc==-1){ break;}

				if(!this.searchline(check, 0, fc)){
					for(var c=0;c<bd.cellmax;c++){
						if(bd.QaC(c)==1 && check[bd.xnum(bd.cell[c].cx  ,bd.cell[c].cy)]==1){ bd.sErC([c],1);}
						if(bd.QaC(c)==2 && check[bd.xnum(bd.cell[c].cx+1,bd.cell[c].cy)]==1){ bd.sErC([c],1);}
					}
					while(1){
						var endflag = true;
						var clist = pc.cellinside_cond(0,0,k.qcols-1,k.qrows-1,function(c){ return (bd.ErC(c)==1);});
						for(var i=0;i<clist.length;i++){
							var c = clist[i];
							var cc1, cc2, cx=bd.cell[c].cx, cy=bd.cell[c].cy;
							if     (bd.QaC(c)==1){ cc1=bd.xnum(cx,cy  ); cc2=bd.xnum(cx+1,cy+1);}
							else if(bd.QaC(c)==2){ cc1=bd.xnum(cx,cy+1); cc2=bd.xnum(cx+1,cy  );}
							if(this.scntCross2(cc1)==1 || this.scntCross2(cc2)==1){ bd.sErC([c],0); endflag = false; break;}
						}
						if(endflag){ break;}
					}
					if(this.inAutoCheck){ return false;}
					result = false;
				}
				for(var c=0;c<bd.crossmax;c++){ if(check[c]==1){ check[c]=2;} }
			}
			return result;
		};
		ans.searchline = function(check, dir, c){
			var flag=true;
			var nc, tx=bd.cross[c].cx, ty=bd.cross[c].cy;
			check[c]=1;

			nc = bd.xnum(tx-1,ty-1);
			if(nc!=-1 && dir!=4 && bd.QaC(bd.cnum(tx-1,ty-1))==1 && (check[nc]!=0 || !this.searchline(check,1,nc))){ flag = false;}
			nc = bd.xnum(tx-1,ty+1);
			if(nc!=-1 && dir!=3 && bd.QaC(bd.cnum(tx-1,ty  ))==2 && (check[nc]!=0 || !this.searchline(check,2,nc))){ flag = false;}
			nc = bd.xnum(tx+1,ty-1);
			if(nc!=-1 && dir!=2 && bd.QaC(bd.cnum(tx  ,ty-1))==2 && (check[nc]!=0 || !this.searchline(check,3,nc))){ flag = false;}
			nc = bd.xnum(tx+1,ty+1);
			if(nc!=-1 && dir!=1 && bd.QaC(bd.cnum(tx  ,ty  ))==1 && (check[nc]!=0 || !this.searchline(check,4,nc))){ flag = false;}

			return flag;
		};

		ans.checkQnumCross = function(){
			var result = true;
			for(var c=0;c<bd.crossmax;c++){
				if(bd.QnX(c)>=0 && bd.QnX(c)!=this.scntCross(c)){
					if(this.inAutoCheck){ return false;}
					bd.sErX([c],1);
					result = false;
				}
			}
			return result;
		};
	}
};
