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
		}
	});

	//选中元素集合
	var ChooseTextItemList = Backbone.Collection.extend({
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
		initialize: function() {
			this.collection.bind("add", this.render);
		},
		events: {
			"click .box": 'clickBox',
			"change #eleName": "eleNameChange",
			"change #valueEle": "valueEleChange"
		},
		render: function(model) {
			var newDiv = $('<li><div id="' + model.cid + '" class="box animated bounceInLeft"><' + model.get('tag') + '>' + model.get('value') + '</' + model.get('tag') + '></div></li>')
			$("#main-Panel").append(newDiv);
			$('#eleName').prop("value", model.get("name"));
			$('#valueEle').prop('value', model.get("value"));
			return this;
		},
		clickBox: function(event) {
			var ele = event.target.tagName == "DIV" ? event.target : event.target.parentElement;
			var cid = ele.id;
			var model = chooseList.getByCid(cid);
			$('.box').removeClass('chooseItemChecked');
			ele.className = "box animated bounceInLeft chooseItemChecked";
			//console.log(this.collection.getByCid(cid));
			var temp=this.collection.getByCid(cid)
			//this.model=this.collection.getByCid(cid);
			//console.log(this.model);
			//console.log(temp);
			//$('#eleName').prop("value",temp.get("name"));
			$('#valueEle').prop("value",temp.get("value"));
			$('#eleName').prop("value",temp.get("name"));
			chooseView.model=temp;
		},
		eleNameChange: function(event) {
			this.model.set("name", $('#eleName').prop('value'));
		},
		valueEleChange: function(event) {
			var value = $('#valueEle').prop('value')
			this.model.set("value", value);
			$('#' + this.model.cid).children().html(value);
		}
	});
	var chooseList = new ChooseTextItemList();
	var optionView = new OptionalView();
	var chooseView = new ChooseView({
		collection: chooseList
			//model: new ChooseTextItem()
	});
})();