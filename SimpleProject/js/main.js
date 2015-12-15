/**
 *RequireJS main主入口 
 */
require.config({
	paths: {
		"jquery": "jquery",
		"bootstrap": "bootstarp",
		"underscore": "underscore",
		"backbone": "backbone"
	},
	shime: {
		"underscore": {
			exports: '_'
		},
		"backbone": {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		
	}
});
require(['jquery', 'underscore', 'backbone'], function() {

	var Optional = Backbone.Model.extend({
		defaults: {
			tag: 'unKnown',
			text: 'unKnown',
		}
	});
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

	var ChooseTextItemList = Backbone.Collection.extend({
		url: 'receive.html',
		model: ChooseTextItem
	});
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
			"click .box": 'clickBox',
			"change #eleName": "eleNameChange",
			"change #valueEle": "valueEleChange",
			"click .deleteEle": "deleteEle",
			"click #changeBtn": "picSrc",
			"click #saveWork": "saveWork",
			"click #previewWork": "preview",
			"click #clearAll": "clearAll"
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
		removeEle: function(model) {
			if (model.cid == undefined) {
				alert("请选择一个元素");
			}
			$('#' + model.cid).parents('li').remove();
			$('#eleName').prop("value", "");
			$('#valueEle').prop("value", "");
		},
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
		eleNameChange: function(event) {
			this.model.set("name", $('#eleName').prop('value'));
		},
		valueEleChange: function(event) {
			var value = $('#valueEle').prop('value')
			this.model.set("value", value);
			$('#' + this.model.cid).children().html(value);
		},
		picSrc: function(event) {
			var path = $('#changePic').val();
			alert(path);
		},
		saveWork: function() {
			var arrs = new Array;
			$('#main-Panel').find('div').each(function() {
				var cid = $(this).prop("id");
				var model = chooseList.getByCid(cid);
				arrs.push(model.toJSON());
			});
			store.remove();
			store.set("item", arrs);
			$.ajax({
				type: "POST",
				url: "receive.html",
				data: JSON.stringify(arrs),
				success: function(result) {
					alert('保存成功！');
				}
			});
		},
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

});