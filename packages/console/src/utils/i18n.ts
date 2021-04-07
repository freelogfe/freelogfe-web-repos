import {
  formatDate,
  formatTime,
  formatRelative,
  formatNumber,
  formatPlural,
  formatMessage,
  formatHTMLMessage
} from 'umi-plugin-react/locale';

function message(message: string, values?: { [key: string]: string | number }): string {
  return formatMessage({id: message}, values);
}

export {
  message,
};
