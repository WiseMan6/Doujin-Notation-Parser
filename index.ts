/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation> */

// dprint-ignore
const GRAMMAR = new Set([
  40, 41,   // ()
  91, 93,   // []
  123, 125, // {}
]);

// dprint-ignore
const Types = {
  OPEN_BARE: 100,    // `(`
  CLOSE_BARE: 101,   // `)`
  OPEN_SQUARE: 110,  // `[`
  CLOSE_SQUARE: 111, // `]`
  OPEN_CURLY: 120,   // `{`
  CLOSE_CURLY: 121,  // `}`
  TEXT: 0,
} as const;

const ScopeTypes = {
  [Types.OPEN_BARE]: "Bare",
  [Types.CLOSE_BARE]: "Bare",
  [Types.OPEN_SQUARE]: "Square",
  [Types.CLOSE_SQUARE]: "Square",
  [Types.OPEN_CURLY]: "Curly",
  [Types.CLOSE_CURLY]: "Curly",
} as const;

const DICT = ["color", "ntr"];
const DICT_SET = new Set(DICT);

type ValueOf<T> = T[keyof T];

export type ScopeType = ValueOf<typeof ScopeTypes>;

export interface Metadata {
  Title: string;
  Artists?: string[];
  Circles?: string[];
  Head?: string[];
  Tail?: Array<{
    type: ScopeType;
    value: string;
  }>;
}

type Span = {
  readonly start: number;
  readonly end: number;
};

interface Token {
  readonly type: ValueOf<typeof Types>;
  readonly span: Span;
}

interface Node extends Token {
  readonly children?: Node[];
  // readonly unsafe?: boolean;
}

class Tokenizer {
  private readonly source: string;
  private position = 0;

  constructor(source: string) {
    this.source = source;
  }

  // dprint-ignore
  tokenize(): Token[] {
    const tokens: Token[] = [];

    const len = this.source.length;
    while (this.position < len) {
      this.skipWhitespaces();

      switch (this.source.charCodeAt(this.position)) {
        case 91: tokens.push(this.token(Types.OPEN_SQUARE)); break;
        case 93: tokens.push(this.token(Types.CLOSE_SQUARE)); break;
        case 40: tokens.push(this.token(Types.OPEN_BARE)); break;
        case 41: tokens.push(this.token(Types.CLOSE_BARE)); break;
        case 123: tokens.push(this.token(Types.OPEN_CURLY)); break;
        case 125: tokens.push(this.token(Types.CLOSE_CURLY)); break;
        default: tokens.push(this.text()); break;
      }
    }

    return tokens;
  }

  private token(type: ValueOf<typeof Types>) {
    const start = this.position;
    this.position++;
    return {
      type,
      span: {
        start,
        end: start + 1,
      },
    };
  }

  private text(): Token {
    const len = this.source.length;
    const start = this.position;
    let pos = start;

    while (pos < len && !GRAMMAR.has(this.source.charCodeAt(pos))) {
      pos++;
    }

    this.position = pos;

    return { type: 0, span: { start, end: pos } };
  }

  private skipWhitespaces(): void {
    const len = this.source.length;
    let pos = this.position;

    while (pos < len && this.source.charCodeAt(pos) === 32) {
      pos++;
    }

    this.position = pos;
  }
}

function parse(tokens: Token[], start = 0, end = tokens.length): Node[] {
  const nodes: Node[] = [];
  let i = start;

  while (i < end) {
    const token = tokens[i]!;
    const type = token.type;

    if (type === Types.TEXT) {
      nodes.push(token);
      i++;
      continue;
    }

    // Even number for open, for close odd
    if (type >= Types.OPEN_BARE && type % 2 === 0) {
      const odd = type + 1;

      let depth = 1;
      let j = i + 1;

      // Fast-forward to matching closing bracket
      while (j < end && depth > 0) {
        const typeJ = tokens[j].type;
        if (typeJ === type) depth++;
        if (typeJ === odd) depth--;
        j++;
      }

      if (depth === 0) {
        nodes.push({
          type: token.type,
          children: parse(tokens, i + 1, j - 1),
          span: {
            start: token.span.start,
            end: tokens[j - 1].span.end,
          },
        });
        i = j;
      } else {
        // nodes.push({
        //   type: token.type,
        //   span: token.span,
        //   unsafe: true,
        // });
        i++;
      }
    } else {
      // nodes.push({
      //   type: token.type,
      //   span: token.span,
      //   unsafe: true,
      // });
      i++;
    }
  }

  return nodes;
}

function transform(source: string, start: number, end: number): string[] {
  const names: string[] = [];

  for (let i = start; i < end; i++) {
    const char = source.charCodeAt(i);

    // Ampersand (`&`)
    if (char === 38) {
      // Look around to handle names like `J&K`.
      const left = source.charCodeAt(i - 1);
      const right = source.charCodeAt(i + 1);
      if (left === 32 || right === 32) {
        if (i - start) {
          const name = source.substring(start, i).trim();
          if (name) names.push(name);
        }

        start = i + 1;
      }
      continue;
    }

    // Comma (`,`)
    if (char === 44) {
      if (i - start) {
        const name = source.substring(start, i).trim();
        if (name) {
          names.push(name);
        }
      }

      start = i + 1;
    }
  }

  const finalName = source.substring(start, end).trim();
  if (finalName) {
    names.push(finalName);
  }

  return names;
}

