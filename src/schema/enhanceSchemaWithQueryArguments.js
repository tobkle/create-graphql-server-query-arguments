// @flow
import cloneDeep from 'lodash.clonedeep';

import {
  getBaseType,
  buildTypeDefinition,
  buildField,
  buildValue,
  buildArgument,
  isScalarField
} from '../util/graphql';

import {
  DOCUMENT,
  OBJECT_TYPE_DEFINITION,
  INPUT_OBJECT_TYPE_DEFINITION,
  ENUM_TYPE_DEFINITION,
  TYPE_EXTENSION_DEFINITION,
  LIST_TYPE,
  FIELD_DEFINITION,
  NAME
} from 'graphql/language/kinds';

import {
  INT,
  FLOAT,
  STRING,
  ENUM,
  BOOLEAN,
  BSON_TYPE,
  REGEX,
  QUERY
} from '../constants';

import { lcFirst } from '../util/capitalization';

/**
 * prepares the schema for the additional query arguments types
 * @public
 * @param {object} inputSchema - the input's schema with all fields
 * @return {object} outputSchema - the enhanced output Schema
 */

export function enhanceSchemaWithQueryArguments(inputSchema: any): any {
  const enhancedSchema = cloneDeep(inputSchema);
  const queryArguments = {};

  if (enhancedSchema.kind === DOCUMENT) {
    enhancedSchema.definitions
      .filter(def => def.kind === OBJECT_TYPE_DEFINITION)
      .forEach(({ fields, name }) => {
        const TypeName = name.value;

        // get all field definition types
        const fieldTypes = getFieldTypes(fields);

        // prepare "filter" query argument fields for scalar types
        const filterInputFields = getFilterInputFields(fieldTypes, TypeName);

        // prepare an enum to contain all sortable fields for the orderBy
        const sortEnumValues = getEnumValues(fieldTypes);

        // prepare "orderBy" query argument fields
        const orderByInputFields = getOrderByInputFields(TypeName);

        if (filterInputFields.length > 0) {
          const queryFieldName = `${lcFirst(TypeName)}s`;
          const FilterInputTypeName = `${TypeName}Filter`;
          const SortEnumTypeName = `${TypeName}Sort`;
          const OrderByInputTypeName = `${TypeName}OrderBy`;

          addFilterInputType(
            FilterInputTypeName,
            filterInputFields,
            enhancedSchema
          );
          addSortEnumType(SortEnumTypeName, sortEnumValues, enhancedSchema);
          addOrderByInputType(
            OrderByInputTypeName,
            orderByInputFields,
            enhancedSchema
          );

          queryArguments[queryFieldName] = {
            filterName: FilterInputTypeName,
            orderByName: `[${OrderByInputTypeName}!]`
          };
        }
      });

    // add the newly created types to the Query itself,
    // to make them accessable by users
    addQueryArguments(enhancedSchema, queryArguments);
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
  return [
    buildField('sort', [], `${TypeName}Sort!`),
    buildField('direction', [], 'Direction = ASC')
  ];
}

/**
 * prepare enum values out of field types
 * @private
 * @param {array} fieldTypes - AST array of field definitions
 * @return {object} fieldAST - the AST of enum values
 */

function getEnumValues(fieldTypes) {
  // prepare an enum to contain all sortable fields for the orderBy
  return fieldTypes
    .filter(field => field.scalar)
    .map(field => buildValue(field.name, [], STRING));
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
  return fieldTypes
    .filter(field => field.scalar)
    .map(field => prepareArgument(field, TypeName))
    .reduce((array, field) => array.concat(field), [
      { [`AND`]: `[${TypeName}Filter!]` },
      { [`NOR`]: `[${TypeName}Filter!]` },
      { [`OR`]: `[${TypeName}Filter!]` }
    ])
    .map(field => {
      const name = Object.keys(field)[0];
      const type = field[name];
      return buildField(name, [], type);
    });
}

/**
 * analyse and identify field information for further processing
 * @private
 * @param {array} fields - AST array of field definitions
 * @return {array} fieldAST - list of field descriptions
 */

function getFieldTypes(fields) {
  return fields.map(field => ({
    name: field.name.value,
    type: getBaseType(field.type).name.value,
    scalar: isScalarField(field)
  }));
}

/**
 * registers the "filter" input type into the AST
 * @private
 * @param {string} FilterInputTypeName - name of the input field
 * @param {array} filterInputFields - AST array of field definitions
 * @param {object} enhancedSchema - AST of the document
 */

function addFilterInputType(
  FilterInputTypeName,
  filterInputFields,
  enhancedSchema
) {
  // add "input <TypeName>Filter" type to the schema
  enhancedSchema.definitions.push(
    buildTypeDefinition(
      FilterInputTypeName,
      filterInputFields,
      INPUT_OBJECT_TYPE_DEFINITION
    )
  );
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
  enhancedSchema.definitions.push(
    buildTypeDefinition(
      SortEnumTypeName,
      [],
      ENUM_TYPE_DEFINITION,
      sortEnumValues
    )
  );
}

/**
 * registers the "input <Type>OrderBy" input type into the AST
 * @private
 * @param {string} OrderByInputTypeName - name of the input field
 * @param {array} orderByInputFields - AST array of field definitions
 * @param {object} enhancedSchema - AST of the document
 */

function addOrderByInputType(
  OrderByInputTypeName,
  orderByInputFields,
  enhancedSchema
) {
  // add "input <TypeName>OrderBy" type
  enhancedSchema.definitions.push(
    buildTypeDefinition(
      OrderByInputTypeName,
      orderByInputFields,
      INPUT_OBJECT_TYPE_DEFINITION
    )
  );
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
  enhancedSchema.definitions
    .filter(
      def =>
        def.kind === TYPE_EXTENSION_DEFINITION &&
        def.definition.kind === OBJECT_TYPE_DEFINITION &&
        def.definition.name.value === QUERY
    )
    .forEach(({ definition }) => {
      const { fields, name } = definition;

      if (fields && name) {
        // find the right fields
        fields
          // only in field definition, which are a list, such as 'users'
          .filter(
            field =>
              field.type.kind === LIST_TYPE && field.kind === FIELD_DEFINITION
          )
          .forEach(field => {
            // as arguments is a reserved field, we need to rename to args
            const args = field.arguments;

            const queryArgument = queryArguments[field.name.value];
            // if we have arguments to add for this type e.g. 'users'
            if (queryArgument && field.name.kind === NAME && args) {
              // add "skip" query argument
              args.push(buildArgument('skip', 'Int'));

              // add "filter" query argument
              args.push(buildArgument('filter', queryArgument.filterName));

              // add "orderBy" query argument
              args.push(buildArgument('orderBy', queryArgument.orderByName));
            }
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
 * @return {array} argumentFields - map of arguments and their types
 */

function prepareArgument({ name, type }, TypeName) {
  switch (type) {
    case STRING:
    case ENUM:
      return [
        { [`${name}`]: type },
        { [`${name}_lt`]: type },
        { [`${name}_lte`]: type },
        { [`${name}_gt`]: type },
        { [`${name}_gte`]: type },
        { [`${name}_eq`]: type },
        { [`${name}_ne`]: type },
        { [`${name}_not`]: `${TypeName}Filter` },
        { [`${name}_all`]: `[${type}!]` },
        { [`${name}_in`]: `[${type}!]` },
        { [`${name}_nin`]: `[${type}!]` },
        { [`${name}_not_in`]: `[${type}!]` },
        { [`${name}_exists`]: BOOLEAN },
        { [`${name}_type`]: BSON_TYPE },
        { [`${name}_regex`]: REGEX },
        { [`${name}_contains`]: STRING },
        { [`${name}_starts_with`]: STRING },
        { [`${name}_ends_with`]: STRING },
        { [`${name}_not_contains`]: STRING },
        { [`${name}_not_starts_with`]: STRING },
        { [`${name}_not_ends_with`]: STRING },
        { [`${name}_contains_ci`]: STRING },
        { [`${name}_starts_with_ci`]: STRING },
        { [`${name}_ends_with_ci`]: STRING },
        { [`${name}_not_contains_ci`]: STRING },
        { [`${name}_not_starts_with_ci`]: STRING },
        { [`${name}_not_ends_with_ci`]: STRING }
      ];

    case INT:
    case FLOAT:
      return [
        { [`${name}`]: type },
        { [`${name}_lt`]: type },
        { [`${name}_lte`]: type },
        { [`${name}_gt`]: type },
        { [`${name}_gte`]: type },
        { [`${name}_eq`]: type },
        { [`${name}_ne`]: type },
        { [`${name}_all`]: `[${type}!]` },
        { [`${name}_in`]: `[${type}!]` },
        { [`${name}_nin`]: `[${type}!]` },
        { [`${name}_not_in`]: `[${type}!]` },
        { [`${name}_exists`]: BOOLEAN },
        { [`${name}_type`]: BSON_TYPE }
      ];

    case BOOLEAN:
    default:
      return [
        { [`${name}`]: type },
        { [`${name}_eq`]: type },
        { [`${name}_ne`]: type },
        { [`${name}_all`]: `[${type}!]` },
        { [`${name}_in`]: `[${type}!]` },
        { [`${name}_nin`]: `[${type}!]` },
        { [`${name}_not_in`]: `[${type}!]` },
        { [`${name}_exists`]: BOOLEAN },
        { [`${name}_type`]: BSON_TYPE }
      ];
  }
}
