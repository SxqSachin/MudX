import { AsyncDataProcessCallback, DataProcessCallback, VoidCallback } from "../types"
import { XID } from "../types/Object";
import { uuid } from "../utils/uuid";

type SubscriberXID = XID;
type EventDataXID = XID;
export class Subscriber<EVENT, DATA> {
  private _xid: XID;

  get xid() {
    return this._xid;
  }

  constructor() {
    this._xid = uuid();
  }

  subscribe(publisher: Publisher<EVENT, DATA>, event: XEvent<EVENT>, listener: AsyncDataProcessCallback<DATA>): VoidCallback {
    return publisher.addSubscribe(this, event, listener);
  }
}

type SubscribeEventObject<EVENT, DATA> = {event: XEvent<EVENT>, xid: EventDataXID, listener: AsyncDataProcessCallback<XEventData<DATA>>};
export class Publisher<EVENT, DATA> {
  private _subscriberMap!: Map<SubscriberXID, SubscribeEventObject<EVENT, DATA>[]>;

  constructor() {
    this._subscriberMap = new Map();
  }

  async publish(event: XEvent<EVENT>, data: XEventData<DATA>): Promise<DATA> {
    let curData = data;

    this._subscriberMap.forEach(async subscribeData => {
      subscribeData.forEach(async eventData => {
        if (eventData.event === event) {
          const curProcessRes = await eventData.listener(curData);
          curData = curProcessRes ?? curData;
        }
      })
    })

    return curData;
  }

  addSubscribe(subscribe: Subscriber<EVENT, DATA>, event: XEvent<EVENT>, listener: AsyncDataProcessCallback<XEventData<DATA>>): VoidCallback {
    const subscribeXID = subscribe.xid;
    const listenerXID = uuid();

    if (!this._subscriberMap.has(subscribeXID)) {
      this._subscriberMap.set(subscribeXID, [])
    }

    const eventList = this._subscriberMap.get(subscribeXID) as SubscribeEventObject<EVENT, DATA>[];
    eventList.push({
      xid: listenerXID,
      event,
      listener,
    });

    this._subscriberMap.set(subscribeXID, eventList)

    return () => {
      const eventList = this._subscriberMap.get(subscribeXID);
      if (!eventList?.length) {
        return;
      }
      const eventListenerIndex = eventList.findIndex(eventObj => {
        return eventObj.xid === listenerXID;
      })

      eventList.splice(eventListenerIndex, 1);
      this._subscriberMap.set(subscribeXID, eventList);
    }
  }
}

export type XEvent<T> = T;
export type XEventData<T> = T;