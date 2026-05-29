# AI USAGE

## Where AI helped

- I used AI for the "info" pages , the rest was derived directly from the data provided.

## Prompts or strategies that worked

- To generate the `"info"` type using "You are a sports journalist ..." system prompt gave me much better results, before that I just did "Give me a summary of the match"

## Verification steps (tests, assertions, manual checks)

- OpenAI api supports structured outputs using Zod which means it's safe, Zod parses the output,
  yes AI can make mistakes but I used the most recent and fastest model (gpt5.4-mini),
  also added "if you are not sure about something don't include" and "not search anything online and only use the data provided", this significantly reduced the chances of hallucination

## Cases where you chose **not** to use AI and why

- My initial idea was to pass the events to AI and get all of pages but
  deriving from data made much more sense and should be more accurate, due to the fact that AI can make mistakes, I used AI only in one task which is to generate `"info"` page
