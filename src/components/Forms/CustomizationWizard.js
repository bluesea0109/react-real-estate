import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { Form as FinalForm } from 'react-final-form';

import { Button, Menu, Segment } from '../../components/Base';

const CustomizationWizard = ({ children, initialValues = {}, onSubmit, togglePages, setTogglePages }) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [onlyOnce, setOnlyOnce] = useState(false);

  useEffect(() => {
    if (!onlyOnce && values !== initialValues) {
      setValues(initialValues);
      setOnlyOnce(true);
    }
  }, [initialValues, values, setValues, onlyOnce, setOnlyOnce]);

  const next = useCallback(
    values => {
      setPage(Math.min(page + 1, children.length - 1));
      setValues(values);
    },
    [page, children]
  );

  const previous = useCallback(() => setPage(Math.max(page - 1, 0)), [page]);

  const validate = values => {
    const activePage = React.Children.toArray(children)[page];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  const handleSubmit = useCallback(
    values => {
      const isLastPage = page === React.Children.count(children) - 1;
      if (isLastPage) {
        return onSubmit(values);
      } else {
        next(values);
      }
    },
    [onSubmit, next, page, children]
  );

  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;

  useEffect(() => {
    if (togglePages === 'first') {
      setTogglePages(null);
      previous();
    }
    if (togglePages === 'last') {
      setTogglePages(null);
      handleSubmit(values);
    }
  }, [togglePages, setTogglePages, values, previous, handleSubmit]);

  return (
    <FinalForm initialValues={values} validate={validate} onSubmit={handleSubmit} keepDirtyOnReinitialize={true}>
      {({ handleSubmit, submitting }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Segment style={{ margin: '0 0 -1px 0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              <Menu pointing secondary>
                <Menu.Item name="newListing" active={!isLastPage} onClick={previous} />
                <Menu.Item name="soldListing" active={page > 0} onClick={handleSubmit} />
              </Menu>
            </Segment>

            {activePage}

            <div style={{ display: 'grid', justifyContent: 'end' }}>
              <span>
                {page > 0 && (
                  <Button type="button" onClick={previous}>
                    « Previous
                  </Button>
                )}
                {!isLastPage && <Button type="submit">Next »</Button>}
                {isLastPage && (
                  <Button type="submit" disabled={submitting}>
                    Submit
                  </Button>
                )}
              </span>
            </div>
          </Form>
        );
      }}
    </FinalForm>
  );
};

CustomizationWizard.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default CustomizationWizard;
