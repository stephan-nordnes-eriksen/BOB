/**
 * BOB - Build Or Bail
 *
 * A simple and powerful pipe system for building complex XML and HTML structures.
 */

/** A value that can be a string or a zero-argument function that returns an unknown (coerced to string). */
export type BOBOptionFunction = () => unknown;
export type BOBOptionValue = string | BOBOptionFunction;

/** Map of HTML attribute names to their values (functions or strings). */
export type BOBOptions = Record<string, BOBOptionValue>;

const SELF_CLOSING_TAGS: ReadonlySet<string> = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
  "basefont",
  "bgsound",
  "frame",
  "isindex",
]);

// ─── BOB ─────────────────────────────────────────────────────────────────────

export class BOB {
  /** Shared data slot set during `.do()` iteration; access via `BOB.data()`. */
  static _data: unknown = null;

  parent: BOB | null;
  options: Record<string, string>;
  preBob: BOB | null;
  innerBob: BOB | null;
  postBob: BOB | null;
  type: string;
  object_class: string | null;
  object_id: string | null;
  object_content: string;
  object_style: string | null;

  // ── Static helpers ──────────────────────────────────────────────────────────

  /** TODO: selects an existing DOM element and append/prepend/inserts into it. */
  static find(_selector: string): void {
    // intentionally empty – not yet implemented
  }

  /** Returns the current data item set during a `.do()` iteration. */
  static data(): unknown {
    return BOB._data;
  }

  /** Shorthand for `BOB.data()`. */
  static d(): unknown {
    return BOB._data;
  }

  /**
   * Returns `data` as-is when it is already a `BOB` instance,
   * otherwise creates a new `BOB` from the selector string.
   */
  static get_or_create_bob(
    data: string | BOB,
    options: BOBOptions | undefined,
    parent: BOB | null
  ): BOB {
    if (data instanceof BOB) {
      return data;
    }
    return new BOB(data, options, parent);
  }

  /**
   * Resolves `data` to a string:
   * - if it is a function, call it and coerce the result with `String()`
   * - otherwise return the string directly
   */
  static toVariable(data: BOBOptionValue): string {
    if (typeof data === "function") {
      return String(data());
    }
    return data;
  }

  // ── Constructor ─────────────────────────────────────────────────────────────

  constructor(
    selector: string,
    options?: BOBOptions,
    parent: BOB | null = null,
    preBob: BOB | null = null,
    contentBob: BOB | null = null,
    postBob: BOB | null = null
  ) {
    if (selector.indexOf(" ") > -1) {
      console.error(
        `Invalid BOB selector. "${selector}" contains " "(space). ` +
          `Only allowed is "tag", "tag.class", or "tag#id".`
      );
    }

    this.parent = parent;

    // Resolve any function values in options immediately so that BOB.data is
    // captured at construction time (important inside a .do() loop).
    this.options = {};
    if (options) {
      for (const key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          this.options[key] = BOB.toVariable(options[key]);
        }
      }
    }

    this.preBob = preBob;
    this.innerBob = contentBob;
    this.postBob = postBob;

    this.type = selector;
    this.object_class = null;
    this.object_id = null;
    this.object_content = "";
    this.object_style = null;

