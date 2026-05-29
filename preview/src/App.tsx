import Out from '../../out/out.json';
import type { Highlight, Cover, Info } from '@/shared/types';
import type { StoryPack } from '@/shared/types';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import validateData from '@/lib/validateData';
import Story from './components/Story';
import Main from './pages/Main';
import './App.css';

const isValid = validateData(Out);
console.log({ isValid });
const stories: Record<string, StoryPack> = {};

type Parsed = {
  highlight: Highlight[];
  info: Info[];
  cover: Cover[];
};

const parsed: Parsed = {
  highlight: [],
  info: [],
  cover: [],
};

const typedOut = Out as StoryPack;
typedOut.pages.forEach((p) => {
  if (p.type === 'highlight') parsed.highlight.push(p as Highlight);
  else if (p.type === 'cover') parsed.cover.push(p as Cover);
  else if (p.type === 'info') parsed.info.push(p as Info);
});

stories[Out.story_id] = typedOut;

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-6 md:px-6">
          <Routes>
            <Route path="/" element={<Main stories={stories} />}>
              <Route
                path="story/:storyId"
                element={<Story stories={stories} />}
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
