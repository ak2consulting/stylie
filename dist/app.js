define("src/utils",[],function(){var a={};return a.init=function(a){a.util.pxToNumber=function(a){return+a.replace("px","")},a.util.trimString=function(a){return a.replace(/^\s*|\s*$/g,"")},a.util.updatePath=function(){var b=a.config.crosshairs.from.getCenter(),c=a.config.crosshairs.to.getCenter();a.util.generatePathPrerender(a.util.pxToNumber(b.left),a.util.pxToNumber(b.top),a.util.pxToNumber(c.left),a.util.pxToNumber(c.top),a.config.selects.x.$el.val(),a.config.selects.y.$el.val())},a.util.generatePathPoints=function(b,c,d,e,f,g){var h=[],i={x:b,y:c},j={x:d,y:e},k={x:f,y:g},l,m;for(l=0;l<=a.const.RENDER_GRANULARITY;l++)m=Tweenable.util.interpolate(i,j,1/a.const.RENDER_GRANULARITY*l,k),h.push(m);return h},a.util.generatePathPrerender=function(b,c,d,e,f,g){a.config.prerenderedPath=document.createElement("canvas"),a.config.prerenderedPath.width=a.kapi.canvas_width(),a.config.prerenderedPath.height=a.kapi.canvas_height();var h=a.config.prerenderedPath.ctx=a.config.prerenderedPath.getContext("2d"),i=a.util.generatePathPoints.apply(this,arguments),j;h.beginPath(),_.each(i,function(a){j?h.lineTo(a.x,a.y):h.moveTo(a.x,a.y),j=a}),h.lineWidth=1,h.strokeStyle="#fa0",h.stroke(),h.closePath()},a.util.moveLastKeyframe=function(b,c){var d=b.getTrackNames(),e=b.getTrackLength(d[0])-1;_.each(d,function(a){b.modifyKeyframeProperty(a,e,{millisecond:c})}),b.kapi.updateInternalState(),a.config.animationDuration=c},a.util.getFormulaFromEasingFunc=function(a){var b=a.toString().replace("\n",""),c=b.replace(/.*return\s*/g,""),d=c.replace(/\}|;\s*}$/g,"");return d}},a}),define("src/css-gen",["exports"],function(a){function b(a,b){var c=a;return _.each(b,function(a){c=c.replace("%s",a)}),c}var c={x:"left",y:"top"};a.renderCSS3KeyframeSegment=function(a,d,e){var f;return d==="to"||d==="from"?f=b("  %s { ",[d]):f=b("  %s% { ",[(100/e*(d+1)).toFixed(2)]),_.each(a,function(a,d){var e=c[d]||e;f+=b("%s: %spx; ",[e,a.toFixed(2)])}),f+="} \n",f},a.generateCSS3Keyframes=function(c,d,e){var f=[b("@%skeyframes %s {\n",[e||"",c])],g=d.length;return f.push(a.renderCSS3KeyframeSegment(d[0],"from",g)),_.each(d.slice(1,-1),function(b,c){keyframeStr=a.renderCSS3KeyframeSegment(b,c,g-1),f.push(keyframeStr)}),f.push(a.renderCSS3KeyframeSegment(_.last(d),"to",g)),f.push("}"),f.join("")}}),define("src/ui/checkbox",["exports"],function(a){a.view=Backbone.View.extend({events:{change:"onChange"},initialize:function(a){_.extend(this,a),this.delegateEvents(),this.$el.trigger("change")},onChange:function(){}})}),define("src/ui/button",["exports"],function(a){a.view=Backbone.View.extend({events:{click:"onClick"},initialize:function(a){_.extend(this,a),this.delegateEvents()},onClick:function(){}})}),define("src/ui/select",["exports"],function(a){a.view=Backbone.View.extend({events:{change:"onChange"},initialize:function(a){_.extend(this,a),_.each(Tweenable.prototype.formula,function(a,b){var c=$(document.createElement("option"),{value:b});c.html(b),this.$el.append(c)},this)},onChange:function(a){var b={};b[this.$el.data("axis")]=this.$el.val(),this.app.config.currentActor.modifyKeyframe(this.app.config.animationDuration,{},b),this.app.util.updatePath(),this.app.canvasView.backgroundView.update(),this.app.kapi.canvas_clear().redraw()}})}),define("src/ui/auto-update-textfield",["exports"],function(a){a.view=Backbone.View.extend({events:{keyup:"onKeyup",keydown:"onKeydown"},initialize:function(a){_.extend(this,a)},onKeyup:function(a){var b=this.$el.val();this.onValReenter&&this.onValReenter(b)},onKeydown:function(a){var b=a.which;b==38&&this.onArrowUp?this.onArrowUp():b==40&&this.onArrowDown&&this.onArrowDown()}})}),define("src/ui/ease-field",["exports","./auto-update-textfield"],function(easeField,autoUpdateTextfield){easeField.view=autoUpdateTextfield.view.extend({initialize:function(a){autoUpdateTextfield.view.prototype.initialize.apply(this,arguments);var b=this.$el.data("easename"),c=Tweenable.prototype.formula[b],d=this.app.util.getFormulaFromEasingFunc(c);this.$el.val(d),this.$el.data("lastvalidfn",d)},onValReenter:function(val){var easename=this.$el.data("easename"),lastValid=this.$el.data("lastvalidfn");if(lastValid===val)return;try{eval("Tweenable.prototype.formula."+easename+" = function (x) {return "+val+"}"),this.$el.data("lastvalidfn",val),this.$el.removeClass("error"),this.app.util.updatePath()}catch(ex){eval("Tweenable.prototype.formula."+easename+" = function (x) {return "+lastValid+"}"),this.$el.addClass("error")}}})}),define("src/ui/crosshair",["exports"],function(a){a.view=Backbone.View.extend({events:{},initialize:function(a){_.extend(this,a),this.$el.draggable({containment:"parent",drag:_.bind(this.onDrag,this),stop:_.bind(this.onDragStop,this)})},onDrag:function(a,b){var c=this.$el.data("pos"),d=c==="from"?0:this.app.config.animationDuration;this.app.config.currentActor.modifyKeyframe(d,this.getCenter()),this.app.kapi.canvas_clear().redraw(),this.app.util.updatePath(),this.app.canvasView.backgroundView.update()},onDragStop:function(a,b){this.onDrag.apply(this,arguments),this.app.view.cssOutput.renderCSS()},getCenter:function(){var a=this.$el.position();return{left:a.left+"px",top:a.top+"px"}}})}),define("src/ui/background",["exports"],function(a){a.view=Backbone.View.extend({initialize:function(a){_.extend(this,a),this.context=this.$el[0].getContext("2d"),this.$el.css("background","#eee"),this.resize({height:a.height,width:a.width})},update:function(){this.app.config.prerenderedPath&&(this.$el[0].width=this.$el.width(),this.app.config.isPathShowing&&this.context.drawImage(this.app.config.prerenderedPath,0,0))},resize:function(a){_.each(["height","width"],function(b){if(b in a){var c={};c[b]=a[b],this.$el.css(c).attr(c)}},this)}})}),define("src/ui/canvas",["exports","src/ui/background"],function(a,b){var c=$(window),d=$("header");a.view=Backbone.View.extend({initialize:function(a){_.extend(this,a),this.initDOM()},initDOM:function(){var a=c.height(),d=c.width();this.app.kapi=new Kapi(this.$el[0],{fps:60,height:a,width:d}),this.backgroundView=new b.view({app:this.app,$el:this.$canvasBG,height:a,width:d});var e=this.getDOMActor();this.app.kapi.addActor(e),this.app.config.currentActor=e,this.setDOMKeyframePoints(e),this.initRekapiControls(),c.on("resize",_.bind(this.onWindowResize,this))},onWindowResize:function(a){var b=c.height()-d.outerHeight(),e=c.width();this.app.kapi.canvas_height(b),this.app.kapi.canvas_width(e),this.backgroundView.resize({height:b,width:e}),this.backgroundView.update()},initRekapiControls:function(){this.app.kapi.controls=new RekapiScrubber(this.app.kapi),this.app.util.updatePath()},getDOMActor:function(){var a=$("#rekapi-canvas").children();return a.height(a.height()).width(a.width()),new Kapi.DOMActor(a[0])},setDOMKeyframePoints:function(a){a.keyframe(0,_.extend(this.app.config.crosshairs.from.getCenter(),{color:"#777",radius:15})).keyframe(this.app.config.initialDuration,_.extend(this.app.config.crosshairs.to.getCenter(),{color:"#333"}))}})}),define("src/ui/pane",["exports"],function(a){var b=$(window);a.view=Backbone.View.extend({CONTAINER_TEMPLATE:['<div class="pane"></div>'].join(""),HANDLE_TEMPLATE:['<div class="pane-handle"></div>'].join(""),CONTENT_WRAPPER_TEMPLATE:['<div class="pane-content"></div>'].join(""),events:{},initialize:function(a){_.extend(this,a),this.$handle=$(this.HANDLE_TEMPLATE),this.$el.wrap($(this.CONTAINER_TEMPLATE)),this.$el=this.$el.parent(),this.$el.wrapInner($(this.CONTENT_WRAPPER_TEMPLATE)).prepend(this.$handle).css({left:b.width()-this.$el.outerWidth(!0)}).draggable({containment:"parent",handle:this.$handle,stop:_.bind(this.onDragStop,this)}),this.oldSize=this.getSize()},onResize:function(){this.oldSize=this.getSize()},onDragStop:function(a,b){this.$el.position().top<0&&this.$el.css("top","0px")},getSize:function(){return{height:this.$el.height(),width:this.$el.width()}}})}),define("src/ui/tabs",["exports"],function(a){a.view=Backbone.View.extend({events:{"click .tabs li":"onTabClick"},initialize:function(a){_.extend(this,a),this.delegateEvents(),this.tabs=this.$el.find(".tabs").children(),this.contents=this.$el.find(".tabs-contents").children(),this.tabs.eq(0).trigger("click")},onTabClick:function(a){a.preventDefault();var b=$(a.currentTarget);this.contents.css("display","none"),$("#"+b.data("target")).css("display","block")}})}),define("src/ui/css-output",["exports","src/css-gen"],function(a,b){a.view=Backbone.View.extend({events:{},initialize:function(a){_.extend(this,a),this.$trigger.on("click",_.bind(this.onTriggerClick,this))},onTriggerClick:function(a){this.renderCSS()},renderCSS:function(){var a=this.app.config.crosshairs.from.getCenter(),c=this.app.config.crosshairs.to.getCenter(),d=this.app.util.generatePathPoints(this.app.util.pxToNumber(a.left),this.app.util.pxToNumber(a.top),this.app.util.pxToNumber(c.left),this.app.util.pxToNumber(c.top),this.app.config.selects.x.$el.val(),this.app.config.selects.y.$el.val()),e=b.generateCSS3Keyframes("foo",d,"-webkit-");this.$el.val(e)}})}),define("src/ui/html-input",["exports"],function(a){a.view=Backbone.View.extend({events:{keyup:"onKeyup"},initialize:function(a){_.extend(this,a),this.$renderTarget=$("#rekapi-canvas .rekapi-actor"),this.initialValue=this.readFromDOM()},onKeyup:function(){this.renderToDOM()},readFromDOM:function(){return this.$el.html(this.app.util.trimString(this.$renderTarget.html()))},renderToDOM:function(){var a=this.$el.val()||this.initialValue;this.$renderTarget.html(a)}})}),require(["src/utils","src/css-gen","src/ui/checkbox","src/ui/button","src/ui/select","src/ui/auto-update-textfield","src/ui/ease-field","src/ui/crosshair","src/ui/canvas","src/ui/pane","src/ui/tabs","src/ui/css-output","src/ui/html-input"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n=$(window),o={config:{},"const":{},util:{},view:{}};o.const.PRERENDER_GRANULARITY=150,o.const.RENDER_GRANULARITY=100,a.init(o),Tweenable.prototype.formula.customEase1=function(a){return Math.pow(a,4)},Tweenable.prototype.formula.customEase2=function(a){return Math.pow(a,.25)},o.config.selects={x:new e.view({$el:$("#x-easing"),app:o}),y:new e.view({$el:$("#y-easing"),app:o})},o.view.durationField=new f.view({app:o,$el:$("#duration"),ARROW_KEY_INCREMENT:10,onValReenter:function(a){if(!isNaN(a)){var b=Math.abs(a);this.app.util.moveLastKeyframe(this.app.config.currentActor,b)}},tweakVal:function(a){this.$el.val(parseInt(o.config.animationDuration,10)+a),this.$el.trigger("keyup")},onArrowUp:function(){this.tweakVal(this.ARROW_KEY_INCREMENT)},onArrowDown:function(){this.tweakVal(-this.ARROW_KEY_INCREMENT)}}),o.config.animationDuration=o.config.initialDuration=o.view.durationField.$el.val(),o.config.easeFields=[],$(".ease").each(function(a,b){var c=new g.view({$el:$(b),app:o});o.config.easeFields.push(c)});var p=$(".crosshair.from");p.css({left:20,top:n.height()/2-p.height()/2});var q=$(".crosshair.to");q.css({left:n.width()/2,top:n.height()/2-q.height()/2}),o.config.crosshairs={from:new h.view({app:o,$el:p}),to:new h.view({app:o,$el:q})},o.canvasView=new i.view({app:o,$el:$("#rekapi-canvas"),$canvasBG:$("#tween-path")}),o.canvasView.backgroundView.update(),o.kapi.play(),o.view.showPathView=new c.view({app:o,$el:$("#show-path"),onChange:function(a){var b=this.$el.attr("checked");this.app.config.isPathShowing=!!b,this.app.kapi.redraw(),this.app.canvasView.backgroundView.update()}}),o.view.controlPane=new j.view({app:o,$el:$("#control-pane")}),o.view.controlPaneTabs=new k.view({app:o,$el:$("#control-pane")}),o.view.cssOutput=new l.view({app:o,$el:$("#css-output textarea"),$trigger:o.view.controlPaneTabs.$el.find('[data-target="css-output"]')}),o.view.htmlInput=new m.view({app:o,$el:$("#html-input textarea")}),subscribe("mainPanel-resize",_.bind(o.view.controlPane.onResize,o.view.controlPane)),$(window).trigger("resize")}),define("src/init",function(){})