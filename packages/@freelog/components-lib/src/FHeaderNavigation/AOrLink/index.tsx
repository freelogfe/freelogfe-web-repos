import * as React from 'react';
// import styles from './index.less';
// import {Link} from 'umi';

interface AOrLinkProps {
  children: any;
  href: string;
  target?: '_self' | '_blank';
  className?: string;
  style?: React.CSSProperties;

  UmiLinkPatch?: any;
}

function AOrLink({ children, href, target, className = '', style = {}, UmiLinkPatch }: AOrLinkProps) {

  const Link = UmiLinkPatch;

  return (<>
    {
      href.startsWith('http') || !Link
        ? (<a
          className={className}
          style={style}
          href={href}
          target={target}
        >{children}</a>)
        : (<Link
          className={className}
          style={style}
          to={href}
          target={target}
        >{children}</Link>)
    }
  </>);
}

export default AOrLink;
