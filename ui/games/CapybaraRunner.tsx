/* eslint-disable @next/next/no-img-element */
import Script from 'next/script';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
const easterEggBadgeFeature = config.features.easterEggBadge;

const CapybaraRunner = () => {
  const [ hasReachedHighScore, setHasReachedHighScore ] = React.useState(false);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
    };

    const handleHighScore = () => {
      setHasReachedHighScore(true);
    };

    window.addEventListener('reachedHighScore', handleHighScore);
    window.addEventListener('keydown', preventDefaultKeys);

    return () => {
      window.removeEventListener('keydown', preventDefaultKeys);
      window.removeEventListener('reachedHighScore', handleHighScore);
    };
  }, []);

  return (
    <>
      <Heading level="2" className="mt-12 mb-2">Score 1000 to win a special prize!</Heading>
      <div className="mb-4">{ isMobile ? 'Tap below to start' : 'Press space to start' }</div>
      <Script strategy="lazyOnload" src="/static/capybara/index.js"/>
      <div className="w-full lg:w-[600px] h-[300px] py-[50px]">
        <div id="main-frame-error" className="interstitial-wrapper" style={{ marginTop: '20px' }}>
          <div id="main-content"></div>
          <div id="offline-resources" style={{ display: 'none' }}>
            <img id="offline-resources-1x" src="/static/capybara/capybaraSprite.png"/>
            <img id="offline-resources-2x" src="/static/capybara/capybaraSpriteX2.png"/>
          </div>
        </div>
      </div>
      { easterEggBadgeFeature.isEnabled && hasReachedHighScore && (
        <div className="flex flex-col items-center justify-center gap-4 mt-10">
          <span className="text-2xl font-bold">You unlocked a hidden badge!</span>
          <span className="text-lg text-center">Congratulations! You're eligible to claim an epic hidden badge!</span>
          <Link
            href={ easterEggBadgeFeature.badgeClaimLink }
            external noIcon
          >
            <Button>Claim</Button>
          </Link>
        </div>
      ) }
    </>
  );
};

export default CapybaraRunner;
