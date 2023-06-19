// import React from 'react';
// import G6, { Graph, IG6GraphEvent, INode, IShape } from '@antv/g6';
// import {
//   Group,
//   Rect,
//   Text,
//   Circle,
//   Image,
//   createNodeFromReact,
// } from '@antv/g6-react-node';
//
// export type ShapeEventListner = (
//   event: IG6GraphEvent,
//   node: INode | null,
//   shape: IShape,
//   graph: Graph,
// ) => void;
//
// export interface EventAttrs {
//   onClick?: ShapeEventListner;
//   onDBClick?: ShapeEventListner;
//   onMouseEnter?: ShapeEventListner;
//   onMouseMove?: ShapeEventListner;
//   onMouseOut?: ShapeEventListner;
//   onMouseOver?: ShapeEventListner;
//   onMouseLeave?: ShapeEventListner;
//   onMouseDown?: ShapeEventListner;
//   onMouseUp?: ShapeEventListner;
//   onDragStart?: ShapeEventListner;
//   onDrag?: ShapeEventListner;
//   onDragEnd?: ShapeEventListner;
//   onDragEnter?: ShapeEventListner;
//   onDragLeave?: ShapeEventListner;
//   onDragOver?: ShapeEventListner;
//   onDrop?: ShapeEventListner;
//   onContextMenu?: ShapeEventListner;
// }
//
// const propsToEventMap = {
//   click: 'onClick',
//   dbclick: 'onDBClick',
//   mouseenter: 'onMouseEnter',
//   mousemove: 'onMouseMove',
//   mouseout: 'onMouseOut',
//   mouseover: 'onMouseOver',
//   mouseleave: 'onMouseLeave',
//   mousedown: 'onMouseDown',
//   mouseup: 'onMouseUp',
//   dragstart: 'onDragStart',
//   drag: 'onDrag',
//   dragend: 'onDragEnd',
//   dragenter: 'onDragEnter',
//   dragleave: 'onDragLeave',
//   dragover: 'onDragOver',
//   drop: 'onDrop',
//   contextmenu: 'onContextMenu',
// };
//
// export function appenAutoShapeListener(graph: Graph) {
//   Object.entries(propsToEventMap).map(([eventName, propName]) => {
//     graph.on(`node:${eventName}` as any, evt => {
//       const shape = evt.shape;
//       const item = evt.item as INode;
//       const graph = evt.currentTarget as Graph;
//       const func = shape?.get(propName) as ShapeEventListner;
//       if (func) {
//         func(evt, item, shape, graph);
//       }
//     });
//   });
// }
//
// export const G6MiniDemo = ({
//                              nodeType,
//                              count = 1,
//                              height = 200,
//                            }: {
//   nodeType: string;
//   count?: number;
//   height?: number;
// }) => {
//   React.useEffect(() => {
//     const data = {
//       nodes: 'e'
//         .repeat(count)
//         .split('')
//         .map((e, i) => ({
//           description: 'ant_type_name_...',
//           label: 'Type / ReferType',
//           color: '#7262fd',
//           meta: {
//             creatorName: 'a_creator',
//           },
//           id:
//             'node' +
//             i +
//             Math.random()
//               .toString(16)
//               .slice(-4),
//           type: nodeType,
//         })),
//       edges: [],
//     };
//     const width = document.getElementById('container000111')?.clientWidth || 800;
//     const graph = new G6.Graph({
//       container: 'container000111',
//       width,
//       height,
//       fitCenter: true,
//       modes: {
//         default: ['drag-node', 'drag-canvas', 'zoom-canvas'],
//       },
//       layout: {
//         type: 'dagre',
//       },
//     });
//     graph.data(data);
//     const time = new Date();
//     graph.render();
//     console.log(
//       `${count} Nodes rendered`,
//       'Render time:',
//       (Number(new Date()) - Number(time)) / 1000,
//       's',
//     );
//     appenAutoShapeListener(graph);
//     return () => {
//       graph.destroy();
//     };
//   }, [count, nodeType]);
//   return <div id='container000111'></div>;
// };
//
// const ReactNode = ({ cfg = {} }) => {
//   const { description, meta = {}, label = 'label' } = cfg as any;
//   return (
//     <Group>
//       <Rect style={{}} onClick={() => {
//         console.log('#####2342394ui3jk');
//       }}>
//         <Rect
//           style={{
//             width: 150,
//             height: 20,
//             fill: (cfg as any).color,
//             radius: [6, 6, 0, 0],
//             cursor: 'move',
//             stroke: (cfg as any).color,
//             justifyContent: 'center',
//           }}
//           draggable
//         >
//           <Text
//             style={{
//               margin: [4, 5],
//               fontWeight: 'bold',
//               fill: '#fff',
//             }}
//           >
//             {label}
//           </Text>
//         </Rect>
//         <Rect
//           style={{
//             width: 150,
//             height: 55,
//             stroke: (cfg as any).color,
//             fill: '#ffffff',
//             radius: [0, 0, 6, 6],
//           }}
//         >
//           <Text style={{ fill: '#333', margin: [8, 4] }}>
//             描述: {description}
//           </Text>
//           <Text style={{ fill: '#333', margin: [6, 4] }}>
//             创建者: {meta.creatorName}
//           </Text>
//         </Rect>
//       </Rect>
//       <Circle
//         style={{
//           stroke: (cfg as any).color,
//           r: 10,
//           fill: '#fff',
//           cursor: 'pointer',
//           margin: [0, 'auto'],
//         }}
//         name='circle'
//       >
//         <Image
//           style={{
//             img:
//               'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
//             width: 12,
//             height: 12,
//             margin: [4, 'auto'],
//           }}
//         />
//       </Circle>
//     </Group>
//   );
// };
//
// G6.registerNode('test', createNodeFromReact(ReactNode));
//
// function FG6MiniDemo() {
//   return (<G6MiniDemo nodeType='test' count={3} />);
// }
//
// export default FG6MiniDemo;
