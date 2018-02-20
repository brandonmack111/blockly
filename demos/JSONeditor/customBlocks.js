Blockly.defineBlocksWithJsonArray([{
  "type": "root",
  "message0": "{ %1 %2 }",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "contents",
      "check": "ObjectKey"
    }
  ],
  "colour": 65,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "object",
  "message0": "{ %1 %2 }",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "keys",
      "check": "ObjectKey"
    }
  ],
  "output": "Object",
  "colour": 65,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "objectkey",
  "message0": "%1 : %2",
  "args0": [
    {
      "type": "field_input",
      "name": "key",
      "text": "someName"
    },
    {
      "type": "input_value",
      "name": "value",
      "check": [
        "String",
        "Number",
        "Object",
        "Array",
        "Boolean",
        "null"
      ]
    }
  ],
  "previousStatement": "ObjectKey",
  "nextStatement": "ObjectKey",
  "colour": 65,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "null",
  "message0": "null",
  "output": "null",
  "colour": 0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "string",
  "message0": "\" %1 \"",
  "args0": [
    {
      "type": "field_input",
      "name": "str",
      "text": ""
    }
  ],
  "output": "String",
  "colour": 160,
  "tooltip": "",
  "helpUrl": ""
}])

Blockly.Blocks['array'] = {
  init: function() {
    this.setHelpUrl("");
    this.setColour(260);
    this.eltCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.Mutator(['input_mutator_elt']));
    this.setTooltip("");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('elt_count', this.eltCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.eltCount_ = parseInt(xmlElement.getAttribute('elt_count'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('input_mutator');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('inputs').connection;
    for (var i = 0; i < this.eltCount_; i++) {
      var itemBlock = workspace.newBlock('input_mutator_elt');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('inputs');
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.eltCount_; i++) {
      var connection = this.getInput('elt' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.eltCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.eltCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'elt' + i);
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('inputs');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('elt' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    if (this.eltCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.eltCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField('Create empty Array');
    }
    // elt new inputs.
    for (var i = 0; i < this.eltCount_; i++) {
      if (!this.getInput('elt' + i)) {
        var input = this.appendValueInput('elt' + i);
        if (i == 0) {
          input.appendField('Create Array with');
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput('elt' + i)) {
      this.removeInput('elt' + i);
      i++;
    }
  }
};

Blockly.Blocks['input_mutator'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("inputs");
    this.appendStatementInput("inputs")
        .setCheck("InputElt");
    this.setColour(260);
 this.setTooltip("");
 this.contextMenu = false;
  }
};

Blockly.Blocks['input_mutator_elt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("input");
    this.setPreviousStatement(true, "InputElt");
    this.setNextStatement(true, "InputElt");
    this.setColour(260);
 this.setTooltip("");
 this.contextMenu = false;
  }
};