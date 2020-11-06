import React, { useCallback } from 'react';
import { Field } from 'formik';
import { useDropzone } from 'react-dropzone';
import { Form, Header, Icon, Label, Card, Image, Item } from 'semantic-ui-react';

import { deletePhotoPending, uploadPhotoPending } from '../../../store/modules/pictures/actions';
import { useFocusOnError } from './utils/helpers';
import ErrorMessage from './ErrorMessage';

function FileUpload({ name, label, pending, dispatch, errorComponent = ErrorMessage, tag = undefined, ...props }) {
  const fieldRef = React.useRef();

  const onDrop = useCallback(
    acceptedFiles => {
      if (!pending && acceptedFiles.length > 0) {
        const data = [name, acceptedFiles[0]];
        dispatch(uploadPhotoPending(data));
      }
    },
    [pending, name, dispatch]
  );

  const { getRootProps, getInputProps, open, isDragReject } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: 'image/jpeg, image/png',
  });

  useFocusOnError({ fieldRef, name });

  const onClickDelete = target => {
    if (!pending) {
      dispatch(deletePhotoPending(target));
    }
  };

  return (
    <Field name={name}>
      {({ field, form }) => {
        const error = form.touched[name] && form.errors[name];
        return (
          <Form.Field
            error={!!error}
            {...props}
            style={{
              display: 'grid',
              gridTemplateColumns: '3fr 1fr',
              gridTemplateAreas: `"Label Func" "Image Image"`,
              width: '18em',
            }}
          >
            {!!label && (
              <label style={{ gridArea: 'Label' }} htmlFor={props.id || props.name}>
                {label} {tag}
              </label>
            )}

            {name === 'teamLogo' && field.value && !field.value.includes('image-placeholder') && (
              <div style={{ gridArea: 'Func', justifySelf: 'end' }}>
                <Item as="label" style={{ cursor: 'pointer' }}>
                  <Header as="h4" style={error ? { color: '#9f3a38' } : { color: '#59C4C4' }} onClick={() => onClickDelete(name)}>
                    Delete
                  </Header>
                </Item>
              </div>
            )}

            <div style={{ gridArea: 'Image' }}>
              <div style={{ maxWidth: '15em' }} {...getRootProps({ className: 'dropzone' })} ref={fieldRef}>
                <Item className="image-container" htmlFor={name} as="label" style={{ cursor: isDragReject ? 'not-allowed' : 'pointer' }} onClick={open}>
                  <Card
                    style={
                      error
                        ? { minHeight: '15em', maxHeight: '15em', minWidth: '15em', maxWidth: '15em', overflow: 'hidden', border: '3px solid #e0b4b4' }
                        : { minHeight: '15em', maxHeight: '15em', minWidth: '15em', maxWidth: '15em', overflow: 'hidden' }
                    }
                  >
                    <Label corner="right" className="image-upload-label">
                      <Icon name="upload" style={{ cursor: 'pointer' }} />
                    </Label>
                    {field.value && !isDragReject ? (
                      <Image size="tiny" src={field.value} wrapped ui={false} />
                    ) : name === 'realtorPhoto' ? (
                      <Image size="tiny" src={require('../../../assets/photo-placeholder.svg')} wrapped ui={false} />
                    ) : (
                      <Image size="tiny" src={require('../../../assets/image-placeholder.svg')} wrapped ui={false} />
                    )}
                    {pending ? null : <input {...getInputProps()} />}
                    <div className="image-middle">
                      {pending ? (
                        <Image
                          centered
                          size="tiny"
                          src={require('../../../assets/loading.gif')}
                          style={{ background: 'unset', marginTop: '1em', opacity: 1 }}
                        />
                      ) : isDragReject ? (
                        <Icon name="cancel" size="huge" className="wrong-image-overlay" />
                      ) : (
                        <Icon name="camera" size="huge" className="image-overlay" />
                      )}
                    </div>
                  </Card>
                </Item>
                <b className="wrong-image-overlay">{isDragReject ? 'Unsupported file type' : ''}</b>
              </div>
            </div>
          </Form.Field>
        );
      }}
    </Field>
  );
}

export default FileUpload;
