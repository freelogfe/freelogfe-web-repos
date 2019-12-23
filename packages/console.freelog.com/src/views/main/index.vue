<template>
    <section class="index-main-container">

		<el-tabs class="main-c-tabs" v-model="activeTabName" @tab-click="exchangeActiveTabName">
			<el-tab-pane label="发行市场" :name="tabs[0].name">
				<div class="resource-types-bar">
					<el-button 
						type="text"
						:class="{ 'selected': selectedType === item.value }"
						v-for="item in resourceTypes" 
						:key="item.value"
						@click="exchangeSelectedResourceType(item.value)">{{item.label}}</el-button>
					<search-input showInputImmediately width="160px" placeholder="搜索自定义类型" @search="searchHandler"></search-input>
				</div>
				<div class="main-content-wrap">
					<lazy-list-view
						itemClass="resource-list-item"
						class="resource-list"
						ref="resourceList"
						:list="resourceList"
						:height="275"
						:fetch="fetchReleaseData"
					>
						<template slot-scope="scope">
							<list-item :release="scope.data"></list-item>
						</template>
						<!--占位居中-->
						<template slot="append">
							<div class="res-placeholder-item"></div><div class="res-placeholder-item"></div>
							<div class="res-placeholder-item"></div><div class="res-placeholder-item"></div>
							<div class="res-placeholder-item"></div><div class="res-placeholder-item"></div>
						</template>
					</lazy-list-view>
				</div>
			</el-tab-pane>
			<el-tab-pane label="示例节点" :name="tabs[1].name">
				<node-example></node-example>
			</el-tab-pane>
  		</el-tabs>
			
    </section>
</template>

<script>
    import IndexMainView from './index'

    export default IndexMainView
</script>

<style lang="less" scoped>
    @import "index.less";
</style>

<style lang="less">
    .index-main-container {
		
        .fl-lazy-list-view.resource-list {
            > ul {
                display: flex;
                flex-wrap: wrap;
                margin-left: -20px;
                justify-content: center;
            }
        }

        .res-placeholder-item,
        .resource-list-item {
            width: 220px;
            margin-left: 20px;
        }

        .resource-list-item {
            overflow: hidden;
            border-radius: 4px;
            background-color: #FFFFFF;
            margin-bottom: 20px;
            box-shadow: rgba(0, 0, 0, .2) 0 2px 2px 0;
		}
    }
</style>
