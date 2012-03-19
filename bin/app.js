define("src/utils",[],function(){var a={};return a.init=function(a){a.util.pxToNumber=function(a){return+a.replace("px","")},a.util.trimString=function(a){return a.replace(/^\s*|\s*$/g,"")},a.util.updatePath=function(){var b=a.collection.keyframes.first().getAttrs(),c=a.collection.keyframes.last().getAttrs();a.util.generatePathPrerender(b.left,b.top,c.left,c.top,a.config.selects.x.$el.val(),a.config.selects.y.$el.val())},a.util.generatePathPoints=function(b,c,d,e,f,g){var h=[],i={x:b,y:c},j={x:d,y:e},k={x:f,y:g},l,m;for(l=0;l<=a.const.RENDER_GRANULARITY;l++)m=Tweenable.util.interpolate(i,j,1/a.const.RENDER_GRANULARITY*l,k),h.push(m);return h},a.util.generatePathPrerender=function(b,c,d,e,f,g){a.config.prerenderedPath=document.createElement("canvas"),a.config.prerenderedPath.width=a.kapi.canvas_width(),a.config.prerenderedPath.height=a.kapi.canvas_height();var h=a.config.prerenderedPath.ctx=a.config.prerenderedPath.getContext("2d"),i=a.util.generatePathPoints.apply(this,arguments),j;h.beginPath(),_.each(i,function(a){j?h.lineTo(a.x,a.y):h.moveTo(a.x,a.y),j=a}),h.lineWidth=1,h.strokeStyle="#fa0",h.stroke(),h.closePath()},a.util.moveLastKeyframe=function(b,c){var d=b.getTrackNames(),e=b.getTrackLength(d[0])-1;_.each(d,function(a){b.modifyKeyframeProperty(a,e,{millisecond:c})}),b.kapi.updateInternalState(),a.config.animationDuration=c},a.util.getFormulaFromEasingFunc=function(a){var b=a.toString().replace("\n",""),c=b.replace(/.*return\s*/g,""),d=c.replace(/\}|;\s*}$/g,"");return d}},a}),define("src/css-gen",["exports"],function(a){function c(a,b){var c=a;return _.each(b,function(a){c=c.replace("%s",a)}),c}function e(a,d,e){var f=[],g=e?e+"-":"";return f.push(c("  %sanimation-duration: %s;",[g,d])),f.push(c("  %sanimation-name: %s;",[g,a+b])),f}var b="-keyframes",d={x:"left",y:"top"};a.renderCSS3KeyframeSegment=function(a,b,e){var f;return b==="to"||b==="from"?f=c("  %s { ",[b]):f=c("  %s% { ",[(100/e*(b+1)).toFixed(2)]),_.each(a,function(a,b){var e=d[b]||e;f+=c("%s: %spx; ",[e,a.toFixed(2)])}),f+="} \n",f},a.generateAnimationClass=function(a,b,d){var b=c("%sms",[b]),f=[c(".%s {",[a])];return f.push("  position: absolute;"),_.each(d,function(c){f=f.concat(e(a,b,c))}),f.push("}"),f.join("\n")},a.generateCSS3Keyframes=function(d,e,f){f&&(f+="-");var g=[c("@%skeyframes %s {\n",[f||"",d+b])],h=e.length;return g.push(a.renderCSS3KeyframeSegment(e[0],"from",h)),_.each(e.slice(1,-1),function(b,c){keyframeStr=a.renderCSS3KeyframeSegment(b,c,h-1),g.push(keyframeStr)}),g.push(a.renderCSS3KeyframeSegment(_.last(e),"to",h)),g.push("}"),g.join("")},a.generateCSS3ClassAndKeyframes=function(b,c,d,e){var f=[a.generateAnimationClass(b,d,e)];return e=e||[""],_.each(e,function(d){f.push("\n"+a.generateCSS3Keyframes(b,c,d))}),f.join("\n")}}),define("src/ui/checkbox",["exports"],function(a){a.view=Backbone.View.extend({events:{change:"_onChange"},initialize:function(a){_.extend(this,a),a.preventInitialHandlerCall&&(this.delegateEvents(),this.$el.trigger("change"))},_onChange:function(a){this.onChange.call(this,a,this.$el.attr("checked")==="checked")}})}),define("src/ui/button",["exports"],function(a){a.view=Backbone.View.extend({events:{click:"onClick"},initialize:function(a){_.extend(this,a),this.delegateEvents()},onClick:function(){}})}),define("src/ui/select",["exports"],function(a){a.view=Backbone.View.extend({events:{change:"onChange"},initialize:function(a){_.extend(this,a),_.each(Tweenable.prototype.formula,function(a,b){var c=$(document.createElement("option"),{value:b});c.html(b),this.$el.append(c)},this)},onChange:function(a){var b={};b[this.$el.data("axis")]=this.$el.val(),this.app.config.currentActor.modifyKeyframe(this.app.config.animationDuration,{},b),this.app.util.updatePath(),this.app.canvasView.backgroundView.update(),this.app.kapi.canvas_clear().redraw()}})}),define("src/ui/auto-update-textfield",["exports"],function(a){a.view=Backbone.View.extend({events:{keyup:"onKeyup",keydown:"onKeydown"},initialize:function(a){_.extend(this,a)},onKeyup:function(a){var b=this.$el.val();this.onValReenter&&this.onValReenter(b)},onKeydown:function(a){var b=a.which;b==38&&this.onArrowUp?this.onArrowUp():b==40&&this.onArrowDown&&this.onArrowDown()}})}),define("src/ui/ease-field",["exports","./auto-update-textfield"],function(easeField,autoUpdateTextfield){easeField.view=autoUpdateTextfield.view.extend({initialize:function(a){autoUpdateTextfield.view.prototype.initialize.apply(this,arguments);var b=this.$el.data("easename"),c=Tweenable.prototype.formula[b],d=this.app.util.getFormulaFromEasingFunc(c);this.$el.val(d),this.$el.data("lastvalidfn",d)},onValReenter:function(val){var easename=this.$el.data("easename"),lastValid=this.$el.data("lastvalidfn");if(lastValid===val)return;try{eval("Tweenable.prototype.formula."+easename+" = function (x) {return "+val+"}"),this.$el.data("lastvalidfn",val),this.$el.removeClass("error"),this.app.util.updatePath()}catch(ex){eval("Tweenable.prototype.formula."+easename+" = function (x) {return "+lastValid+"}"),this.$el.addClass("error")}}})}),define("src/ui/background",["exports"],function(a){a.view=Backbone.View.extend({initialize:function(a){_.extend(this,a),this.context=this.$el[0].getContext("2d"),this.$el.css("background","#eee"),this.resize({height:a.height,width:a.width})},update:function(){this.app.config.prerenderedPath&&(this.$el[0].width=this.$el.width(),this.app.config.isPathShowing&&this.context.drawImage(this.app.config.prerenderedPath,0,0))},resize:function(a){_.each(["height","width"],function(b){if(b in a){var c={};c[b]=a[b],this.$el.css(c).attr(c)}},this)}})}),define("src/ui/canvas",["exports","src/ui/background"],function(a,b){var c=$(window),d=$("header");a.view=Backbone.View.extend({initialize:function(a){_.extend(this,a),this.initDOM()},initDOM:function(){var a=c.height(),d=c.width();this.app.kapi=new Kapi(this.$el[0],{fps:60,height:a,width:d}),this.backgroundView=new b.view({app:this.app,$el:this.$canvasBG,height:a,width:d});var e=this.getDOMActor();this.app.kapi.addActor(e),this.app.config.currentActor=e,this.setDOMKeyframePoints(e),this.initRekapiControls(),c.on("resize",_.bind(this.onWindowResize,this))},onWindowResize:function(a){var b=c.height()-d.outerHeight(),e=c.width();this.app.kapi.canvas_height(b),this.app.kapi.canvas_width(e),this.backgroundView.resize({height:b,width:e}),this.backgroundView.update()},initRekapiControls:function(){this.app.kapi.controls=new RekapiScrubber(this.app.kapi),this.app.util.updatePath()},getDOMActor:function(){var a=$("#rekapi-canvas").children();return a.height(a.height()).width(a.width()),new Kapi.DOMActor(a[0])},setDOMKeyframePoints:function(a){a.keyframe(0,this.app.collection.keyframes.first().getCSS()).keyframe(this.app.config.initialDuration,this.app.collection.keyframes.last().getCSS())}})}),define("src/ui/pane",["exports"],function(a){var b=$(window);a.view=Backbone.View.extend({CONTAINER_TEMPLATE:['<div class="pane"></div>'].join(""),HANDLE_TEMPLATE:['<div class="pane-handle"></div>'].join(""),CONTENT_WRAPPER_TEMPLATE:['<div class="pane-content"></div>'].join(""),events:{},initialize:function(a){_.extend(this,a),this.$handle=$(this.HANDLE_TEMPLATE),this.$el.wrap($(this.CONTAINER_TEMPLATE)),this.$el=this.$el.parent(),this.$el.wrapInner($(this.CONTENT_WRAPPER_TEMPLATE)).prepend(this.$handle).css({left:b.width()-this.$el.outerWidth(!0)}).draggable({containment:"parent",handle:this.$handle,stop:_.bind(this.onDragStop,this)}),this.oldSize=this.getSize()},onResize:function(){this.oldSize=this.getSize()},onDragStop:function(a,b){this.$el.position().top<0&&this.$el.css("top","0px")},getSize:function(){return{height:this.$el.height(),width:this.$el.width()}}})}),define("src/ui/tabs",["exports"],function(a){a.view=Backbone.View.extend({ACTIVE_CLASS:"tabs-active",events:{"click .tabs li":"onTabClick"},initialize:function(a){_.extend(this,a),this.delegateEvents(),this.tabs=this.$el.find(".tabs").children(),this.contents=this.$el.find(".tabs-contents").children(),this.tabs.eq(0).trigger("click")},onTabClick:function(a){a.preventDefault();var b=$(a.currentTarget);this.tabs.removeClass(this.ACTIVE_CLASS),b.addClass(this.ACTIVE_CLASS),this.contents.css("display","none"),$("#"+b.data("target")).css("display","block")}})}),define("src/ui/css-output",["exports","src/css-gen"],function(a,b){function d(a){var b=[];return _.each(a.config.activeClasses,function(a,d){a&&b.push(c[d])}),b}var c={moz:"-moz",webkit:"-webkit",w3:""};a.view=Backbone.View.extend({events:{},initialize:function(a){_.extend(this,a),this.$trigger.on("click",_.bind(this.onTriggerClick,this))},onTriggerClick:function(a){this.renderCSS()},renderCSS:function(){var a=this.app.collection.keyframes.first().getAttrs(),c=this.app.collection.keyframes.last().getAttrs(),e=this.app.util.generatePathPoints(a.left,a.top,c.left,c.top,this.app.config.selects.x.$el.val(),this.app.config.selects.y.$el.val()),f=this.app.view.durationFieldView.$el.val(),g=b.generateCSS3ClassAndKeyframes(this.app.view.cssNameFieldView.$el.val(),e,f,d(this.app));this.$el.val(g)}})}),define("src/ui/html-input",["exports"],function(a){a.view=Backbone.View.extend({events:{keyup:"onKeyup"},initialize:function(a){_.extend(this,a),this.$renderTarget=$("#rekapi-canvas .rekapi-actor"),this.initialValue=this.readFromDOM()},onKeyup:function(){this.renderToDOM()},readFromDOM:function(){return this.$el.html(this.app.util.trimString(this.$renderTarget.html()))},renderToDOM:function(){var a=this.$el.val()||this.initialValue;this.$renderTarget.html(a)}})}),define("src/ui/incrementer-field",["exports","src/ui/auto-update-textfield"],function(a,b){a.view=b.view.extend({increment:10,initialize:function(a){b.view.prototype.initialize.call(this,a)},tweakVal:function(a){this.$el.val(parseInt(this.$el.val(),10)+a),this.$el.trigger("keyup")},onArrowUp:function(){this.tweakVal(this.increment)},onArrowDown:function(){this.tweakVal(-this.increment)}})}),define("src/ui/keyframe",["exports","src/ui/incrementer-field"],function(a,b){function c(a){return new b.view({app:this.app,$el:a,onValReenter:_.bind(function(b){this.model.set(a.data("keyframeattr"),+b),publish(this.app.events.KEYFRAME_UPDATED)},this)})}a.view=Backbone.View.extend({events:{},KEYFRAME_TEMPLATE:['<li class="keyframe">',"<h3></h3>","<label>","<span>Left:</span>",'<input class="third-width keyframe-attr-left" type="text" data-keyframeattr="left"></input>',"</label>","<label>","<span>Top:</span>",'<input class="third-width keyframe-attr-top" type="text" data-keyframeattr="top"></input>',"</label>","<hr>","</li>"].join(""),initialize:function(a){_.extend(this,a),this.app=this.owner.app,this.$el=$(this.KEYFRAME_TEMPLATE),this.model.keyframeView=this,this.initDOMReferences(),this.initIncrementers(),this.render(),subscribe(this.app.events.KEYFRAME_UPDATED,_.bind(this.render,this))},initDOMReferences:function(){this.header=this.$el.find("h3"),this.inputLeft=this.$el.find(".keyframe-attr-left"),this.inputTop=this.$el.find(".keyframe-attr-top")},initIncrementers:function(){this.incrementerViews={},_.each([this.inputLeft,this.inputTop],function(a){this.incrementerViews[a.data("keyframeattr")]=c.call(this,a)},this)},render:function(){this.header.html(this.model.get("percent")+"%"),this.model.get("left")!==+this.inputLeft.val()&&this.inputLeft.val(this.model.get("left")),this.model.get("top")!==+this.inputTop.val()&&this.inputTop.val(this.model.get("top"))}})}),define("src/model/keyframe",["exports"],function(a){a.model=Backbone.Model.extend({initialize:function(a,b){_.extend(this,b),subscribe(this.app.events.KEYFRAME_UPDATED,_.bind(this.updateActor,this))},validate:function(a){var b=!1;_.each(a,function(a){typeof a!="number"&&(b=!0)});if(b)return"Number is NaN"},updateActor:function(){var a=this.get("percent")===0?0:this.app.config.animationDuration;this.app.config.currentActor&&(this.app.config.currentActor.modifyKeyframe(a,this.getCSS()),this.app.kapi.canvas_clear().redraw())},getCSS:function(){return{left:this.get("left")+"px",top:this.get("top")+"px"}},getAttrs:function(){return{left:this.get("left"),top:this.get("top")}}})}),define("src/ui/crosshair",["exports","src/model/keyframe"],function(a,b){a.view=Backbone.View.extend({events:{},initialize:function(a){_.extend(this,a),this.$el.draggable({containment:"parent",drag:_.bind(this.onDrag,this),stop:_.bind(this.onDragStop,this)}),this.model.set("percent",+this.$el.data("percent")),this.model.crosshairView=this,this.updateModel(),subscribe(this.app.events.KEYFRAME_UPDATED,_.bind(this.render,this))},onDrag:function(a,b){this.updateModel()},onDragStop:function(a,b){this.onDrag.apply(this,arguments),this.app.view.cssOutputView.renderCSS()},render:function(){this.$el.css({left:this.model.get("left")+"px",top:this.model.get("top")+"px"}),this.app.canvasView&&(this.app.util.updatePath(),this.app.canvasView.backgroundView.update())},updateModel:function(){this.model.set({left:this.app.util.pxToNumber(this.$el.css("left")),top:this.app.util.pxToNumber(this.$el.css("top"))}),publish(this.app.events.KEYFRAME_UPDATED)}})}),define("src/collection/keyframes",["exports","src/model/keyframe"],function(a,b){a.collection=Backbone.Collection.extend({model:b.model,initialize:function(){}})}),define("src/ui/keyframes",["src/collection/keyframes","src/ui/keyframe"],function(a,b){return a.view=Backbone.View.extend({events:{},initialize:function(a){_.extend(this,a),this.keyframeViews={},this.initKeyframeViews()},initKeyframeViews:function(){this.collection.each(function(a){var b=this.initKeyframeView(a);this.$el.append(b.$el)},this)},initKeyframeView:function(a){var c=new b.view({owner:this,model:a});return this.keyframeViews[c.cid]=c,c},render:function(){_.each(this.keyframeViews,function(a){a.render()})}}),a}),require(["src/utils","src/css-gen","src/ui/checkbox","src/ui/button","src/ui/select","src/ui/auto-update-textfield","src/ui/ease-field","src/ui/crosshair","src/ui/canvas","src/ui/pane","src/ui/tabs","src/ui/css-output","src/ui/html-input","src/ui/keyframes","src/ui/incrementer-field","src/model/keyframe"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var q=$(window),r={config:{activeClasses:{}},"const":{},events:{},util:{},view:{},collection:{}};r.const.PRERENDER_GRANULARITY=150,r.const.RENDER_GRANULARITY=100,r.config.activeClasses.moz=!0,r.config.activeClasses.webkit=!0,r.config.activeClasses.w3=!0,r.events.KEYFRAME_UPDATED="keyframeUpdated",a.init(r),Tweenable.prototype.formula.customEase1=function(a){return Math.pow(a,4)},Tweenable.prototype.formula.customEase2=function(a){return Math.pow(a,.25)},r.config.selects={x:new e.view({$el:$("#x-easing"),app:r}),y:new e.view({$el:$("#y-easing"),app:r})},r.view.durationFieldView=new o.view({app:r,$el:$("#duration"),onValReenter:function(a){if(!isNaN(a)){var b=Math.abs(a);this.app.util.moveLastKeyframe(this.app.config.currentActor,b)}}}),r.config.animationDuration=r.config.initialDuration=r.view.durationFieldView.$el.val(),r.config.easeFields=[],$(".ease").each(function(a,b){var c=new g.view({$el:$(b),app:r});r.config.easeFields.push(c)}),r.collection.keyframes=new n.collection,$(".crosshair").each(function(a,b){var c=$(b);r.collection.keyframes.add({left:a?q.width()-q.width()/(a+1):40,top:q.height()/2-c.height()/2},{app:r}),c.css(r.collection.keyframes.last().getAttrs()),new h.view({app:r,$el:c,model:r.collection.keyframes.last()})}),r.view.keyframes=new n.view({app:r,$el:$("#keyframe-controls .controls"),collection:r.collection.keyframes}),r.canvasView=new i.view({app:r,$el:$("#rekapi-canvas"),$canvasBG:$("#tween-path")}),r.canvasView.backgroundView.update(),r.kapi.play(),r.view.showPathView=new c.view({app:r,$el:$("#show-path"),preventInitialHandlerCall:!0,onChange:function(a,b){this.app.config.isPathShowing=!!b,this.app.kapi.redraw(),this.app.canvasView.backgroundView.update()}}),r.view.controlPaneView=new j.view({app:r,$el:$("#control-pane")}),r.view.controlPaneTabsView=new k.view({app:r,$el:$("#control-pane")}),r.view.cssOutputView=new l.view({app:r,$el:$("#css-output textarea"),$trigger:r.view.controlPaneTabsView.$el.find('[data-target="css-output"]')}),r.view.cssNameFieldView=new f.view({app:r,$el:$("#css-name"),onKeyup:function(a){this.app.config.className=a,this.app.view.cssOutputView.renderCSS()}}),r.view.mozCheckboxView=new c.view({app:r,$el:$("#moz-toggle"),onChange:function(a,b){this.app.config.activeClasses.moz=b,this.app.view.cssOutputView.renderCSS()}}),r.view.webkitCheckboxView=new c.view({app:r,$el:$("#webkit-toggle"),onChange:function(a,b){this.app.config.activeClasses.webkit=b,this.app.view.cssOutputView.renderCSS()}}),r.view.w3CheckboxView=new c.view({app:r,$el:$("#w3-toggle"),onChange:function(a,b){this.app.config.activeClasses.w3=b,this.app.view.cssOutputView.renderCSS()}}),r.view.htmlInputView=new m.view({app:r,$el:$("#html-input textarea")}),$(window).trigger("resize")}),define("src/init",function(){})