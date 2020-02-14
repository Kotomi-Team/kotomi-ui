import 'antd/dist/antd.less'
import { configure } from '@storybook/react';
import '@storybook/addon-console'

configure(require.context('../ushio', true, /\.ushio\.tsx$/), module);
