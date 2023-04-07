import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useContext } from '../../context';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { AiOutlineDownload } from 'react-icons/ai';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import ActionBar from './ActionBar';
import { FormatService } from 'renderer/services/FormatService';

/**
 * Functional component for the live data representation in a line chart,
 * that lies in the context. Therefore the line chart updates and adds points
 * itself, if new values are added to the context.
 *
 * @param IDefaultProps
 */
const OutputLineChart: React.FC<IDefaultProps> = ({ id, className }) => {
  const getThemes = () => {
    let plugins = {
      legend: {
        labels: {
          color: '#495057',
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context: any) {
            return (
              t('TIMESTAMP') +
              ': ' +
              context.dataset.timestamp[context.dataIndex].toLocaleString()
            );
          },
        },
      },
    };

    let lightOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: plugins,
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
      animation: {
        duration: false, // general animation time
      },
      hover: {
        animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0,
    };

    let darkOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0,
      plugins: plugins,
      scales: {
        x: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
      animation: {
        duration: false, // general animation time
      },
      hover: {
        animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0,
    };

    return {
      lightOptions,
      darkOptions,
    };
  };

  const WIDTH_PER_DATA_POINT = 20;
  const { receivedData, setReceivedData, selectedTheme } = useContext();
  const { lightOptions, darkOptions } = getThemes();
  const chartRef = useRef<Chart>(null);
  const [initWidth, setInitWidth] = useState<number>(0);
  const { t } = useTranslation();
  const { width, ref } = useResizeDetector({
    onResize: () => {
      buildLineChart();
    },
  });
  const [isDataNumeric, setIsDataNumeric] = useState<boolean>(true);
  const [basicData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: t('VALUE'),
        data: [],
        timestamp: [],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.0,
      },
    ],
  });

  useEffect(() => {
    buildLineChart();
  }, [receivedData]);

  useLayoutEffect(() => {
    if (width === undefined) {
      setInitWidth(ref.current?.offsetWidth);
    }
  }, []);

  /**
   * Builds the line chart. The amount of values relies on the width of
   * the table, so in the long run there is a fixed space between values.
   */
  function buildLineChart() {
    const chartData = [];
    const labels = [];
    const timestamps = [];
    let leftWidth: number = width || initWidth;
    let colCount = Math.round(leftWidth / WIDTH_PER_DATA_POINT);
    let startIndex =
      receivedData.length - colCount > 0 ? receivedData.length - colCount : 0;
    for (let index = startIndex; index < receivedData.length; index++) {
      var value = getValue(receivedData[index].value);
      if (value.length === 0) {
        continue;
      }
      if (isNumeric(value)) {
          labels.push(index);
          chartData.push(receivedData[index].value);
          timestamps.push(receivedData[index].timestamp);
      } else {
        console.log('Is not numeric for', receivedData[index]);
        setIsDataNumeric(false);
        break;
      }
    }
    if (isDataNumeric) {
      basicData.labels = labels;
      basicData.datasets[0].data = chartData;
      basicData.datasets[0].timestamp = timestamps;
    }
  }

  const isNumeric = (str: any) => {
    if (typeof str != 'string') return false;
    return !isNaN(parseFloat(str));
  };

  const getValue = (str: any) => {
    var replaceChars = ['\r', '\n', '\t', ',', ';'];
    replaceChars.forEach((e) => (str = str.replaceAll(e, '')));
    return str;
  };

  /**
   * The canvas of the chart can be converted to base64 in order to save
   * the diagram as an image. Therefor the background is set to 'white',
   * because the canvas itself is transparent.
   * Then the base64 string will be converted to blob to download it
   * with an anchor element. There will be a .tmp file in the download directory,
   * as a normal download process is initiated.
   */
  const onSaveImage = () => {
    const ctx: any = chartRef.current?.getCanvas().getContext('2d');
    // fillstyle need be set in the back
    ctx.globalCompositeOperation = 'destination-over';
    if (selectedTheme?.theme === 'dark') {
      ctx.fillStyle = '#2a323d';
    } else {
      ctx.fillStyle = 'white';
    }
    ctx.fillRect(
      0,
      0,
      chartRef.current?.getCanvas().width,
      chartRef.current?.getCanvas().height
    );
    ctx.restore();
    const b64Data = chartRef.current?.getBase64Image();
    fetch(b64Data)
      .then((res) => res.blob())
      .then((blob) => {
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download =
          'diagram_' + new Date().toISOString().split('.')[0] + '.png';
        a.click();
      });
  };

  const getChart = () => {
    var options = selectedTheme?.theme === 'dark' ? darkOptions : lightOptions;
    var opacity = isDataNumeric ? '1' : '0.5';
    return (
      <Chart
        id={id}
        ref={chartRef}
        type="line"
        className="w-full"
        style={{ height: '70%', minHeight: '26vh', opacity: opacity }}
        data={basicData}
        options={options}
      />
    );
  };

  return (
    <div id={id + ':container'} className={className + ' h-full w-full'}>
      <ActionBar
        id={id + ':outputActionBar'}
        data={receivedData}
        setData={setReceivedData}
        dataCountLabel={'Rx'}
        dataCounterHidden={false}
        clearButtonHidden={false}
        clearButtonToolTip={t('CLEAR_RECEIVED')}
        saveButtonHidden={false}
        onSave={onSaveImage}
      />
      <div className={'grid h-full w-full pt-1 ' + className} ref={ref}>
        <label className="ml-8 mt-8 absolute" hidden={isDataNumeric}>
          {t('NO_VALID_FORMAT_FOR_LINE_CHART')}
        </label>
        {getChart()}
      </div>
    </div>
  );
};

export default OutputLineChart;
