import { useEffect } from 'react';
import { getIn, useFormikContext } from 'formik';

const UpdateWithoutRerender = ({ formValues }) => {
  const { setFieldValue, setFieldTouched, touched, errors } = useFormikContext();

  useEffect(() => {
    setFieldValue('listed_defaultDisplayAgent', formValues?.listed?.defaultDisplayAgent?.userId, true);
    setFieldValue('listed_frontHeadline', formValues?.listed?.frontHeadline, true);
    setFieldValue('listed_cta', formValues?.listed?.cta, true);
    setFieldValue('listed_shortenCTA', formValues?.listed?.shortenCTA, true);
    setFieldValue('listed_kwkly', formValues?.listed?.kwkly, true);

    setFieldValue('sold_defaultDisplayAgent', formValues?.sold?.defaultDisplayAgent?.userId, true);
    setFieldValue('sold_frontHeadline', formValues?.sold?.frontHeadline, true);
    setFieldValue('sold_cta', formValues?.sold?.cta, true);
    setFieldValue('sold_shortenCTA', formValues?.sold?.shortenCTA, true);
    setFieldValue('sold_kwkly', formValues?.sold?.kwkly, true);
  }, [setFieldValue, formValues]);

  useEffect(() => {
    const touched_listed_shortenCTA = getIn(touched, 'listed_shortenCTA');
    if (touched_listed_shortenCTA) {
      const error_listed_cta = getIn(errors, 'listed_cta');
      const error_listed_kwkly = getIn(errors, 'listed_kwkly');

      if (error_listed_cta) {
        setFieldTouched('listed_cta', true, true);
      }

      if (error_listed_kwkly) {
        setFieldTouched('listed_kwkly', true, true);
      }
    }

    const touched_sold_shortenCTA = getIn(touched, 'sold_shortenCTA');
    if (touched_sold_shortenCTA) {
      const error_sold_cta = getIn(errors, 'sold_cta');
      const error_sold_kwkly = getIn(errors, 'sold_kwkly');

      if (error_sold_cta) {
        setFieldTouched('sold_cta', true, true);
      }

      if (error_sold_kwkly) {
        setFieldTouched('sold_kwkly', true, true);
      }
    }
  }, [touched, errors, setFieldTouched]);

  return null;
};

export default UpdateWithoutRerender;
