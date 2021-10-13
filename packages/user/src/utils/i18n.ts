import { useIntl, formatMessage } from 'umi';

function message(message: string, values?: { [key: string]: string | number }): string {
  return formatMessage({id: message}, values);
}

export {
  message,
};
