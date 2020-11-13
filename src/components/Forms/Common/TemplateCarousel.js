import { CarouselProvider, Slider } from 'pure-react-carousel';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header, Icon } from '../../Base';
import { useWindowSize } from '../../Hooks/useWindowSize';
import {
  StyledButtonBack,
  StyledButtonNext,
  SliderButtons,
  CustomSlide,
  sliderButtonStyles,
} from '../Base/Carousel';
import TemplatePictureFormField from './TemplatePictureFormField';

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

  return (
    <div style={{ flex: '1 1 0px' }}>
      <Header as="h5" style={{ opacity: !editable ? 0.4 : 1 }}>
        Template Theme
      </Header>
      <CarouselProvider>
        <CarouselProvider
          naturalSlideWidth={130}
          naturalSlideHeight={100}
          totalSlides={stencilsAvailable?.length + 3 || 3}
          visibleSlides={sliderWidth > 320 ? Math.floor(sliderWidth / 320) : 1}
          step={1}
          infinite={true}
        >
          <SliderButtons ref={sliderRef}>
            <Slider style={{ margin: '0 1.5rem', minHeight: 240 }}>
              <CustomSlide index={0}>
                {TemplatePictureFormField({
                  templateName: 'ribbon',
                  listingType,
                  initialValues,
                  formValues,
                  setFormValues,
                })}
              </CustomSlide>
              <CustomSlide index={1}>
                {TemplatePictureFormField({
                  templateName: 'bookmark',
                  listingType,
                  initialValues,
                  formValues,
                  setFormValues,
                })}
              </CustomSlide>
              <CustomSlide index={2}>
                {TemplatePictureFormField({
                  templateName: 'stack',
                  listingType,
                  initialValues,
                  formValues,
                  setFormValues,
                })}
              </CustomSlide>
              {stencilsAvailable &&
                stencilsAvailable.map((stencil, ind) => (
                  <CustomSlide key={stencil.templateTheme} index={ind + 3}>
                    {TemplatePictureFormField({
                      templateName: stencil.templateTheme,
                      listingType,
                      initialValues,
                      formValues,
                      setFormValues,
                      src: stencil.thumbnail,
                      isNew: stencil.new,
                    })}
                  </CustomSlide>
                ))}
            </Slider>
            <StyledButtonBack style={sliderButtonStyles} className="back-button">
              <Icon name="chevron left" size="large"></Icon>
            </StyledButtonBack>
            <StyledButtonNext style={sliderButtonStyles} className="next-button">
              <Icon name="chevron right" size="large"></Icon>
            </StyledButtonNext>
          </SliderButtons>
        </CarouselProvider>
      </CarouselProvider>
    </div>
  );
}
