/*!
 * 贝塞尔曲线面板组件，根据参数绑定事件，拖动两个圆来修改贝塞尔曲线的参数，
 * 可通过getValue获取贝塞尔曲线的值
 */
(function(){
	var Bezier = function(options){
		var self = this;
		var svg = document.getElementById(options.svg);
		var path = document.getElementById(options.path);
		var line1 = document.getElementById(options.line1);
		var line2 = document.getElementById(options.line2);
		var circle1 = document.getElementById(options.circle1);
		var circle2 = document.getElementById(options.circle2);
		var body = document.body;
		var currentDom = 1;
		var tmpX = 0;
		var tmpY = 0;
		var mouseX = 0;
		var mouseY = 0;
		var otherX = parseInt(circle2.getAttribute("cx"));
		var otherY = parseInt(circle2.getAttribute("cy"));
		var newX = parseInt(circle1.getAttribute("cx"));
		var newY = parseInt(circle1.getAttribute("cy"));
		var translateX = options.translateX;
		var translateY = options.translateY;
		var d = '';

		this.value = calculateValue(newX,newY,otherX,otherY); //获取默认的值

		addEventListenerFunc(circle1,"mousedown",eventDownHandler);
		addEventListenerFunc(circle2,"mousedown",eventDownHandler);
		addEventListenerFunc(svg,"mousedown",eventClickHandler);

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
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				window.event.cancelBubble = true;
			}
			tmpX = parseInt(this.getAttribute("cx"));
			tmpY = parseInt(this.getAttribute("cy"));
			mouseX = event.clientX;
			mouseY = event.clientY;
			if(this.id==circle1.id){
				currentDom = 1;
				otherX = circle2.getAttribute("cx");
				otherY = circle2.getAttribute("cy");
			}else{
				currentDom = 2;
				otherX = circle1.getAttribute("cx");
				otherY = circle1.getAttribute("cy");
			}
	 		addEventListenerFunc(body,"mousemove",eventMoveHandler);
			addEventListenerFunc(body,"mouseup",eventUpHandler);
		}

		/**
		 * 鼠标移动时的事件处理
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function eventMoveHandler(event){
			newX = tmpX+event.clientX-mouseX;
			newY = tmpY+event.clientY-mouseY;
			if(newX<=0){
				newX = 0;
			}
			if(newX>=200){
				newX = 200;
			}
			if(currentDom===1){
				circle1.setAttribute("cx",newX);
				circle1.setAttribute("cy",newY);
				line1.setAttribute("x1",newX);
				line1.setAttribute("y1",newY);
				d = "M0 200 C"+newX+" "+newY+" "+otherX+" "+otherY+" 200 0";
			}else{
				circle2.setAttribute("cx",newX);
				circle2.setAttribute("cy",newY);
				line2.setAttribute("x1",newX);
				line2.setAttribute("y1",newY);
				d = "M0 200 C"+otherX+" "+otherY+" "+newX+" "+newY+" 200 0";
			}
			path.setAttribute("d",d);
		}

		/**
		 * 鼠标松开时的事件处理
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function eventUpHandler(event){
			self.value = calculateValue(newX,newY,otherX,otherY);
			removeEventListenerFunc(body,"mousemove",eventMoveHandler);
			removeEventListenerFunc(body,"mouseup",eventUpHandler);
		}

		/**
		 * 鼠标点击时的事件处理
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function eventClickHandler(event){
			var offsetX = event.offsetX - translateX;
			var offsetY = event.offsetY - translateY;
			var dis1 = Math.sqrt((offsetX-newX)*(offsetX-newX)+(offsetY-newY)*(offsetY-newY));
			var	dis2 = Math.sqrt((offsetX-otherX)*(offsetX-otherX)+(offsetY-otherY)*(offsetY-otherY));
			if(currentDom==1){
				if(dis1<=dis2){
					newX = offsetX;
					newY = offsetY;
					circle1.setAttribute("cx",newX);
					circle1.setAttribute("cy",newY);
					line1.setAttribute("x1",newX);
					line1.setAttribute("y1",newY);
					d = "M0 200 C"+newX+" "+newY+" "+otherX+" "+otherY+" 200 0";
				}else{
					currentDom=2;
					otherX = newX;
					otherY = newY;
					newX = offsetX;
					newY = offsetY;
					circle2.setAttribute("cx",newX);
					circle2.setAttribute("cy",newY);
					line2.setAttribute("x1",newX);
					line2.setAttribute("y1",newY);
					d = "M0 200 C"+otherX+" "+otherY+" "+newX+" "+newY+" 200 0";
				}
			}else{
				if(dis1<=dis2){
					newX = offsetX;
					newY = offsetY;
					circle2.setAttribute("cx",newX);
					circle2.setAttribute("cy",newY);
					line2.setAttribute("x1",newX);
					line2.setAttribute("y1",newY);
					d = "M0 200 C"+otherX+" "+otherY+" "+newX+" "+newY+" 200 0";
				}else{
					currentDom = 1;
					otherX = newX;
					otherY = newY;
					newX = offsetX;
					newY = offsetY;
					circle1.setAttribute("cx",newX);
					circle1.setAttribute("cy",newY);
					line1.setAttribute("x1",newX);
					line1.setAttribute("y1",newY);
					d = "M0 200 C"+newX+" "+newY+" "+otherX+" "+otherY+" 200 0";
				}
			}
			path.setAttribute("d",d);
		}

		/**
		 * 根据两个圆的位置，计算对应的贝塞尔曲线的参数
		 * @param  {[type]}
		 * @param  {[type]}
		 * @param  {[type]}
		 * @param  {[type]}
		 * @return {[type]}
		 */
		function calculateValue(newX,newY,otherX,otherY){
			var value = '';
			if(currentDom===1){
				value = "cubic-bezier("+parseFloat(newX/200).toFixed(2)+","+
				parseFloat(1-newY/200).toFixed(2)+","+parseFloat(otherX/200).toFixed(2)+","+
				parseFloat(1-otherY/200).toFixed(2)+")";
			}else{
				value = "cubic-bezier("+parseFloat(otherX/200).toFixed(2)+","+
				parseFloat(1-otherY/200).toFixed(2)+","+parseFloat(newX/200).toFixed(2)+","+
				parseFloat(1-newY/200).toFixed(2)+")";
			}
			return value;
		}
	};

	Bezier.prototype = {
		getValue: function(){
			console.log(this.value);
			return this.value;
		},
	};
	window.Bezier = Bezier;
})();