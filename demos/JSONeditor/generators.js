Blockly.JavaScript['root'] = function(block) {
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  var code = '{' + statements_contents.slice(0,-1) + '}';
  return code;
};

Blockly.JavaScript['object'] = function(block) {
  var statements_keys = Blockly.JavaScript.statementToCode(block, 'keys');
  var code = '{' + statements_keys.slice(0,-1) + '  }';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['objectkey'] = function(block) {
  var text_key = block.getFieldValue('key');
  var value_value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC) || null;
  var code = '"' + text_key.replace(/"/g, '\\"') + '": ' + value_value + ',';
  return code;
};

Blockly.JavaScript['array'] = function(block) {
  var elts = [];
  for (var i=0; i<block.eltCount_; i++) {
	  elts[i] = Blockly.JavaScript.valueToCode(block, 'elt' + i,
		Blockly.JavaScript.ORDER_COMMA) || 'null';
  }
  var code = '[' + elts.join(', ') + ']';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['null'] = function(block) {
  var code = 'null';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['string'] = function(block) {
  var text_str = block.getFieldValue('str');
  var code = '"' + text_str.replace(/"/g, '\\"') + '"';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};