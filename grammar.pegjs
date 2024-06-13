
{
  var TYPES_TO_PROPERTY_NAMES = {
    CallExpression:   "callee",
    MemberExpression: "object",
  };

  function filledArray(count, value) {
    return Array.apply(null, new Array(count))
      .map(function() { return value; });
  }

  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

  function buildBinaryExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "BinaryExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function buildLogicalExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "LogicalExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function optionalList(value) {
    return value !== null ? value : [];
  }
}

Start
  = __ program:Program __ { return program; }

// ----- A.1 Lexical Grammar -----

SourceCharacter
  = .

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

Comment "comment"
  = SingleLineComment2
  / SingleLineComment

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

SingleLineComment2
  = ";" (!LineTerminator SourceCharacter)*

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

SignedInteger
  = [+-]? DecimalDigit+

IdentifierName "identifier"
  = head:IdentifierStart tail:IdentifierPart* {
      return {
        type: "Identifier",
        name: head + tail.join("")
      };
    }
IdentifierStart
  = [a-zA-Z]
  / "$"
  / "_"
  
IdentifierPart
  = IdentifierStart
  / "\u200C"
  / "\u200D"
  /"_"

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"; }
  / "f"  { return "\f"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  / "v"  { return "\v"; }

registro
	= "x"i DecimalIntegerLiteral
    / "w"i DecimalIntegerLiteral
    / "#" DecimalIntegerLiteral

// Skipped
__
  = (WhiteSpace / LineTerminatorSequence / Comment)*
 
_ "ignored"
	= [ \t]*
    
// Automatic Semicolon Insertion

EOS
  = __ ";"
  / SingleLineComment? LineTerminatorSequence
  / __ EOF

EOF
  = !.
 
Comma 
	=  _ ","

// ----- A.4 Statements -----

Statement
  = AritmeticStatement
  /InstructionStatement
  /label

AritmeticStatement
	= 	"add"i   _ registro _ Comma  _ registro _ Comma  _ registro __
    	/"sub"i  _ registro _ Comma  _ registro _ Comma  _ registro __
        
BodyStatement
	= IdentifierName
    	
        
InstructionStatement
	= 	"mov"i _ registro _ Comma registro __
    	/"cmp" _ registro _ Comma registro __
    	/"beq"_ BodyStatement __
        /"bl" _ BodyStatement __
		/"svc" _ "#"DecimalIntegerLiteral __
        /"ret"__
    	
Section=
	".section"i _ IdentifierName?
    
dec
	=   "." IdentifierName _? __?
        / IdentifierName _?":"? _? __?
       

init
	= dec* 
    
label=
	identificador:IdentifierName ":" {return identificador}

Program
  =  init body:SourceElements? {
      return {
        type: "Program",
        body: optionalList(body)
      };
    }
    

SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      return buildList(head, tail, 1);
    }

SourceElement
  = Statement
  /Comment