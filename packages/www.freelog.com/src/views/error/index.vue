<template>
  <div>
    <section class="error">
      <div class="clip-text">
        <h1>
          <span class="not-found-word">4</span>
          <span class="not-found-word">0</span>
          <span class="not-found-word">4</span>
        </h1>
        <h2 class="not-found-word not-found-text">Not Found</h2>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'not-found'
}
</script>

<style lang="less" scoped type="text/less">
  .error {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

  .not-found-word {
    animation: outside 2s;
    color: #fff;
    font-family: Arial, cursive;
    font-size: 200px;
    line-height: 220px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.1s linear;
    text-shadow: 0 0 2px #686868, 0 1px 1px #ddd, 0 2px 1px #d6d6d6, 0 3px 1px #ccc, 0 4px 1px #c5c5c5, 0 5px 1px #c1c1c1, 0 6px 1px #bbb, 0 7px 1px #777, 0 8px 3px rgba(100, 100, 100, 0.4), 0 9px 5px rgba(100, 100, 100, 0.1), 0 10px 7px rgba(100, 100, 100, 0.15), 0 11px 9px rgba(100, 100, 100, 0.2), 0 12px 11px rgba(100, 100, 100, 0.25), 0 13px 15px rgba(100, 100, 100, 0.3);
  }

  .not-found-text {
    font-size: 100px;
    line-height: 110px;
  }

    @keyframes outside {
      0% {
        text-shadow: 0 0 2px #686868;
      }
      100% {
        text-shadow: 0 0 2px #686868,
        0 1px 1px #ddd,
        0 2px 1px #d6d6d6,
        0 3px 1px #ccc,
        0 4px 1px #c5c5c5,
        0 5px 1px #c1c1c1,
        0 6px 1px #bbb,
        0 7px 1px #777,
        0 8px 3px rgba(100, 100, 100, 0.4),
        0 9px 5px rgba(100, 100, 100, 0.1),
        0 10px 7px rgba(100, 100, 100, 0.15),
        0 11px 9px rgba(100, 100, 100, 0.2),
        0 12px 11px rgba(100, 100, 100, 0.25),
        0 13px 15px rgba(100, 100, 100, 0.3);
      }
    }
  }
</style>
