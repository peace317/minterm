import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Chart } from "primereact/chart";
import { useContext } from "../../context";
import { useResizeDetector } from "react-resize-detector";
import { useTranslation } from "react-i18next";
import ActionBar from "./ActionBar";
import { StoreKey } from "@/renderer/types";
import { TooltipItem } from "chart.js";
import clsx from "clsx";

/**
 * Functional component for the live data representation in a line chart,
 * that lies in the context. Therefore the line chart updates and adds points
 * itself, if new values are added to the context.
 *
 * @param IDefaultProps
 */
const OutputLineChart: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  id,
  className,
}) => {
  const { t } = useTranslation();
  const getThemes = useCallback(() => {
    const plugins = {
      legend: {
        labels: {
          color: "#495057",
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context: TooltipItem<any>) {
            return (
              t("TIMESTAMP") +
              ": " +
              context.dataset.timestamp[context.dataIndex].toLocaleString()
            );
          },
        },
      },
    };

    const lightOptions = {
      aspectRatio: 0,
      plugins: plugins,
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
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

    const darkOptions = {
      aspectRatio: 0,
      plugins: plugins,
      scales: {
        x: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "#ebedef",
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
  }, []);

  const WIDTH_PER_DATA_POINT = 20;
  const { receivedData, setReceivedData } = useContext();
  const { lightOptions, darkOptions } = getThemes();
  const chartRef = useRef<Chart>(null);
  const [initWidth, setInitWidth] = useState<number>(0);
  const { width, ref } = useResizeDetector();
  const [isDataNumeric, setIsDataNumeric] = useState<boolean>(true);
  const [basicData] = useState({
    labels: [],
    datasets: [
      {
        label: t("VALUE"),
        data: [],
        timestamp: [],
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.0,
      },
    ],
  });
  const theme = useMemo(() => {
    return window.electron.store.get(StoreKey.THEME);
  }, []);

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
    const leftWidth: number = width || initWidth;
    const colCount = Math.round(leftWidth / WIDTH_PER_DATA_POINT);
    const startIndex =
      receivedData.length - colCount > 0 ? receivedData.length - colCount : 0;
    for (let index = startIndex; index < receivedData.length; index++) {
      const value = getValue(receivedData[index].value);
      if (value.length === 0) {
        continue;
      }
      if (isNumeric(value)) {
        labels.push(index);
        chartData.push(receivedData[index].value);
        timestamps.push(receivedData[index].timestamp);
      } else {
        console.log("Is not numeric for", receivedData[index]);
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

  const isNumeric = (str: string) => {
    if (typeof str != "string") return false;
    return !isNaN(parseFloat(str));
  };

  const getValue = (str: string) => {
    const replaceChars = ["\r", "\n", "\t", ",", ";"];
    replaceChars.forEach((e) => (str = str.replaceAll(e, "")));
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
    const ctx: CanvasRenderingContext2D = chartRef.current?.getCanvas().getContext("2d");
    // fillstyle need be set in the back
    ctx.globalCompositeOperation = "destination-over";
    if (theme === "dark") {
      ctx.fillStyle = "#2a323d";
    } else {
      ctx.fillStyle = "white";
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
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          "diagram_" + new Date().toISOString().split(".")[0] + ".png";
        a.click();
      });
  };

  const getChart = () => {
    const options = theme === "dark" ? darkOptions : lightOptions;
    const opacity = isDataNumeric ? "1" : "0.5";
    return (
      <Chart
        id={id}
        ref={chartRef}
        type="line"
        className="w-full"
        style={{ height: "calc(100% - 25px)", opacity: opacity }}
        data={basicData}
        options={options}
      />
    );
  };

  return (
    <div id={id + ":container"} className={clsx(className, " h-full w-full")}>
      <ActionBar
        id={id + ":outputActionBar"}
        data={receivedData}
        setData={setReceivedData}
        dataCountLabel={"Rx"}
        dataCounterHidden={false}
        clearButtonHidden={false}
        clearButtonToolTip={t("CLEAR_RECEIVED")}
        saveButtonHidden={false}
        onSave={onSaveImage}
      />
      <div className={"grid h-full w-full"} ref={ref}>
        <label className="ml-8 mt-8 absolute" hidden={isDataNumeric}>
          {t("NO_VALID_FORMAT_FOR_LINE_CHART")}
        </label>
        {getChart()}
      </div>
    </div>
  );
};

export default OutputLineChart;
