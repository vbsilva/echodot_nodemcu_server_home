import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen';
import DeviceScreen from './src/screens/DeviceScreen';

const navigator = createSwitchNavigator({
  Home: {
    screen: HomeScreen
  },
  Device: {
    screen: DeviceScreen
  }
});

export default createAppContainer(navigator);
