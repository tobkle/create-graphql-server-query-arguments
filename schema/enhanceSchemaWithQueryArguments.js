'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhanceSchemaWithQueryArguments = enhanceSchemaWithQueryArguments;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _graphql = require('../util/graphql');

var _kinds = require('graphql/language/kinds');

var _constants = require('../constants');

var _capitalization = require('../util/capitalization');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * prepares the schema for the additional query arguments types
 * @public
 * @param {object} inputSchema - the input's schema with all fields
 * @return {object} enhancedSchema - the enhanced output Schema
 */

function enhanceSchemaWithQueryArguments(inputSchema) {
  var enhancedSchema = (0, _lodash2.default)(inputSchema);
  var queryArguments = {};

  if (enhancedSchema.kind === _kinds.DOCUMENT) {
    enhancedSchema.definitions.filter(function (def) {
      return def.kind === _kinds.OBJECT_TYPE_DEFINITION;
    }).forEach(function (_ref) {
      var fields = _ref.fields,
          name = _ref.name;

      var TypeName = name.value;

      // get all field definition types
      var fieldTypes = getFieldTypes(fields);

      // prepare "filter" query argument fields for scalar types
      var filterInputFields = getFilterInputFields(fieldTypes, TypeName);

      // prepare an enum to contain all sortable fields for the orderBy
      var sortEnumValues = getEnumValues(fieldTypes);

      // prepare "orderBy" query argument fields
      var orderByInputFields = getOrderByInputFields(TypeName);

      if (filterInputFields.length > 0) {
        var queryFieldName = (0, _capitalization.lcFirst)(TypeName) + 's';
        var FilterInputTypeName = TypeName + 'Filter';
        var SortEnumTypeName = TypeName + 'Sort';
        var OrderByInputTypeName = TypeName + 'OrderBy';

        addFilterInputType(FilterInputTypeName, filterInputFields, enhancedSchema);
        addSortEnumType(SortEnumTypeName, sortEnumValues, enhancedSchema);
        addOrderByInputType(OrderByInputTypeName, orderByInputFields, enhancedSchema);

        queryArguments[queryFieldName] = {
          filterName: FilterInputTypeName,
          orderByName: '[' + OrderByInputTypeName + '!]'
        };
      }
    });

    // add the newly created types to the Query itself,
    // to make them accessable by users
    addQueryArguments(enhancedSchema, queryArguments);

    // add query arguments to other paginated fields
    addPaginatedFieldsArguments(enhancedSchema);
  }

  return enhancedSchema;
}

/**
 * prepares the orderBy input type
 * @private
 * @param {string} TypeName - the name of the type
 * @return {object} fieldAST - the AST of an input type field
 */

function getOrderByInputFields(TypeName) {
  // prepare "orderBy" query argument fields
  return [(0, _graphql.buildField)('sort', [], TypeName + 'Sort!'), (0, _graphql.buildField)('direction', [], 'Direction = ASC')];
}

/**
 * prepare enum values out of field types
 * @private
 * @param {array} fieldTypes - AST array of field definitions
 * @return {object} fieldAST - the AST of enum values
 */

function getEnumValues(fieldTypes) {
  // prepare an enum to contain all sortable fields for the orderBy
  return fieldTypes.filter(function (field) {
    return field.scalar;
  }).map(function (field) {
    return (0, _graphql.buildValue)(field.name, [], _constants.STRING);
  });
}

/**
 * prepare enum values out of field types
 * @private
 * @param {array} fieldTypes - AST array of field definitions
 * @param {string} TypeName - the name of the type
 * @return {object} fieldAST - the AST of enum values
 */

function getFilterInputFields(fieldTypes, TypeName) {
  // prepare "filter" query argument fields for scalar types
  return fieldTypes.filter(function (field) {
    return field.scalar;
  }).map(function (field) {
    return prepareArgument(field, TypeName);
  }).reduce(function (array, field) {
    return array.concat(field);
  }, [_defineProperty({}, 'AND', '[' + TypeName + 'Filter!]'), _defineProperty({}, 'NOR', '[' + TypeName + 'Filter!]'), _defineProperty({}, 'OR', '[' + TypeName + 'Filter!]')]).map(function (field) {
    var name = Object.keys(field)[0];
    var type = field[name];
    return (0, _graphql.buildField)(name, [], type);
  });
}

/**
 * analyse and identify field information for further processing
 * @private
 * @param {array} fields - AST array of field definitions
 * @return {array} fieldAST - list of field descriptions
 */

