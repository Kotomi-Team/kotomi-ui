import 'asp-antd-compatible/dist/asp-antd-compatible.css'
import { configure } from '@storybook/react';
import '@storybook/addon-console'

configure(require.context('../ushio', true, /\.ushio\.tsx$/), module);
