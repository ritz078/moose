import React from 'react';
import cn from 'classnames';

export default function (category: string, tooltip: string) {
  const cat = category.toLowerCase();
  let iconName;

  if (cat.includes('video')) {
    iconName = 'movie';
  } else if (cat.includes('audio')) {
    iconName = 'music-circle';
  } else if (cat.includes('application')) {
    iconName = 'application';
  } else if (cat.includes('games')) {
    iconName = 'google-controller';
  } else if (cat.includes('others')) {
    iconName = 'help-circle-outline';
  } else {
    iconName = 'skull';
  }

  const className = cn('mdi tooltip tooltip-bottom fs-18', `mdi-${iconName}`);

  return <i className={className} data-tooltip={`${category} | ${tooltip}` || category} />;
}