// Quite heavy on perfomance
function isWhitelisted(span: Span, source: string): boolean {
  const content = source.substring(span.start + 1, span.end - 1).toLowerCase();
  return DICT_SET.has(content) || DICT.some(word => content.includes(word));
}

function parseTitle(nodes: Node[], source: string, end: number): [number, Span] {
  const start = end;

  if (nodes.length - end > 1) {
    for (let j = end + 1; j < nodes.length; j++) {
      const node = nodes[j];
      const type = node.type;

      if (type > Types.CLOSE_BARE) break;
      if (type === Types.TEXT) {
        // EXPERIMENTAl:
        // - Fixes `Title (Series) =Group=` (61)
        // - Fixes `Title (Series) - Copy` (126)
        //
        // Titles like `-Title -Anthology-` shouldn't be affected.
        if ([61, 126].includes(source.charCodeAt(node.span.start))) break;

        end = j;
      }
    }

    if (
      nodes[end + 1]?.type === Types.OPEN_BARE &&
      source.charCodeAt(nodes[end + 1].span.start - 1) !== 32
    ) {
      end++;
    }

    if (
      nodes[end + 1]?.type === Types.OPEN_BARE &&
      isWhitelisted(nodes[end + 1].span, source)
    ) {
      end++;
    }
  }

  return [
    end,
    {
      start: nodes[start].span.start,
      end: nodes[end].span.end + Number(
        // Make it more obvious that the title is malformed, e.g.:
        // `Title Series)` is better than just `Title Series`.
        [41, 93, 125].includes(source.charCodeAt(nodes[end].span.end)),
      ),
    },
  ];
}

function pushTail(metadata: Metadata, source: string, node: Node): void {
  (metadata.Tail ??= []).push({
    type: ScopeTypes[node.type],
    value: source.substring(
      node.span.start + 1,
      node.span.end - 1,
    ),
  });
}

export function parseFilename(filename: string): Metadata {
  const source = filename.trim();
  const metadata: Metadata = {
    Title: source,
  };

  const tokens = new Tokenizer(source).tokenize();
  if (tokens.length === 1) {
    return metadata;
  }

  const nodes = parse(tokens);

  let offset = 0;
  let titleParsed = false;

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    switch (node.type) {
      case Types.TEXT: {
        if (titleParsed) {
          // [English] =WE ARE PROBABLY HERE= [DL]
          continue;
        }

        const [pos, span] = parseTitle(nodes, source, index);
        metadata.Title = source.substring(span.start, span.end).trimEnd();

        index = pos;
        titleParsed = true;
        break;
      }

      case Types.OPEN_BARE: {
        if (index === offset) {
          offset++;

          // Pick nearest in case they are chained for some reasons
          if (Types.OPEN_BARE === nodes[index + 1]?.type) {
            continue;
          }

          if (Types.OPEN_SQUARE === nodes[index + 1]?.type) {
            const start = node.span.start + 1;
            const end = node.span.end - 1;

            metadata.Head = transform(source, start, end);
            continue;
          }
        }

        if (!titleParsed && nodes[index + 1]?.type === Types.TEXT) {
          const [pos, span] = parseTitle(nodes, source, index);
          metadata.Title = source.substring(span.start, span.end).trimEnd();

          index = pos;
          titleParsed = true;
          continue;
        }

        if (titleParsed) {
          pushTail(/* MUT */ metadata, source, node);
        }
        break;
      }

      case Types.OPEN_SQUARE: {
        if (index === offset) {
          // [AI Decensored][... (Yapo)] ...
          if (Types.OPEN_SQUARE === nodes[index + 1]?.type) {
            offset++;
            continue;
          }

          const children = node?.children;
          const len = children?.length;

          if (!len) continue;

          const firstChild = children[0];
          if (len > 1 && firstChild.type === Types.TEXT) {
            const lastChild = children[len - 1];

            if (lastChild.type === Types.OPEN_BARE) {
              const lastCircle = children[len - 2];

              // Handle artist names like `Artist(ic)`
              // if (source.charCodeAt(lastChild.span.start - 1) !== 32) {
              //   const artists = transform(source, firstChild.span.start, lastCircle.span.end);
              //   artists[artists.length - 1] += source.substring(
              //     lastChild.span.start,
              //     lastChild.span.end
              //   );
              //   metadata.Artists = artists;
              //   continue;
              // }

              // `bar` in `foo (optional) (bar)`
              metadata.Artists = transform(source, lastChild.span.start + 1, lastChild.span.end - 1);
              // `foo (optional)` sequence in `foo (optional) (bar)`
              metadata.Circles = transform(source, firstChild.span.start, lastCircle.span.end);
            } else {
              metadata.Artists = transform(source, node.span.start + 1, node.span.end - 1);
            }
          } else {
            metadata.Artists = transform(source, node.span.start + 1, node.span.end - 1);
          }

          continue;
        }

        if (titleParsed) {
          pushTail(/* MUT */ metadata, source, node);
        }
        break;
      }

      case Types.OPEN_CURLY: {
        if (titleParsed) {
          pushTail(/* MUT */ metadata, source, node);
        }
        break;
      }

      default:
        break;
    }
  }

  if (source === metadata.Title) {
    return { Title: source };
  }

  return metadata;
}
