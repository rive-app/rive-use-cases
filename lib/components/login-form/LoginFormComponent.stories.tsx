import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import LoginFormComponent from './LoginFormComponent';
import './StoryStyles.css';

export default {
  title: 'Example/LoginFormComponent',
  component: LoginFormComponent,
} as ComponentMeta<typeof LoginFormComponent>;

const Template: ComponentStory<typeof LoginFormComponent> = (args) => (
  <div className="rive-story-container">
    <LoginFormComponent {...args} />
  </div>
);

export const Primary = Template.bind({});
