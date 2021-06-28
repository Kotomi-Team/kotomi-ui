import 'asp-antd-compatible/dist/antd.css'
import { configure } from '@storybook/react';
import '@storybook/addon-console'

configure(require.context('../ushio', true, /\.ushio\.tsx$/), module);
