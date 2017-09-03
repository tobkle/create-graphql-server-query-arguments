[![npm version](https://badge.fury.io/js/create-graphql-server-query-arguments.svg)](http://badge.fury.io/js/create-graphql-server-query-arguments) [![Build Status](https://travis-ci.org/tobkle/create-graphql-server-query-arguments.svg?branch=master)](https://travis-ci.org/tobkle/create-graphql-server-query-arguments) [![Coverage Status](https://coveralls.io/repos/github/tobkle/create-graphql-server-query-arguments/badge.svg?branch=master)](https://coveralls.io/github/tobkle/create-graphql-server-query-arguments?branch=master)

# create-graphql-server-query-arguments

Build query arguments for filter and orderBy MongoDB queries.

** This is still under development **
** TODO: prepare proper end-to-end test cases for the different filters **

## Purpose
You build a GraphQL server with the npm package "create-graphql-server", which serves as a backend to web applications. This "create-graphql-server" generates schemas, resolvers and models for an express-js server.

As soon as you are building the web application on top of this server, you want to access this backend server with specific GraphQL queries. Sometimes you want to set filters, to get just filtered records. Sometimes you want to sort data by different fields in ascending or descending order. Sometimes you want just pages of data with the first ten data records, or just the second page after the first ten records and so on.

In order to enable such accesses to your GraphQL server backend, the schema needs to provide query arguments such as: 
* filter
* orderBy
* limit
* skip

TODO: as enhanced version of limit and skip:
* first 
* before 
* last
* after

Additionally, your data model must know, how to map these query arguments into valid database queries for the mongoDB database.

That's the purpose of this module. 
* it provides a function for the schema generator, to generate additional query arguments
* it provides a function for basic types for all arguments later
* it provides a function for the data model, to map query arguments, into a database query

GraphQL query argument to mongoDB mapper:
```javascript
const { baseQuery, sortQuery, skip, limit} = prepareQueries( query_arguments )
```

GraphQL schema Query argument generator:
```javascript
buildRequiredTypes();
```

GraphQL schema Query argument generator:
```javascript
const enhancedOutputSchema = enhanceSchemaWithQueryArguments( inputSchema );
```

It provides the following query arguments:

### orderBy
All fields of the type definitions are automatically added to the orderBy sort field selection, except for associations to other types.

### limit
A limit argument is added, to choose the number of documents/records the query should return.

### skip
A skip argument is added, to skip a number of found records, not to be returned by the query.

### filter
The following filter query arguments are added to list types, which you can use to build complex queries:
* eq
* all
* ne
* in
* nin
* lt
* lte
* gt
* gte
* regex
* contains
* starts_with
* ends_with
* not_contains
* not_starts_with
* not_ends_with
* not_in
* exists
* type
* AND
* NOT
* NOR
* OR

## Installation

### Installation Part 1 -- add the module to create-graphql-server project

```bash
yarn add create-graphql-server-query-arguments
```

### Installation Part 2 -- add it to the server for the mongoDB accesses
Add this module to your express server in "create-graphql-server/skel/server/index.js" and provide it to your data model by:
```javascript
...
import { prepareQueries } from 'create-graphql-server-query-arguments';
...
```

... and also in skel/server/index.js add it it your your data model context by...
```javascript
...
app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, me) => {
    req.context = addModelsToContext({
      db, pubsub, me, UserCollection, log, prepareQueries    // <===
    });
    graphqlExpress(() => {
		...
    })
  });
})
...
```

Now you can access it in your data models with "this.context.prepareQueries":
```javascript
find(args, me, resolver) {
  const { baseQuery, sortQuery, skip, limit} = this.context.prepareQueries( args ); // <===
  const authQuery = queryForRoles(/* auth logic here */);
  const finalQuery = { ...baseQuery, ...authQuery };
  return this.collection
    .find(finalQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .toArray();
}
```
Be sure, that also the resolver(s) pass on all "args" to your model method "find".

Add these adjustments also to your: "test/output-app/server/index.js", otherwise your test runs will fail, as it compares the generated app files from "skel" with this "output-app" files.

### Installation Part 3 -- General Type Definitions for all arguments, but can be defined only once

add to file "skel/schema/index.js"
```javascript
...
import { buildRequiredTypes } from 'create-graphql-server-query-arguments'; // <=== add this line
...
const typeDefs = [`
  scalar ObjID

  type Query {
    # A placeholder, please ignore
    __placeholder: Int
  }

  type Mutation {
    # A placeholder, please ignore
    __placeholder: Int
  }

  type Subscription {
    # A placeholder, please ignore
    __placeholder: Int
  }
`];

typeDefs.push(buildRequiredTypes()); // <=== add this line

export default typeDefs;
...
```
Caution: Do the same again in the "test/output-app/schema/index.js" to have proper test runs.

### Installation Part 4 -- Generator for Schema for individual argument type definitions
Add to file "generate/index.js" the following two statements:
```javascript
...
import { 
	enhanceSchemaWithQueryArguments 
} from 'create-graphql-server-query-arguments'; // <===

export default function generate(inputSchemaStr) {
  const inputSchema = parse(inputSchemaStr);
  const type = inputSchema.definitions[0];
  const TypeName = type.name.value;
  const typeName = lcFirst(TypeName);
  const outputSchema = generateSchema(inputSchema);
  const enhancedSchema = enhanceSchemaWithQueryArguments(outputSchema); // <=== 
...
}
```

Add those types to your outputSchema.



## Documentation
[API Documentation](https://tobkle.github.io/create-graphql-server-query-arguments/)


## Tests
```bash
yarn test
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


