import Out from '../../out/out.json';
import type { StoryPack } from '@/shared/types';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { validateStorypack } from './utils';
import Story from './components/Story';
import Main from './pages/Main';
import './App.css';

function App() {
  const isValid = validateStorypack(Out);
  if (!isValid) {
    return (
      <div className="text-2xl text-red-500">
        Invalid data. Check console for details.
      </div>
    );
  }

  const typedOut = Out as StoryPack;

  return (
    <BrowserRouter>
      <div className="flex items-center min-h-screen">
        <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-6 md:px-6">
          <Routes>
            <Route
              path="/"
              element={<Main stories={typedOut} story_id={Out.story_id} />}
            >
              <Route
                path="story/:storyId"
                element={<Story story_id={Out.story_id} stories={typedOut} />}
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
