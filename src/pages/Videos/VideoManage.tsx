// src/pages/VideoManagement.tsx
import { InboxOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, Tabs, Upload, UploadProps, message } from 'antd';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface Video {
  id: number;
  title: string;
  uploadTime: string;
  status: string;
  tags: string[];
  description: string;
}

const fetchVideos = async (params: any) => {
  // 在这里实现获取视频数据的接口调用
  try {
    const response = await fetch('/api/videos', { method: 'GET' });
    const data = await response.json();
    return { data: data.videos, success: true, total: data.total };
  } catch (error) {
    message.error('获取视频数据失败');
    return { data: [], success: false, total: 0 };
  }
};

const uploadVideo = async (values: any, fileList: UploadFile[]) => {
  // 在这里实现上传视频的接口调用
  try {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    const response = await fetch('/api/videos', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      message.success('视频上传成功');
      return true;
    } else {
      message.error('视频上传失败');
      return false;
    }
  } catch (error) {
    message.error('视频上传失败');
    return false;
  }
};

const VideoManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ProColumns<Video>[] = [
    { title: '视频标题', dataIndex: 'title', key: 'title' },
    { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 'pending' ? '待审核' : '已发布'),
    },
    { title: '操作', key: 'action', render: () => <a>编辑</a> },
  ];

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== file.uid),
      );
    },
    beforeUpload: (file) => {
      setFileList((prevList) => [...prevList, file]);
      return false;
    },
    fileList,
  };

  const tabItems = [
    {
      key: '1',
      label: '视频列表',
      children: (
        <>
          <Button
            type="primary"
            onClick={handleUpload}
            style={{ marginBlockEnd: 10 }}
          >
            上传视频
          </Button>
          <ProTable<Video>
            columns={columns}
            request={fetchVideos}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            search={false}
            // options={false}
          />
        </>
      ),
    },
    {
      key: '2',
      label: '审核视频',
      children: (
        <ProTable<Video>
          columns={columns}
          request={fetchVideos}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          search={false}
        />
      ),
    },
    {
      key: '3',
      label: '视频标签管理',
      children: (
        <ProTable<{ tag: string; count: number }>
          columns={[
            { title: '标签', dataIndex: 'tag', key: 'tag' },
            { title: '关联视频数', dataIndex: 'count', key: 'count' },
          ]}
          request={async (params) => {
            // 在这里实现获取标签数据的接口调用
            try {
              const response = await fetch('/api/tags', { method: 'GET' });
              const data = await response.json();
              return { data: data.tags, success: true, total: data.total };
            } catch (error) {
              message.error('获取标签数据失败');
              return { data: [], success: false, total: 0 };
            }
          }}
          rowKey="tag"
          pagination={{ pageSize: 10 }}
          search={false}
        />
      ),
    },
  ];

  return (
    <PageContainer title="视频管理">
      <Tabs defaultActiveKey="1" items={tabItems} />

      <Modal
        title="上传视频"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <ProForm
          onFinish={async (values) => {
            const success = await uploadVideo(values, fileList);
            if (success) {
              setIsModalVisible(false);
            }
          }}
        >
          <ProFormText
            name="title"
            label="视频标题"
            placeholder="请输入视频标题"
          />
          <ProFormTextArea
            name="description"
            label="视频描述"
            placeholder="请输入视频描述"
          />
          <ProFormSelect
            name="tags"
            label="视频标签"
            mode="multiple"
            placeholder="请选择视频标签"
            options={[
              { label: '标签1', value: 'tag1' },
              { label: '标签2', value: 'tag2' },
            ]}
          />
          <ProFormDatePicker name="uploadTime" label="上传时间" />
          <Upload.Dragger {...uploadProps} style={{ marginBlockEnd: 20 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传。严禁上传公司数据或其他带有敏感信息的文件
            </p>
          </Upload.Dragger>
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default VideoManagement;
