// src/pages/UserList.tsx
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  isVip: boolean;
  loginTime: string;
  loginDevice: string;
  lastLoginIp: string;
  loginCount: number;
  followerCount: number;
  userHomepage: string;
  registerChannel: string;
  rechargeInfo: string;
}

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users`);
        const result = await response.json();
        setData(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [page, pageSize]);

  const columns: ProColumns<User>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '是否VIP',
      dataIndex: 'isVip',
      key: 'isVip',
      render: (_, record) => (record.isVip ? '是' : '否'),
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
    },
    {
      title: '登录设备',
      dataIndex: 'loginDevice',
      key: 'loginDevice',
    },
    {
      title: '上次登录IP',
      dataIndex: 'lastLoginIp',
      key: 'lastLoginIp',
    },
    {
      title: '登录次数',
      dataIndex: 'loginCount',
      key: 'loginCount',
    },
    {
      title: '粉丝数量',
      dataIndex: 'followerCount',
      key: 'followerCount',
    },
    {
      title: '用户主页',
      dataIndex: 'userHomepage',
      key: 'userHomepage',
      render: (_, record) => (
        <a href={record.userHomepage} target="_blank" rel="noopener noreferrer">
          主页
        </a>
      ),
    },
    {
      title: '注册渠道',
      dataIndex: 'registerChannel',
      key: 'registerChannel',
    },
    {
      title: '充值信息',
      dataIndex: 'rechargeInfo',
      key: 'rechargeInfo',
    },
  ];

  return (
    <div>
      <ProTable<User>
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        search={false}
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="button" type="primary">
            新建
          </Button>,
        ]}
      />
    </div>
  );
};

export default UserList;
