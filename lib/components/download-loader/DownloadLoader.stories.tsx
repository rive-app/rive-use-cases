import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DownloadLoader from './DownloadLoader';
import './StoryStyles.css';

export default {
  title: 'Example/DownloadLoaderComponent',
  component: DownloadLoader,
} as ComponentMeta<typeof DownloadLoader>;

const Template: ComponentStory<typeof DownloadLoader> = (args) => (
  <div className="rive-story-container-loader">
    <DownloadLoader {...args} />
  </div>
);

export const Primary = Template.bind({});
