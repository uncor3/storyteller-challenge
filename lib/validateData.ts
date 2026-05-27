// import type { StoryPackT } from './types/types';
import StoryPack from '../schema/story.schema.json';
import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import MatchData from '../data/match_events.json';

const ajv = new Ajv({
  allErrors: true,
});

addFormats(ajv);

const validate = ajv.compile(StoryPack);

export default function validateData(data: any) {
  const valid = validate(data);
  if (!valid) {
    console.log(validate.errors);
  } else {
    console.log('Valid');
  }
  return valid;
}
