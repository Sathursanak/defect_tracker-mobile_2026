# SeverityIndexIndicator Component

A visual gauge component that displays the defect severity index as an interactive arc indicator, similar to a speedometer or gauge chart.

## Features

- **Visual Gauge Display**: Shows severity index as an arc from 0-100%
- **Color-coded Indicators**: 
  - Green (0-33%): Low severity
  - Yellow (34-66%): Medium severity  
  - Red (67-100%): High severity
- **Scale Markers**: Shows scale markers at 0, 25, 50, 75, and 100
- **Responsive Design**: Customizable size
- **Accessibility**: Clear value display and descriptive text

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | Required | Severity index value (0-3, converted to 0-100% internally) |
| `size` | `number` | `200` | Size of the gauge in pixels |
| `title` | `string` | `"Defect Severity Index"` | Title displayed above the gauge |

## Usage

```tsx
import SeverityIndexIndicator from '../components/SeverityIndexIndicator';

// Basic usage
<SeverityIndexIndicator value={1.5} />

// With custom size and title
<SeverityIndexIndicator 
  value={2.1} 
  size={180}
  title="Project Risk Level"
/>
```

## Value Conversion

The component automatically converts severity index values (0-3 scale) to percentage (0-100%):

- `0.0` → `0%` (No severity)
- `1.0` → `33%` (Low severity)
- `1.5` → `50%` (Medium-low severity)
- `2.0` → `67%` (Medium-high severity)
- `3.0` → `100%` (Maximum severity)

## Color Coding

- **Green** (`#10b981`): 0-33% (Low severity)
- **Yellow** (`#f59e0b`): 34-66% (Medium severity)
- **Red** (`#ef4444`): 67-100% (High severity)

## Dependencies

- `react-native-svg`: For rendering the gauge graphics
- `react-native`: Core React Native components

## Implementation Details

The component uses SVG paths to create:
- Background arc (full gauge outline)
- Value arc (filled portion based on current value)
- Scale markers and labels
- Center indicator dot

The gauge spans 270 degrees (from -135° to +135°) to create a traditional speedometer appearance.
