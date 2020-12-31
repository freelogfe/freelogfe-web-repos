import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6';
// import ReactDOM from 'react-dom';

interface FAntvG6Props {
  data: any;
}

function FAntvG6({data}: FAntvG6Props) {
  const ref = React.useRef(null);
  let graph: any = null;

  React.useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ref.current || '',
        width: 920,
        height: 500,
        modes: {
          // default: ['drag-canvas'],
        },
        layout: {
          type: 'dagre',
          // direction: 'LR',
        },
        defaultNode: {
          type: 'node',
          labelCfg: {
            style: {
              // fill: '#000000A6',
              // fontSize: 10,
            },
          },
          style: {
            // stroke: '#72CC4A',
            // width: 150,
          },
        },
        defaultEdge: {
          // type: 'polyline',
        },
      });
    }
    graph.data(data);
    graph.render();
  }, []);
  return (<div ref={ref}/>);
}

export default FAntvG6;
