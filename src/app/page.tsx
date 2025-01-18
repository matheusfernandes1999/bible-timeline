'use client';
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

import { Event } from './types/events';
import EventForm from './Components/EventForm';
import TimelineComponent from './Components/TimelineComponent';
import TooltipComponent from './Components/TooltipComponent';
import SafeMap from './Components/SafeMap';

export default function Timeline() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Subscribe to the real-time updates from Firestore
    const unsubscribe = onSnapshot(collection(db, "events"), (querySnapshot) => {
      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as Event[];

      // Sort the events based on the start date
      setEvents(fetchedEvents.sort((a, b) => a.start - b.start));
    }, (error) => {
      console.error("Error fetching events from Firestore: ", error);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const [tooltip, setTooltip] = useState<{ visible: boolean; id: string } | null>(null);
  const timelineStart = -4026;
  const timelineEnd = 1914;
  const totalTimelineDuration = timelineEnd - timelineStart;

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
      setTooltip({
        visible: true,
        id: event.id,
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
  };

  const closeTooltip = () => setTooltip(null);

  return (
    <div className='bg-gray-950 h-[100vh]'>
      <EventForm />
      <TimelineComponent
        events={events}
        onEventClick={handleEventClick}
        timelineStart={timelineStart}
        timelineEnd={timelineEnd}
        totalTimelineDuration={totalTimelineDuration}
      />

      <TooltipComponent tooltip={tooltip} onClose={closeTooltip}/>
      <SafeMap events={events} />
    </div>
  );
}
