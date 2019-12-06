import 'antd/dist/antd.css'
import { configure } from '@storybook/react';
import '@storybook/addon-console'

configure(require.context('../components', true, /\.ushio\.tsx$/), module);