function getFieldTypes(fields) {
  return fields.map(function (field) {
    return {
      name: field.name.value,
      type: (0, _graphql.getBaseType)(field.type).name.value,
      scalar: (0, _graphql.isScalarField)(field)
    };
  });
}

/**
 * registers the "filter" input type into the AST
 * @private
 * @param {string} FilterInputTypeName - name of the input field
 * @param {array} filterInputFields - AST array of field definitions
 * @param {object} enhancedSchema - AST of the document
 */

function addFilterInputType(FilterInputTypeName, filterInputFields, enhancedSchema) {
  // add "input <TypeName>Filter" type to the schema
  enhancedSchema.definitions.push((0, _graphql.buildTypeDefinition)(FilterInputTypeName, filterInputFields, _kinds.INPUT_OBJECT_TYPE_DEFINITION));
}

/**
 * registers the "enum <Type>Sort" enum type into the AST
 * @private
 * @param {string} SortEnumTypeName - name of the enum field
 * @param {array} sortEnumValues - AST array of field definitions
 * @param {object} enhancedSchema - AST of the document
 */

function addSortEnumType(SortEnumTypeName, sortEnumValues, enhancedSchema) {
  // add "enum <TypeName>Sort" type
  enhancedSchema.definitions.push((0, _graphql.buildTypeDefinition)(SortEnumTypeName, [], _kinds.ENUM_TYPE_DEFINITION, sortEnumValues));
}

/**
 * registers the "input <Type>OrderBy" input type into the AST
 * @private
 * @param {string} OrderByInputTypeName - name of the input field
 * @param {array} orderByInputFields - AST array of field definitions
 * @param {object} enhancedSchema - AST of the document
 */

function addOrderByInputType(OrderByInputTypeName, orderByInputFields, enhancedSchema) {
  // add "input <TypeName>OrderBy" type
  enhancedSchema.definitions.push((0, _graphql.buildTypeDefinition)(OrderByInputTypeName, orderByInputFields, _kinds.INPUT_OBJECT_TYPE_DEFINITION));
}

/**
 * adds the query arguments "filter" and "orderBy" to the "extend Query" type
 * @private
 * @param {object} enhancedSchema - AST document definition, to be enhanced
 * @param {array} queryArguments - dictionary of queryArguments to be added
 */

function addQueryArguments(enhancedSchema, queryArguments) {
  // add the arguments to the Query:
  // e.g.: tweets(filter: TweetFilter, orderBy: [TweetOrderBy!])
  enhancedSchema.definitions.filter(function (def) {
    return def.kind === _kinds.TYPE_EXTENSION_DEFINITION && def.definition.kind === _kinds.OBJECT_TYPE_DEFINITION && def.definition.name.value === _constants.QUERY;
  }).forEach(function (_ref5) {
    var definition = _ref5.definition;
    var fields = definition.fields,
        name = definition.name;


    if (fields && name) {
      // find the right fields
      fields
      // only in field definition, which are a list, such as 'users'
      .filter(function (field) {
        return field.type.kind === _kinds.LIST_TYPE && field.kind === _kinds.FIELD_DEFINITION;
      }).forEach(function (field) {
        // as arguments is a reserved field, we need to rename to args
        var args = field.arguments;

        var queryArgument = queryArguments[field.name.value];
        // if we have arguments to add for this type e.g. 'users'
        if (queryArgument && field.name.kind === _kinds.NAME && args) {
          // add "skip" query argument
          args.push((0, _graphql.buildArgument)('skip', 'Int'));

          // add "filter" query argument
          args.push((0, _graphql.buildArgument)('filter', queryArgument.filterName));

          // add "orderBy" query argument
          args.push((0, _graphql.buildArgument)('orderBy', queryArgument.orderByName));
        }
      });
    }
  });
}

/**
 * adds the query arguments "filter" and "orderBy" to the type paginated fields
 * @private
 * @param {object} enhancedSchema - AST document definition, to be enhanced
 * @param {array} queryArguments - dictionary of queryArguments to be added
 */

