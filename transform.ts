import StoryPack from './schema/story.schema.ts';
import EventsSchema from './data/events.schema.ts';
import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import MatchData from './data/match_events.json';
import crypto from 'crypto';
import fs from 'fs';
import { IMAGES } from './shared/constants.ts';
import { exit } from 'process';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

type Message = (typeof MatchData.messages)[number]['message'][number];
const OUT_DIR = './out';

if (!process.env.OPENAI_API_KEY) {
  console.log(
    'Please set OPENAI_API_KEY env var, you can use the API key I provided in the email sent to you',
  );
  exit(1);
}

const openai = new OpenAI();
const story_id = crypto.randomUUID();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validateEvent = ajv.compile(EventsSchema);

async function main() {
  type NormalizedMessage = ReturnType<typeof normalizeEvent>;
  const pages = [];
  const contestById = new Map(
    MatchData.matchInfo.contestant.map((team) => [team.id, team]),
  );

  function getTeamName(teamId?: string) {
    if (!teamId) return undefined;
    return contestById.get(teamId)?.name ?? contestById.get(teamId)?.shortName;
  }

  function getTeamCode(teamId?: string) {
    if (!teamId) return undefined;
    return contestById.get(teamId)?.code;
  }

  let homeScore = 0;
  let awayScore = 0;
  const homeTeamId = MatchData.matchInfo.contestant.find(
    (t) => t.position === 'home',
  )?.id;
  const awayTeamId = MatchData.matchInfo.contestant.find(
    (t) => t.position === 'away',
  )?.id;

  function isGoal(event: NormalizedMessage) {
    return GOAL_TYPES.includes(event.type);
  }

  function countAsGoal(event: NormalizedMessage) {
    if (event.teamRef1 === homeTeamId) homeScore += 1;
    if (event.teamRef1 === awayTeamId) awayScore += 1;
  }

  const GOAL_TYPES = ['goal', 'penalty goal'];
  const HIGHLIGHT_TYPES = GOAL_TYPES.concat([
    'yellow card',
    'red card',
    'penalty won',
  ]);
  const HIGHLIGHT_SCORE: Record<string, number> = {
    goal: 3,
    'penalty goal': 3,
    'red card': 2,
    'yellow card': 1,
    'penalty won': 1,
  };

  function getRandomImage() {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
  }

  function isHighlight(event: NormalizedMessage) {
    return HIGHLIGHT_TYPES.includes(event.type);
  }

  function highlightScore(event: string) {
    return HIGHLIGHT_SCORE[event] ?? 0;
  }

  function normalizeEvent(m: Message) {
    const minute = Number.parseInt(String(m.minute ?? ''));
    const period = Number.parseInt(String(m.period ?? ''));
    const second = Number.parseInt(String(m.second ?? ''));

    return {
      minute,
      period,
      second,
      teamRef1: m.teamRef1,
      type: m.type,
      playerRef1: m.playerRef1,
      playerRef2: m.playerRef2,
      comment: m.comment,
    };
  }

  const highlightCandidates: Array<{
    minute: number;
    type: string;
    comment: string;
    headline: string;
    caption: string;
    score: number;
  }> = [];

  let prevCaption = '';
  // we need to do reverse in order for the
  // captions (scores) to be accurate
  // reverse modifies the original array and it's fine
  for (const m of MatchData.messages[0]!.message.reverse()) {
    const normalized = normalizeEvent(m);
    if (!validateEvent(normalized)) continue;
    if (!isHighlight(normalized)) continue;
    if (isGoal(normalized)) countAsGoal(normalized);

    const score = {
      homeNameCode: getTeamCode(homeTeamId) ?? 'Home',
      homeName: getTeamName(homeTeamId) ?? 'Home',
      homeScore,
      awayNameCode: getTeamCode(awayTeamId) ?? 'Away',
      awayName: getTeamName(awayTeamId) ?? 'Away',
      awayScore,
    };
    const caption = `${score.homeNameCode} ${score.homeScore}-${score.awayScore} ${score.awayNameCode}`;
    const headline = `${score.homeName} ${score.homeScore}-${score.awayScore} ${score.awayName}`;

    highlightCandidates.push({
      minute: normalized.minute,
      type: normalized.type,
      comment: normalized.comment,
      // if the score is the same then just show the comment
      caption: caption === prevCaption ? normalized.comment : caption,
      headline,
      score: highlightScore(normalized.type),
    });
    prevCaption = caption;
  }

  // higher score first if it's a tie, pick the later minute first
  highlightCandidates
    .sort((a, b) => b.score - a.score || b.minute - a.minute)
    // .slice(0, 12)
    .forEach((m) => {
      pages.push({
        type: 'highlight',
        minute: m.minute,
        headline: m.headline,
        caption: m.caption,
        image: getRandomImage(),
        explanation: m.comment,
      });
    });

  const score = {
    homeName: getTeamName(homeTeamId) ?? 'Home',
    homeScore,
    awayName: getTeamName(awayTeamId) ?? 'Away',
    awayScore,
  };

  const finalScore = `${score.homeName} ${score.homeScore}-${score.awayScore} ${score.awayName}`;

  pages.push({
    type: 'cover',
    headline: finalScore,
    subheadline: `${MatchData.matchInfo.competition.knownName} · ${MatchData.matchInfo.localDate}`,
    image: IMAGES[Math.floor(Math.random() * IMAGES.length)],
  });

  const InfoScheme = z.object({
    headline: z.string().min(10),
    body: z.string().min(200),
  });

  console.log('Generating match summary...');

  const response = await openai.responses.parse({
    model: 'gpt-5.4-mini',
    input: [
      {
        role: 'system',
        content: `You are a sports journalist`,
      },
      {
        role: 'user',
        content: `
        Write a brief match summary, be optimistic, return headline and body ,
        headline must at least be 10 characters and the body must be at least 200 characters,
  
        Here is the match details

        Match: ${finalScore}
        Competition: ${MatchData.matchInfo.competition.knownName}
        Date: ${MatchData.matchInfo.localDate}
        
        Key Events : ${JSON.stringify(highlightCandidates)}
        `,
      },
    ],
    text: {
      format: zodTextFormat(InfoScheme, 'event'),
    },
  });

  const out = response.output_parsed;

  if (!out) {
    console.log('Failed to get data from openai');
    exit(1);
  }

  console.log('Generation completed...');

  pages.push({
    type: 'info',
    headline: out.headline,
    body: out.body,
    //additional but i believe it'll look good on UI
    image: getRandomImage(),
  });

  const data = {
    story_id,
    title: finalScore || MatchData.matchInfo.description,
    source: 'provided-data',
    created_at: new Date().toISOString(),
    metrics: {
      highlights: highlightCandidates.length,
      goals: score.homeScore + score.awayScore,
    },
    pages,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(`${OUT_DIR}/out.json`, JSON.stringify(data, null, 2));

  const validate = ajv.compile(StoryPack);
  const valid = validate(data);
  if (!valid) {
    console.log(validate.errors);
    exit(1);
  }

  // FIXME: make this dynamic based on the input file name
  console.log('Data is valid and written to out/out.json');
}

main();
