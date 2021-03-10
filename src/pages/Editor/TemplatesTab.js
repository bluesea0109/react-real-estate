import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NewLabel } from '../../components/Forms/Base/Carousel';
import * as brandColors from '../../components/utils/brandColors';
import { updateMailoutTemplateThemePending } from '../../store/modules/mailout/actions';
import { sleep } from '../../components/utils/utils';

export default function TemplatesTab({ mailoutDetails, handleSave }) {
  const dispatch = useDispatch();

  const [filteredStencils, setFilteredStencils] = useState([]);

  const stencilsAvailable = useSelector(store => store.templates?.available?.byIntent);
  const editIntentPath = useSelector(store => store.mailout?.mailoutEdit?.intentPath);
  const publishedTags = mailoutDetails?.publishedTags;
  const editTemplateTheme = useSelector(store => store.mailout?.mailoutEdit?.templateTheme);

  useEffect(() => {
    let newFilteredStencils = stencilsAvailable?.filter(stencil => {
      if (
        stencil.templateUuid === 'bookmark-multi' &&
        mailoutDetails.created < new Date('2020-11-19T17:54:37.344Z').getTime()
      )
        return false;
      return true;
    });
    if (
      !publishedTags?.includes('listingMarketing') &&
      !editIntentPath?.includes('listingMarketing')
    )
      newFilteredStencils = [];
    else {
      editIntentPath
        ? (newFilteredStencils = stencilsAvailable?.filter(stencil =>
            stencil.intentPath?.includes(editIntentPath)
          ))
        : (newFilteredStencils = stencilsAvailable?.filter(stencil =>
            stencil.intentPath?.includes(publishedTags.join('|'))
          ));
    }

    setFilteredStencils(newFilteredStencils);
  }, [stencilsAvailable, mailoutDetails.created, editIntentPath, publishedTags]);

  const updateMailoutTemplateTheme = async (templateTheme, intentPath) => {
    handleSave({ templateTheme });

    await sleep(1000);

    dispatch(
      updateMailoutTemplateThemePending({
        templateUuid: templateTheme,
        intentPath: intentPath,
      })
    );
  };

  const renderTemplatePicture = (index, intentPath, templateTheme, src, isNew = false) => {
    return (
      <div key={index} onClick={() => updateMailoutTemplateTheme(templateTheme, intentPath)}>
        <div
          style={
            editTemplateTheme === templateTheme
              ? {
                  border: `2px solid ${brandColors.primary}`,
                  padding: '0.5em',
                  margin: '0.5rem auto',
                  borderRadius: '5px',
                  maxWidth: 500,
                }
              : { padding: '0.5em', margin: '0.5rem' }
          }
        >
          <img
            src={src}
            alt={intentPath}
            style={{
              cursor: 'pointer',
              width: '100%',
              border: '1px solid lightgrey',
              boxShadow: '1px 1px 4px lightgrey',
              zIndex: 10,
            }}
          />
        </div>
        {isNew && (
          <NewLabel>
            <span className="label">New</span>
          </NewLabel>
        )}
      </div>
    );
  };

  return (
    <>
      {filteredStencils &&
        filteredStencils.map((stencil, index) =>
          renderTemplatePicture(
            index,
            stencil.intentPath,
            stencil.templateUuid,
            stencil.thumbnail,
            stencil.new
          )
        )}
    </>
  );
}
