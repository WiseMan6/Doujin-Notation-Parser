Doujin format refers to ambiguous naming conventions where each block (either plain text or typed scope) and its position corresponds to specific metadata. The most common and complete example would be `(Head) [Circle (Artist & Artist(2))] Title (tail) [tail2] {tail3}`.

Apart from its "flexibility" in structure, you might find that encountering plain text is not conclusive evidence of having found a title – titles themselves can also contain scopes at the [start](https://github.com/WiseMan6/doujin-format-parser/blob/0258efc3742a5c9522c6ae4436b55c3e5fee89da/tests/real-world.test.ts#L29-L30), at the [end](https://github.com/WiseMan6/doujin-format-parser/blob/0258efc3742a5c9522c6ae4436b55c3e5fee89da/tests/real-world.test.ts#L9-L10), and in the [middle](https://github.com/WiseMan6/doujin-format-parser/blob/0258efc3742a5c9522c6ae4436b55c3e5fee89da/tests/real-world.test.ts#L96-L97). Worse yet, because these constructs are mostly composed by hand, they are prone to typical typos like [duplicated](https://github.com/WiseMan6/doujin-format-parser/blob/0258efc3742a5c9522c6ae4436b55c3e5fee89da/tests/synthetical/malformed.test.ts#L9) or [unclosed](https://github.com/WiseMan6/doujin-format-parser/blob/0258efc3742a5c9522c6ae4436b55c3e5fee89da/tests/synthetical/malformed.test.ts#L22-L23) brackets, where the latter may cause content to "spill out" – something I tried to handle as gracefully as I could.

## Usage
```typescript
import { parseFilename } from "./index.ts";

parseFilename("(C91) [wadamemo (WADA Rco)] Fate GO MEMO (Fate/Grand Order)");
```
How it looks:
```javascript
{
  Title: "Fate GO MEMO",
  Head: [ "C91" ],
  Artists: [ "WADA Rco" ],
  Circles: [ "wadamemo" ],
  Tail: [
    {
      type: "Bare",
      value: "Fate/Grand Order",
    }
  ],
}
```
## Variations support
Though capable of recognizing other naming forms, It merely "tolerates" them, if not outright failing.

For example, the `AI Gen` part in `[AI Gen] [Artist] Title` gets ignored in favor of credentials (Artist/Circle).

Similarly, `(18禁ゲーム) [250613][...] ... (files) {DLsite}` would be parsed with `250613` omitted.
## Limitations
Though some typos become irrelevant once the title is found, something like `[C (A) T` can still throw everything off. It would look like a messy, recognizable line (hopefully).

It does not sanitize input other than trimming it, meaning that technical suffixes like file extensions are best avoided.