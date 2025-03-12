import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagInput, { TagInputState } from './TagInput';

describe('TagInput Component', () => {
    // Basic rendering tests
    test('renders empty input with placeholder', () => {
        render(<TagInput placeholder="Test placeholder" />);
        expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
    });

    test('renders initial tags', () => {
        render(<TagInput initialTags={['React', 'TypeScript']} />);
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    // Functionality tests
    test('adds a new tag when Enter is pressed', async () => {
        render(<TagInput />);
        const input = screen.getByRole('textbox');

        await userEvent.type(input, 'New Tag');
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(screen.getByText('New Tag')).toBeInTheDocument();
        expect(input).toHaveValue('');
    });

    test('adds multiple tags when separator is used', async () => {
        render(<TagInput separator="," />);
        const input = screen.getByRole('textbox');

        await userEvent.type(input, 'Tag1,Tag2');

        expect(screen.getByText('Tag1')).toBeInTheDocument();
        expect(input).toHaveValue('Tag2');

        fireEvent.blur(input);
        expect(screen.getByText('Tag2')).toBeInTheDocument();
        expect(input).toHaveValue('');
    });

    test('removes a tag when remove button is clicked', () => {
        render(<TagInput initialTags={['React']} />);

        const removeButton = screen.getByLabelText('Remove tag React');
        userEvent.click(removeButton);

        expect(screen.queryByText('React')).not.toBeInTheDocument();
    });

    test('removes the last tag when backspace is pressed with empty input', () => {
        render(<TagInput initialTags={['React', 'TypeScript']} />);

        const input = screen.getByRole('textbox');
        userEvent.click(input);
        fireEvent.keyDown(input, { key: 'Backspace' });

        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
    });

    test('calls onTagsChange when tags are modified', async () => {
        const handleTagsChange = jest.fn();

        render(<TagInput onTagsChange={handleTagsChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'New Tag');
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(handleTagsChange).toHaveBeenCalledWith(['New Tag']);
    });

    // Constraint tests
    test('respects maximum tags limit', async () => {
        const maxTags = 2;
        render(<TagInput initialTags={['React', 'TypeScript']} maxTags={maxTags} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'JavaScript');
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
        expect(screen.getAllByText(/React|TypeScript/)).toHaveLength(maxTags);
    });

    test('prevents duplicate tags when allowDuplicates is false', async () => {
        render(<TagInput initialTags={['React']} allowDuplicates={false} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'React');
        fireEvent.keyDown(input, { key: 'Enter' });

        // Should still only have one "React" tag
        expect(screen.getAllByText('React')).toHaveLength(1);
    });

    test('allows duplicate tags when allowDuplicates is true', async () => {
        render(<TagInput initialTags={['React']} allowDuplicates={true} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'React');
        fireEvent.keyDown(input, { key: 'Enter' });

        // Should have two "React" tags
        expect(screen.getAllByText('React')).toHaveLength(2);
    });

    test('does not add empty tags', async () => {
        render(<TagInput />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, '   ');
        fireEvent.keyDown(input, { key: 'Enter' });

        // No tags should be added
        expect(screen.queryByRole('button', { name: /Remove tag/ })).not.toBeInTheDocument();
    });

    // Display state tests
    test('renders in default state', () => {
        render(<TagInput state={TagInputState.DEFAULT} placeholder="Default placeholder" />);
        expect(screen.getByPlaceholderText('Default placeholder')).toBeInTheDocument();
    });

    test('renders in with-tags state', () => {
        render(<TagInput state={TagInputState.WITH_TAGS} initialTags={['Tag 1', 'Tag 2']} />);
        expect(screen.getByText('Tag 1')).toBeInTheDocument();
        expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });

    test('renders in typing state with "lore" value', () => {
        render(<TagInput state={TagInputState.TYPING} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('lore');
    });

    test('renders in exceed-width state with predefined tags', () => {
        render(<TagInput state={TagInputState.EXCEED_WIDTH} maxWidth={300} />);
        expect(screen.getAllByText(/Tag/)).toHaveLength(5);
    });

    // Overflow detection tests
    test('adds overflowing class when tags exceed container width', async () => {
        // Mock the scrollWidth and clientWidth
        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
            configurable: true,
            get: function () {
                return this.classList.contains('tag-input-container') ? 400 : 0;
            }
        });

        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            configurable: true,
            get: function () {
                return this.classList.contains('tag-input-container') ? 300 : 0;
            }
        });

        render(<TagInput maxWidth={300} initialTags={['Tag 1', 'Tag 2']} />);

        // Trigger the resize event to force overflow check
        fireEvent(window, new Event('resize'));

        await waitFor(() => {
            const container = document.querySelector('.tag-input-container');
            expect(container).toHaveClass('overflowing');
        });
    });

    // Interaction tests
    test('focuses the input when container is clicked', () => {
        render(<TagInput />);

        const container = document.querySelector('.tag-input-container');
        const input = screen.getByRole('textbox');

        // Click outside to ensure focus is not on the input
        userEvent.click(document.body);
        expect(document.activeElement).not.toBe(input);

        // Click the container
        userEvent.click(container!);
        expect(document.activeElement).toBe(input);
    });

    test('adds tag on blur if input has value', async () => {
        render(<TagInput />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'Blur Tag');

        // Blur the input
        fireEvent.blur(input);

        expect(screen.getByText('Blur Tag')).toBeInTheDocument();
        expect(input).toHaveValue('');
    });

    test('stops event propagation when removing a tag', () => {
        // Create a mock container click handler
        const containerClickHandler = jest.fn();

        // Render component with the mock click handler
        render(
            <div onClick={containerClickHandler}>
                <TagInput initialTags={['React']} />
            </div>
        );

        // Get the remove button and click it
        const removeButton = screen.getByLabelText('Remove tag React');
        userEvent.click(removeButton);

        // The container click handler should not be called if stopPropagation works
        expect(containerClickHandler).not.toHaveBeenCalled();
    });

});