    if (selector.indexOf(".") > -1) {
      const parts = selector.split(".");
      this.type = parts[0];
      this.object_class = parts[1] ?? null;
    } else if (selector.indexOf("#") > -1) {
      const parts = selector.split("#");
      this.type = parts[0];
      this.object_id = parts[1] ?? null;
    }
  }

  // ── Instance methods ────────────────────────────────────────────────────────

  /** Set the text content of this element. Alias: `.co()`. */
  content(content: BOBOptionValue): this {
    return this.co(content);
  }

  /** Shorthand for `.content()`. */
  co(content: BOBOptionValue): this {
    const child = this.i("");
    child.object_content = BOB.toVariable(content);
    return this;
  }

  /** Set the inline `style` attribute. Alias: `.st()`. */
  style(style: BOBOptionValue): this {
    return this.st(style);
  }

  /** Shorthand for `.style()`. */
  st(style: BOBOptionValue): this {
    this.object_style = BOB.toVariable(style);
    return this;
  }

  /** Set the `class` attribute. Alias: `.cl()`. */
  class(object_class: BOBOptionValue): this {
    return this.cl(object_class);
  }

  /** Shorthand for `.class()`. */
  cl(object_class: BOBOptionValue): this {
    this.object_class = BOB.toVariable(object_class);
    return this;
  }

  /** Set the `id` attribute. */
  id(object_id: BOBOptionValue): this {
    this.object_id = BOB.toVariable(object_id);
    return this;
  }

  /**
   * Insert a child element inside this element.
   * Returns the newly created child (shifts focus downward). Alias: `.i()`.
   */
  insert(data: string | BOB, options?: BOBOptions): BOB {
    return this.i(data, options);
  }

  /** Shorthand for `.insert()`. */
  i(data: string | BOB, options?: BOBOptions): BOB {
    const child_bob = BOB.get_or_create_bob(data, options, this);
    if (this.innerBob) {
      this.innerBob.a(child_bob);
    } else {
      this.innerBob = child_bob;
    }
    return child_bob;
  }

  /**
   * Append a sibling element after this element.
   * Returns the newly created sibling (shifts focus to sibling). Alias: `.a()`.
   */
  append(data: string | BOB, options?: BOBOptions): BOB {
    return this.a(data, options);
  }

  /** Shorthand for `.append()`. */
  a(data: string | BOB, options?: BOBOptions): BOB {
    const par = this.parent ?? this;
    const new_bob = BOB.get_or_create_bob(data, options, par);
    if (this.postBob) {
      return this.postBob.a(new_bob);
    }
    this.postBob = new_bob;
    return new_bob;
  }

  /**
   * Prepend a sibling element before this element.
   * Returns the newly created sibling (shifts focus to sibling). Alias: `.p()`.
   */
  prepend(data: string | BOB, options?: BOBOptions): BOB {
    return this.p(data, options);
  }

  /** Shorthand for `.prepend()`. */
  p(data: string | BOB, options?: BOBOptions): BOB {
    const par = this.parent ?? this;
    const new_bob = BOB.get_or_create_bob(data, options, par);
    if (this.preBob) {
      return this.preBob.p(new_bob);
    }
    this.preBob = new_bob;
    return new_bob;
  }

  /**
   * Iterate over `dataset`, repeating the subsequent chain once per item.
   * Use `BOB.data()` (or `BOB.d()`) inside the chain to access the current item.
   * Alias: `.d()`.
   */
  do(dataset: unknown[]): BOBChildArray {
    return this.d(dataset);
  }

  /** Shorthand for `.do()`. */
  d(dataset: unknown[]): BOBChildArray {
    return new BOBChildArray(dataset, this);
  }

  /** Move focus up to the parent element. Returns `null` at the root. Alias: `.u()`. */
  up(): BOB | null {
    return this.u();
  }

  /** Shorthand for `.up()`. */
  u(): BOB | null {
    return this.parent;
  }

  /** Return a pretty-printed HTML/XML string. Alias: `.pp()`. */
  prettyPrint(): string {
    return this.pp();
  }

  /** Shorthand for `.prettyPrint()`. */
  pp(): string {
    return this.s(true);
  }

  /** Serialize to an HTML/XML string (calls `.s()`). */
  toString(): string {
    return this.s();
  }

  /**
   * Serialize to an HTML/XML string.
   * When called on a non-root element the call bubbles up to the root automatically.
   *
   * @param pretty - when `true`, output is indented for readability.
   */
  s(pretty: boolean = false): string {
    // Bubble up to the root so that the full tree is serialized.
    if (this.parent) {
      return this.parent.s(pretty);
    }

    // Detach children's parent pointers so their own s() calls don't bubble.
    if (this.innerBob) {
      this.innerBob.parent = null;
    }
    if (this.preBob) {
      this.preBob.parent = null;
    }
    if (this.postBob) {
      this.postBob.parent = null;
    }

    let prepend = "";
    let append = "";
    let printself = "";
    let content_b = "";

    if (this.innerBob) {
      content_b = this.innerBob.s(pretty);
    }
    if (this.preBob) {
      prepend = this.preBob.s(pretty);
    }
    if (this.postBob) {
      append = this.postBob.s(pretty);
    }

    // TODO: Make special case for img (or those without content?) and
    //       no-type tags, which are pure text content.
    if (this.type !== "") {
      printself += "<" + this.type + " ";

      for (const key in this.options) {
        if (Object.prototype.hasOwnProperty.call(this.options, key)) {
          const value = this.options[key];
          // Skip the key when a dedicated property overrides it.
          if (
            !(key === "style" && this.object_style) &&
            !(key === "id" && this.object_id) &&
            !(key === "class" && this.object_class)
          ) {
            printself += key + '="' + value + '" ';
          }
        }
      }

      if (this.object_class) {
        printself += 'class="' + this.object_class + '" ';
      }
      if (this.object_id) {
        printself += 'id="' + this.object_id + '" ';
      }
      if (this.object_style) {
        printself += 'style="' + this.object_style + '" ';
      }

      // Remove the trailing space before the closing angle bracket.
      printself = printself.slice(0, -1);

      const closable = SELF_CLOSING_TAGS.has(this.type);
      if (closable && content_b === "") {
        printself += " />";
      } else {
        if (pretty) {
          if (content_b) {
            content_b = "\n\t" + content_b.split("\n").join("\n\t") + "\n";
          } else {
            content_b = "\n";
          }
        }
        printself += ">" + content_b + "</" + this.type + ">";
      }
    } else {
      // Pure text element (no tag type).
      // object_content is the only meaningful property here; innerBob is unused.
      printself = this.object_content;
    }

    if (pretty) {
      if (prepend) {
        prepend = prepend + "\n\t";
        printself = printself.split("\n").join("\n\t");
      }
      if (append) {
        append = "\n" + append;
      }
    }

    return prepend + printself + append;
  }
}

// ─── BOBChildArray ───────────────────────────────────────────────────────────

