<template>
    <div class="Page" >
        <div class="block " ref="page">
            <el-pagination
                :current-page.sync="curPage"
                @size-change="currentChange"
                @current-change="currentChange"
                :page-size="pageSize"
                :pager-count="5"
                layout="prev, pager, next, jumper"
                :total="totalNum">
            </el-pagination>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        // 调用Page组件，需props传递pageChange回调方法，pageSize每页显示数目，totalNum总条数，currentPage当前页
        props: [ 'pageChange', 'pageSize', 'totalNum', 'currentPage' ],
        data() {
            return {
                curPage: 1
            }
        },
        watch: {
            currentPage(cur, old) {
                // 不将currentPage直接赋值给current-page.sync是为了避免直接修改props的错误操作
                this.curPage = this.currentPage;
            }
        },
        methods: {
            // 点击分页
            currentChange(page) {
                // 执行回调方法，将当前页传递给父组件
                this.$emit('pageChange', page);
            }
        },
    }
</script>

<style lang="less">
    @import url('./Page.less');
</style>
