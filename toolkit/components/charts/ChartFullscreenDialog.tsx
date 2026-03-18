import React from 'react';

import type { Resolution, TimeChartData } from './types';

import RepeatIcon from 'icons/repeat.svg';
import { Heading } from 'toolkit/chakra/heading';

import { Button } from '../../chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from '../../chakra/dialog';
import { ChartWidgetContent } from './ChartWidgetContent';

export interface Props {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  title: string;
  description?: string;
  charts: TimeChartData;
  resolution?: Resolution;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  handleZoomReset: () => void;
};

const FullscreenChartModal = ({
  charts,
  open,
  onOpenChange,
  title,
  description,
  resolution,
  zoomRange,
  handleZoom,
  handleZoomReset,
}: Props) => {
  return (
    <DialogRoot
      open={ open }
      onOpenChange={ onOpenChange }
      // FIXME: with size="full" the chart will not be expanded to the full height of the modal
      size="cover"
    >
      <DialogContent>
        <DialogHeader/>
        <DialogBody pt={ 6 } display="flex" flexDir="column">
          <div className="grid gap-x-2 mb-4">
            <Heading mb={ 1 } level="2">
              { title }
            </Heading>

            { description && (
              <span
                className="text-sm text-[var(--chakra-colors-text-secondary)]"
                style={{ gridColumn: 1 }}
              >
                { description }
              </span>
            ) }

            { Boolean(zoomRange) && (
              <Button
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="sm"
                variant="outline"
                onClick={ handleZoomReset }
              >
                <RepeatIcon className="w-4 h-4"/>
                Reset zoom
              </Button>
            ) }
          </div>
          <ChartWidgetContent
            isEnlarged
            charts={ charts }
            handleZoom={ handleZoom }
            zoomRange={ zoomRange }
            resolution={ resolution }
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default FullscreenChartModal;
