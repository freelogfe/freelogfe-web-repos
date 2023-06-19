// import * as React from 'react';
// import styles from './index.less';
// // import FFullScreen from "@/components/FFullScreen";
// // import {Button} from 'antd';
//
// interface FViewportTabsProps {
//   options: {
//     label: string;
//     value: string;
//   }[];
//   value: string;
//   children: React.ReactNode;
//
//   onChange?(value: string): void;
// }
//
// function FViewportTabs({options, value, onChange, children}: FViewportTabsProps) {
//
//   return (<div className={styles.Viewport}>
//     <div className={styles.ViewportNavs}>
//       <div className={styles.options}>
//         {
//           options.map((o) => {
//             return (<a
//               key={o.value}
//               className={o.value === value ? styles.active : ''}
//               onClick={() => {
//                 onChange && onChange(o.value);
//               }}
//             >{o.label}</a>)
//           })
//         }
//       </div>
//     </div>
//     <div>
//       {children}
//     </div>
//   </div>);
// }
//
// export default FViewportTabs;
