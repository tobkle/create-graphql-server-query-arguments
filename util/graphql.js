'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SCALAR_TYPE_NAMES = undefined;
exports.getBaseType = getBaseType;
exports.argumentsToObject = argumentsToObject;
exports.isScalarField = isScalarField;
exports.buildName = buildName;
exports.buildTypeDefinition = buildTypeDefinition;
exports.buildTypeExtension = buildTypeExtension;
exports.buildTypeReference = buildTypeReference;
exports.buildField = buildField;
exports.buildValue = buildValue;
exports.buildArgument = buildArgument;
exports.addPaginationArguments = addPaginationArguments;
exports.applyCustomDirectives = applyCustomDirectives;
exports.idArgument = idArgument;
exports.getType = getType;

var _graphql = require('graphql');

var _lodash = require('lodash.includes');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCALAR_TYPE_NAMES = exports.SCALAR_TYPE_NAMES = ['Int', 'Float', 'String', 'Boolean', 'ID', 'ObjID'];

function getBaseType(type) {
  if (type.kind === 'ListType' || type.kind === 'NonNullType') {
    return getBaseType(type.type);
  }
  return type;
}

function argumentsToObject(argumentsAst) {
  var result = {};
  argumentsAst.forEach(function (argument) {
    result[argument.name.value] = argument.value.value;
  });
  return result;
}

function isScalarField(field) {
  return (0, _lodash2.default)(SCALAR_TYPE_NAMES, getBaseType(field.type).name.value);
}

function buildName(name) {
  return { kind: 'Name', value: name };
}

function buildTypeDefinition(name, fields, kind, values) {
  return {
    kind: kind || 'ObjectTypeDefinition',
    name: buildName(name),
    interfaces: [],
    directives: [],
    fields: fields,
    values: values || []
  };
}

function buildTypeExtension(type) {
  return {
    kind: _graphql.Kind.TYPE_EXTENSION_DEFINITION,
    definition: type
  };
}

function buildTypeReference(name) {
  if (name[name.length - 1] === '!') {
    return {
      kind: 'NonNullType',
      type: buildTypeReference(name.substring(0, name.length - 1))
    };
  }

  if (name[0] === '[' && name[name.length - 1] === ']') {
    return {
      kind: 'ListType',
      type: buildTypeReference(name.substring(1, name.length - 1))
    };
  }

  return {
    kind: 'NamedType',
    name: buildName(name)
  };
}

function buildField(name, args, typeName) {
  return {
    kind: 'FieldDefinition',
    name: buildName(name),
    arguments: args,
    type: buildTypeReference(typeName)
  };
}

function buildValue(name, args) {
  return {
    kind: 'EnumValueDefinition',
    name: buildName(name),
    arguments: args
  };
}

function buildArgument(name, type) {
  return {
    kind: 'InputValueDefinition',
    name: buildName(name),
    type: buildTypeReference(type),
    defaultValue: null,
    directives: []
  };
}

function addPaginationArguments(field) {
  field.arguments.push(buildArgument('lastCreatedAt', 'Float'));
  field.arguments.push(buildArgument('limit', 'Int'));
}

// Apply all the directives that modify the field's schema. At this stage
// this is simply the pagination directives, which add pagination arguments
// to the field.
function applyCustomDirectives(field) {
  field.directives.forEach(function (directive) {
    var directiveName = directive.name.value;
    var isPaginated = (0, _lodash2.default)(['hasMany', 'hasAndBelongsToMany', 'belongsToMany'], directiveName);
    if (isPaginated) {
      addPaginationArguments(field);
    }
  });
}

function idArgument() {
  return buildArgument('id', 'ObjID!');
}

function getType(level) {
  if (level.kind === 'NamedType') {
    return level.name.value;
  }

  if (level.type) {
    return getType(level.type);
  }

  return '';
}