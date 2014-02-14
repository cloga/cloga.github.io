var MyPic = {
	Init:function(l_url,ratio,endge_type){
		/**
		 * First, let's instanciate sigma.js :
		 */
		
		var obj = document.getElementById("sigma-example");
		obj.innerHTML = '';
		var sigInst = sigma.init(obj).drawingProperties({
			 defaultLabelColor: 'black',
			 defaultLabelSize: 12,
			 defaultLabelBGColor: '#fff',
			 defaultLabelHoverColor: '#000',
			 labelThreshold: 5,
			 defaultEdgeType: endge_type
		 }).graphProperties({
			 minNodeSize: 0.5,
			 maxNodeSize: 5,
			 minEdgeSize: 1,
			 maxEdgeSize: 1
		 }).mouseProperties({
			 maxRatio: ratio
		 });
		
		// (requires "sigma.parseGexf.js" to be executed)
		sigInst.parseGexf(l_url);

		/**
		 * Now, here is the code that shows the popup :
		 */
		
		(function(){
			
			var popUp;

			// This function is used to generate the attributes list from the node attributes.
			// Since the graph comes from GEXF, the attibutes look like:
			// [
			// { attr: 'Lorem', val: '42' },
			// { attr: 'Ipsum', val: 'dolores' },
			// ...
			// { attr: 'Sit', val: 'amet' }
			// ]
			function attributesToString(attr) {
				return '' +
				attr.map(function(o){
					return '' + o.attr + ' : ' + o.val + '';
				}).join('') +
				'';
			}

			function showNodeInfo(event) {
				popUp && popUp.remove();

				var node;
				sigInst.iterNodes(function(n){
					node = n;
				},[event.content[0]]);

				popUp = $(
						''
				).append(
				// The GEXF parser stores all the attributes in an array named
				// 'attributes'. And since sigma.js does not recognize the key
				// 'attributes' (unlike the keys 'label', 'color', 'size' etc),
				// it stores it in the node 'attr' object :
						attributesToString( node['attr']['attributes'] )
				).attr(
						'id',
						'node-info'+sigInst.getID()
				).css({
					'display': 'inline-block',
					'border-radius': 3,
					'padding': 5,
					'background': '#fff',
					'color': '#000',
					'box-shadow': '0 0 4px #666',
					'position': 'absolute',
					'left': node.displayX,
					'top': node.displayY+15
				});

				$('ul',popUp).css('margin','0 0 0 20px');
				$('#sigma-example').append(popUp);
			}

			function hideNodeInfo(event) {
				popUp && popUp.remove();
				popUp = false;
			}

			sigInst.bind('overnodes',showNodeInfo).bind('outnodes',hideNodeInfo).draw();
		})();
	}
}


