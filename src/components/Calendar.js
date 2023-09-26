import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarComponent = ({ events, handleSelect, today }) => {
    return (
        <FullCalendar
            viewClassNames={"custom-calendar"}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            displayEventTime={false}
            events={events}
            selectable={true}
            select={handleSelect}
            slotDuration="24:00:00"
            validRange={{
                start: today,
            }}
            eventContent={(arg) => {
                const { event } = arg;

                // Définissez des couleurs personnalisées pour chaque type d'événement
                let backgroundColor;
                switch (event.extendedProps.leaveType) {
                    case 'RTT':
                        backgroundColor = 'green';
                        break;
                    case 'Vacances':
                        backgroundColor = 'red';
                        break;
                    case 'Rendez-vous':
                        backgroundColor = 'blue';
                        break;
                    case 'Maladie':
                        backgroundColor = 'purple';
                        break;
                    default:
                        backgroundColor = 'black';
                }

                if (event.extendedProps.status === 'En attente') {
                    backgroundColor = 'grey';
                }

                return (
                    <div
                        className="fc-content"
                        style={{
                            backgroundColor,
                            color: 'white',
                            padding: '5px',
                            width: '100%'
                        }}
                    >
                        <b>{event.title}</b>
                        {/* <br />
                {event.extendedProps.leaveType} */}
                    </div>
                );
            }}
        />
    );
};

export default CalendarComponent;