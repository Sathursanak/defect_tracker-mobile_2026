declare module 'react-native-speedometer' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  export interface SpeedometerProps {
    value: number;
    size?: number;
    minValue?: number;
    maxValue?: number;
    allowedDecimals?: number;
    labels?: Array<{
      name: string;
      labelColor?: string;
      activeBarColor?: string;
    }>;
    needleImage?: any;
    wrapperStyle?: ViewStyle;
    outerCircleStyle?: ViewStyle;
    halfCircleStyle?: ViewStyle;
    imageWrapperStyle?: ViewStyle;
    imageStyle?: ViewStyle;
    innerCircleStyle?: ViewStyle;
    labelWrapperStyle?: ViewStyle;
    labelStyle?: ViewStyle;
    labelNoteStyle?: ViewStyle;
    useNativeDriver?: boolean;
    // Additional properties for tick marks and numbers
    showLabels?: boolean;
    showPercent?: boolean;
    percentStyle?: TextStyle;
    showIndicator?: boolean;
    indicatorStyle?: ViewStyle;
    showTicks?: boolean;
    tickStyle?: ViewStyle;
    tickLabelStyle?: TextStyle;
    tickInterval?: number;
  }

  export default class RNSpeedometer extends Component<SpeedometerProps> {}
}
