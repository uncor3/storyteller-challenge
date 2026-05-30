# DECISIONS

## My approch

I wanted to add this section in `DECISIONS.md` because I think it's worth mentioning.

I wanted to keep it minimalistic and as fast as possible

I chose

- TS/JS for both frontend/backend, as we can share the same types, util functions and so much more.
- React, Tailwind as the frontend stack
- Vite as bundler
- Bun as the runtime as it can compile to native code (much faster than npm)
- Kept AI usage mininal in StoryPack generation, depended on provided data mostly

## Problems I faced

- `json-schema-to-ts` package doesn't support a `.json` file so I had to export schemas from `.ts` files, this is why i deleted `x.schema.json` files. You can Google for `typescript json import as const` or https://www.reddit.com/r/typescript/comments/116mlg2/declaring_static_json_imported_as_const/ for more info

## Heuristic and ranking

- For ranking highlights for example I implemented a scoring system "HIGHLIGHT_SCORE" which looks like this

```tsx
const HIGHLIGHT_SCORE: Record<string, number> = {
  goal: 3,
  'penalty goal': 3,
  'red card': 2,
  'yellow card': 1,
  'penalty won': 1,
};
```

And also did something like so

```jsx
// higher score first if it's a tie, pick the later minute first
highlightCandidates.sort((a, b) => b.score - a.score || b.minute - a.minute);
```

## Data handling (duplicates, missing fields, out‑of‑order minutes)

- I validated `matchInfo` and `messages` separately, it's more work but this way if `matchInfo` is valid, some invalid `messages` are ok we can just drop them instead of dropping the whole thing for a couple invalid `messages`,

- In provided story.schema.json `pack_id` was required but `story_id` was declared I fixed it

- In events_schema.md it's mentioned that these are sent as integers but in reality these were strings in provided data
  ```
  | `minute` | integer | yes | minute in match (0–120) |
  | `period` | integer | yes | 1 or 2 for 1st/2nd half |
  | `second` | integer | yes | second in minute (0-59)
  ```
  I parsed them myself to integers to make sure they are indeed integers, not to mention that they also go through the schema validation

## Pack structure and invariants

- I kept the same pack structure but on "info" type as it allowed additional types I also provided an image for a better looking UI

## What I would do with 2 more hours

- If I had more time, I could use more AI in the story generation process (wherever makes sense), maybe more UI elements , upcoming matches (need data from API for this)
