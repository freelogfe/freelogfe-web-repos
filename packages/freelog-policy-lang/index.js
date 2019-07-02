import antlr4 from 'antlr4'
import resourcePolicyLexer from '@freelog/resource-policy-lang/gen/resourcePolicyLexer'
import resourcePolicyParser from '@freelog/resource-policy-lang/gen/resourcePolicyParser'
import { compile } from '@freelog/resource-policy-lang'

import HighlightGenerator from './src/HighlightGenerator'
import BeautifyGenerator from './src/BeautifyGenerator'

export const compilePolicy = compile
export function highlightPolicy (segmentText){
  const parser = getParser(segmentText)

  parser.buildParseTrees = true
  const tree = parser.policy()
  const gen = new HighlightGenerator(1)
  gen.visit(tree)

  return gen.getPolicyHighlightElements(tree)
}

export function beautifyPolicy (segmentText){
  const parser = getParser(segmentText)

  parser.buildParseTrees = true
  const tree = parser.policy()
  var gen = new BeautifyGenerator(1)
  gen.visit(tree)

  return gen.getBeautifulPolicy()
}

function getParser(segmentText) {
  const chars = new antlr4.InputStream(segmentText)
  const lexer = new resourcePolicyLexer.resourcePolicyLexer(chars)
  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new resourcePolicyParser.resourcePolicyParser(tokens)
  return parser
}


