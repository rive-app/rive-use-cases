import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import RatingFeedbackComponent from './RatingFeedback';
import './StoryStyles.css';

export default {
  title: 'Example/AvatarRating',
  component: RatingFeedbackComponent,
} as ComponentMeta<typeof RatingFeedbackComponent>;

const Template: ComponentStory<typeof RatingFeedbackComponent> = (args) => (
  <div className="rive-story-container-avatar">
    <RatingFeedbackComponent {...args} />
  </div>
);

export const Primary = Template.bind({});
