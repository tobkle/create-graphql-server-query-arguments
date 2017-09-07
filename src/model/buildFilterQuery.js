// @flow
import isArrayLike from 'lodash.isarraylike';
import isObject from 'lodash.isobject';

/*
 * build a query for the type model accessing mongodb
 * @public
 */

export function buildFilterQuery(args: any): any {
  const query = {};

  // on primitive types, just return the data as leaf values in the recursion
  switch (typeof args) {
    case 'boolean':
      return args;
    case 'number':
      return args;
    case 'string':
      return args;
    case 'function':
      return args;
    case 'object':
      // only on "ObjectID"s, we don't go deeper into this Object
      // other "objects" will be handled below
      if (args._bsontype && args._bsontype === 'ObjectID') {
        return args;
      }
  }

  // on array like types, return the interpreted mapped values.
  // array elements can be also query objects,
  // so we have to analyze each one of them first, before we return them
  // back as an array
  if (isArrayLike(args) && args.length && args.length > 0) {
    return args.map(item => buildFilterQuery(item));
  }

  // on object like types, analyze the graphql provided query arguments...
  if (isObject(args)) {
    // get all the keys of the argument
    const keys = Object.keys(args);

    // analyze all arguments and map them to mongodb query parts
    keys.forEach(key => {
      // a key might look like: e.g. "bodyText_not_starts_with"
      // to analyze it, we need to split off the field name from the operation
      const keyParts = key.split('_');

      // number of keyParts e.g. 4 as a cloned field, as keyParts changes later
      const length = 0 + keyParts.length;

      // the fieldName is then e.g. "bodyText", get the first array element
      let fieldName = keyParts.shift();

      // our "id" field is in mongo "_id"
      if (fieldName === 'id') {
        fieldName = '_id';
      }

      // the operation is then: e.g. "not_starts_with"
      const operation = keyParts.join('_');

      // the value which was passed in to this operation, might be a deep Object
      // so it has to be analyzed recursively
      const value = args[key];

      switch (length) {
        // if there is only 1 key part provided, it must be one of the special
        // cases such as AND, NOT NOR, OR,
        // or the default case, that it had just provided a simple field name
        case 1:
          switch (fieldName) {
            case 'AND':
              // $and performs a logical AND operation on an array of two or
              // more expressions, (e.g. <expression1>, <expression2>, etc.)
              // and selects the documents, that satisfy all the expressions
              // in the array.
              //     $and   : [ { tags: "ssl" }, { tags: "security" } ]
              query['$and'] = buildFilterQuery(value);
              break;

            case 'NOR':
              // $nor performs a logical NOR operation on an array of one or
              // more query expression and selects the documents that fail
              // all the query expressions in the array.
              // db.inventory.find({ $nor: [ { price: 1.99 }, { sale: true } ]})
              query['$nor'] = buildFilterQuery(value);
              break;

            case 'OR':
              // $or operator performs a logical OR operation on an array of
              // two or more <expressions> and selects the documents that
              // satisfy at least one of the <expressions>.
              // db.inventory.find({
              //   $or: [ { quantity: { $lt: 20 } }, { price: 10 } ]
              // })
              query['$or'] = buildFilterQuery(value);
              break;

            default:
              // the trivial case
              // fieldName = value
              query[fieldName] = buildFilterQuery(value);
              break;
          }
          break;

        // if there are more than one keyParts, we know, it must be
        // one of the following operations,
        // provided from the graphql schema as filter arguments
        default:
          switch (operation) {
            case 'all':
              // $all operator selects the documents, where the value of
              // a field is an array
              // that contains all the specified elements. To specify an
              // $all expression
              //         tags:   {  $all : [ "ssl" , "security"       ] }
              //        field:   {  $all : [ <value1> , <value2> ...  ] }
              query[fieldName] = { $all: buildFilterQuery(value) };
              break;

            case 'eq':
              // $eq specifies equality condition. The $eq operator matches
              // documents where the value of a field equals the specified value
              // db.inventory.find( { qty: { $eq: 20 } } )
              query[fieldName] = { $eq: buildFilterQuery(value) };
              break;

            case 'ne':
              // $ne selects the documents where the value of the field is
              // not equal (i.e. !=) to the specified value. This includes
              // documents that do not contain the field.
              //        field:   {  $ne : value                        }
              query[fieldName] = { $ne: buildFilterQuery(value) };
              break;

            case 'in':
              // $in operator selects the documents where the value of a
              // field equals any value
              // in the specified array.
              // db.inventory.find( { qty: { $in: [ 5, 15 ] } } )
              query[fieldName] = { $in: buildFilterQuery(value) };
              break;

            case 'nin':
              // $nin selects the documents where:
              //  * the field value is not in the specified array or
              //  * the field does not exist.
              // db.inventory.find( { qty: { $nin: [ 5, 15 ] } } )
              query[fieldName] = { $nin: buildFilterQuery(value) };
              break;

            case 'lt':
              // $lt selects the documents where the value of the field is less
              // than (i.e. <) the specified value.
              // db.inventory.find( { qty: { $lt: 20 } } )
              query[fieldName] = { $lt: buildFilterQuery(value) };
              break;

            case 'lte':
              // $lte selects the documents where the value of the field
              // is less than or equal to (i.e. <=) the specified value.
              // db.inventory.find( { qty: { $lte: 20 } } )
              query[fieldName] = { $lte: buildFilterQuery(value) };
              break;

            case 'gt':
              // $gt selects those documents where the value of the field
              // is greater than (i.e. >) the specified value.
              // db.inventory.find( { qty: { $gt: 20 } } )
              query[fieldName] = { $gt: buildFilterQuery(value) };
              break;

            case 'gte':
              // $gte selects the documents where the value of the field
              // is greater than or equal to (i.e. >=) a specified value
              // e.g. value.
              // db.inventory.find( { qty: { $gte: 20 } } )
              query[fieldName] = { $gte: buildFilterQuery(value) };
              break;

            case 'not':
              // $not performs a logical NOT operation on the specified
              //  <operator-expression> and selects the documents that
              // do not match the <operator-expression>.
              // This includes documents that do not contain the field.
              // db.inventory.find( { price: { $not: { $gt: 1.99 } } } )

              const subQuery = buildFilterQuery(value);
              if (subQuery[fieldName]) {
                query[fieldName] = { $not: subQuery[fieldName] };
              } else {
                // this shouldn't happen, but for safety reasons
                query[fieldName] = { $not: buildFilterQuery(value) };
              }
              break;

            case 'exists':
              // Syntax: { field: { $exists: <boolean> } }
              // When <boolean> is true, $exists matches the documents
              // that contain the field, including documents where the
              // field value is null.
              // If <boolean> is false, the query returns only the documents
              //  that do not contain the field.
              query[fieldName] = { $exists: buildFilterQuery(value) };
              break;

            case 'type':
              // $type selects the documents where the value of the field
              // is an instance of the specified BSON type.
              // Querying by data type is useful when dealing with
              // highly unstructured data where data types are not predictable
              // { field: { $type: <BSON type number> | <String alias> } }
              // look for the type: enum BSONType
              query[fieldName] = { $type: buildFilterQuery(value) };
              break;

            case 'not_in':
              // $in operator selects the documents where the value of a
              // field equals any value
              // in the specified array. $not inverses
              // db.inventory.find( { qty: { $in: [ 5, 15 ] } } )
              query[fieldName] = { $nin: buildFilterQuery(value) };
              break;

            case 'regex':
              // in schema defined graphql type:
              // type regex {
              //   regex: String
              //   option: Enum (type option { global, multiline, ...})
              // }
              // so we need to map the options first to mongoDB regex options:
              let options = '';
              if (value.options) {
                value.options.forEach(option => {
                  switch (option) {
                    case 'global':
                      options += 'g';
                      break;
                    case 'multiline':
                      options += 'm';
                      break;
                    case 'insensitive':
                      options += 'i';
                      break;
                    case 'sticky':
                      options += 'y';
                      break;
                    case 'unicode':
                      options += 'u';
                      break;
                  }
                });
              }

              // assign it directly, as deeper structures aren't allowed here
              query[fieldName] = {
                $regex: value.regex,
                $options: options
              };
              break;

            case 'contains':
              // the field contains this string
              query[fieldName] = {
                $regex: buildFilterQuery(value)
              };
              break;

            case 'starts_with':
              // the field starts with this string
              query[fieldName] = {
                $regex: `^${buildFilterQuery(value)}`,
                $options: 'm'
              };
              break;

            case 'ends_with':
              // the field ends with this string
              query[fieldName] = {
                $regex: `${buildFilterQuery(value)}$`,
                $options: 'm'
              };
              break;

            case 'not_contains':
              // the field does not contain this string
              query[fieldName] = {
                $regex: `^(?!.*${buildFilterQuery(value)})`,
                $options: 'm'
              };
              break;

            case 'not_starts_with':
              // the field ends not with this string
              query[fieldName] = {
                $regex: `^(?!${buildFilterQuery(value)})`,
                $options: 'm'
              };
              break;

            case 'not_ends_with':
              // // the field ends with this string
              // query[fieldName] = {
              //   $regex: `(?!${buildFilterQuery(value)})$`,
              //   $options: 'm'
              // };
              // the field ends with this string case-in-sensitive
              // it is called "negated or negative lookbehind" .*(?<!xyz)$
              // Javascript isn't supporting this today
              // so have to use a complicated look ahead pattern instead
              query[fieldName] = {
                $regex: `^(?!.*${buildFilterQuery(value)}$).*$`,
                $options: 'gm'
              };
              break;

            case 'contains_ci':
              // the field contains this string case-in-sensitive
              query[fieldName] = {
                $regex: buildFilterQuery(value),
                $options: 'im'
              };
              break;

            case 'starts_with_ci':
              // the field starts with this string case-in-sensitive
              query[fieldName] = {
                $regex: `^${buildFilterQuery(value)}`,
                $options: 'im'
              };
              break;

            case 'ends_with_ci':
              // the field ends with this string case-in-sensitive
              query[fieldName] = {
                $regex: `${buildFilterQuery(value)}$`,
                $options: 'im'
              };
              break;

            case 'not_contains_ci':
              // the field does not contain this string case-in-sensitive
              query[fieldName] = {
                $regex: `^(?!.*${buildFilterQuery(value)})`,
                $options: 'im'
              };
              break;

            case 'not_starts_with_ci':
              // the field starts with this string case-in-sensitive
              query[fieldName] = {
                // $not: {
                $regex: `^(?!${buildFilterQuery(value)})`,
                $options: 'im'
                // }
              };
              break;

            case 'not_ends_with_ci':
              // the field ends with this string case-in-sensitive
              // it is called "negated or negative lookbehind" .*(?<!xyz)$
              // Javascript isn't supporting this today
              // so have to use a complicated look ahead pattern instead
              query[fieldName] = {
                $regex: `^(?!.*${buildFilterQuery(value)}$).*$`,
                $options: 'gim'
              };
              break;
          }
      }
    });
  }

  return query;
}
