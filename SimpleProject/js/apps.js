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
			picSrc:'',
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
			this.collection.bind("remove", this.removeEle);
		},
		events: {
			"click .box": 'clickBox',
			"change #eleName": "eleNameChange",
			"change #valueEle": "valueEleChange",
			"click .deleteEle": "deleteEle",
			"click #changeBtn":"picSrc"
		},
		render: function(model) {
			//bounceInLeft
			var newDiv = "";
			if (model.get('tag') == "IMG") {
				 newDiv = $('<li><div id="' + model.cid + '" class="box animated" style="height: 500px;"><' + model.get('tag') + ' src="img/备选图片.jpg" style="width:100%;heigth:100%" /></div></li>')
			} else {
				 newDiv = $('<li><div id="' + model.cid + '" class="box animated "><' + model.get('tag') + '>' + model.get('value') + '</' + model.get('tag') + '></div></li>')
			}
			$("#main-Panel").append(newDiv);
			$('#eleName').prop("value", model.get("name"));
			$('#valueEle').prop('value', model.get("value"));
			return this;
		},
		removeEle: function(model) {
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
		picSrc:function(event){
			var path=$('#changePic').val();
			alert(path);
			$('#' + this.model.cid).find('IMG').attr('src',path);
		},
		deleteEle: function(event) {

			if (this.model == undefined) {
				alert("画布中至少需要一个元素！");
			} else {
				this.collection.remove(this.model);
			}
		}
	});
	var chooseList = new ChooseTextItemList();
	var optionView = new OptionalView();
	var chooseView = new ChooseView({
		collection: chooseList
	});
	$('#changeBtn').click(function(){
		//alert($('#changePic').val());
		
	})
})();