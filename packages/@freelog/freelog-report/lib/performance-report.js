export default function fPerformanceReport (options) {
  const defaultOpts = {
    reportUrl: ''
  }
  const opts = Object.assign(defaultOpts, options)
  
  console.log(opts)
  window.addEventListener('beforeunload', unloadHandler, false)

  // 数据上报
  function unloadHandler() {
    if (opts.reportUrl === '') return 
    const data = getPerformanceData()
    if (typeof window.navigator.sendBeacon === 'function') {
      // sendBeacon方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能
      window.navigator.sendBeacon(opts.reportUrl, JSON.stringify((data)))
    } else {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', opts.reportUrl, true) 
      xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')
      xhr.send(JSON.stringify(data))
    }
  }

  function getPerformanceData() {
    return {
      time: new Date().getTime(),
      url: window.location.href,
      clientW: document.documentElement.clientWidth || document.body.clientWidth,
      clientH: document.documentElement.clientHeight || document.body.clientHeight,
      performance: getPagePerformance(),
      resourceTimingList: getResourcePerformance(),
    }
  }

  function getPagePerformance() {
    let timing = window.performance.timing
    // 优先使用 navigation v2  https://www.w3.org/TR/navigation-timing-2/
    if (typeof window.PerformanceNavigationTiming === 'function') {
      const navigationTimings = window.performance.getEntriesByType('navigation')
      if (navigationTimings.length > 0) {
        timing = navigationTimings[0]
      }
    }
    return {
      // 重定向耗时
      rdt: +(timing.redirectEnd - timing.redirectStart).toFixed(2),
      // DNS查询耗时
      dnst: +(timing.domainLookupEnd - timing.domainLookupStart).toFixed(2),
      // TCP连接耗时
      tcpt: +(timing.connectEnd - timing.connectStart).toFixed(2),
      // Doc请求耗时
      doct: +(timing.responseEnd - timing.requestStart).toFixed(2),
      // Firstbyte首包加载耗时
      fbt: +(timing.responseStart - timing.requestStart).toFixed(2),
      // FP: First paint, 首次渲染 或 白屏耗时
      fpt: +(timing.responseEnd - timing.fetchStart).toFixed(2),
      // TTI：Time to Interact，首次可交互 耗时	
      ttit: +(timing.domInteractive - timing.fetchStart).toFixed(2),
      // Ready：HTML 加载完成时间，即 DOM 就位的时间
      rdyt: +(timing.domContentLoadedEventEnd - timing.fetchStart).toFixed(2),
      // loaded: 页面完全加载耗时
      loadt: +(timing.loadEventStart - timing.fetchStart).toFixed(2),
    }
  }

  function getResourcePerformance() {
    const pResourceTimingList = []
    if (window.performance && window.performance.getEntries) {
      const pResourceTimings = window.performance.getEntriesByType('resource')
      for (let pResourceTiming of pResourceTimings) {
        const { name, initiatorType, nextHopProtocol, duration, startTime, decodedBodySize  } = pResourceTiming
        pResourceTimingList.push({
          url: name,
          initiatorType,
          duration: +duration.toFixed(2),
          startTime: +startTime.toFixed(2),
          nextHopProtocol,
          decodedBodySize,
        })
      }
    }
    return pResourceTimingList
  }
}