/**
 * Manages parallel BOB chains – one per element of a dataset.
 * Created by `BOB.do()` / `BOB.d()`; not intended to be instantiated directly.
 */
export class BOBChildArray {
  dataset: unknown[];
  parent: BOB;
  bobs: BOB[];

  constructor(dataset: unknown[], parent: BOB) {
    this.dataset = dataset;
    this.parent = parent;
    this.bobs = [];
  }

  // Note: There is no point applying these to the parent directly.
  // Calling `.do(data).id(BOB.data)` would not make sense.

  /** Set content on each child. Alias: `.co()`. */
  content(content: BOBOptionValue): this {
    return this.co(content);
  }

  /** Shorthand for `.content()`. */
  co(content: BOBOptionValue): this {
    for (let i = 0; i < this.dataset.length; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].co(content);
      }
    }
    return this;
  }

  /** Set style on each child. Alias: `.st()`. */
  style(style: BOBOptionValue): this {
    return this.st(style);
  }

  /** Shorthand for `.style()`. */
  st(style: BOBOptionValue): this {
    for (let i = 0; i < this.dataset.length; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].st(style);
      }
    }
    return this;
  }

  /** Set class on each child. Alias: `.cl()`. */
  class(object_class: BOBOptionValue): this {
    return this.cl(object_class);
  }

  /** Shorthand for `.class()`. */
  cl(object_class: BOBOptionValue): this {
    for (let i = 0; i < this.dataset.length; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].cl(object_class);
      }
    }
    return this;
  }

  /** Set id on each child. */
  id(object_id: BOBOptionValue): this {
    for (let i = 0; i < this.dataset.length; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i].id(object_id);
      }
    }
    return this;
  }

  /** Insert a child inside each tracked element. Alias: `.i()`. */
  insert(data: string | BOB, options?: BOBOptions): this {
    return this.i(data, options);
  }

  /** Shorthand for `.insert()`. */
  i(data: string | BOB, options?: BOBOptions): this {
    for (let i = 0; i < this.dataset.length; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].insert(data, options);
      } else {
        this.bobs.push(this.parent.insert(data, options));
      }
    }
    return this;
  }

  /** Append a sibling after each tracked element. Alias: `.a()`. */
  append(data: string | BOB, options?: BOBOptions): this {
    return this.a(data, options);
  }

  /** Shorthand for `.append()`. */
  a(data: string | BOB, options?: BOBOptions): this {
    for (let i = 0; i < this.dataset.length; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].a(data, options);
      } else {
        this.bobs.push(this.parent.a(data, options));
      }
    }
    return this;
  }

  /** Prepend a sibling before each tracked element. Alias: `.p()`. */
  prepend(data: string | BOB, options?: BOBOptions): this {
    return this.p(data, options);
  }

  /** Shorthand for `.prepend()`. */
  p(data: string | BOB, options?: BOBOptions): this {
    for (let i = 0; i < this.dataset.length; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        this.bobs[i] = this.bobs[i].p(data, options);
      } else {
        this.bobs.push(this.parent.p(data, options));
      }
    }
    return this;
  }

  /** Return a pretty-printed HTML/XML string. Alias: `.pp()`. */
  prettyPrint(): string {
    return this.pp();
  }

  /** Shorthand for `.prettyPrint()`. */
  pp(): string {
    return this.s(true);
  }

  /** Serialize to an HTML/XML string (calls `.s()`). */
  toString(): string {
    return this.s();
  }

  /**
   * Serialize to an HTML/XML string by delegating to the parent BOB's `.s()`.
   * @param pretty - when `true`, output is indented for readability.
   */
  s(pretty: boolean = false): string {
    return this.parent.s(pretty);
  }

  /**
   * Nested `.do()` – documented to not behave correctly when chained.
   * TODO: do(data).do(data2) does not behave correctly.
   * Alias: `.d()`.
   */
  do(data: unknown[]): this {
    return this.d(data);
  }

  /** Shorthand for `.do()`. */
  d(data: unknown[]): this {
    const len = Math.min(this.bobs.length, this.dataset.length);
    for (let i = 0; i < len; i++) {
      BOB._data = this.dataset[i];
      if (this.bobs[i]) {
        // BOB.d() returns a BOBChildArray; store it via type assertion.
        // Nested do() is known to not work correctly (see TODO above).
        (this.bobs as unknown[])[i] = this.bobs[i].d(data);
      } else {
        (this.bobs as unknown[]).push(this.parent.d(data));
      }
    }
    return this;
  }

  /** Move focus up to the parent element. Alias: `.u()`. */
  up(): BOB | BOBChildArray {
    return this.u();
  }

  /** Shorthand for `.up()`. */
  u(): BOB | BOBChildArray {
    if (!this.bobs[0]) {
      BOB._data = null;
      return this.parent;
    }

    for (let i = 0; i < this.bobs.length; i++) {
      // BOB.u() returns BOB | null; if null (root element), keep current bob.
      const result = this.bobs[i].u();
      if (result !== null) {
        this.bobs[i] = result;
      }
    }

    if (this.bobs[0] === this.parent) {
      BOB._data = null;
      return this.parent;
    }

    return this;
  }
}
