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