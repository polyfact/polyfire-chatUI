## ChatUI Component Documentation

### Introduction

The ChatUI component is a primary interface for users to interact with the chat feature. Developed using the Polyfact SDK, it provides developers with an extensive range of properties to customize its appearance and behavior. Below is a tabulated breakdown of each property to ensure maximum clarity.

### Installation

To include the ChatUI component in your project, you can easily install it using either yarn or npm:

**Using Yarn:**

```bash
yarn add @polyfact/chat
```

**Using npm:**

```bash
npm install @polyfact/chat
```

### Repository

For more detailed information, contributions, or issues, visit the repository: [polyfact-chat](https://github.com/kevin-btc/polyfact-chat).

| Property               | Type                        | Description                                                               | Default (if applicable) |
| ---------------------- | --------------------------- | ------------------------------------------------------------------------- | ----------------------- |
| `classNameChatContent` | `ChatContentClassNameProps` | Customize the class names for different elements within the chat content. | -                       |
| `styleChatContent`     | `ChatContentStyleProps`     | Apply custom styles to different parts of the chat content.               | -                       |
| `classNameClearModal`  | `ClearClassNameProps`       | Customize the class name for the clear modal.                             | -                       |
| `styleClearModal`      | `ClearStyleProps`           | Apply custom styles to the clear modal.                                   | -                       |
| `TitleClearModal`      | `string`                    | Set the title for the clear modal.                                        | -                       |
| `memoryId`             | `string`                    | Assign a unique identifier to the chat for memory purposes.               | -                       |
| `height`               | `string`                    | Define the height of the ChatUI component.                                | `100vh`                 |
| `width`                | `string`                    | Define the width of the ChatUI component.                                 | `70%`                   |
| `chat`                 | `Chat`                      | The primary prop to render the chat content.                              | -                       |
| `renderAIFirstMessage` | `() => React.ReactNode`     | Customize the initial message displayed by the AI.                        | Default AI greeting     |
| `renderPencilIcon`     | `() => React.ReactNode`     | Customize the pencil icon displayed within the chat.                      | Default pencil icon     |
| `renderSendIcon`       | `() => React.ReactNode`     | Customize the send icon displayed within the chat.                        | Default send icon       |
| `renderClearIcon`      | `() => React.ReactNode`     | Customize the clear icon displayed within the chat.                       | Default clear icon      |
| `placeholderText`      | `string`                    | Define placeholder text for the chat input field.                         | -                       |
| `className`            | `ChatContentClassNameProps` | Customize the class names for the main ChatUI component.                  | -                       |
| `style`                | `ChatContentStyleProps`     | Apply custom styles to the ChatUI component.                              | -                       |
| `Color Customization`  | `string`                    | Customize the color schemes for different elements within the ChatUI.     | -                       |
| `botName`              | `string`                    | Specify the name of the bot in the chat.                                  | -                       |
| `initialMessage`       | `string`                    | Define the first message that appears in the chat upon initialization.    | -                       |

\* Note: Color Customization includes properties such as `chatBackgroundColor`, `chatTextColor`, `inputBackgroundColor`, and more as previously detailed.

### Example:

```tsx
<ChatUI
  chat={chatInstance}
  height="500px"
  width="80%"
  placeholderText="Type your message here..."
  botName="ChatBot"
  initialMessage="Welcome to ChatUI!"
  styleChatContent={{
    wrapper: { background: '#f5f5f5' },
    input: { borderColor: '#ddd' },
  }}
/>
```

### Features

- **Highly Customizable:** With various properties at your disposal, tailor the ChatUI as per your application's requirements.

- **Lightweight:** Optimized to ensure minimal impact on performance while delivering an engaging user experience.

### Contributing

Feel free to contribute to the ChatUI component by forking the repository and submitting a pull request. For major changes, please open an issue first to discuss what you would like to change.

### License

The ChatUI component is licensed under the MIT License. See the `LICENSE` file in the repository for more information.

### Support

For any issues, questions, or recommendations, please visit the repository's issue section or contact the maintainers directly. We appreciate your feedback and aim to make ChatUI the go-to solution for chat interfaces in React applications.
