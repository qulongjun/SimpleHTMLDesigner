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
			propertyCid: 'unKnown'
		}
	});
	//右侧元素属性模型
	var EleProperty = Backbone.Model.extend({
		//构造函数
		initialize: function() {
			this.bind("change", function() {
				var name = this.get("name");
				alert("你改变了属性值name:" + name);
			});
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
	//备选元素集合
	var OptionalList = Backbone.Collection.extend({
		model: Optional
	});
	//选中元素集合
	var ChooseTextItemList = Backbone.Collection.extend({
		model: ChooseTextItem
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
			var tg = model.target;
			var opt = new Optional({
				'tag': tg.children[0].tagName,
				'text': '请输入文本内容'
			});
			var choose = new ChooseTextItem({
				'tag': tg.children[0].tagName
			})
			chooseList.add(choose);
		}
	});
	//选中元素视图
	var ChooseView = Backbone.View.extend({
		el: $("#main-Panel"),
		initialize: function() {
			this.collection.bind("add", this.addOne);
			this.collection.bind("remove", this.delOne);
		},
		events: {

		},
		addOne: function(model) {
			var newDiv = $('<li><div id="" class="box animated bounceInLeft"><' + model.get('tag') + '>' + model.get('value') + '</' + model.get('tag') + '></div></li>')
			$("#main-Panel").append(newDiv);
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
		}
	});
	var PropertyView = Backbone.View.extend({
		el: $('#propertyForm'),
		initialize: function() {
			console.log(this.model);
			//this.collection.bind("add", this.addOne);
		},
		events: {
			"change #eleName": "eleName",
			"change #valueEle": "valueEle"
		},

		//		addOne: function(model) {
		//			$('#eleName').prop('value', model.get('name'));
		//			$('#valueEle').prop('value', model.get('value'));
		//		},
		eleName: function(event) {
			//元素名被修改触发事件
			var name = $('#eleName').prop('value');
			var value = $('#valueEle').prop('value');
			//this.collection.get(∂)
//			//
//			console.log(this.model);
			//this.model.set
		
		},
		'valueEle': function(event) {
			//文本值被修改触发事件
		}
	});

	var chooseList = new ChooseTextItemList();
	var propertyList = new PropertyList();
	var optionView = new OptionalView();
	var propertyView = new PropertyView({
		collection: propertyList,
		//model: EleProperty

	});

	var chooseView = new ChooseView({
		collection: chooseList
	});
})();