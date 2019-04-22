/* test_yajilin.js */

ui.debug.addDebugData('yajilin', {
	url : '5/5/m32j10',
	failcheck : [
		['lnBranch',  "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /1 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
		['lnCross',   "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /0 0 1 0 /1 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 1 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
		['lnOnShade', "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . # . /. . . . . /# . # . . /. . . . . /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
		['csAdjacent',"pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . . /# . # . . /. . # . . /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
		['anShadeNe', "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . . . + /. . + . + /. . . # . /1 1 -1 1 /1 -1 1 -1 /0 0 0 -1 /1 -1 1 1 /1 1 0 0 /1 -1 1 1 1 /0 1 0 0 1 /0 1 0 0 1 /1 -1 1 0 0 /"],
		['lnDeadEnd', "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
		['lnPlLoop',  "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . . . /1 1 0 1 /1 1 0 1 /0 0 0 0 /0 0 1 0 /0 0 1 0 /1 0 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 1 0 /"],
		['ceEmpty',   "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 1 0 1 /0 0 1 0 /1 0 1 1 1 /0 1 0 0 1 /0 1 0 0 1 /0 0 1 1 0 /"],
		[null,        "pzprv3/yajilin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . # . /1 1 -1 1 /1 -1 1 -1 /0 0 0 -1 /1 -1 1 1 /1 1 0 0 /1 -1 1 1 1 /0 1 0 0 1 /0 1 0 0 1 /1 -1 1 0 0 /"]
	],
	inputs : [
		/* 回答入力テスト */
		{ input:["newboard,5,2", "playmode"] },
		{ input:["mouse,left, 5,1", "mouse,right, 7,1", "mouse,left, 1,1, 9,1, 9,3, 1,3, 1,1", "mouse,right, 9,1"],
		  result:"pzprv3/yajilin/2/5/. . . . . /. . . . . /. . # + . /. . . . . /1 0 0 1 /1 1 1 1 /1 0 0 0 1 /"},
		{ input:["mouse,left, 1,3", "mouse,right, 3,1, 7,1"],
		  result:"pzprv3/yajilin/2/5/. . . . . /. . . . . /. . + + . /. . . . . /1 0 0 1 /1 1 1 1 /1 0 0 0 1 /"},
		/* 問題入力はyajikazuと同じなので省略 */
		{ input:["newboard,4,1", "playmode"] },
		{ input:["mouse,left, 3,1"],
		  result:"pzprv3/yajilin/1/4/. . . . /. # . . /0 0 0 /"},
		{ input:["mouse,left, 1,1, 7,1"],
		  result:"pzprv3/yajilin/1/4/. . . . /. # . . /0 0 1 /"},
		{ input:["ansclear", "mouse,left, 3,1"],
		  result:"pzprv3/yajilin/1/4/. . . . /. # . . /0 0 0 /"},
		{ input:["mouse,left, 1,1, 5,1"],
		  result:"pzprv3/yajilin/1/4/. . . . /. # . . /0 0 0 /"}
	]
});