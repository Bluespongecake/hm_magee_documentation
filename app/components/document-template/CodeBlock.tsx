type CodeLanguage = "html" | "javascript" | "typescript" | "json";
type TokenType =
  | "plain"
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "property"
  | "function"
  | "operator"
  | "punctuation"
  | "tag"
  | "attr-name"
  | "attr-value";

type CodeToken = {
  type: TokenType;
  text: string;
};

const SCRIPT_KEYWORDS = new Set([
  "async",
  "await",
  "const",
  "else",
  "false",
  "fetch",
  "function",
  "if",
  "import",
  "from",
  "let",
  "new",
  "null",
  "return",
  "true",
  "var",
]);

const JSON_KEYWORDS = new Set(["true", "false", "null"]);

const toPlain = (text: string): CodeToken => ({ type: "plain", text });

function tokenizeScriptLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  while (cursor < line.length) {
    const rest = line.slice(cursor);

    const comment = /^\/\/.*/.exec(rest);
    if (comment) {
      tokens.push({ type: "comment", text: comment[0] });
      break;
    }

    const stringLiteral = /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/.exec(rest);
    if (stringLiteral) {
      tokens.push({ type: "string", text: stringLiteral[0] });
      cursor += stringLiteral[0].length;
      continue;
    }

    const property = /^[A-Za-z_$][\w$]*(?=\s*:)/.exec(rest);
    if (property) {
      tokens.push({ type: "property", text: property[0] });
      cursor += property[0].length;
      continue;
    }

    const functionCall = /^[A-Za-z_$][\w$]*(?=\s*\()/.exec(rest);
    if (functionCall) {
      const value = functionCall[0];
      tokens.push({
        type: SCRIPT_KEYWORDS.has(value) ? "keyword" : "function",
        text: value,
      });
      cursor += value.length;
      continue;
    }

    const identifier = /^[A-Za-z_$][\w$]*/.exec(rest);
    if (identifier) {
      const value = identifier[0];
      tokens.push({
        type: SCRIPT_KEYWORDS.has(value) ? "keyword" : "plain",
        text: value,
      });
      cursor += value.length;
      continue;
    }

    const numberToken = /^\d+(?:\.\d+)?/.exec(rest);
    if (numberToken) {
      tokens.push({ type: "number", text: numberToken[0] });
      cursor += numberToken[0].length;
      continue;
    }

    const operator = /^===|^!==|^==|^!=|^<=|^>=|^=>|^[=+\-*/%<>!&|?:]/.exec(rest);
    if (operator) {
      tokens.push({ type: "operator", text: operator[0] });
      cursor += operator[0].length;
      continue;
    }

    const punctuation = /^[()[\]{}.,;]/.exec(rest);
    if (punctuation) {
      tokens.push({ type: "punctuation", text: punctuation[0] });
      cursor += punctuation[0].length;
      continue;
    }

    const whitespace = /^\s+/.exec(rest);
    if (whitespace) {
      tokens.push(toPlain(whitespace[0]));
      cursor += whitespace[0].length;
      continue;
    }

    tokens.push(toPlain(rest[0]));
    cursor += 1;
  }

  return tokens;
}

function tokenizeJsonLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  while (cursor < line.length) {
    const rest = line.slice(cursor);

    const propertyString = /^"(?:\\.|[^"\\])*"(?=\s*:)/.exec(rest);
    if (propertyString) {
      tokens.push({ type: "property", text: propertyString[0] });
      cursor += propertyString[0].length;
      continue;
    }

    const stringLiteral = /^"(?:\\.|[^"\\])*"/.exec(rest);
    if (stringLiteral) {
      tokens.push({ type: "string", text: stringLiteral[0] });
      cursor += stringLiteral[0].length;
      continue;
    }

    const keyword = /^(true|false|null)\b/.exec(rest);
    if (keyword) {
      tokens.push({
        type: JSON_KEYWORDS.has(keyword[1]) ? "keyword" : "plain",
        text: keyword[0],
      });
      cursor += keyword[0].length;
      continue;
    }

    const numberToken = /^-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?/.exec(rest);
    if (numberToken) {
      tokens.push({ type: "number", text: numberToken[0] });
      cursor += numberToken[0].length;
      continue;
    }

    const punctuation = /^[()[\]{}.,:]/.exec(rest);
    if (punctuation) {
      tokens.push({ type: "punctuation", text: punctuation[0] });
      cursor += punctuation[0].length;
      continue;
    }

    const whitespace = /^\s+/.exec(rest);
    if (whitespace) {
      tokens.push(toPlain(whitespace[0]));
      cursor += whitespace[0].length;
      continue;
    }

    tokens.push(toPlain(rest[0]));
    cursor += 1;
  }

  return tokens;
}

function tokenizeHtmlLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  while (cursor < line.length) {
    const rest = line.slice(cursor);

    const comment = /^<!--.*-->/.exec(rest);
    if (comment) {
      tokens.push({ type: "comment", text: comment[0] });
      cursor += comment[0].length;
      continue;
    }

    const tag = /^<\/?[A-Za-z][\w-]*/.exec(rest);
    if (tag) {
      tokens.push({ type: "tag", text: tag[0] });
      cursor += tag[0].length;
      continue;
    }

    const tagClose = /^\/?>/.exec(rest);
    if (tagClose) {
      tokens.push({ type: "punctuation", text: tagClose[0] });
      cursor += tagClose[0].length;
      continue;
    }

    const attrName = /^\s+[A-Za-z_:][\w:.-]*/.exec(rest);
    if (attrName) {
      const leading = attrName[0].match(/^\s+/)?.[0] ?? "";
      if (leading) tokens.push(toPlain(leading));
      tokens.push({
        type: "attr-name",
        text: attrName[0].slice(leading.length),
      });
      cursor += attrName[0].length;
      continue;
    }

    const operator = /^=/.exec(rest);
    if (operator) {
      tokens.push({ type: "operator", text: operator[0] });
      cursor += operator[0].length;
      continue;
    }

    const attrValue = /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/.exec(rest);
    if (attrValue) {
      tokens.push({ type: "attr-value", text: attrValue[0] });
      cursor += attrValue[0].length;
      continue;
    }

    tokens.push(toPlain(rest[0]));
    cursor += 1;
  }

  return tokens;
}

function tokenizeLine(line: string, language: CodeLanguage): CodeToken[] {
  if (language === "html") return tokenizeHtmlLine(line);
  if (language === "json") return tokenizeJsonLine(line);
  return tokenizeScriptLine(line);
}

export function CodeBlock({ language, code }: { language: CodeLanguage; code: string }) {
  const lines = code.trim().split("\n");

  return (
    <div className="code-block-frame">
      <div className="code-block__language">{language}</div>
      <pre className={`code-block code-block--${language}`}>
        <code>
          {lines.map((line, lineIndex) => (
            <span className="code-block__line" key={`${language}-${lineIndex}`}>
              {tokenizeLine(line, language).map((token, tokenIndex) => (
                <span
                  className={`code-block__token code-block__token--${token.type}`}
                  key={`${language}-${lineIndex}-${tokenIndex}`}
                >
                  {token.text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
