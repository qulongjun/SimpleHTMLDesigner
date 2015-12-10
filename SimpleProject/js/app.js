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
		initialize: function() {
			this.bind("change:value", this.changeValue);
		},
		changeValue: function(model) {
			var chooseItem = new ChooseView({
				collection: chooseList,
				model: model
			});
		},
		defaults: {
			tag: 'div',
			name: '新元素',
			value: '请输入文本内容',
			fontSize: 16,
			fontColor: 'Black',
			bold: 'normal',
			italic: 'normal',
			textAlign: 'left',
			propertyCid: 'unKnown'
		}
	});

	//右侧元素属性模型
	var EleProperty = Backbone.Model.extend({
		//构造函数
		initialize: function() {
			this.bind("change:name", this.changeName);
			this.bind("change:value", this.changeValue);
		},
		changeName: function(model) {
			var cid = this.get("chooseItemCid");
			var chooseModel = chooseList.getByCid(cid)
			chooseModel.set("name", model.get("name"));
		},
		changeValue: function(model) {
			var cid = this.get("chooseItemCid");
			var chooseModel = chooseList.getByCid(cid)
			chooseModel.set("value", model.get("value"));
		},
		defaults: {
			name: 'unKnown',
			value: 'unKnown',
			fontSize: 16,
			fontColor: 'Black',
			bold: 'normal',
			italic: 'normal',
			textAlign: 'left',
			chooseItemCid: 'unKnown'
		}
	});
	//选中元素集合
	var ChooseTextItemList = Backbone.Collection.extend({
		model: ChooseTextItem,
		initialize: function() {
			this.bind('add', this.addOne);
		},
		addOne: function(model) {
			var eleProperty = new EleProperty({
				name: model.get('name'),
				value: model.get('value'),
				fontSize: model.get('fontSize'),
				fontColor: model.get('fontColor'),
				bold: model.get('blod'),
				italic: model.get('italic'),
				textAlign: model.get('textAlign'),
				chooseItemCid: model.cid
			});
			propertyList.add(eleProperty);
			model.set("propertyCid", eleProperty.cid);
			var propertyView = new PropertyView({
				collection: propertyList,
				model: eleProperty
			});
		}
	});
	//元素属性集合
	var PropertyList = Backbone.Collection.extend({
		model: EleProperty
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
		}
	});


	//选中元素视图
	var ChooseView = Backbone.View.extend({
		el: $("#main-Panel"),
		initialize: function() {
			this.collection.bind("add", this.render);
			this.model.bind("change", this.changeValue);
		},
		events: {
			"click .box": 'clickBox'
		},
		render: function(model) {
			var newDiv = $('<li><div id="' + model.cid + '" class="box animated bounceInLeft"><' + model.get('tag') + '>' + model.get('value') + '</' + model.get('tag') + '></div></li>')
			$("#main-Panel").append(newDiv);
			return this;
		},

		changeValue: function(model) {
			alert(model.cid);
			//$('#' + model.cid).children().html(model.get("value"));
		},
		clickBox: function(event) {
			var ele = event.target.tagName == "DIV" ? event.target : event.target.parentElement;
			var cid = ele.id;
			var model = chooseList.getByCid(cid);
			console.log(event);
			$('.box').removeClass('chooseItemChecked');
			ele.className = "box animated bounceInLeft chooseItemChecked";
		}
	});



	//元素属性视图
	var PropertyView = Backbone.View.extend({
		el: $('#propertyForm'),
		initialize: function() {
			this.render();
		},
		events: {
			"change #eleName": "eleName",
			"change #valueEle": "valueEle"
		},
		render: function() {
			$('#eleName').prop('value', this.model.get("name"));
			$('#valueEle').prop('value', this.model.get("value"));
		},
		eleName: function(event) {
			//元素名被修改触发事件
			var name = $('#eleName').prop('value');
			this.model.set("name", name);
		},
		valueEle: function(event) {
			//文本值被修改触发事件
			var value = $('#valueEle').prop('value');
			this.model.set("value", value);
		}
	});




	var chooseList = new ChooseTextItemList();
	var propertyList = new PropertyList();
	var optionView = new OptionalView();
	var chooseView = new ChooseView({
		collection: chooseList,
		model: new ChooseTextItem()
	});
})();