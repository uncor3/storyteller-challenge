import StoryPack from './schema/story.schema.json';
import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import MatchData from './data/match_events.json';
import crypto from 'crypto';
import fs from 'fs';

const OUT_DIR = './out';
const story_id = crypto.randomUUID();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const pages = [];

// TODO: implement generateCaption
async function generateCaption() {}

for (const m of MatchData.messages[0]!.message) {
  // TODO:
  const minute = Number.parseInt(m.minute!, 10);
  if (!Number.isFinite(minute)) continue;

  // await generateCaption();

  pages.push({
    type: 'highlight' as const,
    minute,
    headline: m.comment,
    caption: m.comment,
  });
}

const data = {
  story_id,
  title: 'TODO',
  source: 'provided-data',
  created_at: new Date().toISOString(),
  metrics: {},
  pages,
};

fs.mkdirSync(OUT_DIR);
fs.writeFileSync(`${OUT_DIR}/out.json`, JSON.stringify(data, null, 2));

const validate = ajv.compile(StoryPack);
const valid = validate(data);
if (!valid) console.log(validate.errors);
else console.log('Transform completed');
