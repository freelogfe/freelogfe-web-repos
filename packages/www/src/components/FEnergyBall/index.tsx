import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { CanvasHTMLAttributes } from 'react';

interface FEnergyBallProps {
  percent: number;
}

function FEnergyBall({ percent }: FEnergyBallProps) {
  // console.log(percent, 'percent sdifjsdlkfjlksdjflkjkl');
  const canvasRef = React.useRef<any>(null);
  // const [$percent, set$percent, get$percent] = F

  AHooks.useMount(() => {
    init();
  });

  function init() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // var range = document.getElementById('r');

    //range控件信息
    // var rangeValue = range.value;
    let rangeValue: number = percent;
    let nowRange: number = 40; //用于做一个临时的range

    //画布属性
    const mW = (canvas.width = 350);
    const mH = (canvas.height = 350);
    const lineWidth = 1;

    //圆属性
    const r = mH / 2; //圆心
    const cR = r - 32 * lineWidth; //圆半径

    //Sin 曲线属性
    const sX: number = 0;
    const axisLength: number = mW; //轴长
    const waveWidth: number = 0.008; //波浪宽度,数越小越宽
    const waveHeight: number = 6; //波浪高度,数越大越高
    const speed: number = 0.09; //波浪速度，数越大速度越快
    let xOffset: number = 0; //波浪x偏移量

    ctx.lineWidth = lineWidth;

    //画圈函数
    let IsdrawCircled = false;
    const drawCircle = function() {
      ctx.beginPath();
      // ctx.strokeStyle = '#1080d0';
      ctx.strokeStyle = '#f00';
      ctx.arc(r, r, cR + 1, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(r, r, cR, 0, 2 * Math.PI);
      ctx.clip();
      IsdrawCircled = true;
    };

    //画sin 曲线函数
    const drawSin = function(xOffset: number, color: string, waveHeight: number) {
      ctx.save();

      const points = []; //用于存放绘制Sin曲线的点

      ctx.beginPath();
      //在整个轴长上取点
      for (let x = sX; x < sX + axisLength; x += 20 / axisLength) {
        //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
        const y = Math.sin((-sX - x) * waveWidth + xOffset) * 0.8 + 0.1;
        const dY = mH * (1 - nowRange / 100);
        points.push([x, dY + y * waveHeight]);
        ctx.lineTo(x, dY + y * waveHeight);
      }

      //封闭路径
      ctx.lineTo(axisLength, mH);
      ctx.lineTo(sX, mH);
      ctx.lineTo(points[0][0], points[0][1]);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    };

    const render = function() {
      ctx.clearRect(0, 0, mW, mH);
      // console.log(percent, 'percent ##########################################');
      rangeValue = percent;

      if (!IsdrawCircled) {
        drawCircle();
      }

      if (nowRange <= rangeValue) {
        const tmp = 1;
        nowRange += tmp;
      }

      if (nowRange > rangeValue) {
        const tmp = 1;
        nowRange -= tmp;
      }

      // drawSin(xOffset + Math.PI * 0.7, 'rgba(28, 134, 209, 0.5)', 18);
      drawSin(xOffset + Math.PI * 0.7, '#0f0', 18);
      // drawSin(xOffset, '#1c86d1', 18);
      drawSin(xOffset, '#00f', 18);
      // drawText();

      xOffset += speed;
      requestAnimationFrame(render);
    };
    //写百分比文本函数
    // const drawText = function () {
    //     ctx.save();

    //     const size = 0.4 * cR;
    //     ctx.font = size + 'px Microsoft Yahei';
    //     ctx.textAlign = 'center';
    //     ctx.fillStyle = 'rgba(06, 85, 128, 0.5)';
    //     ctx.fillText(~~nowRange + '%', r, r + size / 2);

    //     ctx.restore();
    // };

    render();
  }

  return (<canvas ref={canvasRef} />);
}

export default FEnergyBall;
