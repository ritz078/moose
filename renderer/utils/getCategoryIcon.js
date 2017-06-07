import React from 'react';
import cn from 'classnames';

export default function (category: string) {
  const cat = category.toLowerCase();
  let iconName;

  if (cat.includes('video')) {
    iconName = 'movie';
  } else if (cat.includes('audio')) {
    iconName = 'music-circle';
  } else if (cat.includes('android')) {
    iconName = 'android';
  } else if (cat.includes('windows')) {
    iconName = 'windows';
  } else if (cat.includes('mac')) {
    iconName = 'laptop-mac';
  } else if (cat.includes('ios')) {
    iconName = 'ios';
  } else if (cat.includes('unix')) {
    iconName = 'linux';
  } else if (cat.includes('picture')) {
    iconName = 'image';
  } else if (cat.includes('application')) {
    iconName = 'application';
  } else if (cat.includes('games')) {
    iconName = 'google-controller';
  } else if (cat.includes('book')) {
    iconName = 'file-document';
  } else if (cat.includes('other')) {
    iconName = 'help-circle-outline';
  } else {
    iconName = 'skull';
  }

  const className = cn('mdi tooltip tooltip-bottom fs-18', `mdi-${iconName}`);

  return <i className={className} data-tooltip={category} />;
}
