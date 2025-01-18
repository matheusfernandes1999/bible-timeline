'use client';
import React from 'react';
import { Event } from '../types/events';

type TimelineProps = {
  events: Event[];
  onEventClick: (event: Event, e: React.MouseEvent) => void;
  timelineStart: number;
  timelineEnd: number;
  totalTimelineDuration: number;
};

const TimelineComponent: React.FC<TimelineProps> = ({
  events,
  onEventClick,
  timelineStart,
  timelineEnd,
  totalTimelineDuration,
}) => {
  // Function to determine the placement of events (whether to place in a new row or same row)
  const getEventPosition = (event: Event, index: number) => {
    let marginTop = 0;
    for (let i = 0; i < index; i++) {
      const prevEvent = events[i];
      if (
        (event.start < prevEvent.finish && event.finish > prevEvent.start) || // Overlapping events
        (event.start === prevEvent.start) // Same start date
      ) {
        marginTop += 27; // Place in a new line
      }
    }
    return marginTop;
  };

  return (
    <div className="relative w-full h-[250px] mt-8 justify-self-center rounded-md overflow-hidden">
      {/* Timeline Labels */}
      <div className="absolute top-0 left-0 w-full h-[20px] text-xs flex justify-between text-white font-bold px-2">
        <span>{timelineStart} AEC</span>
        <span>{timelineEnd} EC</span>
      </div>

      {/* Year 0 marker */}
      <div
        className="absolute top-0 text-sm font-bold text-white"
        style={{
          left: `${((0 - timelineStart) / totalTimelineDuration) * 100}%`,
          transform: 'translateX(-50%)',
        }}
      >
        0
      </div>

      {/* Timeline Background */}
      <div className="absolute top-[20px] left-0 w-full h-[100%]"></div>

      {/* Event Bars */}
      {events.map((event, index) => {
        const eventStartDiff = event.start - timelineStart;
        const eventDuration = event.duration;
        const eventWidth = (eventDuration / totalTimelineDuration) * 100;

        const eventPosition = (eventStartDiff / totalTimelineDuration) * 100;
        const eventScaledWidth = (eventWidth / 100) * 100;

        const eventMarginTop = getEventPosition(event, index);

        return (
          <div key={index}>
            <div
              className="absolute text-xs font-bold text-gray-700 text-center cursor-pointer"
              style={{
                top: `${eventMarginTop + 25}px`,
                left: `${eventPosition + 5}%`,
                transform: 'translateX(-50%)',
              }}
              onClick={(e) => onEventClick(event, e)}
            >
              {event.name}
            </div>

            <div
              className="absolute top-[20px] left-0 h-[5px] text-white text-center leading-[40px] shadow-md"
              style={{
                top: `${eventMarginTop + 20}px`,
                left: `${eventPosition}%`,
                width: `${eventScaledWidth}%`,
                backgroundColor: event.color,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineComponent;
