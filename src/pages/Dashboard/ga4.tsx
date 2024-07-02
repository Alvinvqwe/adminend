import { ProCard } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

interface DataRow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface AnalyticsResponse {
  rows: DataRow[];
}

const AnalyticsChart: React.FC = () => {
  const [responsive, setResponsive] = useState(false);

  const [userData, setUserData] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [pageData, setPageData] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (
      url: string,
      setData: React.Dispatch<React.SetStateAction<any[]>>,
      formatData: (data: AnalyticsResponse) => any[],
    ) => {
      try {
        const response = await fetch(url);
        const text = await response.text();

        // 尝试解析 JSON 数据
        try {
          const result: AnalyticsResponse = JSON.parse(text);
          if (result.rows.length === 0) {
            setData([['暂无数据', 0, 0]]);
          } else {
            setData(formatData(result));
          }
        } catch (jsonError) {
          console.error('解析 JSON 时出错:', jsonError);
          console.error('响应内容为:', text);
          setError('解析 JSON 响应时出错。详情请查看控制台。');
        }
      } catch (fetchError) {
        console.error('获取数据时出错:', fetchError);
        setError('获取数据时出错。详情请查看控制台。');
      }
    };

    fetchData('/api/ga4/analytics/users', setUserData, (data) =>
      data.rows.map((row) => [
        row.dimensionValues[0].value,
        Number(row.metricValues[0].value),
        Number(row.metricValues[1].value),
      ]),
    );

    fetchData('/api/ga4/analytics/traffic', setTrafficData, (data) =>
      data.rows.map((row) => [
        row.dimensionValues[0].value,
        Number(row.metricValues[0].value),
        Number(row.metricValues[1].value),
      ]),
    );

    fetchData('/api/ga4/analytics/pages', setPageData, (data) =>
      data.rows.map((row) => [
        row.dimensionValues[0].value,
        Number(row.metricValues[0].value),
        Number(row.metricValues[1].value),
      ]),
    );

    fetchData('/api/ga4/analytics/events', setEventData, (data) =>
      data.rows.map((row) => [
        row.dimensionValues[0].value,
        Number(row.metricValues[0].value),
        Number(row.metricValues[1].value),
      ]),
    );
  }, []);

  if (error) {
    return <div>错误: {error}</div>;
  }

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        style={{ marginBlockStart: 24 }}
        title="GA4指标仪表盘"
        //direction={responsive ? 'column' : 'row'}
        headerBordered
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24}>
            <ProCard
              loading={!userData}
              layout="center"
              //   colSpan={{ xs: 24, sm: 12 }}
              bordered
            >
              <Chart
                chartType="BarChart"
                width="100%"
                height="300px"
                data={
                  userData
                    ? userData.length > 1
                      ? [['国家', '活跃用户', '新用户'], ...userData]
                      : [
                          ['国家', '活跃用户', '新用户'],
                          ['暂无数据', 0, 0],
                        ]
                    : []
                }
                options={{
                  title: '用户分析',
                  hAxis: {
                    title: '国家',
                  },
                  vAxis: {
                    title: '用户数',
                  },
                }}
              />
            </ProCard>
          </Col>
          <Col xs={24} sm={24}>
            <ProCard loading={!trafficData} layout="center" bordered>
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={
                  trafficData
                    ? trafficData.length > 1
                      ? [['来源 / 媒介', '会话次数', '跳出率'], ...trafficData]
                      : [
                          ['来源 / 媒介', '会话次数', '跳出率'],
                          ['暂无数据', 0, 0],
                        ]
                    : []
                }
                options={{
                  title: '流量分析',
                  hAxis: {
                    title: '来源 / 媒介',
                  },
                  vAxis: {
                    title: '会话次数 / 跳出率',
                  },
                }}
              />
            </ProCard>
          </Col>
          <Col xs={24} sm={12}>
            <ProCard loading={!pageData} layout="center" bordered>
              <Chart
                chartType="PieChart"
                width="100%"
                height="300px"
                data={
                  pageData
                    ? pageData.length > 1
                      ? [['页面标题', '浏览次数', '平均参与时间'], ...pageData]
                      : [
                          ['页面标题', '浏览次数', '平均参与时间'],
                          ['暂无数据', 0, 0],
                        ]
                    : []
                }
                options={{
                  title: '页面分析',
                }}
              />
            </ProCard>
          </Col>
          <Col xs={24} sm={12}>
            <ProCard loading={!eventData} layout="center" bordered>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="300px"
                data={
                  eventData
                    ? eventData.length > 1
                      ? [['事件名称', '参与率', '事件计数'], ...eventData]
                      : [
                          ['事件名称', '参与率', '事件计数'],
                          ['暂无数据', 0, 0],
                        ]
                    : []
                }
                options={{
                  title: '事件分析',
                  hAxis: {
                    title: '事件名称',
                  },
                  vAxis: {
                    title: '参与率 / 事件计数',
                  },
                }}
              />
            </ProCard>
          </Col>
        </Row>
      </ProCard>
    </RcResizeObserver>
  );
};

export default AnalyticsChart;
