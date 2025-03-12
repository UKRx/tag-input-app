# TagInput Component

A flexible and customizable React component for managing tags in forms and interfaces.

## Features

- Add tags by typing and pressing Enter, using a customizable separator, or on blur
- Remove tags by clicking the "X" button
- Limit the maximum number of tags
- Handle duplicate tags (allow or prevent)
- Customizable separator character
- Responsive design with overflow detection
- Fully accessible with ARIA attributes
- TypeScript support with proper type definitions

## Installation

```bash
npm install
npm run start
```

# TagInput.tsx

| Prop              | Type                       | Default                 | Description                                 |
| ----------------- | -------------------------- | ----------------------- | ------------------------------------------- |
| `initialTags`     | `string[]`                 | `[]`                    | Initial tags to display                     |
| `maxTags`         | `number`                   | `undefined`             | Maximum number of tags allowed (optional)   |
| `placeholder`     | `string`                   | `'Add tags...'`         | Placeholder text for the input              |
| `separator`       | `string`                   | `','`                   | Character used to separate tags when typing |
| `onTagsChange`    | `(tags: string[]) => void` | `undefined`             | Callback function when tags change          |
| `allowDuplicates` | `boolean`                  | `false`                 | Whether to allow duplicate tags             |
| `state`           | `TagInputState`            | `TagInputState.DEFAULT` | Display state of the component              |
| `maxWidth`        | `number`                   | `undefined`             | Maximum width for overflow detection        |

## Display States

The component supports different display states through the `TagInputState` enum:

- `DEFAULT`: Basic empty input with placeholder
- `WITH_TAGS`: Input with pre-populated tags
- `TYPING`: Input showing a user actively typing
- `EXCEED_WIDTH`: Input with tags that exceed the container width

## Styling

The component includes default styling that can be customized by overriding the CSS classes:

- `.tag-input-container`: The main container
- `.tags-area`: The area containing tags and input
- `.tag`: Individual tag element
- `.tag-remove-btn`: The remove button for tags
- `.tag-input`: The text input element

## Accessibility

The component includes proper ARIA labels and keyboard navigation support:

- Click anywhere in the container to focus the input
- Press Enter to add a tag
- Press Backspace when the input is empty to remove the last tag
- Each remove button has an appropriate aria-label
