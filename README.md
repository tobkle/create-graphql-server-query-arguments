[![npm version](https://badge.fury.io/js/create-graphql-server-query-arguments.svg)](http://badge.fury.io/js/create-graphql-server-query-arguments) [![Build Status](https://travis-ci.org/tobkle/create-graphql-server-query-arguments.svg?branch=master)](https://travis-ci.org/tobkle/create-graphql-server-query-arguments) [![Coverage Status](https://coveralls.io/repos/github/tobkle/create-graphql-server-query-arguments/badge.svg?branch=master)](https://coveralls.io/github/tobkle/create-graphql-server-query-arguments?branch=master)

# create-graphql-server-query-arguments

Build query arguments for filter and orderBy MongoDB queries.

Added 60 test cases, which pass against my local create-graphql-server instance.
These tests are referenced in create-graphql-server test runs later.

TODO:
* There can be more test cases, with complex queries and a critical review of the tests. Add them to (src/index-test-cases.js).
* Implement a test app within the package, to run these test cases against. Used so far my local server to test with. 

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
* not 
* type
* AND
* NOR
* OR

## Installation

### Installation Part 1 -- add the module to create-graphql-server project

The create-graphql-server generator actually consists out of three parts:
1. root directory, the generator with directory "generate" and its according "package.json"
2. skel directory, contains the skeleton of the future "to-be-generated-app", also with its "package.json"
3. test/output-app directory, contains a generated test application, which is like the app in skel, but with already generated parts. This is used for test runs, to check, if it produces valid code.

In order to get the whole up and running, we have to consider all three parts.

In the "root" directory:
```bash
yarn add create-graphql-server-query-arguments
```

In the "test/output-app" directory
```bash
yarn add create-graphql-server-query-arguments
```

In the "skel/package.json", we have to update only the package.json, that it looks the same like in "test/output-app". Just copy the package.json like so and replace <path> with your create-graphql-server directory path (use pwd, to find out).
```bash
cp <path>/test/output-app/package.json <path>/skel/package.json
```

### Installation Part 2 -- add it to the server for the mongoDB accesses
Add this module to your express server in "create-graphql-server/skel/server/index.js" and also in the "test/output-app/server/index.js" and provide it to your data model by:
```javascript
...
import { prepareQueries } from 'create-graphql-server-query-arguments';
...
```

... further below in both files, also add it it your your data model context...
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

Now you can access it in your data models with "this.context.prepareQueries", e.g. in your "model/User.js":
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

If you forget to sync your changes in both the "skel" directory and your "test/output-app" directory, your test runs will fail. It compares the generated app files from "skel" with those in the "output-app" files.

### Installation Part 3 -- General Type Definitions for all arguments, but can be defined only once

Add to files "skel/schema/index.js" and "test/output-app/schema/index.js":
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
Add to file "generate/schema/index.js" the following statements:

If you don't have installed "create-graphql-server-authorization", use this:
```javascript
...
import { 
	enhanceSchemaWithQueryArguments 
} from 'create-graphql-server-query-arguments'; // <== here
...
...
  	// if you have NOT installed create-graphql-server-authorization add this:
  	const outputSchemaWithArguments = enhanceSchemaWithQueryArguments(outputSchema); // <== here
    
	return outputSchemaWithArguments;  // <== here
}
```

If you have installed also "create-graphql-server-authorization", use this instead:
```javascript
...
...
  // if you have also create-graphql-server-authorization installed use this:
  const outputSchemaWithAuth = enhanceSchemaForAuthorization(outputSchema);
  const outputSchemaWithArguments = enhanceSchemaWithQueryArguments(outputSchemaWithAuth);   // <== here
  
  return outputSchemaWithArguments;   // <== here
}
```

Add those types to your outputSchema.

### Installation Part 5 --- adjust model and resolver templates
In "generate/model/templates" and "generate/resolvers/templates" adjust the templates: "default_default.template" and "default_user.template". (If you use create-graphql-server-authorization as well, you have to create additionally the following two files: "authorize_default.template" and "authorize_user.template").

### Adjust "generate/model/templates/default/default_default.template"
from...
```javascript
...
	find({ lastCreatedAt = 0, limit = 10, baseQuery = {} }) {
	  const finalQuery = { ...baseQuery, createdAt: { $gt: lastCreatedAt } };
	  return this.collection
	    .find(finalQuery)
	    .sort({ createdAt: 1 })
	    .limit(limit)
	    .toArray();
	}
...
```

...to...
```javascript
...
	find(args) {
	  const { baseQuery, sortQuery, skip, limit} = this.context.prepareQueries( args );
	  const finalQuery = { ...baseQuery };
	  this.context.log.debug(`\n\n${resolver} DB-Query:\n\n`, JSON.stringify(finalQuery, null, 2), '\nsort:', sortQuery,'\nskip:', skip, '\nlimit:', limit, '\n','\n');
	  return this.collection
	    .find(finalQuery)
	    .sort(sortQuery)
	    .skip(skip)
	    .limit(limit)
	    .toArray();
	}
...
```

### Adjust "generate/model/templates/user/default_user.template"
from....
```javascript
...
	find({ lastCreatedAt = 0, limit = 10, baseQuery = {} }{{#if authorize}}, me, resolver{{/if}}) {
	  const finalQuery = { ...baseQuery, createdAt: { $gt: lastCreatedAt } };
	  return this.collection
	    .find(finalQuery)
	    .sort({ createdAt: 1 })
	    .limit(limit)
	    .toArray();
	}
...
```

...to...
```javascript
...
	find(args) {
	  const { baseQuery, sortQuery, skip, limit} = this.context.prepareQueries( args );
	  const finalQuery = { ...baseQuery  };
	  this.context.log.debug(`\n\n${resolver} DB-Query:\n\n`, JSON.stringify(finalQuery, null, 2), '\nsort:', sortQuery,'\nskip:', skip, '\nlimit:', limit, '\n','\n');
	  return this.collection
	    .find(finalQuery)
	    .sort(sortQuery)
	    .skip(skip)
	    .limit(limit)
	    .toArray();
	}
...
```

### Change "generate/resolvers/templates/default/default_default.template"
from...
```javascript
...
Query: {
  {{typeName}}s(root, { lastCreatedAt, limit }, { {{TypeName}}, me }) {
    return {{TypeName}}.find({ lastCreatedAt, limit }, me, '{{typeName}}s');
  },
...
```

...to...
```javascript
...
Query: {
	{{typeName}}s(root, args, { {{TypeName}}, me }) {
	  return {{TypeName}}.find(args, me, '{{typeName}}s');
	},
...
```

## With Authorization create-graphql-server-authorization
**OPTIONAL:**
If you are using create-graphql-server-authorization as well, you have to create additional files:

Add "generate/model/templates/default/authorize_default.template":
```javascript
/* eslint-disable prettier */
import {
  queryForRoles,
  onAuthRegisterLoader,
  authlog,
  checkAuthDoc
} from 'create-graphql-server-authorization';

export default class {{TypeName}} {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('{{typeName}}');
    this.pubsub = context.pubsub;
    const { me, {{User}} } = context;
    queryForRoles(
      me,
      {{{userRoles.readOne}}},
      {{{docRoles.readOne}}},
      { {{User}} },
      onAuthRegisterLoader('{{typeName}} findOneById', 'readOne', me, this)
    );
  }

  async findOneById(id, me, resolver) {
    const log = authlog(resolver, 'readOne', me);
    if (!this.authorizedLoader) {
      log.error('not authorized');
      return null;
    }
    return await this.authorizedLoader.load(id);
  }

  find(args, me, resolver) {
    const { baseQuery, sortQuery, skip, limit} = this.context.prepareQueries( args );
    const authQuery = queryForRoles(
      me,
      {{{userRoles.readMany}}},
      {{{docRoles.readMany}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'readMany', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    this.context.log.debug(`\n\n${resolver} DB-Query:\n\n`, JSON.stringify(finalQuery, null, 2), '\nsort:', sortQuery,'\nskip:', skip, '\nlimit:', limit, '\n','\n');
    return this.collection
      .find(finalQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();
  }
{{#each singularFields}}
{{> defaultSingularField }}
{{/each}}
{{#each paginatedFields}}
{{> defaultPaginatedField }}
{{/each}}

  createdBy({{typeName}}, me, resolver) {
    return this.context.{{User}}.findOneById({{typeName}}.createdById, me, resolver);
  }

  updatedBy({{typeName}}, me, resolver) {
    return this.context.{{User}}.findOneById({{typeName}}.updatedById, me, resolver);
  }

  async insert(doc, me, resolver) {
    const docToInsert = Object.assign({}, doc, {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdById: (me && me._id) ? me._id : 'unknown',
      updatedById: (me && me._id) ? me._id : 'unknown',
    });
    checkAuthDoc(
      docToInsert,
      me,
      {{{userRoles.create}}},
      {{{docRoles.create}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'create', me)
    );
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    if (!id) {
      throw new Error(`insert {{typeName}} not possible.`);
    }
    this.context.log.debug(`inserted {{typeName}} ${id}.`);
    const insertedDoc = this.findOneById(id, me, 'pubsub {{typeName}}Inserted');
    this.pubsub.publish('{{typeName}}Inserted', insertedDoc);
    return insertedDoc;
  }

  async updateById(id, doc, me, resolver) {
    const docToUpdate = {
      $set: Object.assign({}, doc, {
        updatedAt: Date.now(),
        updatedById: me && me._id ? me._id : 'unknown'
      })
    };
    const baseQuery = { _id: id };
    const authQuery = queryForRoles(
      me,
      {{{userRoles.update}}},
      {{{docRoles.update}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'update', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.updateOne(finalQuery, docToUpdate);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`update {{typeName}} not possible for ${id}.`);
    }
    this.context.log.debug(`updated {{typeName}} ${id}.`);
    this.authorizedLoader.clear(id);
    const updatedDoc = this.findOneById(id, me, 'pubsub {{typeName}}Updated');
    this.pubsub.publish('{{typeName}}Updated', updatedDoc);
    return updatedDoc;
  }

  async removeById(id, me, resolver) {
    const baseQuery = { _id: id };
    const authQuery = queryForRoles(
      me,
      {{{userRoles.delete}}},
      {{{docRoles.delete}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'delete', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.remove(finalQuery);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`remove {{typeName}} not possible for ${id}.`);
    }
    this.context.log.debug(`removed {{typeName}} ${id}.`);
    this.authorizedLoader.clear(id);
    this.pubsub.publish('{{typeName}}Removed', id);
    return result;
  }
}

```

Adjust "generate/model/templates/user/authorize_user.template":
```javascript
/* eslint-disable prettier */
import {
  queryForRoles,
  onAuthRegisterLoader,
  authlog,
  checkAuthDoc,
  protectFields
} from 'create-graphql-server-authorization';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

export default class {{TypeName}} {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('{{typeName}}');
    this.pubsub = context.pubsub;
    this.authRole = {{User}}.authRole;
    const { me } = context;
    queryForRoles(
      me,
      {{{userRoles.readOne}}},
      {{{docRoles.readOne}}},
      { {{User}} },
      onAuthRegisterLoader('{{typeName}} findOneById', 'readOne', me, this)
    );
  }

  static authRole({{typeName}}) {
    return {{typeName}} && {{typeName}}.{{roleField}} ? {{typeName}}.{{roleField}} : null;
  }

  async findOneById(id, me, resolver) {
    const log = authlog(resolver, 'readOne', me);
    if (!this.authorizedLoader) {
      log.error('not authorized');
      return null;
    }
    return await this.authorizedLoader.load(id);
  }

  find(args, me, resolver) {
    const { baseQuery, sortQuery, skip, limit} = this.context.prepareQueries( args );
    const authQuery = queryForRoles(
      me,
      {{{userRoles.readMany}}},
      {{{docRoles.readMany}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'readMany', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    this.context.log.debug(`\n\n${resolver} DB-Query:\n\n`, JSON.stringify(finalQuery, null, 2), '\nsort:', sortQuery,'\nskip:', skip, '\nlimit:', limit, '\n','\n');
    return this.collection
      .find(finalQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();
  }
{{#each singularFields}}
{{> defaultSingularField }}
{{/each}}
{{#each paginatedFields}}
{{> defaultPaginatedField }}
{{/each}}

  createdBy({{typeName}}, me, resolver) {
    return this.context.{{User}}.findOneById({{typeName}}.createdById, me, resolver);
  }

  updatedBy({{typeName}}, me, resolver) {
    return this.context.{{User}}.findOneById({{typeName}}.updatedById, me, resolver);
  }

  async insert(doc, me, resolver) {
    // We don't want to store passwords in plaintext
    const { password, ...rest } = doc;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    let docToInsert = Object.assign({}, rest, {
      hash,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdById: me && me._id ? me._id : 'unknown',
      updatedById: me && me._id ? me._id : 'unknown'
    });
    checkAuthDoc(
      docToInsert,
      me,
      {{{userRoles.create}}},
      {{{docRoles.create}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'create', me)
    );
    docToInsert = protectFields(me, [{{#if firstUserRole}}'{{firstUserRole}}'{{/if}}], [{{#if roleField}}'{{roleField}}'{{/if}}], docToInsert, {
      {{User}}: this.context.{{User}}
    });
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    if (!id) {
      throw new Error(`insert {{typeName}} not possible.`);
    }
    this.context.log.debug(`inserted {{typeName}} ${id}.`);
    const insertedDoc = this.findOneById(id, me, 'pubsub {{typeName}}Inserted');
    this.pubsub.publish('{{typeName}}Inserted', insertedDoc);
    return insertedDoc;
  }

  async updateById(id, doc, me, resolver) {
    const docToUpdate = {
      $set: Object.assign({}, doc, {
        updatedAt: Date.now(),
        updatedById: me && me._id ? me._id : 'unknown'
      })
    };
    const baseQuery = { _id: id };
    const authQuery = queryForRoles(
      me,
      {{{userRoles.update}}},
      {{{docRoles.update}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'update', me)
    );
    docToUpdate.$set = protectFields(
      me,
      [{{#if firstUserRole}}'{{firstUserRole}}'{{/if}}],
      [{{#if roleField}}'{{roleField}}'{{/if}}],
      docToUpdate.$set,
      { {{User}}: this.context.{{User}} }
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.updateOne(finalQuery, docToUpdate);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`update {{typeName}} not possible for ${id}.`);
    }
    this.context.log.debug(`updated {{typeName}} ${id}.`);
    this.authorizedLoader.clear(id);
    const updatedDoc = this.findOneById(id, me, 'pubsub {{typeName}}Updated');
    this.pubsub.publish('{{typeName}}Updated', updatedDoc);
    return updatedDoc;
  }

  async removeById(id, me, resolver) {
    const baseQuery = { _id: id };
    const authQuery = queryForRoles(
      me,
      {{{userRoles.delete}}},
      {{{docRoles.delete}}},
      { {{User}}: this.context.{{User}} },
      authlog(resolver, 'delete', me)
    );
    const finalQuery = { ...baseQuery, ...authQuery };
    const result = await this.collection.remove(finalQuery);
    if (result.result.ok !== 1 || result.result.n !== 1) {
      throw new Error(`remove {{typeName}} not possible for ${id}.`);
    }
    this.context.log.debug(`removed {{typeName}} ${id}.`);
    this.authorizedLoader.clear(id);
    this.pubsub.publish('{{typeName}}Removed', id);
    return result;
  }
}

```

Add "generate/resolvers/templates/default/authorize_default.template":
```javascript
/* eslint-disable prettier */
/* eslint comma-dangle: [2, "only-multiline"] */
const resolvers = {
  {{TypeName}}: {
    id({{typeName}}) {
      return {{typeName}}._id;
    },
{{#each singularFields}}
{{> defaultSingularField }}
{{/each}}
{{#each paginatedFields}}
{{> defaultPaginatedField }}
{{/each}}

    createdBy({{typeName}}, args, { {{TypeName}}, me }) {
      return {{TypeName}}.createdBy({{typeName}}, me, '{{typeName}} createdBy');
    },

    updatedBy({{typeName}}, args, { {{TypeName}}, me }) {
      return {{TypeName}}.updatedBy({{typeName}}, me, '{{typeName}} updatedBy');
    }
  },
  Query: {
    {{typeName}}s(root, args, { {{TypeName}}, me }) {
      return {{TypeName}}.find(args, me, '{{typeName}}s');
    },

    {{typeName}}(root, { id }, { {{TypeName}}, me }) {
      return {{TypeName}}.findOneById(id, me, '{{typeName}}');
    }
  },
  Mutation: {
    async create{{TypeName}}(root, { input }, { {{TypeName}}, me }) {
      return await {{TypeName}}.insert(input, me, 'create{{TypeName}}');
    },

    async update{{TypeName}}(root, { id, input }, { {{TypeName}}, me }) {
      return await {{TypeName}}.updateById(id, input, me, 'update{{TypeName}}');
    },

    async remove{{TypeName}}(root, { id }, { {{TypeName}}, me }) {
      return await {{TypeName}}.removeById(id, me, 'remove{{TypeName}}');
    }
  },
  Subscription: {
    {{typeName}}Created: {{typeName}} => {{typeName}},
    {{typeName}}Updated: {{typeName}} => {{typeName}},
    {{typeName}}Removed: id => id
  }
};

export default resolvers;

```

### Installation Part 6 --- For test runs
The "test/output-app" expects now also different schema files, as we added these additional query arguments. So they have to be also in the test app, otherwise our tests will fail. You don't have to do this manually. In create-graphql-server "bin/gentest.js" we have command line command, which is generating all the required files as test files in a temp directory, and if you are using sublime it will show them in sublime. Run it with...
```bash
yarn gentest              # defaults to test/input/User.graphql AND:
yarn gentest test/input/Tweet.graphql
```

With that you get also all schema files generated as they should look like with the new extended "enhanceSchemaWithQueryArguments" logic. 

Copy the generated *.graphql files and overwrite the files in "test/output-app/schema/*.graphql".
Copy the generated *.model.js files and overwrite the files in "test/output-app/model/*.js"
Copy the generated *.resolver.js files and overwrite the files in "test/output-app/resolvers"

### Finally
If you have succeeded an all the following test runs are ok, you did well. Congratulations!
```bash
yarn end-to-end-test
yarn output-app-generation-test
yarn test-add-update-remove
```

If you are having troubles somewhere, have a look into the running example at:
[tobkle/create-graphql-server branch: Authorization+Arguments](https://github.com/tobkle/create-graphql-server/tree/Authorization+Arguments)

## Documentation
[API Documentation](https://tobkle.github.io/create-graphql-server-query-arguments/)

## Tests
```bash
yarn test
```

Or in create-graphql-server package itself:
```bash
yarn end-to-end-arguments-test
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

# Example Queries

Have a look in the test directory to see more:
[index-test-cases](https://github.com/tobkle/create-graphql-server-query-arguments/tree/master/src/index-test-cases.js)