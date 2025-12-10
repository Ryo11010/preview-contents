import { layoutStyles } from './layout';
import { loginStyles } from './login';
import { controlStyles } from './controls';
import { menuStyles } from './menu';
import { navigationStyles } from './navigation';
import { punchStyles } from './punch';
import { historyStyles } from './history';
import { settingsStyles } from './settings';
import { adminStyles } from './admin';

export const styles = {
  ...layoutStyles,
  ...loginStyles,
  ...controlStyles,
  ...menuStyles,
  ...navigationStyles,
  ...punchStyles,
  ...historyStyles,
  ...settingsStyles,
  ...adminStyles,
};

export type StylesType = typeof styles;
