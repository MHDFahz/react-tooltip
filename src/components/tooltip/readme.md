# ToolTip Component

A tooltip component that can be positioned relative to its parent element.

## Author

[![Author](https://img.shields.io/badge/Author-Fahis-blue)](muhammadfahis.shareef@agilisium.com)

## Version

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://www.agilsium.com/)

## Usage

To use the ToolTip component, import it into your React component and render it inside the JSX. The following props can be passed to the component:

## Props

- `position`: The position of the tooltip relative to its parent element. Can be set to "right", "left", "above", "below" or "auto.
- `show`: A flag indicating whether the tooltip should be visible by default.
- `trigger`: The event that triggers the tooltip to show. Can be set to "hover", "click" or "touch".
- `content`: The content of the tooltip. It can be a string of text, an image, or a list.
- `delay`: The delay in milliseconds before the tooltip is shown or hidden.
- `style`: The style for the tooltip element.
- `forceCenter`: A flag indicating whether the tooltip should be centered even if it would otherwise be obscured.
- `autoClose` - A flag indicating whether the tooltip should automatically close after a certain amount of time or not.

Here is an example of how the ToolTip component can be used:

```jsx
import ToolTip from './ToolTip'

function MyComponent() {
  return (
    <div>
      <span>Hover over me!</span>
      <ToolTip
        position='right'
        show={true}
        trigger='hover'
        content='This is a tooltip'
        delay={500}
        forceCenter={false}
      >
        <div>Hi hover</div>
      </ToolTip>
    </div>
  )
}
```

### Ref Features

You can also use the reference that the forwardRef function created to show and hide the tooltip using showDynamicToolTip, killDynamicToolTip and getNode functions.

```jsx
const ref = useRef(null)

function MyComponent() {
  return (
    <div>
      <ToolTip
        position='right'
        show={true}
        trigger='hover'
        content='This is a tooltip'
        delay={500}
        ref={ref}
      >
        <span>Hover over me!</span>
      </ToolTip>
      <button onClick={() => ref.current.showDynamicToolTip()}>
        Show Tooltip
      </button>
      <button onClick={() => ref.current.killDynamicToolTip()}>
        Hide Tooltip
      </button>
    </div>
  )
}
```

#### Note that the component uses dynamic positioning feature to place the tooltip at the best possible position by analyzing the available space in the window and the position of the parent element.
