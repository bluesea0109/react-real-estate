import React, { useState } from 'react';

import { ButtonNoStyle, Menu, Segment } from '../../Base';
import { Form } from '../Base';

const Wizard = ({
  children,
  initialValues = {},
  onSubmit,
  page,
  setPage,
  controls,
  onLastPage,
  onIsDisabled,
}) => {
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
    <Form
      initialValues={values}
      enableReinitialize={false}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {props => {
        onIsDisabled(!!props.status || props.isSubmitting);
        onLastPage(isLastPage);

        return (
          <Form.Children>
            {controls}

            <Segment style={{ marginTop: '22px' }}>
              <Menu pointing secondary>
                <Menu.Item
                  as={ButtonNoStyle}
                  name="newListing"
                  active={page === 0}
                  disabled={page === 0}
                  onClick={previous}
                />
                <Menu.Item
                  as={ButtonNoStyle}
                  type="submit"
                  name="soldListing"
                  active={page === 1}
                  disabled={!!props.status || props.isSubmitting || page === 1}
                />
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
