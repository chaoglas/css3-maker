/*!
 * 拖动条组件，根据配置参数绑定事件，监听拖动小块和点击事件来获取百分比的值，
 * 可通过getValue获取到值，getRealDom获取当前绑定事件的元素
 */

(function(){
	var Drag = function(opt){
		var self = this;
		this.value = opt.initLeft ? opt.initLeft : 0;

		var domId = opt.domId;
		var realDataDom = domId+"-real";
		var body = document.body;
		var dom = document.getElementById(domId);
		var dataDom = document.getElementById(domId+"-data");
		var dataValue = dataDom.firstChild;
		var parent = dom.parentNode;

		var tmpX = this.value; //记录位置的临时值
		var mouseX = 0;
		var timer = null; 

		updateStyle(self.value); //更新dom位置

		//添加事件监听的函数，可在外部调用
		this.addListener = function(){
			addEventListenerFunc(dom, "mousedown", eventDownHandler);
			addEventListenerFunc(parent,"mousedown",eventClickHandler);
		};

		//添加事件监听的函数，可在外部调用
		this.removeListener = function(){
			removeEventListenerFunc(dom, "mousedown", eventDownHandler);
			removeEventListenerFunc(parent,"mousedown",eventClickHandler);
		};

		//获取当前绑定的dom，可在外部调用
		this.getRealDataDom = function(){
			return realDataDom;
		};

		this.init(); //初始化组件

		/**
		 * 私有函数，对不同浏览器绑定事件
		 * @param {[type]}
		 * @param {[type]}
		 * @param {[type]}
		 */
		function addEventListenerFunc(dom,type,func){
			if(dom.addEventListener) { 
				dom.addEventListener(type,func, false); 
			} else if (dom.attachEvent) { 
				dom.attachEvent("on" + type, func); 
			}
		}

		/**
		 * 私有函数，对不同浏览器取消事件绑定
		 * @param  {[type]}
		 * @param  {[type]}
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function removeEventListenerFunc(dom,type,func){
			if(dom.removeEventListener) { 
				dom.removeEventListener(type,func, false); 
			} else if (dom.detachEvent) { 
				dom.detachEvent("on" + type, func); 
			}
		}

		/**
		 * 鼠标按下时的事件处理
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function eventDownHandler(event){
			event = event || window.event;
			if(event.stopPropagation){ //防止事件冒泡和进度条冲突
				event.stopPropagation();
			}else{
				window.event.cancelBubble = true;
			}

			tmpX = parseInt(event.target.style.left);
			mouseX = event.clientX;

			updateStyle(self.value);
			dataDom.style.display = "block";

	 		addEventListenerFunc(body,"mousemove",eventMoveHandler);
			addEventListenerFunc(body,"mouseup",eventUpHandler);
		}

		/**
		 * 鼠标移动时的事件处理
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function eventMoveHandler(event){
			self.value = tmpX+event.clientX-mouseX;
			if(self.value<=0) self.value=0;
			if(self.value>=100) self.value=100;
			updateStyle(self.value);
		}

		/**
		 * 鼠标松开时的事件处理
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function eventUpHandler(event){
			dataDom.style.display = "none";
			removeEventListenerFunc(body,"mousemove",eventMoveHandler);
			removeEventListenerFunc(body,"mouseup",eventUpHandler);
		}

		/**
		 * 鼠标点击时的事件处理
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function eventClickHandler(event){
			var offsetX = event.offsetX;
			if(offsetX>=0||offsetX<=100){
				self.value = offsetX;
			}
			if(offsetX>=100) self.value=100;

			updateStyle(self.value);
			dataDom.style.display = "block";

			//设置显示实时进度框，1s后自动隐藏
			if(timer)  window.clearTimeout(timer);
			timer = setTimeout(function(){
				dataDom.style.display="none";
			},1000);
		}

		/**
		 * 更新滑块的位置和实时数据
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function updateStyle(value){
			dom.style.left=value+"px";
			dataDom.style.left = (value-14)+"px";
			dataValue.innerHTML = value+"%";
		}

	};

	Drag.prototype = {
		init: function(){
			this.addListener(); 
		},
		getValue: function(){
			return this.value;
		},
		removeAll: function(){  
			this.removeListener();
		}
	};

	
	window.Drag = Drag;
})();