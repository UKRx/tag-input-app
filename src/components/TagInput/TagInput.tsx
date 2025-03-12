import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, FocusEvent } from 'react';
import './TagInput.css';

// Define enum for TagInput display states
export enum TagInputState {
    DEFAULT = 'default',
    WITH_TAGS = 'withTags',
    TYPING = 'typing',
    EXCEED_WIDTH = 'exceedWidth'
}

interface TagInputProps {
    initialTags?: string[];
    maxTags?: number;
    placeholder?: string;
    separator?: string;
    onTagsChange?: (tags: string[]) => void;
    allowDuplicates?: boolean;
    state?: TagInputState; // Add state prop to control display mode
    maxWidth?: number; // Optional max width for EXCEED_WIDTH state
}

const TagInput: React.FC<TagInputProps> = ({
    initialTags = [],
    maxTags,
    placeholder = 'Add tags...',
    separator = ',',
    onTagsChange,
    allowDuplicates = false,
    state = TagInputState.DEFAULT,
    maxWidth,
}) => {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState<string>('');
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Check if container is overflowing to handle EXCEED_WIDTH state
    useEffect(() => {
        if (containerRef.current && maxWidth) {
            const checkOverflow = () => {
                const container = containerRef.current;
                if (container) {
                    setIsOverflowing(container.scrollWidth > container.clientWidth);
                }
            };

            checkOverflow();
            window.addEventListener('resize', checkOverflow);
            return () => window.removeEventListener('resize', checkOverflow);
        }
    }, [tags, maxWidth]);

    useEffect(() => {
        if (onTagsChange) {
            onTagsChange(tags);
        }
    }, [tags, onTagsChange]);

    // Handle initial state setup
    useEffect(() => {
        if (state === TagInputState.TYPING && inputRef.current) {
            inputRef.current.focus();
        }

        // For demo purposes, if state is EXCEED_WIDTH and we don't have enough tags
        if (state === TagInputState.EXCEED_WIDTH && tags.length < 5) {
            setTags(['Tag 1', 'Tag 2', 'Tag A', 'Tag A', 'Tag A']);
        }
    }, [state]);

    const addTag = (tagValue: string) => {
        // Trim and ensure tag is not empty
        const trimmedTag = tagValue.trim();
        if (!trimmedTag) return;

        // Check if maximum tags limit reached
        if (maxTags !== undefined && tags.length >= maxTags) return;

        // Check for duplicates if not allowed
        if (!allowDuplicates && tags.includes(trimmedTag)) return;

        setTags([...tags, trimmedTag]);
        setInputValue('');
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // If the separator is typed, add the tag
        if (value.includes(separator)) {
            const newTags = value.split(separator);
            const lastTag = newTags.pop() || '';

            newTags.forEach(tag => addTag(tag));
            setInputValue(lastTag);
        } else {
            setInputValue(value);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue) {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        if (inputValue) {
            addTag(inputValue);
        }
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            className={`tag-input-container ${isOverflowing ? 'overflowing' : ''}`}
            ref={containerRef}
            onClick={focusInput}
            style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
        >
            <div className="tags-area">
                {tags.map((tag, index) => (
                    <div key={`${tag}-${index}`} className="tag">
                        {tag}
                        <button
                            type="button"
                            className="tag-remove-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTag(index);
                            }}
                            aria-label={`Remove tag ${tag}`}
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={state === TagInputState.TYPING && !inputValue ? 'lore' : inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="tag-input"
                    aria-label="Add a tag"
                />
            </div>
        </div>
    );
};

export default TagInput;
