import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Message, MessageData } from '../../core/message';
import moment from 'moment'

const MsgPanelWrapper = styled.div`
`;

export function MessagePanel() {
  const [msgList, setMsgList] = useState<MessageData[]>([]);

  useEffect(() => {
    Message.subscribe(async newMsg => {
      setMsgList(old => {
        return [...old, newMsg]
      });
    });
  }, []);

  return (
    <MsgPanelWrapper className="w-full h-full flex flex-col overflow-y-auto">
      {
        [...msgList].reverse().map((msg, index) => {
          return (
            <p key={msg.timestamp + index + msg.msg}><span>{moment(msg.timestamp).format('HH:mm:ss')}</span> <span className="ml-8">{msg.msg}</span></p>
          )
        })
      }
    </MsgPanelWrapper>
  );
}
