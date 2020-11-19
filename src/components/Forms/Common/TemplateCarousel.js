import React, { useState, useRef, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../../Base';
import { useWindowSize } from '../../Hooks/useWindowSize';
import { SliderButtons, StyledButtonBack, StyledButtonNext } from '../Base/Carousel';
import TemplatePictureFormField from './TemplatePictureFormField';
import Slider from 'react-slick';

const NEW_LISTING = 'listed';

export default function TemplateCarousel({
  listingType,
  initialValues,
  formValues,
  setFormValues,
}) {
  const stencilsAvailable = useSelector(store => store.templates.available?.stencils);
  const [sliderWidth, setsliderWidth] = useState(0);
  const sliderContainerRef = useRef(null);
  const windowSize = useWindowSize();
  useLayoutEffect(
    _ => {
      setsliderWidth(sliderContainerRef.current ? sliderContainerRef.current.offsetWidth : 0);
    },
    // eslint-disable-next-line
    [windowSize]
  );
  const [editable] = useState(
    listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold
  );
  const sliderRef = useRef(null);

  let slides = [];
  if (stencilsAvailable) {
    stencilsAvailable.forEach(stencil => {
      slides.push(stencil.templateTheme);
    });
  }
  let startSlide = 0;
  if (formValues && formValues[listingType])
    startSlide = slides.findIndex(slide => slide === formValues[listingType].templateTheme);

  let numSlides = Math.floor(sliderWidth / 240) || 1;
  if (numSlides % 2 === 0) numSlides -= 1;

  const handleTemplateChange = slideIndex => {
    if (!editable) return;
    let newVal = { ...formValues };
    newVal[listingType].templateTheme = stencilsAvailable[slideIndex].templateTheme;
    setFormValues(newVal);
  };

  const sliderSettings = {
    arrows: false,
    className: 'slider center',
    infinite: true,
    centerMode: true,
    slidesToShow: numSlides < stencilsAvailable?.length ? numSlides : stencilsAvailable.length,
    focusOnSelect: editable,
    initialSlide: startSlide,
    swipeToSlide: editable,
    draggable: editable,
    style: editable ? { zIndex: 1 } : { opacity: 0.4 },
    afterChange: current => handleTemplateChange(current),
  };

  const handleSliderBtnClick = dir => {
    dir === 'back' ? sliderRef.current.slickPrev() : sliderRef.current.slickNext();
  };

  return (
    <div>
      <div
        ref={sliderContainerRef}
        style={{ maxWidth: '100%', position: 'relative', padding: '0 1rem', zIndex: 10 }}
      >
        <Header as="h5" style={{ opacity: !editable ? 0.4 : 1 }}>
          Template Theme
        </Header>
        <Slider {...sliderSettings} ref={sliderRef}>
          {stencilsAvailable &&
            stencilsAvailable.map((stencil, ind) => {
              return TemplatePictureFormField({
                templateName: stencil.templateTheme,
                listingType,
                initialValues,
                formValues,
                setFormValues,
                src: stencil.thumbnail,
                isNew: stencil.new,
              });
            })}
        </Slider>
        <SliderButtons>
          {editable && sliderRef.current && (
            <StyledButtonBack onClick={_ => handleSliderBtnClick('back')} />
          )}
          {editable && sliderRef.current && (
            <StyledButtonNext onClick={_ => handleSliderBtnClick('next')} />
          )}
        </SliderButtons>
      </div>
    </div>
  );
}
