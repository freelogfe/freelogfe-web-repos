import * as React from 'react';
import styles from './index.less';
import * as umi from 'umi';

interface AOrLinkProps {
  children: any;
  href: string;
  target?: '_self' | '_blank';
  className?: string;
  style?: React.CSSProperties;
}

function AOrLink({ children, href, target, className = '', style = {} }: AOrLinkProps) {
  return (<>
    {
      href.startsWith('http')
        ? (<a
          className={className}
          style={style}
          href={href}
          target={target}
        >{children}</a>)
        : (<umi.Link
          className={className}
          style={style}
          to={href}
          target={target}
        >{children}</umi.Link>)
    }
  </>);
}

export default AOrLink;
