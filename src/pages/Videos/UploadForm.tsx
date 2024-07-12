import apiRequest from '@/utils/axios';
import { InboxOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { SelectProps } from 'antd';
import { Select, Upload, UploadProps, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

const { Dragger } = Upload;

interface Tag {
  id: number;
  name: string;
}

const VideoUploadForm = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [videoFileLists, setVideoFileLists] = useState<
    Record<number, UploadFile[]>
  >({});

  //   const handleSubmit = async (values: any) => {
  //     console.log('Form Values:', values);
  //     console.log('File List:', videoFileLists);
  //     // 在这里处理表单提交和文件上传逻辑
  //     values.videos.map(async (v: any) => {
  //       var response = await apiRequest.post(
  //         '/video/upload',
  //         {
  //           title: v.title,
  //           description: v.description,
  //           tags: v.tags,
  //           files: v.file.fileList as List,
  //           permission: 'public',
  //           uploaderId: 1,
  //         },
  //         {
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //           },
  //         },
  //       );
  //       console.log(response);
  //       if (response.data.success) {
  //         message.success(v.title + '视频上传成功');
  //       } else {
  //         message.error({
  //           content: v.title + '视频上传失败',
  //           key: v.title,
  //         });
  //       }
  //     });
  //   };
  const handleSubmit = async (values: any) => {
    console.log('Form Values:', values);
    console.log('File List:', videoFileLists);
    values.videos.forEach(async (v: any, index: number) => {
      const formData = new FormData();
      const files = videoFileLists[index] || []; // 获取当前视频的文件列表
      files.forEach((file: UploadFile) => {
        // 确保文件列表中的每个文件都包含originFileObj
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });
      //   formData.append('files', JSON.stringify(files));
      formData.append('title', v.title);
      formData.append('description', v.description);
      formData.append('tags', v.tags);
      formData.append('permission', 'public');
      formData.append('uploaderId', '1');

      try {
        const response = await apiRequest.post('/video/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data.success) {
          message.success(`${v.title} 视频上传成功`);
        } else {
          message.error(`${v.title} 视频上传失败`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        message.error(`${v.title} 视频上传过程中出错`);
      }
    });
  };

  const handleFileChange = (index: number, newFileList: UploadFile[]) => {
    setVideoFileLists((prevLists) => ({
      ...prevLists,
      [index]: newFileList,
    }));
  };

  const handleTagChange = (value: any) => {
    const newTags = value.map((tag: any, idx: number) => {
      if (typeof tag === 'object') {
        return tag;
      }
      // 检查标签是否已经存在
      const existingTag = tags.find((t) => t.name === tag);
      if (existingTag) {
        return existingTag;
      }
      return { id: tags.length + idx, name: tag };
    });

    setTags(newTags);
  };

  const options: SelectProps['options'] = tags.map((tag) => ({
    label: tag.name,
    value: tag.name,
  }));
  return (
    <ProForm layout="vertical" onFinish={handleSubmit}>
      <ProFormList
        name="videos"
        initialValue={[]}
        min={1}
        creatorButtonProps={{
          creatorButtonText: '添加视频',
        }}
        itemContainerRender={(doms) => {
          return <ProForm.Group>{doms}</ProForm.Group>;
        }}
        creatorRecord={{
          title: 'test',
          description: 'testsetset',
          tags: ['test', 'videos', '大波妹'],
          files: [],
        }}
        alwaysShowItemLabel
      >
        {(f, index, action) => {
          console.log(f, index, action);
          const uploadProps: UploadProps = {
            multiple: true,
            onChange(info) {
              const { status } = info.file;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                message.success(
                  `${info.file.name} file uploaded successfully.`,
                );
              } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
              handleFileChange(index, info.fileList);
            },
            onRemove: (file) => {
              // 同样使用函数式更新来处理文件移除
              setVideoFileLists((prevLists) => ({
                ...prevLists,
                [index]: prevLists[index].filter(
                  (item) => item.uid !== file.uid,
                ),
              }));
            },
            beforeUpload: (file) => {
              console.log(file);
              return false;
            },
            fileList: videoFileLists[index] || [],
          };

          return (
            <ProCard.Group key={index} title="视频信息" direction={'row'}>
              <ProCard
                bordered
                style={{
                  marginBlockEnd: 8,
                  width: '100%',
                }}
              >
                <ProForm.Item
                  name={'title'}
                  rules={[{ required: true, message: '请输入视频标题' }]}
                >
                  <ProFormTextArea
                    label="视频标题"
                    placeholder="请输入视频标题"
                    allowClear
                  />
                </ProForm.Item>
                <ProForm.Item
                  name={'description'}
                  rules={[{ required: true, message: '请输入视频描述' }]}
                >
                  <ProFormTextArea
                    label="视频描述"
                    placeholder="请输入视频描述"
                  />
                </ProForm.Item>
                <ProForm.Item
                  name={'tags'}
                  label="视频标签"
                  rules={[{ required: true, message: '请选择或输入视频标签' }]}
                >
                  <Select
                    mode="tags"
                    placeholder="请选择或输入视频标签"
                    tokenSeparators={[',']}
                    options={options}
                    onChange={handleTagChange}
                  />
                </ProForm.Item>
                <ProForm.Item
                  name={['files']}
                  rules={[{ required: true, message: '请上传视频文件' }]}
                >
                  <Dragger
                    {...uploadProps}
                    className="m-3"
                    // multiple
                    accept="video/*"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      点击或拖拽文件到此区域上传
                    </p>
                    <p className="ant-upload-hint">
                      支持单个或批量上传。严禁上传公司数据或其他带有敏感信息的文件
                    </p>
                  </Dragger>
                </ProForm.Item>
              </ProCard>
            </ProCard.Group>
          );
        }}
      </ProFormList>
    </ProForm>
  );
};

export default VideoUploadForm;
