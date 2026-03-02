import { SliseAd } from '@slise/embed-react';
import React from 'react';

import type { BannerProps } from './types';

import config from 'configs/app';

import {
  DESKTOP_BANNER_HEIGHT,
  DESKTOP_BANNER_WIDTH,
  MOBILE_BANNER_HEIGHT,
  MOBILE_BANNER_WIDTH,
} from './consts';

const SliseBanner = ({ className, format = 'responsive' }: BannerProps) => {

  if (format === 'desktop') {
    return (
      <div className={ `flex ${ className || '' }` } style={{ height: `${ DESKTOP_BANNER_HEIGHT }px` }}>
        <SliseAd
          slotId={ config.chain.name || '' }
          pub="pub-10"
          format="728x90"
          style={{ width: `${ DESKTOP_BANNER_WIDTH }px`, height: `${ DESKTOP_BANNER_HEIGHT }px` }}/>
      </div>
    );
  }

  if (format === 'mobile') {
    return (
      <div
        className={ `flex justify-center ${ className || '' }` }
        style={{ height: `${ MOBILE_BANNER_HEIGHT }px`, width: `${ MOBILE_BANNER_WIDTH }px` }}
      >
        <SliseAd
          slotId={ config.chain.name || '' }
          pub="pub-10"
          format="320x100"
          style={{ width: `${ MOBILE_BANNER_WIDTH }px`, height: `${ MOBILE_BANNER_HEIGHT }px` }}/>
      </div>
    );
  }

  return (
    <>
      <div className={ `hidden lg:flex ${ className || '' }` } style={{ height: `${ DESKTOP_BANNER_HEIGHT }px` }}>
        <SliseAd
          slotId={ config.chain.name || '' }
          pub="pub-10"
          format="728x90"
          style={{ width: `${ DESKTOP_BANNER_WIDTH }px`, height: `${ DESKTOP_BANNER_HEIGHT }px` }}/>
      </div>
      <div
        className={ `flex lg:hidden justify-center ${ className || '' }` }
        style={{ height: `${ MOBILE_BANNER_HEIGHT }px`, width: `${ MOBILE_BANNER_WIDTH }px` }}
      >
        <SliseAd
          slotId={ config.chain.name || '' }
          pub="pub-10"
          format="320x100"
          style={{ width: `${ MOBILE_BANNER_WIDTH }px`, height: `${ MOBILE_BANNER_HEIGHT }px` }}/>
      </div>
    </>
  );
};

export default SliseBanner;
