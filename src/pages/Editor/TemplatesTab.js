import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { NewLabel } from '../../components/Forms/Base/Carousel';
import { DropdownCard } from '../../components/Base';
import * as brandColors from '../../components/utils/brandColors';
import CustomFrontPhoto from './CustomFrontPhoto';
import CustomBackPhoto from './CustomBackPhoto';
import { sleep } from '../../components/utils/utils';
import { setSelectedTemplate } from '../../store/modules/liveEditor/actions';

const TemplateImage = styled.div`
  ${props =>
    props.selected
      ? `
    border: 2px solid ${brandColors.primary};
    padding: 0.5rem;
    margin: 0.5rem auto;
    border-radius: 5px;
  `
      : `
    padding: 0.5rem;
    margin: 0.5rem;
  `}
  & > img {
    ${props => (props.selected ? null : 'cursor: pointer;')}
    width: 100%;
    border: 1px solid lightgrey;
    box-shadow: '1px 1px 4px lightgrey';
    z-index: 10;
  }
`;

export default function TemplatesTab({ mailoutDetails, handleSave }) {
  const dispatch = useDispatch();
  const [filteredStencils, setFilteredStencils] = useState([]);
  const [frontOpen, setFrontOpen] = useState(false);
  const [backOpen, setBackOpen] = useState(false);

  const stencilsAvailable = useSelector(store => store.templates?.available?.byIntent);
  const editIntentPath = useSelector(store => store.mailout?.mailoutEdit?.intentPath);
  const publishedTags = mailoutDetails?.publishedTags;
  const editTemplateTheme = useSelector(store => store.mailout?.mailoutEdit?.templateTheme);
  const selectedTemplate = useSelector(state => state.liveEditor?.selectedTemplate);

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

  const updateMailoutTemplateTheme = async templateTheme => {
    if (editTemplateTheme === templateTheme && selectedTemplate) return;

    handleSave({ templateTheme });
    await sleep(2500);

    dispatch(setSelectedTemplate(true));
  };

  const renderTemplatePicture = (index, intentPath, templateTheme, src, isNew = false) => {
    return (
      <div key={index} onClick={() => updateMailoutTemplateTheme(templateTheme)}>
        <TemplateImage selected={editTemplateTheme === templateTheme && selectedTemplate}>
          <img src={src} alt={intentPath} />
        </TemplateImage>
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
      <DropdownCard
        title="Card Front"
        iconName="images"
        isOpen={frontOpen}
        toggleOpen={() => setFrontOpen(!frontOpen)}
      >
        {filteredStencils?.length ? (
          filteredStencils.map((stencil, index) =>
            renderTemplatePicture(
              index,
              stencil.intentPath,
              stencil.templateUuid,
              stencil.thumbnail,
              stencil.new
            )
          )
        ) : (
          <p>Switching templates is not supported for this campaign type.</p>
        )}
        <CustomFrontPhoto handleSave={handleSave} />
      </DropdownCard>

      <DropdownCard
        title="Card Back"
        iconName="images"
        isOpen={backOpen}
        toggleOpen={() => setBackOpen(!backOpen)}
      >
        <CustomBackPhoto handleSave={handleSave} />
      </DropdownCard>
    </>
  );
}
