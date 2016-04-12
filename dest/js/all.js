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
/*!
 * 此文件为配置文件，包含切换css是的dom元素，以及需要绑定事件的列表
 * 
 * 若添加新的数据，首先将css名称加入cssArr中，然后按如下格式编辑内容添加到list中：
 * 
 * list:{
 *     dom: 需要替换的dom,
 *     eventList: {
 *         css属性名(如：duration): {
 *             ifDrag: true （ifDrag绑定拖动条，ifSelect绑定下拉框，isBezier，绑定贝塞尔面板）
 *             domId: 待绑定事件监听的dom的id
 *             type: "css属性类型" （暂时没用到，新版本实时数据监听会使用）
 *             initLeft: 初始的拖动条的位置（0-100）
 *             options: 贝塞尔面板的绑定事件的dom列表
 *         }
 *     }
 * }
 */
(function(){
	
	var CssStyles = function(){

		var cssArr = ["transition","transform","border&radius","box-shadow","text-shadow","rgba"];

		var list = {
			"transition": {
				dom: '<li>'+
					'<label>duration: </label>'+
					'<div class="slide-widget">'+
						'<div id="transition-duration" class="slide-widget-block"></div>'+
						'<div class="silde-widget-data" id="transition-duration-data">'+
							'<span>0.0</span><div class="triangle"></div>'+
						'</div>'+
					'</div>'+
					'<div class="slide-widget-real" id="transition-duration-real"></div>'+
				'</li>'+
				'<svg class="svg" id="svg" width="240" height="360">'+
					'<g transform="translate(20,80)">'+
						'<polygon fill="#fff" points="0,0 200,0 200,200 0,200"></polygon>'+
						'<text x="10" y="220" fill="white" font-size="12px">time</text>'+
						'<text x="10" y="190" fill="white" font-size="12px" transform="rotate(270 0,200)">progression</text>'+
						'<line x1="1" y1="0" x2="1" y2="200" stroke="red" stroke-width="1"></line>'+
						'<line x1="0" y1="199" x2="200" y2="199" stroke="blue" stroke-width="1"></line>'+
						'<line x1="0" y1="200" x2="200" y2="0" stroke="#f0f0f0" stroke-width="6"></line>'+
						'<path id="path" d="M0 200 C34 66 166 66 200 0" fill="none" stroke="black" stroke-width="4"></path>'+
						'<line id="line1" x1="34" y1="66" x2="0" y2="200" stroke="#666" stroke-width="2"></line>'+
						'<line id="line2" x1="166" y1="66" x2="200" y2="0" stroke="#666" stroke-width="2"></line>'+
						'<circle cx="0" cy="200" r="8" fill="white" stroke="gray" stroke-width="1"></circle>'+
						'<circle cx="200" cy="0" r="8" fill="white" stroke="gray" stroke-width="1"></circle>'+
						'<circle id="circle1" cx="34" cy="66" r="8" fill="#ff0088" stroke="gray" stroke-width="1"></circle>'+
						'<circle id="circle2" cx="166" cy="66" r="8" fill="#00aabb" stroke="gray" stroke-width="1"></circle>'+
					'</g>'+
				'</svg>'+
				'<li>'+
					'<button id="btn" class="svg-btn">确定</button>'+
				'</li>',
				eventList:{
					bezier:{
						ifBezier:true,
						options:{
							svg: 'svg',
							path: 'path',
							line1: 'line1',
							line2: 'line2',
							circle1: 'circle1',
							circle2: 'circle2',
							translateX: 20,
							translateY: 80
						}
					},
					duration: {
						ifDrag: true,
						domId: 'transition-duration',
						type: "duration",
						initLeft: 50,
					}
				}
			},
			"transform": {
				"dom": '<li>'+
					'<label>timing: </label>'+
					'<select class="style-select" id="transition-timing">'+
						'<option value="linear">linear</option>'+
						'<option value="ease">ease</option>'+
						'<option value="ease-in">ease-in</option>'+
						'<option value="ease-out">ease-out</option>'+
						'<option value="ease-in-out">ease-in-out</option>'+
					'</select>'+
				'</li>'+
				'<li>'+
					'<label>duration: </label>'+
					'<div class="slide-widget">'+
						'<div id="transform-duration" class="slide-widget-block"></div>'+
						'<div class="silde-widget-data" id="transform-duration-data">'+
							'<span>0.0</span><div class="triangle"></div>'+
						'</div>'+
					'</div>'+
					'<div class="slide-widget-real" id="transform-duration-real"></div>'+
				'</li>'+
				'<li>'+
					'<label>translateX: </label>'+
					'<div class="slide-widget">'+
						'<div id="transform-translateX" class="slide-widget-block"></div>'+
						'<div class="silde-widget-data" id="transform-translateX-data">'+
							'<span>0.0</span><div class="triangle"></div></div>'+
					'</div>'+
					'<div class="slide-widget-real" id="transform-translateX-real"></div>'+
				'</li>'+
				'<li>'+
					'<label>translateY: </label>'+
					'<div class="slide-widget">'+
						'<div id="transform-translateY" class="slide-widget-block"></div>'+
						'<div class="silde-widget-data" id="transform-translateY-data">'+
							'<span>0.0</span><div class="triangle"></div></div>'+
					'</div>'+
					'<div class="slide-widget-real" id="transform-translateY-real"></div>'+
				'</li>'+
				'<li>'+
					'<label>rotate: </label>'+
					'<div class="slide-widget">'+
						'<div id="transform-rotate" class="slide-widget-block"></div>'+
						'<div class="silde-widget-data" id="transform-rotate-data">'+
							'<span>0.0</span><div class="triangle"></div></div>'+
					'</div>'+
					'<div class="slide-widget-real" id="transform-rotate-real"></div>'+
				'</li>'+
				'<li>'+
					'<label>scale: </label>'+
					'<div class="slide-widget">'+
						'<div id="transform-scale" class="slide-widget-block"></div>'+
						'<div class="silde-widget-data" id="transform-scale-data">'+
							'<span>0.0</span><div class="triangle"></div></div>'+
					'</div>'+
					'<div class="slide-widget-real" id="transform-scale-real"></div>'+
				'</li>'+
				'<li>'+
					'<label>skew: </label>'+
					'<div class="slide-widget">'+
						'<div id="transform-skew" class="slide-widget-block"></div>'+
						'<div class="silde-widget-data" id="transform-skew-data">'+
							'<span>0.0</span><div class="triangle"></div></div>'+
					'</div>'+
					'<div class="slide-widget-real" id="transform-skew-real"></div>'+
				'</li>'+
				'<li>'+
					'<button id="btn">确定</button>'+
				'</li>',

				eventList: {
					timing:{
						ifSelect:true,
						domId: 'transition-timing',
						type:"timing",
					},
					duration: {
						ifDrag: true,
						domId: 'transform-duration',
						type: "duration",
						initLeft: 50,
					},
					translateX: {
						ifDrag: true,
						domId: 'transform-translateX',
						initLeft: 50,
						type: "translateX",
					},
					translateY: {
						ifDrag: true,
						domId: 'transform-translateY',
						type: "translateY",
						initLeft: 50,
					},
					rotate: {
						ifDrag: true,
						domId: 'transform-rotate',
						type: "rotate",
						initLeft: 0,
					},
					scale: {
						ifDrag: true,
						domId: 'transform-scale',
						type: "scale",
						initLeft: 50,
					},
					skew: {
						ifDrag: true,
						domId: 'transform-skew',
						type: "skew",
						initLeft: 0,
					}
				}

			},
			"border&radius": {
				dom: '<li>'+
						'<label>style: </label>'+
						'<select class="style-select" id="border-type">'+
							'<option value="solid">solid</option>'+
							'<option value="dashed">dashed</option>'+
							'<option value="double">double</option>'+
							'<option value="groove">groove</option>'+
							'<option value="ridge">ridge</option>'+
							'<option value="inset">inset</option>'+
							'<option value="outset">outset</option>'+
							'<option value="none">none</option>'+
						'</select>'+
					'</li>'+
					'<li>'+
						'<label>width: </label>'+
						'<div class="slide-widget">'+
							'<div id="border-width" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="border-width-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="border-width-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>radius: </label>'+
						'<div class="slide-widget">'+
							'<div id="radius-size" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="radius-size-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="radius-size-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color r: </label>'+
						'<div class="slide-widget">'+
							'<div id="color-r" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="color-r-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="color-r-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color g: </label>'+
						'<div class="slide-widget">'+
							'<div id="color-g" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="color-g-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="color-g-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color b: </label>'+
						'<div class="slide-widget">'+
							'<div id="color-b" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="color-b-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="color-b-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>opacity: </label>'+
						'<div class="slide-widget">'+
							'<div id="color-opacity" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="color-opacity-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="color-opacity-real"></div>'+
					'</li>'+
					'<li>'+
						'<button id="btn">确定</button>'+
					'</li>',
				eventList:{

					style: {
						ifSelect:true,
						domId: 'border-type',
						type:"borderStyle",
					},
					radius: {
						ifDrag: true,
						domId: 'radius-size',
						type: "radius",
						initLeft: 0,
					},
					width: {
						ifDrag:true,
						domId: 'border-width',
						type: "borderWidth",
						initLeft:0,

					},

					r: {
						ifDrag:true,
						domId: 'color-r',
						type: "colorR",
						initLeft:0,
					},
					g: {
						ifDrag:true,
						domId: 'color-g',
						type: "colorG",
						initLeft:0,
					},
					b: {
						ifDrag: true,
						domId: 'color-b',
						type: "colorB",
						initLeft:0,
					},
					opacity: {
						ifDrag: true,
						domId: 'color-opacity',
						type: "colorOpacity",
						initLeft:100,
					}
				},
			},
			"box-shadow": {
				dom: '<li>'+
						'<label>inset: </label>'+
						'<select class="style-select" id="box-shadow-type">'+
							'<option value="no">no</option>'+
							'<option value="inset">inset</option>'+
						'</select>'+
					'</li>'+
					'<li>'+
						'<label>x-offset: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-x" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-x-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-x-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>y-offset: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-y" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-y-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-y-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>blur-radius: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-blur" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-blur-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-blur-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>spread-radius: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-spread" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-spread-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-spread-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color r: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-color-r" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-color-r-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-color-r-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color g: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-color-g" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-color-g-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-color-g-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color b: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-color-b" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-color-b-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-color-b-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>opacity: </label>'+
						'<div class="slide-widget">'+
							'<div id="box-shadow-color-opacity" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="box-shadow-color-opacity-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="box-shadow-color-opacity-real"></div>'+
					'</li>'+
					'<li>'+
						'<button id="btn">确定</button>'+
					'</li>',
				eventList: {
					inset: {
						ifSelect:true,
						domId: 'box-shadow-type',
						type:"boxShadowType",
					},
					"x-offset": {
						ifDrag: true,
						domId: 'box-shadow-x',
						type: "boxShadowOffsetX",
						initLeft: 0,
					},
					"y-offset": {
						ifDrag:true,
						domId: 'box-shadow-y',
						type: "boxShadowOffsetY",
						initLeft:0,
					},
					"blur-radius": {
						ifDrag: true,
						domId: 'box-shadow-blur',
						type: "boxShadowBlurRaidus",
						initLeft: 0,
					},
					"spread-radius": {
						ifDrag:true,
						domId: 'box-shadow-spread',
						type: "boxShadowSpreadRadius",
						initLeft:50,
					},
					r: {
						ifDrag:true,
						domId: 'box-shadow-color-r',
						type: "colorR",
						initLeft:0,
					},
					g: {
						ifDrag:true,
						domId: 'box-shadow-color-g',
						type: "colorG",
						initLeft:0,
					},
					b: {
						ifDrag: true,
						domId: 'box-shadow-color-b',
						type: "colorB",
						initLeft:0,
					},
					opacity: {
						ifDrag: true,
						domId: 'box-shadow-color-opacity',
						type: "colorOpacity",
						initLeft:100,
					}
				}
			},
			"text-shadow": {
				dom: '<li>'+
						'<label>x-offset: </label>'+
						'<div class="slide-widget">'+
							'<div id="text-shadow-x" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="text-shadow-x-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="text-shadow-x-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>y-offset: </label>'+
						'<div class="slide-widget">'+
							'<div id="text-shadow-y" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="text-shadow-y-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="text-shadow-y-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>blur-radius: </label>'+
						'<div class="slide-widget">'+
							'<div id="text-shadow-blur" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="text-shadow-blur-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="text-shadow-blur-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color r: </label>'+
						'<div class="slide-widget">'+
							'<div id="text-shadow-color-r" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="text-shadow-color-r-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="text-shadow-color-r-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color g: </label>'+
						'<div class="slide-widget">'+
							'<div id="text-shadow-color-g" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="text-shadow-color-g-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="text-shadow-color-g-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color b: </label>'+
						'<div class="slide-widget">'+
							'<div id="text-shadow-color-b" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="text-shadow-color-b-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="text-shadow-color-b-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>opacity: </label>'+
						'<div class="slide-widget">'+
							'<div id="text-shadow-color-opacity" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="text-shadow-color-opacity-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="text-shadow-color-opacity-real"></div>'+
					'</li>'+
					'<li>'+
						'<button id="btn">确定</button>'+
					'</li>',
				eventList: {
					
					"x-offset": {
						ifDrag: true,
						domId: 'text-shadow-x',
						type: "textShadowOffsetX",
						initLeft: 0,
					},
					"y-offset": {
						ifDrag:true,
						domId: 'text-shadow-y',
						type: "textShadowOffsetY",
						initLeft:0,
					},
					"blur-radius": {
						ifDrag: true,
						domId: 'text-shadow-blur',
						type: "textShadowBlurRaidus",
						initLeft: 0,
					},
					
					r: {
						ifDrag:true,
						domId: 'text-shadow-color-r',
						type: "colorR",
						initLeft:0,
					},
					g: {
						ifDrag:true,
						domId: 'text-shadow-color-g',
						type: "colorG",
						initLeft:0,
					},
					b: {
						ifDrag: true,
						domId: 'text-shadow-color-b',
						type: "colorB",
						initLeft:0,
					},
					opacity: {
						ifDrag: true,
						domId: 'text-shadow-color-opacity',
						type: "colorOpacity",
						initLeft:100,
					}
				}
			},
			"rgba": {
				dom: '<li>'+
						'<label>color r: </label>'+
						'<div class="slide-widget">'+
							'<div id="rgba-color-r" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="rgba-color-r-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="rgba-color-r-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color g: </label>'+
						'<div class="slide-widget">'+
							'<div id="rgba-color-g" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="rgba-color-g-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="rgba-color-g-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>color b: </label>'+
						'<div class="slide-widget">'+
							'<div id="rgba-color-b" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="rgba-color-b-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="rgba-color-b-real"></div>'+
					'</li>'+
					'<li>'+
						'<label>opacity: </label>'+
						'<div class="slide-widget">'+
							'<div id="rgba-color-opacity" class="slide-widget-block"></div>'+
							'<div class="silde-widget-data" id="rgba-color-opacity-data">'+
								'<span>0.0</span><div class="triangle"></div>'+
							'</div>'+
						'</div>'+
						'<div class="slide-widget-real" id="rgba-color-opacity-real"></div>'+
					'</li>'+
					'<li>'+
						'<button id="btn">确定</button>'+
					'</li>',
				eventList: {
					r: {
						ifDrag:true,
						domId: 'rgba-color-r',
						type: "colorR",
						initLeft:0,
					},
					g: {
						ifDrag:true,
						domId: 'rgba-color-g',
						type: "colorG",
						initLeft:0,
					},
					b: {
						ifDrag: true,
						domId: 'rgba-color-b',
						type: "colorB",
						initLeft:0,
					},
					opacity: {
						ifDrag: true,
						domId: 'rgba-color-opacity',
						type: "colorOpacity",
						initLeft:100,
					}
				}
			}
		};
		this.getData = function(name){
			return list[name];
		};
		this.getList = function(){
			return cssArr;
		};
	};
	window.CssStyles = CssStyles;
})();
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