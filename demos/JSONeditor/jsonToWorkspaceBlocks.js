function jsonToWorkspaceBlocks(jsonString) {
	var ret = '<xml><block type="root" deletable="false" moveable="false" x="40" y="40" ><statement name="contents">';
	var jsonData = JSON.parse(jsonString);
	
	function randomID() {
		return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
	}
	
	function generateObject(jsonObj) {	//recursively generate an Object.
		var dat = "";
		var cnt = 0;
		for (key in jsonObj) {
			dat += '<block type="objectkey" id="obj_' + randomID() + '"><field name="key">' + key + '</field><value name="value">';
			var type = (typeof jsonObj[key]).toLowerCase()
			var isArr = Array.isArray(jsonObj[key]);
			var isNull = jsonObj[key] == null
			switch (type) {
				case 'object':
					if (isArr == true) {
						//this is an Array. It contains elements.
						dat += generateArray(jsonObj[key])
					}
					else if (isNull == true){
						//this is null. It is an atom.
						dat += '<block type="null" id="null_' + randomID() + '"></block>';
					}
					else {
						//this is an Object. It contains elements.
						dat += '<block type="object" id="obj_' + randomID() + '"><statement name="keys">';
						dat += generateObject(jsonObj[key]);
						dat += '</statement></block>'
					}
					break;
				default:
					//this is an atom (except null). Send it to the atom function.
					dat += generateAtom(jsonObj[key]);
					break;
			}
			dat += "</value><next>"
			cnt++;
		}
		while (cnt >0) {
			dat += '</next></block>'
			cnt--
		}
		return dat;
	}
	
	function generateAtom(atom) {	//generate an atomic element.
		if (typeof atom == 'string') {	
			return '<block type="string" id="str_' + randomID() + '"><field name="str">' + atom + '</field></block>';
		}
		if (typeof atom == 'number') {
			return '<block type="math_number" id="num_' + randomID() + '"><field name="NUM">' + atom + '</field></block>';
		}
		if (typeof atom == 'boolean') {
			return '<block type="logic_boolean" id="bool_' + randomID() + '"><field name="BOOL">' + atom + '</field></block>';
		}
		return '<block type="null" id="null_' + randomID() + '"></block>';
	}
	
	function generateArray(arr) {	//recursively generate an Array.
		var ret = '<block type="array" id="arr_' + randomID() + '"><mutation elt_count="' + arr.length + '"></mutation>';
		for (var i=0; i<arr.length; i++) {
			if ((typeof arr[i]) != 'object' || arr[i] == null){
				ret += '<value name="elt' + i +'" >' + generateAtom(arr[i]) + '</value>';
			}
			else if (Array.isArray(arr[i])) {
				ret += '<value name="elt' + i +'" >' + generateArray(arr[i]) + '</value>';
			}
			else {
				ret += '<value name="elt' + i +'" ><block type="object" id="obj_' + randomID() + '" ><statement name="keys">' + generateObject(arr[i]) + '</statement></block></value>';
			}
		}
		ret += '</block>'
		
		return ret;
	}
	
	ret += generateObject(jsonData);
	
	ret += '</statement></block></xml>';
	
	return ret;
}