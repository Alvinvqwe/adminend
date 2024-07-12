// src/pages/VideoManagement.tsx
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import VideoUploadForm from './UploadForm';

interface Video {
  id: number;
  title: string;
  description: string;
  uploader_id: number;
  upload_date: Date;
  video_url: string;
  video_length: string;
  clarity: string;
  review_status: string;
}

interface Tag {
  id: number;
  name: string;
}

// const fetchVideos = async (params: any) => {
//   // 在这里实现获取视频数据的接口调用
//   try {
//     const response = await fetch('/api/videos', {
//       method: 'POST',
//       body: JSON.stringify(params),
//     });
//     const data = await response.json();
//     if (!data.success) {
//       message.error('获取视频数据失败');
//     }
//     return data;
//   } catch (error) {
//     message.error('获取视频数据失败');
//     return { data: [], success: false, total: 0 };
//   }
// };

// const uploadVideo = async (values: any, fileList: UploadFile[]) => {
//   // 在这里实现上传视频的接口调用
//   try {
//     const formData = new FormData();
//     fileList.forEach((file) => {
//       formData.append('files[]', file as RcFile);
//     });
//     Object.keys(values).forEach((key) => {
//       formData.append(key, values[key]);
//     });

//     const response = await request('/api/videos', {
//       method: 'POST',
//       data: formData,
//     });

//     if (response.ok) {
//       message.success('视频上传成功');
//       return true;
//     } else {
//       message.error('视频上传失败');
//       return false;
//     }
//   } catch (error) {
//     message.error('视频上传失败');
//     return false;
//   }
// };

const VideoManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch('/api/video/tags');
      const res = await response.json();
      if (!res.success) {
        message.error('获取标签数据失败');
        return;
      }
      setTags(res.data);
    };
    fetchTags();
  }, []);

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

  const tabItems = [
    {
      key: '1',
      label: '视频列表',
      children: (
        <>
          <ProTable<Video>
            columns={columns}
            request={async () => {
              // 在这里实现获取视频数据的接口调用
              try {
                const response = await fetch('/api/videos/', {
                  method: 'POST',
                  body: JSON.stringify({
                    type: 'viewed ranking',
                    limit: 10,
                    offset: 0,
                  }),
                });
                const res = await response.json();
                if (!res.success) {
                  return { data: [], success: false, total: 0 };
                }
                return {
                  data: res.data,
                  success: true,
                  total: res.data.length,
                };
              } catch (error) {
                // message.error('获取视频数据失败');
                return { data: [], success: false, total: 0 };
              }
            }}
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
          request={async () => {
            // 在这里实现获取视频数据的接口调用
            try {
              const response = await fetch('/api/videos', {
                method: 'POST',
                body: JSON.stringify({
                  type: 'pendings',
                  limit: 10,
                  offset: 0,
                }),
              });
              const res = await response.json();
              if (!res.success) {
                return { data: [], success: false, total: 0 };
              }
              return { data: res.data, success: true, total: res.data.length };
            } catch (error) {
              message.error('获取视频数据失败');
              return { data: [], success: false, total: 0 };
            }
          }}
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
        <ProTable<{ tag: string; count: number; key: number }>
          columns={[{ title: '标签', dataIndex: '视频关联数量', key: 'id' }]}
          request={async () => {
            // 在这里实现获取标签数据的接口调用
            console.log(tags);
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
    {
      key: '4',
      label: '上传视频',
      children: <VideoUploadForm />,
    },
  ];

  return (
    <PageContainer title="视频管理">
      <Tabs defaultActiveKey="1" items={tabItems} />
    </PageContainer>
  );
};

export default VideoManagement;
