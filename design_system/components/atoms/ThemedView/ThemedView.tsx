import { View, type ViewProps } from 'react-native';
import { styles } from './ThemedView.styles';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {

  return <View style={[styles.colorTheme , style]} {...otherProps} />;
}
