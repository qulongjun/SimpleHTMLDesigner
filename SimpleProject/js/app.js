(function() {
	var Optional = Backbone.Model.extend({
		defaults: {
			tag: 'unKnown',
			text: 'unKnown',
		},
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
			textAlign: 'left'
		}
	});
	var EleProperty = Backbone.Model.extend({
		defaults: {
			name: 'unKnown',
			value: 'unKnown',
			fontSize: 16,
			fontColor: 'Black',
			bold: 'normal',
			italic: 'normal',
			textAlign: 'left'

		}
	});
	var OptionalList = Backbone.Collection.extend({
		model: Optional
	});
	var ChooseTextItemList = Backbone.Collection.extend({
		model: ChooseTextItem
	});
	var PropertyList = Backbone.Collection.extend({
		model: EleProperty
	});
	var chooseList = new ChooseTextItemList();
	var propertyList = new PropertyList();
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
				'tag': opt.get('tag')
			})

			chooseList.add(choose);
			var eleProperty = new EleProperty({
				name: choose.get('name'),
				value: chooset.get('value'),
				fontSize: choose.get('fontSize'),
				fontColor: choose.get('fontColor'),
				bold: choose.get('blod'),
				italic: choose.get('italic'),
				textAlign: choose.get('textAlign')
			});
			propertyList.add(eleProperty);
		}
	});
	var optionView = new OptionalView();

	var ChooseView = Backbone.View.extend({
		el: $("#main-Panel"),
		initialize: function() {
			this.collection.bind("add", this.addOne);
			this.collection.bind("remove", this.delOne);
		},
		events: {
			"click .box": "propSet"
		},
		addOne: function(model) {
			var newDiv = $('<li><div id="" class="box animated bounceInLeft"><' + model.get('tag') + '>' + model.get('value') + '</' + model.get('tag') + '></div></li>')
			$("#main-Panel").append(newDiv);
		},
		propSet: function(model) {
			//console.dir(model.cid);
			//console.log(model.attributes);

		}
	});
	var PropertyView = Backbone.View.extend({
		el: $('#propertyForm'),
		initialize: function() {
			this.collection.bind("add", this.addOne);
			//this.collection.bind("remove", this.delOne);
		},
		events: {
			"change #eleName": "eleName",
			"change #valueEle": "valueEle"
		},
		addOne:function(model){
			//alert('aaaprop');
			
		},
		'eleName': function(model) {
			alert("aaa");
		},
		'valueEle': function(model) {
			alert('bbb');
		}

	});
	var propertyView =new PropertyView({
		collection: chooseList
	});
	
	var propertyView = new PropertyView();
	var chooseView = new ChooseView({
		collection: propertyList
	});
})();