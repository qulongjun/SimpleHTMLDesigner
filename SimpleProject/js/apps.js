(function() {
	//左侧备选元素模型
	var Optional = Backbone.Model.extend({
		defaults: {
			tag: 'unKnown',
			text: 'unKnown',
		}
	});
	//中间选中元素模型
	var ChooseTextItem = Backbone.Model.extend({
		defaults: {
			tag: 'div',
			name: '新元素',
			value: '请输入文本内容',
			fontSize: 16,
			fontColor: 'Black',
			bold: 'normal',
			italic: 'normal',
			textAlign: 'left',
			picSrc: '',
		}
	});

	//选中元素集合
	var ChooseTextItemList = Backbone.Collection.extend({
		url: 'receive.html',
		model: ChooseTextItem
	});
	//备选元素视图
	var OptionalView = Backbone.View.extend({
		el: $('#leftNav'),
		events: {
			'click .item': 'optionClick'
		},
		'optionClick': function(model) {
			var ctag = model.target.children[0] != undefined ? model.target.children[0].tagName : model.target.tagName;
			var opt = new Optional({
				'tag': ctag,
				'text': '请输入文本内容'
			});
			var choose = new ChooseTextItem({
				'tag': ctag
			})
			chooseList.add(choose);
			chooseView.model = choose;
		}
	});
	//选中元素视图
	var ChooseView = Backbone.View.extend({
		el: $("#main-Context"),
		url: "",
		initialize: function() {
			this.collection.bind("add", this.render);
			this.collection.bind("remove", this.removeEle);
			var js = store.get("item");
			if (js && js.length != 0) {
				for (var i = 0; i < js.length; i++) {
					this.collection.add(js[i]);
				}
			}
		},
		events: {
			"click .box": 'clickBox', //选中元素事件
			"change #eleName": "eleNameChange", //元素名称修改事件
			"change #valueEle": "valueEleChange", //元素值修改事件
			"click .deleteEle": "deleteEle", //删除元素事件
			"click #changeBtn": "picSrc", //变换图片事件
			"click #saveWork": "saveWork", //保存画布事件
			"click #previewWork": "preview", //预览作品
			"click #clearAll": "clearAll" //清空全部元素
		},
		render: function(model) {
			var newDiv = "";
			if (model.get('tag') == "IMG") {
				newDiv = $('<li><div id="' + model.cid + '" class="box animated" style="height: 500px;"><' + model.get('tag') + ' src="img/测试图片.jpg" style="width:100%;heigth:100%" /></div></li>')
			} else {
				newDiv = $('<li><div id="' + model.cid + '" class="box animated "><' + model.get('tag') + '>' + model.get('value') + '</' + model.get('tag') + '></div></li>')
			}
			$("#main-Panel").append(newDiv);
			$('#eleName').prop("value", model.get("name"));
			$('#valueEle').prop('value', model.get("value"));
			return this;
		},
		//移除元素
		removeEle: function(model) {
			if (model.cid == undefined) {
				alert("请选择一个元素");
			}
			$('#' + model.cid).parents('li').remove();
			$('#eleName').prop("value", "");
			$('#valueEle').prop("value", "");
		},
		//选中元素
		clickBox: function(event) {
			var ele = event.target.tagName == "DIV" ? event.target : event.target.parentElement;
			var cid = ele.id;
			var model = chooseList.getByCid(cid);
			$('.box').removeClass('chooseItemChecked');
			ele.className = "box  chooseItemChecked";
			var temp = this.collection.getByCid(cid)
			$('#valueEle').prop("value", temp.get("value"));
			$('#eleName').prop("value", temp.get("name"));
			chooseView.model = temp;
		},
		//元素名称修改
		eleNameChange: function(event) {
			this.model.set("name", $('#eleName').prop('value'));
		},
		//文本值修改
		valueEleChange: function(event) {
			var value = $('#valueEle').prop('value')
			this.model.set("value", value);
			$('#' + this.model.cid).children().html(value);
		},
		//图片修改
		picSrc: function(event) {
			var path = $('#changePic').val();
			alert(path);
		},
		//保存画布
		saveWork: function() {
			var arrs = new Array;
			//按照画布上的model顺序保存model到数组中
			$('#main-Panel').find('div').each(function() {
				var cid = $(this).prop("id");
				var model = chooseList.getByCid(cid);
				arrs.push(model.toJSON());
			});
			store.remove();
			store.set("item", arrs);
			//发送一个Ajax请求
			$.ajax({
				type: "POST",
				url: "receive.html",
				data: JSON.stringify(arrs),
				success: function(result) {
					alert('保存成功！');
				}
			});
			bootbox.alert("保存成功！");
		},
		//删除元素
		deleteEle: function(event) {
			if (this.model == undefined) {
				alert("画布中至少需要一个元素！");
			} else {
				this.collection.remove(this.model);
			}
		},
		preview: function() {
			var aLi = $('#main-Panel').find("div");
			var html = "";
			aLi.each(function() {
				html += $(this).html();
			});
			bootbox.dialog({
				title: "预览作品",
				message: '<ul>' + html + '</ul>'
			});
		},
		clearAll: function() {
			while (this.collection.length != 0) {
				this.collection.shift();
			}
		}
	});


	var chooseList = new ChooseTextItemList();
	var optionView = new OptionalView();
	var chooseView = new ChooseView({
		collection: chooseList
	});
	window.chooseList = chooseList;
	$('#leftNavUl li').click(function() {
		var index = $(this).index();
		var indexActive;
		$('#leftNavUl li.active').each(function() {
			indexActive = $(this).index();
		})
		if (indexActive != index) {
			$(this).addClass('active').siblings('li').removeClass('active');
			$('.leftNavliDiv').eq(index).addClass('active').siblings().removeClass('active');
		}
	});
	$('#rightNavUl li').click(function() {
		var index = $(this).index();
		var indexActive;
		$('#rightNavUl li.active').each(function() {
			indexActive = $(this).index();
		})
		if (indexActive != index) {
			$(this).addClass('active').siblings('li').removeClass('active');
			$('.rightNavliDiv').eq(index).addClass('active').siblings().removeClass('active');
		}
	});
	$("#main-Panel").sortable({
		cursor: "move",
		items: "li", //只是li可以拖动
		opacity: 0.6, //拖动时，透明度为0.6
		revert: true, //释放时，增加动画
		update: function(event, ui) { //更新排序之后
		}
	});
})();