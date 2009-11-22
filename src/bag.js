//
// パズル固有スクリプト部 バッグ版 bag.js v3.2.3
//
Puzzles.bag = function(){ };
Puzzles.bag.prototype = {
	setting : function(){
		// グローバル変数の初期設定
		if(!k.qcols){ k.qcols = 10;}	// 盤面の横幅
		if(!k.qrows){ k.qrows = 10;}	// 盤面の縦幅
		k.irowake = 0;			// 0:色分け設定無し 1:色分けしない 2:色分けする

		k.iscross      = 0;		// 1:Crossが操作可能なパズル
		k.isborder     = 1;		// 1:Border/Lineが操作可能なパズル
		k.isextendcell = 0;		// 1:上・左側にセルを用意するパズル 2:四方にセルを用意するパズル

		k.isoutsidecross  = 0;	// 1:外枠上にCrossの配置があるパズル
		k.isoutsideborder = 1;	// 1:盤面の外枠上にborderのIDを用意する
		k.isLineCross     = 0;	// 1:線が交差するパズル
		k.isCenterLine    = 0;	// 1:マスの真ん中を通る線を回答として入力するパズル
		k.isborderAsLine  = 1;	// 1:境界線をlineとして扱う

		k.dispzero      = 0;	// 1:0を表示するかどうか
		k.isDispHatena  = 1;	// 1:qnumが-2のときに？を表示する
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

		k.fstruct = ["cellqnum","cellqsub","borderans2"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// areaオブジェクトで領域を生成する

		base.setTitle("バッグ", "BAG");
		base.setExpression("　左ドラッグで線が、右クリックでセルの背景色(緑/黄色)が入力できます。",
						   " Left Button Drag to input lines, Right Click to input background color (lime or yellow) of the cell.");
		base.setFloatbgcolor("rgb(160, 0, 0)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//入力系関数オーバーライド
	input_init : function(){
		// マウス入力系
		mv.mousedown = function(){
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputBGcolor();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputBGcolor();
			}
		};
		mv.inputBGcolor = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){
				if     (bd.QsC(cc)==0){ this.inputData=1;}
				else if(bd.QsC(cc)==1){ this.inputData=2;}
				else                  { this.inputData=0;}
			}
			bd.sQsC(cc, this.inputData);

			this.mouseCell = cc; 

			pc.paintCell(cc);
		};

		// キーボード入力系
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.nummaxfunc = function(cc){ return Math.min(bd.maxnum,k.qcols+k.qrows-1);};
	},

	//---------------------------------------------------------
	//画像表示系関数オーバーライド
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;
		pc.setBGCellColorFunc('qsub2');

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBordersAsLine(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URLエンコード/デコード処理
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeNumber16(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeNumber16();
		};
	},

	//---------------------------------------------------------
	// 正解判定処理実行部
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCross(3,0) ){
				this.setAlert('分岐している線があります。', 'There is a branch line.'); return false;
			}
			if( !this.checkLcntCross(4,0) ){
				this.setAlert('線が交差しています。', 'There is a crossing line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('輪っかが一つではありません。','There are two or more loops.'); return false;
			}

			if( !this.checkLcntCross(1,0) ){
				this.setAlert('途中で途切れている線があります。', 'There is a dead-end line.'); return false;
			}

			var icheck = this.generateIarea();
			if( !this.checkNumberInside(icheck) ){
				this.setAlert('輪の内側に入っていない数字があります。','There is an outside number.'); return false;
			}
			if( !this.checkCellNumber(icheck) ){
				this.setAlert('数字と輪の内側になる4方向のマスの合計が違います。','The number and the sum of the inside cells of four direction is different.'); return false;
			}

			return true;
		};

		ans.generateIarea = function(){
			var icheck = [];
			var cx, cy;
			icheck[0]=(line.lcntCell(0)==0?-1:1);
			for(cy=0;cy<k.qrows;cy++){
				if(cy>0){ icheck[bd.cnum(0,cy)]=icheck[bd.cnum(0,cy-1)]*(bd.isLine(bd.bnum(1,cy*2))?-1:1);}
				for(cx=1;cx<k.qcols;cx++){
					icheck[bd.cnum(cx,cy)]=icheck[bd.cnum(cx-1,cy)]*(bd.isLine(bd.bnum(cx*2,cy*2+1))?-1:1);
				}
			}
			return icheck;
		};
		ans.checkNumberInside = function(icheck){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(icheck[c]==-1 && bd.QnC(c)!=-1){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c],1);
					result = false;
				}
			}
			return result;
		};
		ans.checkCellNumber = function(icheck){
			var result = true;
			for(var cc=0;cc<bd.cellmax;cc++){
				if(bd.QnC(cc)<0){ continue;}

				var list = [];
				list.push(cc);
				var cnt = 1;
				var tx, ty;
				tx = bd.cell[cc].cx-1; ty = bd.cell[cc].cy;
				while(tx>=0)     { var c=bd.cnum(tx,ty); if(icheck[c]!=-1){ cnt++; list.push(c); tx--;} else{ break;} }
				tx = bd.cell[cc].cx+1; ty = bd.cell[cc].cy;
				while(tx<k.qcols){ var c=bd.cnum(tx,ty); if(icheck[c]!=-1){ cnt++; list.push(c); tx++;} else{ break;} }
				tx = bd.cell[cc].cx; ty = bd.cell[cc].cy-1;
				while(ty>=0)     { var c=bd.cnum(tx,ty); if(icheck[c]!=-1){ cnt++; list.push(c); ty--;} else{ break;} }
				tx = bd.cell[cc].cx; ty = bd.cell[cc].cy+1;
				while(ty<k.qrows){ var c=bd.cnum(tx,ty); if(icheck[c]!=-1){ cnt++; list.push(c); ty++;} else{ break;} }

				if(bd.QnC(cc)!=cnt){
					if(this.inAutoCheck){ return false;}
					bd.sErC(list,1);
					result = false;
				}
			}
			return result;
		};
	}
};
