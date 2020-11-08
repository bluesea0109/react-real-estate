import { useEffect } from 'react';
import { getIn, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';

const ValidateURLWithoutRerender = ({ formType }) => {
  const { setStatus, status, values } = useFormikContext();

  let newListingShortenedURLError;
  const newListingTeamShortenedURLError = useSelector(
    store => store.teamShortcode.listedURLToShortenError
  );
  const soldListingTeamShortenedURLError = useSelector(
    store => store.teamShortcode.soldURLToShortenError
  );
  let soldListingShortenedURLError;
  const newListingAgentShortenedURLError = useSelector(
    store => store.shortcode.listedURLToShortenError
  );
  const soldListingAgentShortenedURLError = useSelector(
    store => store.shortcode.soldURLToShortenError
  );

  if (formType === 'team') {
    newListingShortenedURLError = newListingTeamShortenedURLError;
    soldListingShortenedURLError = soldListingTeamShortenedURLError;
  }

  if (formType === 'agent') {
    newListingShortenedURLError = newListingAgentShortenedURLError;
    soldListingShortenedURLError = soldListingAgentShortenedURLError;
  }

  useEffect(() => {
    const listed_shortenCTA = getIn(values, 'listed_shortenCTA');

    if (newListingShortenedURLError && listed_shortenCTA) {
      setStatus({ listed_cta: newListingShortenedURLError.message });
    } else if (status?.listed_cta) {
      setStatus(null);
    }

    const sold_shortenCTA = getIn(values, 'sold_shortenCTA');

    if (soldListingShortenedURLError && sold_shortenCTA) {
      setStatus({ sold_cta: soldListingShortenedURLError.message });
    } else if (status?.sold_cta) {
      setStatus(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStatus, values, newListingShortenedURLError, soldListingShortenedURLError]);

  return null;
};

export default ValidateURLWithoutRerender;
