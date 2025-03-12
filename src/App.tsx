import React, { useState } from 'react';
import './App.css';
import TagInput from './components/TagInput';
import { TagInputState } from './components/TagInput/TagInput';

function App() {
  const [tags, setTags] = useState<string[]>(['Tag 1', 'Tag 2']);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    console.log('Tags updated:', newTags);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tag Input</h1>
      </header>
      <main>
        <section>
          <h2>Default</h2>
          <TagInput
            state={TagInputState.DEFAULT}
            placeholder="Placeholder"
            onTagsChange={handleTagsChange}
          />
        </section>

        <section>
          <h2>With Tag</h2>
          <TagInput
            state={TagInputState.WITH_TAGS}
            initialTags={['Tag 1', 'Tag 2']}
            onTagsChange={handleTagsChange}
          />
        </section>

        <section>
          <h2>When Typing</h2>
          <div className="example-container">
            <TagInput
              state={TagInputState.TYPING}
              initialTags={['Tag 1', 'Tag 2']}
              placeholder="Type here..."
            />
          </div>
        </section>

        <section>
          <h2>When Exceed the Width</h2>
          <div className="example-container">
            <TagInput
              state={TagInputState.EXCEED_WIDTH}
              initialTags={['Tag 1', 'Tag 2', 'Tag A', 'Tag A', 'Tag A']}
            />
          </div>
        </section>

        <section>
          <h2>Behavior</h2>
          <p>Typing "Tag 1, Tag2" and pressing Enter or losing focus will create two tags.</p>
          <p>You can also customize the separator character (default is comma).</p>
        </section>
      </main>
    </div>
  );
}

export default App;
