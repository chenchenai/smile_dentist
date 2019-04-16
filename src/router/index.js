import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const asyncCompont = path =>
    import(/* webpackChunkName: "[request]" */ `@/pages/${path}`);

/*-------登录-------*/
const loginRouter = {
    path: '/login', //登录
    component: () => asyncCompont('Login/Container/Container'),
    children: [
        {
            path: 'factory', //工厂注册
            component: () => asyncCompont('Login/Register/Factory'),
        }, {
            path: 'clinic', //诊所注册
            component: () => asyncCompont('Login/Register/Clinic'),
        }, {
            path: 'forget', //忘记密码
            component: () => asyncCompont('Login/Forget/Forget'),
        }, {
            path: 'do',
            component: () => asyncCompont('Login/Login/Login'),
        }, {
            path: '/',
            redirect: 'do'
        }
    ]
};

/*-------工厂-------*/
const factoryRouter = {
    path: '/factory', // home
    component: () => asyncCompont('Factory/Container/Container'),
    children: [
        {
            path: '/', // 重定向到订单管理
            redirect: 'order'
        }, {
            path: 'index', // 首页
            component: () => asyncCompont('Factory/Index/Index'),
        }, {
           path: 'order', // 订单管理
           component: () => asyncCompont('Factory/Order/List/List')
        }, {
            path: 'production', // 生产
            component: () => asyncCompont('Factory/Production/Container/Container'),
            children: [
                {
                    path: '/', // 重定向到工序
                    redirect: 'scan'
                }, {
                    path: 'technology', // 工艺
                    component: () => asyncCompont('Factory/Production/Technology/Technology'),
                }, {
                    path: 'procedure', // 工序
                    component: () => asyncCompont('Factory/Production/Procedure/List'),
                }, {
                    path: 'scan', // 车间扫描
                    component: () => asyncCompont('Factory/Production/Scan/Scan'),
                }
            ]
        }, {
            path: 'product', // 产品
            component: () => asyncCompont('Factory/Product/Container/Container'),
            children: [
                {
                    path: '/', // 重定向到产品信息
                    redirect: 'product-info'
                }, {
                    path: 'product-info', // 产品信息
                    component: () => asyncCompont('Factory/Product/ProductInfo/List/List'),
                }
            ]
        }, {
            path: 'quality', // 质检
            component: () => asyncCompont('Factory/Quality/Container/Container'),
            children: [
                {
                    path: '/', // 重定向到过程质检
                    redirect: 'stencil'
                }, {
                    path: 'process', // 过程质检
                    component: () => asyncCompont('Factory/Quality/Process/Process'),
                }, {
                    path: 'production', // 成品质检
                    component: () => asyncCompont('Factory/Quality/Production/Production'),
                }, {
                    path: 'stencil', // 成品质检
                    component: () => asyncCompont('Factory/Quality/Stencil/List/List'),
              }
            ]
        }, {
            path: 'setup', // 设置
            component: () => asyncCompont('Factory/SetUp/Container/Container'),
            children: [
                {
                    path: '/', // 重定向规则设置
                    redirect: 'rule'
                }, {
                    path: 'rule', // 规则设置
                    component: () => asyncCompont('Factory/SetUp/Rule/Rule'),
                }, {
                    path: 'staff', // 员工管理
                    component: () => asyncCompont('Factory/SetUp/Staff/Staff'),
                }, {
                    path: 'role', // 角色管理
                    component: () => asyncCompont('Factory/SetUp/Role/Role'),
                }, {
                    path: 'factoryinfo', // 工厂信息
                    component: () => asyncCompont('Factory/SetUp/FactoryInfo/FactoryInfo'),
                }
            ]
        }, {
        path: 'customer', // 客户
        component: () => asyncCompont('Factory/Customer/List/List'),
        // children: [
        //   {
        //     path: '/', // 重定向规则设置
        //     redirect: 'list'
        //   }, {
        //     path: 'list', // 规则设置
        //     component: () => asyncCompont('Factory/Customer/List/List'),
        //   }
        // ]
      },


      /************仓库项目********** */
      {
        path: 'warehouse', /*仓库*/
        component: () => asyncCompont('Factory/Warehouse/Container/Container'),
        children: [
            {
                path: '/', 
                redirect: 'materialStorage'
            }, {
                path: 'materialStorage', /* 物料入库*/
                component: () => asyncCompont('Factory/Warehouse/materialStorage/Container/Container'),
                children: [
                    {
                        path: '/', // 重定向到物料入库list组件
                        redirect: 'materialStorageInfo'
                    }, {
                        path: 'materialStorageInfo', // 物料入库信息
                        component: () => asyncCompont('Factory/Warehouse/materialStorage/materialStorageInfo/List/List'),
                    }
                ],
            }, {
                path: 'materialOutgoing', /* 物料出库*/
                component: () => asyncCompont('Factory/Warehouse/materialOutgoing/Container/Container'),
                children: [
                    {
                        path: '/', // 重定向到物料入库list组件
                        redirect: 'materialOutInfo'
                    }, {
                        path: 'materialOutInfo', // 物料出库信息
                        component: () => asyncCompont('Factory/Warehouse/materialOutgoing/materialOutInfo/List/List'),
                    }
                ],  
            }, 
            {
                path: 'inventory', /* 库存明细*/
                component: () => asyncCompont('Factory/Warehouse/inventory/Container/Container'),
                children: [
                    {
                        path: '/', // 重定向到物料信息
                        redirect: 'inventoryInfo'
                    }, {
                        path: 'inventoryInfo', // 物料信息
                        component: () => asyncCompont('Factory/Warehouse/inventory/inventoryInfo/List/List'),
                    }
                ],

            }, {
                path: 'materialManagement', /* 物料管理*/
                component: () => asyncCompont('Factory/Warehouse/materialManagement/Container/Container'),
                children: [
                    {
                        path: '/', // 重定向到物料信息
                        redirect: 'materialInfo'
                    }, {
                        path: 'materialInfo', // 物料信息
                        component: () => asyncCompont('Factory/Warehouse/materialManagement/materialInfo/List/List'),
                    }
                ],
            },
             {
                 path: 'equipment', /* 设备信息*/
                 component: () => asyncCompont('Factory/Warehouse/equipment/Container/Container'),
                 children: [
                     {
                         path: '/', // 重定向到供应商管理
                         redirect: 'equipmentInfo'
                     }, {
                         path: 'equipmentInfo', // 供应商管理信息
                         component: () => asyncCompont('Factory/Warehouse/equipment/equipmentInfo/List/List'),
                     }
                 ],
            }, 
            {
                path: 'supplierManagement', /* 供应商管理*/
                component: () => asyncCompont('Factory/Warehouse/supplierManagement/Container/Container'),
                children: [
                    {
                        path: '/', // 重定向到供应商管理
                        redirect: 'supplierManagementInfo'
                    }, {
                        path: 'supplierManagementInfo', // 供应商管理信息
                        component: () => asyncCompont('Factory/Warehouse/supplierManagement/supplierManagementInfo/List/List'),
                    }
                ],
            }
        ]
      },
      /************仓库项目********** */






    ]
};

/*-------诊所-------*/
const clinicRouter = {

}

const routes = [
    {
        path: '',
        redirect: '/factory',
    },
    loginRouter,
    factoryRouter
];

export default new Router({
    routes,
});
