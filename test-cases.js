'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testCases = undefined;

var _sendQuery = require('./sendQuery');

var testCases = exports.testCases = [
// tweets(filter: {AND: [{id: "583676d3618530145474e351"}, {createdAt: 1479964352544}]})
{
  name: 'tweets(filter: {AND: [{id: "583676d3618530145474e351"}, {createdAt: 1479964352544}]})',
  image: '001-query-AND.png',
  user: _sendQuery.unknownUser,
  query: '\n      {\n        tweets(filter: {AND: [{id: "583676d3618530145474e351"}, {createdAt: 1479964352544}]}) {\n          id\n          body\n          createdAt\n        }\n      }\n    ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }]
  }
},

// tweets(filter: {NOR: [{id: "583676d3618530145474e351"}, {createdAt: 1479964438372}]})
{
  name: 'tweets(filter: {NOR: [{id: "583676d3618530145474e351"}, {createdAt: 1479964438372}]})',
  image: '002-query-NOR.png',
  user: _sendQuery.defaultUser,
  query: '\n        {\n          tweets(filter: {NOR: [{id: "583676d3618530145474e351"}, {createdAt: 1479964438372}]}) {\n            id\n            body\n            createdAt\n          }\n        }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {OR: [{id: "583676d3618530145474e351"}, {createdAt: 1479964438372}]})
{
  name: 'tweets(filter: {OR: [{id: "583676d3618530145474e351"}, {createdAt: 1479964438372}]})',
  image: '003-query-OR.png',
  user: _sendQuery.adminUser,
  query: '\n        {\n          tweets(filter: {OR: [{id: "583676d3618530145474e351"}, {createdAt: 1479964438372}]}) {\n            id\n            body\n            createdAt\n          }\n        }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {id: "583676d3618530145474e351"}) better: use tweet (singular) instead for "id", it does caching
{
  name: 'tweets(filter: {id: "583676d3618530145474e351"}) better: use tweet (singular) instead for "id", it does caching',
  image: '004-query-fieldname-id.png',
  user: _sendQuery.roleUser,
  query: '\n        {\n          tweets(filter: {id: "583676d3618530145474e351"}) {\n            id\n            body\n            createdAt\n          }\n        }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }]
  }
},

// tweets(filter: {createdAt: 1479964438372})
{
  name: 'tweets(filter: {createdAt: 1479964438372})',
  image: '004-query-fieldname-integer.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {createdAt: 1479964438372}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// ALL: TODO: missing data)
// {
//   name: 'tweets(filter: {createdAt: 1479964438372})',
//   image: '004-query-fieldname.png',
//   user: roleUser,
//   query: `
//     {
//       tweets(filter: {createdAt: 1479964438372}) {
//         id
//         body
//         createdAt
//       }
//     }
//     `,
//   expectedResult: {
//     tweets: [
//       {
//         id: '583676d3618530145474e355',
//         body: 'Where have I heard this before',
//         createdAt: 1479964438372
//       }
//     ]
//   }
// },

// tweets(filter: {id_eq: "583676d3618530145474e350" })
{
  name: 'tweets(filter: {id_eq: "583676d3618530145474e350" }) ',
  image: '006-query-fieldname_eq.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {id_eq: "583676d3618530145474e350" })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }]
  }
},

// tweets(filter: {id_ne: "583676d3618530145474e350" })
{
  name: 'tweets(filter: {id_ne: "583676d3618530145474e350" })',
  image: '007-query-fieldname_ne.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {id_ne: "583676d3618530145474e350" })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {createdAt: 1479964438372})
{
  name: 'tweets(filter: {id_eq: "583676d3618530145474e350" }) ',
  image: '006-query-fieldname_eq.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {id_eq: "583676d3618530145474e350" })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }]
  }
},

// tweets(filter: {id_in: ["583676d3618530145474e350", "583676d3618530145474e354"]})
{
  name: 'tweets(filter: {id_in: ["583676d3618530145474e350", "583676d3618530145474e354"]})',
  image: '008-query-fieldname_in.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {id_in: ["583676d3618530145474e350", "583676d3618530145474e354"]})  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {id_nin: ["583676d3618530145474e350", "583676d3618530145474e354"]})
{
  name: 'tweets(filter: {id_nin: ["583676d3618530145474e350", "583676d3618530145474e354"]})',
  image: '009-query-fieldname_nin.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {id_nin: ["583676d3618530145474e350", "583676d3618530145474e354"]})  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {createdAt_lt: 1479964386822})
{
  name: 'tweets(filter: {createdAt_lt: 1479964386822})',
  image: '010-query-fieldname_lt.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {createdAt_lt: 1479964386822})  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }]
  }
},

// tweets(filter: {createdAt_lte: 1479964386822})
{
  name: 'tweets(filter: {createdAt_lte: 1479964386822})',
  image: '011-query-fieldname_lte.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {createdAt_lte: 1479964386822})  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }]
  }
},

// tweets(filter: {createdAt_lte: 1479964386822})
{
  name: 'tweets(filter: {createdAt_gt: 1479964386822})',
  image: '012-query-fieldname_gt.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {createdAt_gt: 1479964386822})  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {createdAt_gte: 1479964386822})
{
  name: 'tweets(filter: {createdAt_gte: 1479964386822}) ',
  image: '013-query-fieldname_gte.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {createdAt_gte: 1479964386822})  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not: {body_eq: "Where have I heard this before"} })
{
  name: 'tweets(filter: {body_not: {body_eq: "Where have I heard this before"} })  ',
  image: '014-query-fieldname_not.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not: {body_eq: "Where have I heard this before"} })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_exists: true })
{
  name: 'tweets(filter: {body_exists: true })   ',
  image: '015-query-fieldname_exists.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_exists: true })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_exists: false })
{
  name: 'tweets(filter: {body_exists: false })   ',
  image: '015-query-fieldname_exists.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_exists: false })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_type: string })
{
  name: 'tweets(filter: {body_type: string })   ',
  image: '017-query-fieldname_type-string.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_type: string })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_type: int })
{
  name: 'tweets(filter: {body_type: int })   ',
  image: '018-query-fieldname_type-int.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_type: int })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {id_not_in: ["583676d3618530145474e350", "583676d3618530145474e351"] })
{
  name: 'tweets(filter: {id_not_in: ["583676d3618530145474e350", "583676d3618530145474e351"] })    ',
  image: '019-query-fieldname_not_in.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {id_not_in: ["583676d3618530145474e350", "583676d3618530145474e351"] })  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_regex: {regex: "presidential politics"}})
{
  name: 'tweets(filter: {id_not_in: ["583676d3618530145474e350", "583676d3618530145474e351"] })    ',
  image: '020-query-regex-without-options.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "presidential politics"}})  {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "presidential politics", options: global}})
{
  name: 'tweets(filter: {body_regex: {regex: "presidential politics", options: global}})   ',
  image: '021-query-regex-global.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "presidential politics", options: global}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "presidential politics", options: multiline}})
{
  name: 'tweets(filter: {body_regex: {regex: "presidential politics", options: multiline}})',
  image: '022-query-regex-multiline.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "presidential politics", options: multiline}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "presidential politics", options: insensitive}})
{
  name: 'tweets(filter: {body_regex: {regex: "presidential politics", options: insensitive}})',
  image: '023-query-regex-insensitive.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "presidential politics", options: insensitive}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "presidential politics", options: insensitive}})
{
  name: 'tweets(filter: {body_regex: {regex: "presidential politics", options: sticky}})',
  image: '024-query-regex-sticky.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "presidential politics", options: sticky}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "presidential politics", options: unicode}})
{
  name: 'tweets(filter: {body_regex: {regex: "presidential politics", options: unicode}}) ',
  image: '025-query-regex-unicode.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "presidential politics", options: unicode}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "presidential politics", options: [global, multiline, unicode]}})
{
  name: 'tweets(filter: {body_regex: {regex: "presidential politics", options: [global, multiline, unicode]}})  ',
  image: '026-query-regex-multi-options.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "presidential politics", options: [global, multiline, unicode]}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "^It", options: [global, multiline, unicode]}})
{
  name: 'tweets(filter: {body_regex: {regex: "^It", options: [global, multiline, unicode]}}) // starts with...',
  image: '027-query-regex-starts-with.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "^It", options: [global, multiline, unicode]}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "^It", options: [global, multiline, unicode]}})
{
  name: 'tweets(filter: {body_regex: {regex: "turn.$", options: [global, multiline, unicode]}}) // ends with...',
  image: '028-query-regex-ends-with.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "turn.$", options: [global, multiline, unicode]}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_regex: {regex: "It$", options: [global, multiline, unicode]}})
{
  name: 'tweets(filter: {body_regex: {regex: "It$", options: [global, multiline, unicode]}}) // should be empty',
  image: '029-query-regex-ends-with-fail.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "It$", options: [global, multiline, unicode]}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_regex: {regex: "It$", options: [global, multiline, unicode]}})
{
  name: 'tweets(filter: {body_regex: {regex: "^presi", options: [global, multiline, unicode]}}) // should be empty.',
  image: '030-query-regex-starts-with-fail.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "^presi", options: [global, multiline, unicode]}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_regex: {regex: "PRESI", options: [global, multiline, unicode]}})
{
  name: 'tweets(filter: {body_regex: {regex: "PRESI", options: [global, multiline, unicode]}})  // should be empty.',
  image: '031-query-regex-sensitive.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "PRESI", options: [global, multiline, unicode]}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_regex: {regex: "PRESI", options: [insensitive, multiline, unicode]}})
{
  name: 'tweets(filter: {body_regex: {regex: "PRESI", options: [insensitive, multiline, unicode]}}) // finds one.',
  image: '032-query-regex-insensitive.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_regex: {regex: "PRESI", options: [insensitive, multiline, unicode]}}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_contains: "presi"})
{
  name: 'tweets(filter: {body_contains: "presi"}) // finds one.',
  image: '033-query-fieldname_contains.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_contains: "presi"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_contains: "Presi"}) // finds none.
{
  name: 'tweets(filter: {body_contains: "Presi"}) // finds none.',
  image: '034-query-fieldname_contains-fails.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_contains: "Presi"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_starts_with: "It"})
{
  name: 'tweets(filter: {body_starts_with: "It"})',
  image: '035-query-fieldname_starts_with.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_starts_with: "It"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_starts_with: "turn"}) // fails
{
  name: 'tweets(filter: {body_starts_with: "turn"}) // fails',
  image: '036-query-fieldname_starts_with-fails.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_starts_with: "turn"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_ends_with: "turn."})
{
  name: 'tweets(filter: {body_ends_with: "turn."})',
  image: '037-query-fieldname_ends_with.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_ends_with: "turn."}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_ends_with: "It"}) // fails
{
  name: 'tweets(filter: {body_ends_with: "It"}) // fails',
  image: '038-query-fieldname_ends_with-fails.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_ends_with: "It"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

//  tweets(filter: {body_not_contains: "presi"})
{
  name: 'tweets(filter: {body_not_contains: "presi"})',
  image: '039-query-fieldname_not_contains.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_contains: "presi"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_starts_with: "Good times"})
{
  name: 'tweets(filter: {body_not_starts_with: "Good times"})',
  image: '040-query-fieldname_not_starts_with.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_starts_with: "Good times"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_ends_with: "fast:"})
{
  name: 'tweets(filter: {body_not_ends_with: "fast:"}) ',
  image: '041-query-fieldname_not_ends_with.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_ends_with: "fast:"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_contains_ci: "PrEsI"})
{
  name: 'tweets(filter: {body_contains_ci: "PrEsI"}) ',
  image: '042-query-fieldname_contains_ci.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_contains_ci: "PrEsI"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_starts_with_ci: "iT WiLl"})
{
  name: 'tweets(filter: {body_starts_with_ci: "iT WiLl"}) ',
  image: '043-query-fieldname_starts_with_ci.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_starts_with_ci: "iT WiLl"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_starts_with_ci: "TURN."}) fails
{
  name: 'tweets(filter: {body_starts_with_ci: "TURN."}) // fails',
  image: '044-query-fieldname_starts_with_ci-fails.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_starts_with_ci: "TURN."}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_ends_with_ci: "TURN."})
{
  name: 'tweets(filter: {body_ends_with_ci: "TURN."})',
  image: '045-query-fieldname_ends_with_ci.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_ends_with_ci: "TURN."}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
},

// tweets(filter: {body_ends_with_ci: "iT WiLl"}) // fails
{
  name: 'tweets(filter: {body_ends_with_ci: "iT WiLl"}) // fails',
  image: '046-query-fieldname_ends_with_ci-fails.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_ends_with_ci: "iT WiLl"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: []
  }
},

// tweets(filter: {body_not_contains_ci: "WiLl"})
{
  name: 'tweets(filter: {body_not_contains_ci: "WiLl"})',
  image: '046-query-fieldname_ends_with_ci-fails.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_contains_ci: "WiLl"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_contains_ci: "zeta"})
{
  name: 'tweets(filter: {body_not_contains_ci: "zeta"})',
  image: '047-query-fieldname_ends_with_ci-no-pattern.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_contains_ci: "zeta"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_starts_with_ci: "iT WiLl"})
{
  name: 'tweets(filter: {body_not_starts_with_ci: "iT WiLl"})',
  image: '049-query-fieldname_not_starts_with_ci.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_starts_with_ci: "iT WiLl"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_starts_with_ci: "TURN."})
{
  name: 'tweets(filter: {body_not_starts_with_ci: "TURN."}) ',
  image: '050-query-fieldname_not_starts_with_ci-turn.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_starts_with_ci: "TURN."}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_ends_with_ci: "TURN."})
{
  name: 'tweets(filter: {body_not_ends_with_ci: "TURN."})',
  image: '051-query-fieldname_not_ends_with_ci.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_ends_with_ci: "TURN."}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_ends_with_ci: "good"})
{
  name: 'tweets(filter: {body_not_ends_with_ci: "good"})',
  image: '052-query-fieldname_not_ends_with_ci-good.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_ends_with_ci: "good"}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: {sort: createdAt, direction: ASC})
{
  name: 'tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: {sort: createdAt, direction: ASC})',
  image: '053-query-fieldname_not_ends_with_ci-orderBy_createdAt_ASC.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: {sort: createdAt, direction: ASC}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: {sort: createdAt, direction: DESC})
{
  name: 'tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: {sort: createdAt, direction: DESC})',
  image: '054-query-fieldname_not_ends_with_ci-orderBy_createdAt_DESC.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: {sort: createdAt, direction: DESC}) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }]
  }
},

// tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}])
{
  name: 'tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}])',
  image: '055-query-multiple-sort.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}]) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }, {
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }, {
      id: '583676d3618530145474e352',
      body: 'We put our hearts into this talk about a #GraphQL-first workflow and how it helped us build apps fast:',
      createdAt: 1479964371334
    }, {
      id: '583676d3618530145474e355',
      body: 'Where have I heard this before',
      createdAt: 1479964438372
    }]
  }
},

// tweets(limit: 2, filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}])
{
  name: 'tweets(limit: 2, filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}])',
  image: '056-query-limit-2-multiple-sort.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(limit: 2, filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}]) {\n          id\n          body\n          createdAt\n        }\n      }\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e350',
      body: 'A #graphql-first development workflow based on real world lessons, from @danimman & @stubailo:',
      createdAt: 1479964340853
    }, {
      id: '583676d3618530145474e351',
      body: 'Good times bringing Apollo Optics to Rails over the last few months with @tmeasday @chollier @cjoudrey @rmosolgo and others!',
      createdAt: 1479964352544
    }]
  }
},

// tweets(skip: 2, limit: 2, filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}])
{
  name: 'tweets(skip: 2, limit: 2, filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}])',
  image: '056-query-limit-2-multiple-sort.png',
  user: _sendQuery.roleUser,
  query: '\n      {\n        tweets(skip: 2, limit: 2, filter: {body_not_ends_with_ci: "good"}, orderBy: [{sort: body, direction: ASC}, {sort: createdAt, direction: DESC}]) {\n          id\n          body\n          createdAt\n        }\n      }\n\n      ',
  expectedResult: {
    tweets: [{
      id: '583676d3618530145474e353',
      body: 'Help improve @apollographql integration with #redux dev tools:',
      createdAt: 1479964386822
    }, {
      id: '583676d3618530145474e354',
      body: "It will stop being insane. It will just be normal. TV changed presidential politics, now it's social media's turn.",
      createdAt: 1479964423351
    }]
  }
}];
/* eslint-disable max-len */