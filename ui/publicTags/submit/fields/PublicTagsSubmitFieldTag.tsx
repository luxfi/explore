import React from 'react';
import { type FieldError, type FieldErrorsImpl, type Merge } from 'react-hook-form';

import type { FormFields, FormFieldTag } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddButton from 'toolkit/components/buttons/AddButton';
import RemoveButton from 'toolkit/components/buttons/RemoveButton';
import { FormFieldColor } from 'toolkit/components/forms/fields/FormFieldColor';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { FormFieldUrl } from 'toolkit/components/forms/fields/FormFieldUrl';
import { colorValidator } from 'toolkit/components/forms/validators/color';
import EntityTag from 'ui/shared/EntityTags/EntityTag';

import PublicTagsSubmitFieldTagIcon from './PublicTagsSubmitFieldTagIcon';
import PublicTagsSubmitFieldTagType from './PublicTagsSubmitFieldTagType';

const CIRCLE_BG_COLOR_DEFAULT = {
  bgColor: { _light: 'gray.100', _dark: 'gray.700' },
  textColor: { _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' },
};

interface Props {
  index: number;
  field: FormFieldTag;
  tagTypes: Array<PublicTagType> | undefined;
  errors: Merge<FieldError, FieldErrorsImpl<FormFieldTag>> | undefined;
  isDisabled: boolean;
  onAddClick?: (index: number) => void;
  onRemoveClick?: (index: number) => void;
}

const PublicTagsSubmitFieldTag = ({ index, isDisabled, errors, onAddClick, onRemoveClick, tagTypes, field }: Props) => {
  const isMobile = useIsMobile();

  const handleAddClick = React.useCallback(() => {
    onAddClick?.(index);
  }, [ index, onAddClick ]);

  const handleRemoveClick = React.useCallback(() => {
    onRemoveClick?.(index);
  }, [ index, onRemoveClick ]);

  return (
    <>
      <div
        className={ `col-span-1 lg:col-span-2 p-[10px] rounded-base ${
          errors
            ? 'bg-red-50 dark:bg-red-900'
            : 'bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-100)]'
        }` }
      >
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            <FormFieldText<FormFields>
              name={ `tags.${ index }.name` }
              placeholder="Tag (max 35 characters)"
              required
              rules={{ maxLength: 35 }}
            />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <PublicTagsSubmitFieldTagType index={ index } tagTypes={ tagTypes }/>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <FormFieldUrl<FormFields>
              name={ `tags.${ index }.url` }
              placeholder="Label URL"
            />
          </div>
          <FormFieldColor<FormFields>
            name={ `tags.${ index }.bgColor` }
            placeholder="Background (Hex)"
            sampleDefaultBgColor={ CIRCLE_BG_COLOR_DEFAULT.bgColor }
          />
          <FormFieldColor<FormFields>
            name={ `tags.${ index }.textColor` }
            placeholder="Text (Hex)"
            sampleDefaultBgColor={ CIRCLE_BG_COLOR_DEFAULT.textColor }
          />
          <div className="col-span-1 lg:col-span-4">
            <PublicTagsSubmitFieldTagIcon index={ index }/>
          </div>
          <div className="col-span-1 lg:col-span-4">
            <FormFieldText<FormFields>
              name={ `tags.${ index }.tooltipDescription` }
              placeholder="Label description (max 80 characters)"
              rules={{ maxLength: 80 }}
              asComponent="Textarea"
              className="max-h-[160px]"
            />
          </div>
        </div>
      </div>
      <div className="lg:py-[10px]">
        <div className="flex items-center gap-x-3 justify-end lg:justify-start h-auto lg:h-[60px]">
          { onAddClick && (
            <AddButton
              data-index={ index }
              onClick={ handleAddClick }
              disabled={ isDisabled }
            />
          ) }
          { onRemoveClick && (
            <RemoveButton
              data-index={ index }
              onClick={ handleRemoveClick }
              disabled={ isDisabled }
            />
          ) }
        </div>
        { !isMobile && (
          <div className="flex flex-col items-start mt-4 gap-y-2">
            <EntityTag
              data={{
                name: field.name || 'Tag name',
                tagType: field.type[0],
                meta: {
                  tagIcon: errors?.iconUrl ? undefined : field.iconUrl,
                  tagUrl: field.url,
                  bgColor: field.bgColor && colorValidator(field.bgColor) === true ? field.bgColor : undefined,
                  textColor: field.textColor && colorValidator(field.textColor) === true ? field.textColor : undefined,
                  tooltipDescription: field.tooltipDescription,
                },
                slug: 'new',
                ordinal: 0,
              }}
              noLink
            />
            <span className="text-[var(--color-text-secondary)] text-sm">
              { tagTypes?.find(({ type }) => type === field.type[0])?.description }
            </span>
          </div>
        ) }
      </div>
    </>
  );
};

export default PublicTagsSubmitFieldTag;
