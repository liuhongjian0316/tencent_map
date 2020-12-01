//地图实例
var map, area
 
 //自定义DOM覆盖物
 function heatInfo(options){
	var mydom;
	TMap.DOMOverlay.call(this, options);
 }
 heatInfo.prototype = new TMap.DOMOverlay();
 // 初始化
 heatInfo.prototype.onInit = function(options) {
	 this.position = options.position;
	 this.content = options.content;
 };
 // 创建DOM元素，返回一个DOMElement
 heatInfo.prototype.createDOM = function() {
	 mydom=document.createElement("div");
	 //设置DOM样式
	 mydom.style.cssText = 'height:15px;max-width:120px;padding:5px;background:#fff;border:#ccc solid 1px;\
						 line-height:15px;font-size:12px;position:absolute;top:0px;left:0px;';
	 mydom.innerHTML=this.content;
	 return mydom;
 };
 // 更新DOM元素，在地图移动/缩放后执行
 heatInfo.prototype.updateDOM = function() {
	 if (!this.map) {
		 return;
	 }
  
	 // 经纬度坐标转容器像素坐标
	 let pixel = this.map.projectToContainer(this.position);
  
	 //默认使用DOM左上角作为坐标焦点进行绘制（左上对齐）
	 //如想以DOM中心点（横向&垂直居中）或其它位置为焦点，可结合this.dom.clientWidth和this.dom.clientHeight自行计算
	 let left = pixel.getX() - this.dom.clientWidth / 2 + 'px'; //本例水平居中
	 let top = pixel.getY() + 'px';
	  
	 //将平面坐标转为三维空间坐标
	 this.dom.style.transform = `translate3d(${left}, ${top}, 0px)`;
 };
 //更新内容 
 heatInfo.prototype.updateContent = function(content) {
	 mydom.innerHTML=content;
 };
 
 
 
 //地图初始化
 function initMap(dom,lat,lng,areaDatas,heatData,clickFunc,hoverFunc) {
	 var center = new TMap.LatLng(lat,lng);
	 
	 //初始化地图
	 map = new TMap.Map(dom, {
	   zoom: 19.0, //设置地图缩放级别
	   center: center, //设置地图中心点坐标
	   pitch: 43.5,  //设置俯仰角
	   rotation: 45, //设置地图旋转角度
	   viewMode: '3D', //显示模式控制
	   mapStyleId: 'style1'  
	  //mapStyleId: "style1", //个性化样式
	   // baseMap: { //设置底图样式
	   //   type: 'vector', //设置底图为矢量底图
	   //   features: [ //设置矢量底图要素类型
	   //     'base', 
	   //     'point'
	   //   ]
	   // },
	 });
	
	//地域图层
	 var paths = [];
	 areaDatas.forEach(item => {
	   paths.push({
		 path: item, //设置区域边界线经纬度点串
		 styleId: 'styel2' //设置区域样式id
	   })
	 })
	 
	 area = new TMap.visualization.Area({
	   styles: { //设置区域图样式
		 styel1: {
		   fillColor: 'rgba(56,124,234,0.7)', //设置区域填充颜色
		   strokeColor: '#6799EA', //设置区域边线颜色
		   strokeWidth: 1,
		 }
	   },
	   selectOptions: { //设置拾取配置
		 action: 'hover',
		 style: {
		   fillColor: 'rgba(28,213,255,0.8)', //设置区域填充颜色
		   strokeColor: '#fff', //设置区域边线颜色
		   strokeWidth: 1, //区域边线宽度
		   strokeDashArray: [0, 0] //边线虚线展示方式
		 },	
	   },
	 }).setData(paths).addTo(map);
 
	
	//地域图层监听
	area.on('click',clickFunc)
	area.on('hover',hoverFunc)
	
	
	//热力图层
	var heat = new TMap.visualization.Heat({
		max: 100, // 热力最强阈值
		min: 0, // 热力最弱阈值
		height: 0, // 峰值高度
		gradientColor: { // 渐变颜色
		   0.6: "#985407",
		   0.8: "#e54b04",
		   0.9: "#ff0000",
		},
		radius: 100 // 最大辐射半径
	
	}).addTo(map);
	heat.setData(heatData);//设置数据
		
	//遍历heat.js 数据
	$.each(heatData,function(count,value) {
		var content =  '温度:'+ value.count+"℃"
		var myIW = new heatInfo({
			map:map,
			position: new TMap.LatLng(value.lat,value.lng),
			content: content,
		})
	});
 }
 
 function change2D() {
	map.setViewMode('2D');
 }
 
 function change3D() {
	map.setViewMode('3D');
	map.setPitch(70);
 }