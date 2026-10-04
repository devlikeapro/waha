export interface TagNode {
  type: 'tag'
  name: string
  voidElement: boolean
  /** boolean attributes (e.g. `disabled`) have the value `null` */
  attrs: Record<string, string | null>
  children: ASTNode[]
}

export interface TextNode {
  type: 'text'
  content: string
}

export interface CommentNode {
  type: 'comment'
  comment: string
}

export interface ComponentNode {
  type: 'component'
  name: string
  voidElement: boolean
  attrs: Record<string, string | null>
  children: ASTNode[]
}

export type ASTNode = TagNode | TextNode | CommentNode | ComponentNode

/** @deprecated use ASTNode */
export type Node = ASTNode

export interface ParseOptions {
  /** tag names that should be treated as components (children are not parsed) */
  components?: Record<string, unknown>
  /**
   * When set, only tags with these names are parsed as markup; any other
   * tag-shaped input is kept as literal text. Either an array of names or a
   * predicate receiving the tag name. Comments are always parsed.
   */
  allowedTags?: string[] | ((name: string) => boolean)
}

export declare function parse(html: string, options?: ParseOptions): ASTNode[]
export declare function stringify(doc: ASTNode[]): string

declare const HTML: {
  parse: typeof parse
  stringify: typeof stringify
}
export default HTML
