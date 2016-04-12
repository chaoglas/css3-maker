/*!
 * 此文件是主文件，获取操作的dom并绑定相应的事件
 *
 * 扩展css3的样式的方式为：
 * 1.在data.js中添加css配置数据
 * 2.创建此样式处理的专有函数，参考transitonEvent
 * 3.在addEventToDom中添加事件调用
 */

(function(){
	var resetBtn = document.getElementById("reset");
	var box = document.getElementById("box");
	var selectType = document.getElementById("style-select");
	var styleOptList = document.getElementById("style-opt-list");
	var article = document.getElementById("article");
	var bottomData = document.getElementById("bottom-view-realData");
	var bottomText = document.getElementById("bottom-view-text");
	var left = true; //判断box是否在左侧，默认设定为左侧，便于按钮点击时有位移动画效果

	var cssStyles = new CssStyles(); //创建配置文件实例

	updateCSSList(cssStyles.getList()); //获取配置文件所有的css样式
	addEventToDom("transition"); //绑定默认左部组件为transition

	/* 为顶部重设按钮绑定事件，可通过单击文本编辑内容来实现CSS3效果 */
	resetBtn.onclick = function(){
		var content = bottomData.textContent;
		var type = content.split(';');
		var style,styleName,styleValue;
		for(var i=0;i<type.length-1;i++){
			style = type[i].split(":");
			styleName = style[0].trim();
			styleValue = style[1];
			updateStyle(styleName,styleValue,box);

			/* 避免修改transition时没有动画演示*/
			if(styleName=="transition"){
				var transform = '';
				if(left){
					transform = "translate(240px,0)";
					left = false;
				}else{
					transform = "translate(-240px,0)";
					left = true;
				}
				updateStyle("transform",transform,box);
				updateStyle("transform",transform,box);
				updateBottom(styleName+": "+styleValue+";",true,true,true);
			}else if(styleName=="transform"){
				updateBottom(styleName+": "+styleValue+";",true,true,true);
			}else if(styleName=="box-shadow"){
				updateBottom(styleName+": "+styleValue+";",true,true);
			}else{
				updateBottom(styleName+": "+styleValue+";");
			}
		}
		if(type.length>=3){
			updateBottom(content);
		}
	};

	/* 监听样式类型，改变时重新设定左部组件 */
	selectType.onchange = function(){
		addEventToDom(this.value);
	};
	
	/**
	 * 重设css下拉选择框
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function updateCSSList(list){
		var dom = "";
		for(var i=0,len=list.length;i<len;i++){
			dom+='<option value="'+list[i]+'">'+list[i]+'</option>';
		}
		selectType.innerHTML = dom;
	}
	/** 
	 * 对左部组件添加事件监听
	 * @param {[type]}
	 */
	function addEventToDom(type){
		var data = cssStyles.getData(type); //加载配置文件的dom和待配置的对象列表
		styleOptList.innerHTML = data.dom;
		var eventList = data.eventList;
		
		var objList = {
			dragList:{},
			selectList:{}
		};

		for(var opt in eventList){
			if(eventList[opt].ifDrag){
				objList.dragList[opt] = new Drag(eventList[opt]); //创建拖动条组件
			}else if(eventList[opt].ifSelect){
				objList.selectList[opt] = eventList[opt]; //创建下拉选择框
			}else if(eventList[opt].ifBezier){
				objList.dragList[opt] = new Bezier(eventList[opt].options); //创建贝塞尔曲线面板
			}
		}

		/* 此处匹配不同的css3样式制定不同的处理方法 */
		switch (type){
			case "transition":
				transitionEvent(objList);
				changeArticleBackground("#000"); //切换到某个样式时修改展示区的背景
				break;
			case "transform":
				transformEvent(objList);
				changeArticleBackground("#000");
				break;
			case "border&radius":
				borderRadiusEvent(objList);
				changeArticleBackground("#000");
				break;
			case "box-shadow":
				boxShadowEvent(objList);
				changeArticleBackground("#fff");
				break;
			case "text-shadow":
				textShadowEvent(objList);
				changeArticleBackground("#fff");
				break;
			case "rgba":
				rgbaEvent(objList);
				changeArticleBackground("#fff");
				break;
		}
	}
	/**
	 * transition处理函数
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function transitionEvent(objList){
		
		updateStyle("transform","translate(-240px,0)",box);
		var btn = document.getElementById("btn");
		btn.onclick = function(){
			var bezier = '',
			duration = 0;
			var dragList = objList.dragList;
			for(var drag in dragList){
				switch(drag){
					case "bezier":
						bezier = dragList[drag].getValue(); //获取贝塞尔面板的实时值
						console.log(bezier);
						break;
					case "duration":
						duration = dragList[drag].getValue(); //获取拖动条的实时值
						duration /= 50;
						showRealData(dragList[drag].getRealDataDom(),duration+"s"); //获取显示实时值的dom，然后显示数据
						break;
				}
			}
			var transition = "All "+(duration)+"s "+bezier;
			var transform = '';
			if(left){
				transform = "translate(240px,0)";
				left = false;
			}else{
				transform = "translate(-240px,0)";
				left = true;
			}
			updateStyle("transition",transition,box);
			updateStyle("transform",transform,box);
			updateBottom("transition: "+transition+";",true,true,true);
		};
	}

	/**
	 * transform处理函数
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function transformEvent(objList){
		var btn = document.getElementById("btn");
		btn.onclick = function(){
			var duration=0,
			translateX=0,
			translateY=0,
			scale=0,
			rotate=0,
			skew=0,
			timing='';
			var dragList = objList.dragList;
			for(var drag in dragList){
				switch(drag){
					case "duration":
						duration = dragList[drag].getValue();
						duration /= 50;
						showRealData(dragList[drag].getRealDataDom(),duration+"s");
					break;
					case "translateX":
						translateX = dragList[drag].getValue();
						translateX = (translateX-50)*5;
						showRealData(dragList[drag].getRealDataDom(),translateX+"px");
					break;
					case "translateY":
						translateY = dragList[drag].getValue();
						translateY = (translateY-50)*3;
						showRealData(dragList[drag].getRealDataDom(),translateY+"px");
					break;
					case "scale":
						scale = dragList[drag].getValue();
						scale = scale/50;
						showRealData(dragList[drag].getRealDataDom(),scale);
					break;
					case "rotate":
						rotate = dragList[drag].getValue();
						rotate = parseInt((360/100)*rotate);
						showRealData(dragList[drag].getRealDataDom(),rotate+"°");
					break;
					case "skew":
						skew = dragList[drag].getValue();
						skew = parseInt((360/100)*skew);
						showRealData(dragList[drag].getRealDataDom(),skew+"°");
					break;

				}
			}
			var selectList = objList.selectList;
			for(var select in selectList){
				if(select=="timing"){
					timing = document.getElementById(selectList[select].domId).value;
				}
			}
			var transition = "All "+(duration)+"s "+timing;
			var transform = "rotate("+(rotate)+"deg) scale("+(scale)+") skew("+(skew)+"deg) translate("+
				(translateX)+"px,"+(translateY)+"px)";
			updateStyle("transition",transition,box);
			updateStyle("transform",transform,box);
			updateBottom("transform: "+transform+";",true,true,true);
		};
	}

	/**
	 * border-radius处理函数
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function borderRadiusEvent(objList){
		var btn = document.getElementById("btn");
		btn.onclick = function(){
			var radius = 0,
			width = 0,
			r = 0,
			g = 0,
			b = 0,
			opacity = 0,
			style = "";
			var dragList = objList.dragList;
			for(var drag in dragList){
				switch(drag){
					case "radius":
						radius = dragList[drag].getValue();
						radius /=2;
						showRealData(dragList[drag].getRealDataDom(),radius+"px");
						break;
					case "width":
						width = dragList[drag].getValue();
						width = parseInt(width/5);
						showRealData(dragList[drag].getRealDataDom(),width+"px");
						break;
					case "r":
						r = dragList[drag].getValue();
						r = parseInt((255/100)*r);
						showRealData(dragList[drag].getRealDataDom(),r);
						break;
					case "g":
						g = dragList[drag].getValue();
						g = parseInt((255/100)*g);
						showRealData(dragList[drag].getRealDataDom(),g);
						break;
					case "b":
						b = dragList[drag].getValue();
						b = parseInt((255/100)*b);
						showRealData(dragList[drag].getRealDataDom(),b);
						break;
					case "opacity":
						opacity = dragList[drag].getValue();
						opacity = opacity/100;
						showRealData(dragList[drag].getRealDataDom(),opacity);
						break;
				}
				
			}
			var selectList = objList.selectList;
			for(var select in selectList){
				if(select=="style"){
					style = document.getElementById(selectList[select].domId).value;
				}
			}
			
			var border = width+"px "+style+" rgba("+r+","+g+","+b+","+opacity+")";
			box.style.border = border;
			updateStyle("border-radius",radius+"px",box);
			updateStyle("border",border,box);
			updateBottom("border: "+border+"; border-radius: "+radius+"px;");
		};
		
	}

	/**
	 * boxShadow处理函数
	 * @param  {[type]}
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function boxShadowEvent(objList,type){
		var btn = document.getElementById("btn");
		btn.onclick = function(){
			var inset = '',
			offsetX = 0,
			offsetY = 0,
			blurRaidus = 0,
			spreadRaidus = 0,
			r = 0,
			g = 0,
			b = 0,
			opacity = 0;
			var dragList = objList.dragList;
			for(var drag in dragList){
				switch(drag){
					case "x-offset":
						offsetX = dragList[drag].getValue();
						offsetX = (offsetX-50)/2;
						showRealData(dragList[drag].getRealDataDom(),offsetX+"px");
						break;
					case "y-offset":
						offsetY = dragList[drag].getValue();
						offsetY = (offsetY-50)/2;
						showRealData(dragList[drag].getRealDataDom(),offsetY+"px");
						break;
					case "blur-radius":
						blurRaidus = dragList[drag].getValue();
						blurRaidus /=2;
						showRealData(dragList[drag].getRealDataDom(),blurRaidus+"px");
						break;
					case "spread-radius":
						spreadRaidus = dragList[drag].getValue();
						spreadRaidus = (spreadRaidus-50)/2;
						showRealData(dragList[drag].getRealDataDom(),spreadRaidus+"px");
						break;
					case "r":
						r = dragList[drag].getValue();
						r = parseInt((255/100)*r);
						showRealData(dragList[drag].getRealDataDom(),r);
						break;
					case "g":
						g = dragList[drag].getValue();
						g = parseInt((255/100)*g);
						showRealData(dragList[drag].getRealDataDom(),g);
						break;
					case "b":
						b = dragList[drag].getValue();
						b = parseInt((255/100)*b);
						showRealData(dragList[drag].getRealDataDom(),b);
						break;
					case "opacity":
						opacity = dragList[drag].getValue();
						opacity = opacity/100;
						showRealData(dragList[drag].getRealDataDom(),opacity);
						break;
				}
				
			}
			var selectList = objList.selectList;
			for(var select in selectList){
				if(select=="inset"){
					inset = document.getElementById(selectList[select].domId).value;
					if(inset=="no") inset="";
				}
			}

			var boxShadow = inset+" "+offsetX+"px "+offsetY+"px "+blurRaidus+"px "+
				spreadRaidus+"px rgba("+r+","+g+","+b+","+opacity+")";
			updateStyle("box-shadow",boxShadow,box);	
			updateBottom("box-shadow: "+boxShadow+";",true,true);
		};
	}

	/**
	 * text-shadow处理函数
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function textShadowEvent(objList){
		var btn = document.getElementById("btn");
		btn.onclick = function(){
			var offsetX = 0,
			offsetY = 0,
			blurRaidus = 0,
			r = 0,
			g = 0,
			b = 0,
			opacity = 0;
			var dragList = objList.dragList;
			for(var drag in dragList){
				switch(drag){
					case "x-offset":
						offsetX = dragList[drag].getValue();
						offsetX = (offsetX-50)/2;
						showRealData(dragList[drag].getRealDataDom(),offsetX+"px");
						break;
					case "y-offset":
						offsetY = dragList[drag].getValue();
						offsetY = (offsetY-50)/2;
						showRealData(dragList[drag].getRealDataDom(),offsetY+"px");
						break;
					case "blur-radius":
						blurRaidus = dragList[drag].getValue();
						blurRaidus /=10;
						showRealData(dragList[drag].getRealDataDom(),blurRaidus+"px");
						break;
					case "r":
						r = dragList[drag].getValue();
						r = parseInt((255/100)*r);
						showRealData(dragList[drag].getRealDataDom(),r);
						break;
					case "g":
						g = dragList[drag].getValue();
						g = parseInt((255/100)*g);
						showRealData(dragList[drag].getRealDataDom(),g);
						break;
					case "b":
						b = dragList[drag].getValue();
						b = parseInt((255/100)*b);
						showRealData(dragList[drag].getRealDataDom(),b);
						break;
					case "opacity":
						opacity = dragList[drag].getValue();
						opacity = opacity/100;
						showRealData(dragList[drag].getRealDataDom(),opacity);
						break;
				}
				
			}
			var textShadow = offsetX+"px "+offsetY+"px "+blurRaidus+"px "+
				"rgba("+r+","+g+","+b+","+opacity+")";
			updateStyle("text-shadow",textShadow,box);
			updateBottom("text-shadow: "+textShadow+";");
		};
	}

	function rgbaEvent(objList){
		var btn = document.getElementById("btn");
		btn.onclick = function(){
			var r = 0,
			g = 0,
			b = 0,
			opacity = 0;
			var dragList = objList.dragList;
			for(var drag in dragList){
				switch(drag){
					case "r":
						r = dragList[drag].getValue();
						r = parseInt((255/100)*r);
						showRealData(dragList[drag].getRealDataDom(),r);
						break;
					case "g":
						g = dragList[drag].getValue();
						g = parseInt((255/100)*g);
						showRealData(dragList[drag].getRealDataDom(),g);
						break;
					case "b":
						b = dragList[drag].getValue();
						b = parseInt((255/100)*b);
						showRealData(dragList[drag].getRealDataDom(),b);
						break;
					case "opacity":
						opacity = dragList[drag].getValue();
						opacity = opacity/100;
						showRealData(dragList[drag].getRealDataDom(),opacity);
						break;
				}
				
			}
			var background = "rgba("+r+","+g+","+b+","+opacity+")";
			updateStyle("background-color",background,box);
			updateBottom("background-color: "+background+";");
		};
	}

	/**
	 * 用于在点击确定按钮时显示每个参数的最终的值
	 * @param  {String} 显示数值的dom的id
	 * @param  {String} 数值
	 * @return {[type]}
	 */
	function showRealData(domId,value){
		var dom = document.getElementById(domId);
		dom.innerHTML = value;
		dom.style.display = "block";
	}

	/**
	 * 更新box的style
	 * @param  {String} style类型
	 * @param  {String} style的值
	 * @param  {Object} 待更新的dom
	 * @return {[type]}
	 */
	function updateStyle(type,value,dom){
		if(type=="transition处理函数"||type=="transform"||type=="box-shadow"||type=="border-radius"){
			dom.style['-webkit-'+type] = value;
			dom.style['-moz-'+type] = value;
			dom.style['-o-'+type] = value;
		}
		dom.style[type] = value;
	}

	/**
	 * 设置有部面板和方块的背景颜色
	 * @param  {String} 默认为 #FFF,即方块为白，背景为黑
	 * @return {[type]}
	 */
	function changeArticleBackground(type){
		if(type=="#000"){
			article.style.background = "rgba(0,0,0,0.5)";
			box.style.background ="rgba(255,255,255,1)";
			box.style.color ="#000";
		}else{
			article.style.background = "rgba(255,255,255,1)";
			box.style.background ="rgba(0,0,0,0.5)";
			box.style.color ="#fff";
		}
	}

	/**
	 * 更新顶部可编辑区的内容
	 * @param  {String} 待更新的内容
	 * @return {[type]}
	 */
	function updateBottom(data,isWebkit,isMoz,isO){
		bottomData.innerHTML=data;
		var inner = '';
		if(isWebkit){
			inner+= '-webkit-'+data+"<br>";
		}
		if(isMoz){
			inner+= '-moz-'+data+"<br>";
		}
		if(isO){
			inner+= '-o-'+data+"<br>";
		}
		inner+=data;
		bottomText.innerHTML = inner;
	}
})();