// import * as React from 'react';
// import styles from './index.less';
// import ReactMarkdown from 'react-markdown';
// import { FI18n } from '@freelog/tools-lib';
// import htmlReactParser from 'html-react-parser';
//
// // import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
//
// interface FI18nParserProps {
//   i18nKey: string;
//   className?: string;
// }
//
// function FI18nParser({ i18nKey, className = '' }: FI18nParserProps) {
//   if (i18nKey.startsWith('---markdown---')) {
//     return (<ReactMarkdown
//       className={[styles.i18nContainer, className].join(' ')}
//       linkTarget={'_blank'}
//     >{FI18n.i18nNext.t(i18nKey)}</ReactMarkdown>);
//   }
//
//   if (i18nKey.startsWith('---html---')) {
//     return (
//       <div className={[styles.i18nContainer, className].join(' ')}>{htmlReactParser(FI18n.i18nNext.t(i18nKey))}</div>);
//   }
//
//   return (<div>{i18nKey}</div>);
// }
//
// export default FI18nParser;
