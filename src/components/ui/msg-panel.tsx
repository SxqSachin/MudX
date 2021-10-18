import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Message, MessageData } from '../../core/message';
import moment from 'moment'

const MsgPanelWrapper = styled.div`
  min-height: 400px;
`;

export function MessagePanel() {
  const [msgList, setMsgList] = useState<MessageData[]>([]);

  useEffect(() => {
    Message.subscribe(newMsg => {
      setMsgList(old => {
        return [...old, newMsg]
      });
    });
  }, []);

  return (
    <MsgPanelWrapper className="w-full h-full flex flex-col">
      {
        [...msgList].reverse().map((msg, index) => {
          return (
            <p key={msg.timestamp + index}><span>{moment(msg.timestamp).format('HH:mm:ss')}</span> <span className="ml-8">{msg.msg}</span></p>
          )
        })
      }
    </MsgPanelWrapper>
  );
}
