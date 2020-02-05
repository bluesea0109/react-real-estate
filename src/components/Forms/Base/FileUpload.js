import React from 'react';
import { Field } from 'formik';
import { useDropzone } from 'react-dropzone';
import { Form, Header, Icon, Label, Card, Image, Item } from 'semantic-ui-react';

import { deletePhotoPending, uploadPhotoPending } from '../../../store/modules/pictures/actions';

function FileUpload({ name, label, pending, dispatch, ...props }) {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  const files = acceptedFiles.map(file => file);

  const onChangeHandler = files => {
    if (!pending) {
      const data = [name, files[0]];
      dispatch(uploadPhotoPending(data));
    }
  };

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
                {label}{' '}
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

            <div style={{ gridArea: 'Image' }} {...getRootProps({ className: 'dropzone' })} onDrop={() => onChangeHandler(files)}>
              <Item className="image-container" htmlFor={name} as="label" style={{ cursor: 'pointer' }} onClick={open}>
                <Card
                  style={
                    error
                      ? { minHeight: '15em', maxHeight: '15em', minWidth: '15em', maxWidth: '15em', overflow: 'hidden', border: '1px solid #e0b4b4' }
                      : { minHeight: '15em', maxHeight: '15em', minWidth: '15em', maxWidth: '15em', overflow: 'hidden' }
                  }
                >
                  <Label corner="right" className="image-upload-label">
                    <Icon name="upload" style={{ cursor: 'pointer' }} />
                  </Label>
                  {field.value ? (
                    <Image size="tiny" src={field.value} wrapped ui={false} />
                  ) : name === 'realtorPhoto' ? (
                    <Image size="tiny" src={require('../../../assets/photo-placeholder.svg')} wrapped ui={false} />
                  ) : (
                    <Image size="tiny" src={require('../../../assets/image-placeholder.svg')} wrapped ui={false} />
                  )}
                  {pending ? null : <input {...getInputProps()} onChange={() => onChangeHandler(files)} />}
                  <div className="image-middle">
                    {pending ? (
                      <Image centered size="tiny" src={require('../../../assets/loading.gif')} style={{ background: 'unset', marginTop: '1em', opacity: 1 }} />
                    ) : (
                      <Icon name="camera" size="huge" className="image-overlay" />
                    )}
                  </div>
                </Card>
              </Item>
            </div>
          </Form.Field>
        );
      }}
    </Field>
  );
}

export default FileUpload;