function addPaginatedFieldsArguments(enhancedSchema) {
  // add the arguments to other paginated fields
  // e.g.: tweets(filter: TweetFilter, orderBy: [TweetOrderBy!])
  enhancedSchema.definitions.filter(function (def) {
    return def.kind === _kinds.OBJECT_TYPE_DEFINITION;
  }).forEach(function (definition) {
    var fields = definition.fields,
        name = definition.name;


    if (fields && name) {
      // find the right fields
      fields
      // only in field definition, which are a list, such as 'users'
      .filter(function (field) {
        return field.type.kind === _kinds.LIST_TYPE && field.kind === _kinds.FIELD_DEFINITION;
      }).forEach(function (field) {
        // get its target type
        var targetType = field.type.type.name.value;
        var filterName = targetType + 'Filter';
        var orderByName = '[' + targetType + 'OrderBy!]';

        // as arguments is a reserved field, we need to rename to args
        var args = field.arguments;

        // add "skip" query argument
        args.push((0, _graphql.buildArgument)('skip', 'Int'));

        // add "filter" query argument
        args.push((0, _graphql.buildArgument)('filter', filterName));

        // add "orderBy" query argument
        args.push((0, _graphql.buildArgument)('orderBy', orderByName));
      });
    }
  });
}

/**
 * define the combinations of input and output types
 * depending on the later expected values for the functions
 * @private
 * @param {object} field - field of the type
 * @property {string} name - name of the field
 * @property {string} type - type of the field
 * @param {string} TypeName - name of the type
 * @return {array} argumentFields - map of arguments and their types
 */

function prepareArgument(_ref6, TypeName) {
  var name = _ref6.name,
      type = _ref6.type;

  switch (type) {
    case _constants.STRING:
    case _constants.ENUM:
      return [_defineProperty({}, '' + name, type), _defineProperty({}, name + '_lt', type), _defineProperty({}, name + '_lte', type), _defineProperty({}, name + '_gt', type), _defineProperty({}, name + '_gte', type), _defineProperty({}, name + '_eq', type), _defineProperty({}, name + '_ne', type), _defineProperty({}, name + '_not', TypeName + 'Filter'), _defineProperty({}, name + '_all', '[' + type + '!]'), _defineProperty({}, name + '_in', '[' + type + '!]'), _defineProperty({}, name + '_nin', '[' + type + '!]'), _defineProperty({}, name + '_not_in', '[' + type + '!]'), _defineProperty({}, name + '_exists', _constants.BOOLEAN), _defineProperty({}, name + '_type', _constants.BSON_TYPE), _defineProperty({}, name + '_regex', _constants.REGEX), _defineProperty({}, name + '_contains', _constants.STRING), _defineProperty({}, name + '_starts_with', _constants.STRING), _defineProperty({}, name + '_ends_with', _constants.STRING), _defineProperty({}, name + '_not_contains', _constants.STRING), _defineProperty({}, name + '_not_starts_with', _constants.STRING), _defineProperty({}, name + '_not_ends_with', _constants.STRING), _defineProperty({}, name + '_contains_ci', _constants.STRING), _defineProperty({}, name + '_starts_with_ci', _constants.STRING), _defineProperty({}, name + '_ends_with_ci', _constants.STRING), _defineProperty({}, name + '_not_contains_ci', _constants.STRING), _defineProperty({}, name + '_not_starts_with_ci', _constants.STRING), _defineProperty({}, name + '_not_ends_with_ci', _constants.STRING)];

    case _constants.INT:
    case _constants.FLOAT:
      return [_defineProperty({}, '' + name, type), _defineProperty({}, name + '_lt', type), _defineProperty({}, name + '_lte', type), _defineProperty({}, name + '_gt', type), _defineProperty({}, name + '_gte', type), _defineProperty({}, name + '_eq', type), _defineProperty({}, name + '_ne', type), _defineProperty({}, name + '_all', '[' + type + '!]'), _defineProperty({}, name + '_in', '[' + type + '!]'), _defineProperty({}, name + '_nin', '[' + type + '!]'), _defineProperty({}, name + '_not_in', '[' + type + '!]'), _defineProperty({}, name + '_exists', _constants.BOOLEAN), _defineProperty({}, name + '_type', _constants.BSON_TYPE)];

    case _constants.BOOLEAN:
    default:
      return [_defineProperty({}, '' + name, type), _defineProperty({}, name + '_eq', type), _defineProperty({}, name + '_ne', type), _defineProperty({}, name + '_all', '[' + type + '!]'), _defineProperty({}, name + '_in', '[' + type + '!]'), _defineProperty({}, name + '_nin', '[' + type + '!]'), _defineProperty({}, name + '_not_in', '[' + type + '!]'), _defineProperty({}, name + '_exists', _constants.BOOLEAN), _defineProperty({}, name + '_type', _constants.BSON_TYPE)];
  }
}