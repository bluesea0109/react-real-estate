import React, { useState, useRef, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../../Base';
import { useWindowSize } from '../../Hooks/useWindowSize';
import { StyledButtonBack, StyledButtonNext } from '../Base/Carousel';
import TemplatePictureFormField from './TemplatePictureFormField';
import Slider from 'react-slick';

export default function TemplateCarousel({
  editable,
  listingType,
  initialValues,
  formValues,
  setFormValues,
}) {
  const stencilsAvailable = useSelector(store => store.templates.available?.stencils);
  const [sliderWidth, setsliderWidth] = useState(0);
  const sliderRef = useRef(null);
  const windowSize = useWindowSize();
  useLayoutEffect(
    _ => {
      setsliderWidth(sliderRef.current ? sliderRef.current.offsetWidth : 0);
    },
    // eslint-disable-next-line
    [windowSize]
  );

  let slides = ['ribbon', 'bookmark', 'stack'];
  if (stencilsAvailable) {
    stencilsAvailable.forEach(stencil => {
      slides.push(stencil.templateTheme);
    });
  }
  let startSlide = 0;
  if (formValues && formValues[listingType])
    startSlide = slides.findIndex(slide => slide === formValues[listingType].templateTheme);

  const sliderSettings = {
    className: 'slider variable-width',
    infinite: true,
    slidesToShow: sliderWidth > 320 ? Math.floor(sliderWidth / 320) : 1,
    focusOnSelect: true,
    nextArrow: <StyledButtonNext />,
    prevArrow: <StyledButtonBack />,
    initialSlide: startSlide,
    draggable: false,
  };

  return (
    <div style={{ display: 'block' }}>
      <div ref={sliderRef} style={{ maxWidth: '100%' }}>
        <Header as="h5" style={{ opacity: !editable ? 0.4 : 1 }}>
          Template Theme
        </Header>
        <Slider {...sliderSettings}>
          {TemplatePictureFormField({
            templateName: 'ribbon',
            listingType,
            initialValues,
            formValues,
            setFormValues,
          })}
          {TemplatePictureFormField({
            templateName: 'bookmark',
            listingType,
            initialValues,
            formValues,
            setFormValues,
          })}
          {TemplatePictureFormField({
            templateName: 'stack',
            listingType,
            initialValues,
            formValues,
            setFormValues,
          })}
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
      </div>
    </div>
  );
}
