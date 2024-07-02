import { Bar, Column, Line, Pie } from '@ant-design/charts';
import React, { useEffect, useState } from 'react';

interface DataRow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface AnalyticsResponse {
  rows: DataRow[];
}

const AnalyticsChart: React.FC = () => {
  const [userData, setUserData] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [pageData, setPageData] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async (
      url: string,
      setData: React.Dispatch<React.SetStateAction<any[]>>,
      formatData: (data: AnalyticsResponse) => any[],
    ) => {
      const response = await fetch(url);
      const result: AnalyticsResponse = await response.json();
      setData(formatData(result));
    };

    fetchData(
      'http://localhost:7000/api/analytics/users',
      setUserData,
      (data) =>
        data.rows.map((row) => ({
          country: row.dimensionValues[0].value,
          activeUsers: parseInt(row.metricValues[0].value),
          newUsers: parseInt(row.metricValues[1].value),
        })),
    );

    fetchData(
      'http://localhost:7000/api/analytics/traffic',
      setTrafficData,
      (data) =>
        data.rows.map((row) => ({
          sourceMedium: row.dimensionValues[0].value,
          sessions: parseInt(row.metricValues[0].value),
          bounceRate: parseFloat(row.metricValues[1].value),
        })),
    );

    fetchData(
      'http://localhost:7000/api/analytics/pages',
      setPageData,
      (data) =>
        data.rows.map((row) => ({
          pageTitle: row.dimensionValues[0].value,
          views: parseInt(row.metricValues[0].value),
          avgEngagementTime: parseFloat(row.metricValues[1].value),
        })),
    );

    fetchData(
      'http://localhost:7000/api/analytics/events',
      setEventData,
      (data) =>
        data.rows.map((row) => ({
          eventName: row.dimensionValues[0].value,
          engagementRate: parseFloat(row.metricValues[0].value),
          eventCount: parseInt(row.metricValues[1].value),
        })),
    );
  }, []);

  return (
    <div>
      <h1>User Analytics</h1>
      <Bar
        data={userData}
        xField="country"
        yField="activeUsers"
        seriesField="newUsers"
      />

      <h1>Traffic Analytics</h1>
      <Line
        data={trafficData}
        xField="sourceMedium"
        yField="sessions"
        seriesField="bounceRate"
      />

      <h1>Page Analytics</h1>
      <Pie data={pageData} angleField="views" colorField="pageTitle" />

      <h1>Event Analytics</h1>
      <Column
        data={eventData}
        xField="eventName"
        yField="engagementRate"
        seriesField="eventCount"
      />
    </div>
  );
};

export default AnalyticsChart;
