import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { TagInputState } from './components/TagInput/TagInput';

// Define types for the mock component props
interface MockTagInputProps {
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  state?: string;
}

// Mock the TagInput component to simplify testing
jest.mock('./components/TagInput', () => {
  return {
    __esModule: true,
    default: ({ initialTags, onTagsChange, placeholder, state }: MockTagInputProps) => (
      <div data-testid="mock-tag-input" data-state={state}>
        <div data-testid="mock-tags">
          {initialTags?.map((tag: string, index: number) => (
            <span key={index} data-testid="mock-tag">{tag}</span>
          ))}
        </div>
        <input
          data-testid="mock-input"
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (onTagsChange && e.target.value.includes(',')) {
              // Just use the new tags, don't combine with initialTags
              const tags = e.target.value.split(',').map(tag => tag.trim());
              onTagsChange(tags);
            }
          }}
        />
      </div>
    ),
    TagInputState: {
      DEFAULT: 'default',
      WITH_TAGS: 'withTags',
      TYPING: 'typing',
      EXCEED_WIDTH: 'exceedWidth'
    }
  };
});

describe('App Component', () => {
  test('renders the App header', () => {
    render(<App />);
    expect(screen.getByText('Tag Input')).toBeInTheDocument();
  });

  test('renders all sections', () => {
    render(<App />);
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('With Tag')).toBeInTheDocument();
    expect(screen.getByText('When Typing')).toBeInTheDocument();
    expect(screen.getByText('When Exceed the Width')).toBeInTheDocument();
    expect(screen.getByText('Behavior')).toBeInTheDocument();
  });

  test('renders all TagInput components with correct props', () => {
    render(<App />);
    const tagInputs = screen.getAllByTestId('mock-tag-input');

    // Should have 4 TagInput components
    expect(tagInputs).toHaveLength(4);

    // Check states
    expect(tagInputs[0]).toHaveAttribute('data-state', 'default');
    expect(tagInputs[1]).toHaveAttribute('data-state', 'withTags');
    expect(tagInputs[2]).toHaveAttribute('data-state', 'typing');
    expect(tagInputs[3]).toHaveAttribute('data-state', 'exceedWidth');
  });

  test('passes initial tags to TagInput components', () => {
    render(<App />);

    // Check that the "With Tag" section has the correct initial tags
    const tagInputs = screen.getAllByTestId('mock-tag-input');
    const withTagsInput = tagInputs[1];
    const tags = withTagsInput.querySelectorAll('[data-testid="mock-tag"]');

    expect(tags).toHaveLength(2);
    expect(tags[0]).toHaveTextContent('Tag 1');
    expect(tags[1]).toHaveTextContent('Tag 2');
  });

  test('displays behavior instructions', () => {
    render(<App />);

    expect(screen.getByText('Typing "Tag 1, Tag2" and pressing Enter or losing focus will create two tags.')).toBeInTheDocument();
    expect(screen.getByText('You can also customize the separator character (default is comma).')).toBeInTheDocument();
  });

  test('handles tag changes through onTagsChange callback', () => {
    // Mock console.log before rendering
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    render(<App />);

    // Get the first input (Default section)
    const inputs = screen.getAllByTestId('mock-input');
    const defaultInput = inputs[0];

    // Simulate adding tags
    fireEvent.change(defaultInput, { target: { value: 'New Tag 1, New Tag 2' } });

    // Check console.log was called with updated tags - just the new tags
    expect(consoleSpy).toHaveBeenCalledWith(
      'Tags updated:',
      ['New Tag 1', 'New Tag 2']
    );

    // Clean up
    consoleSpy.mockRestore();
  });

  test('renders example containers for specific sections', () => {
    render(<App />);

    // Check that the "When Typing" and "When Exceed the Width" sections are wrapped in example containers
    const exampleContainers = document.querySelectorAll('.example-container');
    expect(exampleContainers).toHaveLength(2);

    // Verify the containers have the correct TagInput components
    const typingContainer = exampleContainers[0];
    const exceedWidthContainer = exampleContainers[1];

    expect(typingContainer.querySelector('[data-state="typing"]')).toBeInTheDocument();
    expect(exceedWidthContainer.querySelector('[data-state="exceedWidth"]')).toBeInTheDocument();
  });
});
