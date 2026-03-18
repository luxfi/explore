import React from 'react';

import type { TabItemRegular } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';

import { Skeleton } from '@luxfi/ui/skeleton';
import type { TabsProps } from '@luxfi/ui/tabs';
import { TabsCounter, TabsList, TabsTrigger } from '@luxfi/ui/tabs';
import { useIsSticky } from '../../hooks/useIsSticky';
import AdaptiveTabsMenu from './AdaptiveTabsMenu';
import useAdaptiveTabs from './useAdaptiveTabs';
import useScrollToActiveTab from './useScrollToActiveTab';
import { menuButton, getTabValue } from './utils';

export interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  widthAllocation?: 'available' | 'fixed';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BaseProps {
  tabs: Array<TabItemRegular>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listProps?: Record<string, any> | (({ isSticky, activeTab }: { isSticky: boolean; activeTab: string }) => Record<string, any>);
  rightSlot?: React.ReactNode;
  rightSlotProps?: SlotProps;
  leftSlot?: React.ReactNode;
  leftSlotProps?: SlotProps;
  stickyEnabled?: boolean;
  isLoading?: boolean;
}

interface Props extends BaseProps {
  activeTab: string;
  variant: TabsProps['variant'];
}

const HIDDEN_ITEM_STYLES: React.CSSProperties = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  visibility: 'hidden',
};

const getItemStyles = (index: number, tabsCut: number | undefined, isLoading: boolean | undefined) => {
  if (tabsCut === undefined || isLoading) {
    return { style: HIDDEN_ITEM_STYLES } as never;
  }

  return index < tabsCut ? {} : { style: HIDDEN_ITEM_STYLES } as never;
};

const getMenuStyles = (tabsLength: number, tabsCut: number | undefined, isLoading: boolean | undefined) => {
  if (tabsCut === undefined || isLoading) {
    return { style: HIDDEN_ITEM_STYLES };
  }

  return tabsCut >= tabsLength ? { style: HIDDEN_ITEM_STYLES } : {};
};

const AdaptiveTabsList = (props: Props) => {

  const {
    tabs,
    activeTab,
    listProps,
    rightSlot,
    rightSlotProps,
    leftSlot,
    leftSlotProps,
    stickyEnabled,
    isLoading,
    variant,
  } = props;

  const isMobile = useIsMobile();

  const tabsList = React.useMemo(() => {
    return [ ...tabs, menuButton ];
  }, [ tabs ]);

  const { tabsCut, tabsRefs, listRef, rightSlotRef, leftSlotRef } = useAdaptiveTabs(tabsList, isLoading || isMobile || tabs.length === 1);
  const isSticky = useIsSticky(listRef, 5, stickyEnabled);
  const activeTabIndex = tabsList.findIndex((tab) => getTabValue(tab) === activeTab) ?? 0;
  useScrollToActiveTab({ activeTabIndex, listRef, tabsRefs, isMobile, isLoading });

  if (tabs.length === 1 && !leftSlot && !rightSlot) {
    return null;
  }

  const isReady = !isLoading && tabsCut !== undefined;

  return (
    <TabsList
      ref={ listRef }
      flexWrap="nowrap"
      alignItems="center"
      whiteSpace="nowrap"
      bgColor="bg.primary"
      marginBottom={ 6 }
      mx={{ base: '-12px', lg: 'unset' }}
      px={{ base: '12px', lg: 'unset' }}
      w={{ base: 'calc(100% + 24px)', lg: '100%' }}
      overflowX={{ base: 'auto', lg: 'initial' }}
      overscrollBehaviorX="contain"
      css={{
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: '12px', // mobile page padding
        // hide scrollbar
        '&::-webkit-scrollbar': { /* Chromiums */
          display: 'none',
        },
        '-ms-overflow-style': 'none', /* IE and Edge */
        scrollbarWidth: 'none', /* Firefox */
      }}
      {
        ...(props.stickyEnabled ? {
          position: 'sticky',
          boxShadow: { base: isSticky ? 'md' : 'none', lg: 'none' },
          top: 0,
          zIndex: { base: 'sticky2', lg: 'docked' },
        } : { })
      }
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(typeof listProps === 'function' ? listProps({ isSticky, activeTab }) : listProps) as any
      }
    >
      { leftSlot && (
        <div
          ref={ leftSlotRef }
          { ...leftSlotProps }
          style={{
            flexGrow: leftSlotProps?.widthAllocation === 'available' && tabsCut !== undefined ? 1 : undefined,
            opacity: tabsCut !== undefined ? 1 : 0,
          }}
        >
          { leftSlot }
        </div>
      )
      }
      { tabs.length > 1 && tabsList.map((tab, index) => {
        const value = getTabValue(tab);
        const ref = tabsRefs[index];

        if (tab.id === 'menu') {
          return (
            <AdaptiveTabsMenu
              key="menu"
              ref={ ref }
              tabs={ tabs }
              tabsCut={ tabsCut ?? 0 }
              isActive={ activeTabIndex > 0 && tabsCut !== undefined && tabsCut > 0 && activeTabIndex >= tabsCut }
              { ...(getMenuStyles(tabs.length, tabsCut, isLoading) as Record<string, unknown>) }
            />
          );
        }

        return (
          <TabsTrigger
            key={ value }
            value={ value }
            ref={ ref }
            scrollSnapAlign="start"
            flexShrink={ 0 }
            { ...getItemStyles(index, tabsCut, isLoading) }
          >
            { typeof tab.title === 'function' ? tab.title() : tab.title }
            <TabsCounter count={ tab.count }/>
          </TabsTrigger>
        );
      }) }
      { tabs.slice(0, isReady ? 0 : 5).map((tab, index) => {
        const value = `${ getTabValue(tab) }-pre`;
        return (
          <TabsTrigger
            key={ value }
            value={ value }
            flexShrink={ 0 }
            bgColor={
              activeTabIndex === index && (variant === 'solid' || variant === undefined) ?
                { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } :
                undefined
            }
          >
            <Skeleton loading>
              { typeof tab.title === 'function' ? tab.title() : tab.title }
              <TabsCounter count={ tab.count }/>
            </Skeleton>
          </TabsTrigger>
        );
      }) }
      {
        rightSlot ? (
          <div
            ref={ rightSlotRef }
            style={{
              marginLeft: 'auto',
              flexGrow: rightSlotProps?.widthAllocation === 'available' && tabsCut !== undefined ? 1 : undefined,
              opacity: tabsCut !== undefined ? 1 : 0,
            }}
            { ...rightSlotProps }
          >
            { rightSlot }
          </div>
        ) :
          null
      }
    </TabsList>
  );
};

export default React.memo(AdaptiveTabsList);
