export const requiredTypes = `
# Direction sets  the sort order: Ascending (ASC) = default, Descending (DESC)
enum Direction {
  # ascending order
  ASC

  # descending order
  DESC 
}

# Regex Type provides access to regular expressions
input Regex {
  # Regular Expression: Without the /, but you can use ^ and $
  regex: String!

  # Regular Expression: Options
  options: [RegexOptions!]
}

# RegexOptions provides options, how to run the regular expression
enum RegexOptions {
  # global: Don't restart after first match
  global

  # multiline: ^ and $ match start/end of line
  multiline

  # insensitive: Case insensitive match
  insensitive

  # sticky: Proceed matching from where previous match ended only
  sticky

  # unicode: Match with full unicode
  unicode
}

enum BSONType {
  # Double 1 "double"
  double

  # String 2 "string"
  string

  # Object 3 "object"
  object

  # Array 4 "array"
  array

  # Binary data 5 "binData"  
  binData

  # Undefined 6 "undefined" Deprecated
  undefined

  # ObjectId 7 "objectId"
  objectId

  # Boolean 8 "bool"
  bool

  # Date 9 "date"
  date

  # Null 10 "null"
  null

  # Regular Expression 11 "regex"
  regex

  # DBPointer 12 "dbPointer" Deprecated
  dbPointer

  # JavaScript 13 "javascript"
  javascript

  # Symbol 14 "symbol" Deprecated
  symbol

  # JavaScript (with scope) 15 "javascriptWithScope"
  javascriptWithScope

  # 32-bit integer 16 "int"
  int

  # Timestamp 17 "timestamp"
  timestamp

  # 64-bit integer 18 "long"
  long

  # Decimal128 19 "decimal"
  decimal

  # Min key -1 "minKey"
  minKey

  # Max key 127 "maxKey"
  maxKey
}

`;
