import {
    HomeOutlined,
    PieChartOutlined,
    UserOutlined,
    UsergroupDeleteOutlined,
    ShopOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    LineChartOutlined,
    AreaChartOutlined
  } from '@ant-design/icons';

const menuList = [
    {
        title: 'Home', // 菜单标题名称
        key: '/home', // 对应的 path
        icon: <HomeOutlined/>, // 图标名称
    },
    {
        title: 'Product Management',
        key: '/products',
        icon: <AppstoreOutlined/>,
        children: [ // 子菜单列表
            {
            title: 'Category',
            key: '/category',
            icon: <ShopOutlined/>
            },
            {
            title: 'Product',
            key: '/product',
            icon: <ShoppingOutlined/>
            },
        ]
    },
    {
        title: 'User Management',
        key: '/user',
        icon: <UserOutlined/>
    },
    {
        title: 'Role Management',
        key: '/role',
        icon: <UsergroupDeleteOutlined/>,
    },
    {title: 'Charts',
        key: '/charts',
        icon: <AreaChartOutlined/>,
        children: [
            {
                title: 'Bar Chart',
                key: '/charts/bar',
                icon: <BarChartOutlined/>
            },
            {
                title: 'Line Chart',
                key: '/charts/line',
                icon: <LineChartOutlined/>
            },
            {
                title: 'Pie Chart',
                key: '/charts/pie',
                icon: <PieChartOutlined/>
            },
        ]
    },
]
export default menuList