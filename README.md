# Highlights → Stories Mini‑Builder (Tech‑agnostic Scaffold)

**Quick Start**

```shell
    bun install
    bun run dev
```

It will start the frontend and you can see the preview at `http://localhost:5173`

You need an OpenAI API key in order to run the CLI tool, if you don't have one you can use the API key I sent to you via email

for CLI tool `export OPENAI_API_KEY=KEY_HERE`

**To run the CLI tool**
`bun run transform` will run with default input and output files, you can pass cli args like so `bun run transform --output-file="out1.json`

**Run tests**
`bun run test` to run the tests, I added a few tests to validate the output story pack and the generated story pack and same sanity checks

**Build**
`bun run build` to build the project, this will complite both frontend (preview/dist) and the CLI tool (bin/), you can run the compiled transform binary `./bin/transform.$platform_executable_name` and serve the `preview/dist` folder to see the frontend or use `bun run preview`

**AI Usage**

I used AI to generate missing json schema definitions, 2 tests cases and some portion of the UI. The rest is all decided/hand coded by me (tech stack/backend/frontend/UI).

I updated the .md files below so you can read, yo can use the link down below to read how I implemented it.

- [DECISIONS.md](templates/DECISIONS.md)
- [AI_USAGE.md](templates/AI_USAGE.md)

**Thanks for the opportunity and I hope you like my submission**
