import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizeDetector } from 'react-resize-detector';
import { IDefaultProps } from '@minterm/types';
import ActionBar from './ActionBar';

interface IOutputTextAreaProps extends IDefaultProps {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<any[]>>;
  actionBarHidden?: boolean;
  dataCounterHidden?: boolean;
  clearButtonHidden?: boolean;
}

/**
 * Displays the data in a uneditable textarea.
 *
 * @param IOutputTextAreaProps
 */
const OutputTextArea: React.FC<IOutputTextAreaProps> = ({
  id,
  className,
  data,
  setData = () => {return;},
  actionBarHidden = false,
  dataCounterHidden = false,
  clearButtonHidden = false,
}) => {
  const { t } = useTranslation();
  const [topScrollable, setTopScrollable] = useState<boolean>(false);
  const [downScrollable, setDownScrollable] = useState<boolean>(false);
  const { ref } = useResizeDetector({
    onResize: () => {
      setScrollable();
    },
  });

  useEffect(() => {
    setScrollable();
  }, []);

  const setScrollable = () => {
    const maxScroll = ref.current?.scrollHeight - ref.current?.clientHeight;
    setDownScrollable(ref.current?.scrollTop - maxScroll !== 0);
    setTopScrollable(ref.current?.scrollTop !== 0);
  };

  const goUp = () => {
    const maxScrollTop = ref.current.scrollHeight - ref.current.clientHeight;

    if (ref.current.scrollTop !== 0) {
      ref.current.scrollTo({
        top: ref.current.scrollTop - maxScrollTop,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const goDown = () => {
    const maxScrollDown = ref.current.scrollHeight - ref.current.clientHeight;
    ref.current.scrollTo({
      top: ref.current.scrollTop + maxScrollDown,
      left: 0,
      behavior: 'smooth',
    });
  };



  return (
    <div id={`${id}:container`} className={`${className} card h-full`}>
      <div hidden={actionBarHidden}>
        <ActionBar
          id={`${id}:outputActionBar`}
          data={data}
          setData={setData}
          dataCountLabel="Rx"
          dataCounterHidden={dataCounterHidden}
          clearButtonHidden={clearButtonHidden}
          clearButtonToolTip={t('CLEAR_RECEIVED')}
        />
      </div>
      <div className="h-full pt-1">
        <Button
          onClick={goDown}
          visible={downScrollable}
          className="scrollDown p-button-text"
          icon="pi pi-angle-down"
        />
        <InputTextarea
          id={id}
          value={data}
          readOnly
          ref={ref}
          className="h-full w-full"
          style={{ resize: 'none' }}
          onScroll={setScrollable}
        />
        <Button
          onClick={goUp}
          visible={topScrollable}
          className="scrollTop p-button-text"
          icon="pi pi-angle-up"
        />
      </div>
    </div>
  );
};

export default OutputTextArea;
