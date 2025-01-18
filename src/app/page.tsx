'use client';
import { useState } from 'react';
import { Event } from './types/events';
import EventForm from './Components/EventForm';
import TimelineComponent from './Components/TimelineComponent';
import TooltipComponent from './Components/TooltipComponent';
import SafeMap from './Components/SafeMap';

export default function Timeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const addEvent = (newEvent: Event) => {
    setEvents([...events, newEvent].sort((a, b) => a.start - b.start));
  };

  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string } | null>(null);
  const timelineStart = -4026;
  const timelineEnd = 1914;
  const totalTimelineDuration = timelineEnd - timelineStart;

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    if (tooltip?.visible && tooltip.text === `Start: ${event.start} | End: ${event.finish}`) {
      setTooltip(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;

      let tooltipText = `Start: ${event.start} | End: ${event.finish}`;
      if (event.meaning) tooltipText += ` | Meaning: ${event.meaning}`;
      if (event.bibleText) tooltipText += ` | Bible Text: ${event.bibleText}`;
      if (event.place) tooltipText += ` | Place: ${event.place}`;
      if (event.additionalInfo) tooltipText += ` | Info: ${event.additionalInfo}`;

      setTooltip({
        visible: true,
        x,
        y,
        text: tooltipText,
      });

      const updatedEvents = events.map((e) => {
        e.color = e.originalColor;
        return e;
      });

      if (event.references && event.references.length > 0) {
        const clickedEvent = updatedEvents.find((e) => e.name === event.name);
        if (clickedEvent) clickedEvent.color = 'orange';

        event.references.forEach((ref: any) => {
          const referencedEvent = updatedEvents.find((e) => e.name === ref);
          if (referencedEvent) {
            referencedEvent.color = 'orange';
          }
        });
      }

      setEvents(updatedEvents);
    }
  };

  const closeTooltip = () => setTooltip(null);

  return (
    <div className='bg-gray-950 h-[100vh]'>
      <EventForm onAddEvent={addEvent} />
      <TimelineComponent
        events={events}
        onEventClick={handleEventClick}
        timelineStart={timelineStart}
        timelineEnd={timelineEnd}
        totalTimelineDuration={totalTimelineDuration}
      />
      <TooltipComponent tooltip={tooltip} onClose={closeTooltip} />
      <SafeMap events={events} />
    </div>
  );
}
