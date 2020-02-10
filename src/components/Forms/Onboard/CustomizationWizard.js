import React, { useState } from 'react';

import { Menu, Segment } from '../../Base';
import { isMobile } from '../utils';
import { Form } from '../Base';

const Wizard = ({ children, initialValues = {}, onSubmit, page, setPage, controls, onLastPage, onIsSubmitting, pauseFormUpdate }) => {
  const [values, setValues] = useState(initialValues);

  const next = values => {
    setPage(Math.min(page + 1, children.length - 1));
    setValues(values);
  };

  const previous = () => {
    setPage(Math.max(page - 1, 0));
  };

  const validate = values => {
    const activePage = React.Children.toArray(children)[page];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  const handleSubmit = (values, bag) => {
    const isLastPage = page === React.Children.count(children) - 1;

    if (isLastPage) {
      return onSubmit(values, bag);
    } else {
      bag.setTouched({});
      bag.setSubmitting(false);
      next(values);
    }
  };

  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;

  return (
    <Form initialValues={values} enableReinitialize={false} validate={validate} onSubmit={handleSubmit}>
      {({ isSubmitting }) => {
        onIsSubmitting(isSubmitting);
        onLastPage(isLastPage);

        return (
          <Form.Children>
            {controls}

            <Segment style={isMobile() ? { marginTop: '155px' } : { marginTop: '90px' }}>
              <Menu pointing secondary>
                <Menu.Item name="newListing" active={page === 0} disabled={page === 0} onClick={previous} />
                <Menu.Item name="soldListing" active={page === 1} disabled={page === 1} onClick={next} />
              </Menu>

              {activePage}
            </Segment>
          </Form.Children>
        );
      }}
    </Form>
  );
};

export default Wizard;
