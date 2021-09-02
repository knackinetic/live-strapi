import { AddIcon, Autoselect } from '@strapi/icons';
import { Box, FieldLabel, Grid, GridItem, IconButton, Row, Stack, TextInput } from '@strapi/parts';
import { TextButton } from '@strapi/parts/TextButton';
import { Field, FieldArray, useFormikContext } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';

const HeadersInput = () => {
  const { formatMessage } = useIntl();
  const { values, errors } = useFormikContext();

  return (
    <Stack size={1}>
      <FieldLabel>
        {formatMessage({
          id: 'Settings.webhooks.form.headers',
          defaultMessage: 'Headers',
        })}
      </FieldLabel>
      <Box padding={8} background="neutral100" hasRadius>
        <FieldArray
          validateOnChange={false}
          name="headers"
          render={({ push, remove }) => (
            <Grid gap={4}>
              <GridItem col={6}>
                <FieldLabel>
                  {formatMessage({
                    id: 'Settings.webhooks.key',
                    defaultMessage: 'Key',
                  })}
                </FieldLabel>
              </GridItem>
              <GridItem col={6}>
                <FieldLabel>
                  {formatMessage({
                    id: 'Settings.webhooks.value',
                    defaultMessage: 'Value',
                  })}
                </FieldLabel>
              </GridItem>
              {values.headers?.map((header, i) => (
                // eslint-disable-next-line
                <React.Fragment key={i}>
                  <GridItem col={6}>
                    <Field
                      as={TextInput}
                      name={`headers.${i}.key`}
                      error={
                        errors.headers?.[i]?.key && formatMessage({ id: errors.headers[i]?.key })
                      }
                    />
                  </GridItem>
                  <GridItem col={6}>
                    <Row>
                      <Box style={{ flex: 1 }}>
                        <Field
                          as={TextInput}
                          name={`headers.${i}.value`}
                          error={
                            errors.headers?.[i]?.value &&
                            formatMessage({ id: errors.headers[i]?.value })
                          }
                        />
                      </Box>
                      <Box paddingLeft={2}>
                        <IconButton
                          onClick={() => values.headers.length !== 1 && remove(i)}
                          label={formatMessage({
                            id: 'Settings.webhooks.events.update',
                          })}
                          icon={<Autoselect />}
                          noBorder
                        />
                      </Box>
                    </Row>
                  </GridItem>
                </React.Fragment>
              ))}
              <GridItem col={12}>
                <TextButton
                  type="button"
                  onClick={() => {
                    push({ key: '', value: '' });
                  }}
                  startIcon={<AddIcon />}
                >
                  {formatMessage({
                    id: 'Settings.webhooks.create.header',
                    defaultMessage: 'Create a new header',
                  })}
                </TextButton>
              </GridItem>
            </Grid>
          )}
        />
      </Box>
    </Stack>
  );
};

export default HeadersInput;
