import 'antd/dist/antd.css'
import { configure } from '@storybook/react';

configure(require.context('../components', true, /\.ushio\.tsx$/), module);
