"use client";
import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/common/Button";
import { Icon } from "@iconify/react";
import { EventService, galleryService } from "@/src/services/databaseService";
import { formatEventDate } from "@/src/utils/dateUtils";

export default function EventPage({ params }) {
  const { slug } = use(params);
  const [event, setEvent] = useState(null);
  const [eventGallery, setEventGallery] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [seasonEvents, setSeasonEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventService = new EventService();

  // Function to check if event is completed (past date)
  const isEventCompleted = (eventDate) => {
    if (!eventDate) return false;

    const now = new Date();
    const eventDateTime =
      eventDate instanceof Date ? eventDate : new Date(eventDate);

    // Set both dates to start of day for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(
      eventDateTime.getFullYear(),
      eventDateTime.getMonth(),
      eventDateTime.getDate()
    );

    return eventDay < today;
  };

  // Fetch event by slug from Firebase
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        console.log("Fetching event with slug:", slug);

        const fetchedEvent = await eventService.getEventBySlug(slug);
        console.log("Fetched event:", fetchedEvent);

        if (!fetchedEvent) {
          console.log("Event not found in Firebase");
          setError("Event not found");
          setLoading(false);
          return;
        }

        setEvent(fetchedEvent);

        // Fetch gallery items for this event
        try {
          const galleryItems = await galleryService.getGalleryItemsByEventSlug(
            slug
          );
          setEventGallery(galleryItems);
        } catch (galleryErr) {
          console.warn("Error fetching event gallery:", galleryErr);
          setEventGallery([]);
        }

        // Fetch events from the same season
        try {
          if (fetchedEvent.season) {
            const seasonEventsData = await eventService.getEventsBySeason(
              fetchedEvent.season
            );
            const otherSeasonEvents = seasonEventsData.filter(
              (e) => e.slug !== slug
            );
            setSeasonEvents(otherSeasonEvents);
          }
        } catch (seasonErr) {
          console.warn("Error fetching season events:", seasonErr);
          setSeasonEvents([]);
        }

        // Fetch related events from the same category
        try {
          const allEvents = await eventService.getAll();
          const related = allEvents
            .filter(
              (e) => e.slug !== slug && e.category === fetchedEvent.category
            )
            .slice(0, 3);
          setRelatedEvents(related);
        } catch (relatedErr) {
          console.warn("Error fetching related events:", relatedErr);
          // Don't fail the whole page if related events fail
          setRelatedEvents([]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            className="text-brand-primary mx-auto mb-4 animate-spin"
            width={64}
          />
          <h3 className="text-xl font-semibold text-gray-600">
            Loading event...
          </h3>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500 mx-auto mb-4"
            width={64}
          />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {error || "Event not found"}
          </h3>
          <p className="text-gray-500 mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button text="Back to Events" type="primary" link="/events" />
        </div>
      </div>
    );
  }

  const eventCompleted = isEventCompleted(event.date);

  console.log(
    "Event:",
    event.speakers.length === 0 ? "No speakers" : "Speakers"
  );
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden p-0">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={event.background || "/images/hero.png"}
            alt={event.title}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>

        {/* Event Info Overlay */}
        <Container className="relative z-20 text-center text-white">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-6 py-2 rounded-full text-sm font-semibold">
              <Icon
                icon={
                  eventCompleted ? "mdi:calendar-check" : "mdi:calendar-star"
                }
                width={20}
              />
              {eventCompleted ? "Completed Event" : event.category}
            </div>
            {event.season && (
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold border border-white/30">
                <Icon icon="mdi:calendar-range" width={20} />
                Season {event.season}
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            {event.title}
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg mb-8">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:calendar-month-outline" width={24} />
              <span>{formatEventDate(event.date) || event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:map-marker-outline" width={24} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:clock-outline" width={24} />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Action buttons - conditional based on event status */}
          {!eventCompleted && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                text={
                  event.season
                    ? `Register for Season ${event.season}`
                    : "Register Now"
                }
                type="primary"
                link={`/events/season/${
                  event.season || "current"
                }/register?from=${slug}`}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary"
              />
              <Button
                text="Add to Calendar"
                type="secondary"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={() => {
                  try {
                    // Handle Date object from Firebase or string from static data
                    let eventDate;
                    if (event.date instanceof Date) {
                      eventDate = new Date(event.date);
                    } else {
                      // Parse the event date - remove ordinal indicators (st, nd, rd, th)
                      const cleanDateString = event.date.replace(
                        /(\d+)(st|nd|rd|th)/,
                        "$1"
                      );
                      eventDate = new Date(cleanDateString);
                    }

                    // Check if date is valid
                    if (isNaN(eventDate.getTime())) {
                      console.error("Invalid date format:", event.date);
                      alert("Unable to add to calendar: Invalid date format");
                      return;
                    }

                    // Parse event time if available, otherwise default to 9 AM
                    const startDate = new Date(eventDate);
                    if (event.time) {
                      // Try to parse the time (e.g., "6:00 PM - 9:00 PM" or "9:00 AM - 6:00 PM")
                      const timeMatch = event.time.match(
                        /(\d{1,2}):(\d{2})\s*(AM|PM)/i
                      );
                      if (timeMatch) {
                        let hours = parseInt(timeMatch[1]);
                        const minutes = parseInt(timeMatch[2]);
                        const period = timeMatch[3].toUpperCase();

                        if (period === "PM" && hours !== 12) {
                          hours += 12;
                        } else if (period === "AM" && hours === 12) {
                          hours = 0;
                        }

                        startDate.setHours(hours, minutes, 0, 0);
                      } else {
                        startDate.setHours(9, 0, 0, 0); // Default to 9 AM
                      }
                    } else {
                      startDate.setHours(9, 0, 0, 0); // Default to 9 AM
                    }

                    // Set end time based on event time or default to 2 hours later
                    const endDate = new Date(startDate);
                    if (event.time && event.time.includes(" - ")) {
                      // Try to parse end time
                      const endTimeMatch = event.time.match(
                        /- (\d{1,2}):(\d{2})\s*(AM|PM)/i
                      );
                      if (endTimeMatch) {
                        let endHours = parseInt(endTimeMatch[1]);
                        const endMinutes = parseInt(endTimeMatch[2]);
                        const endPeriod = endTimeMatch[3].toUpperCase();

                        if (endPeriod === "PM" && endHours !== 12) {
                          endHours += 12;
                        } else if (endPeriod === "AM" && endHours === 12) {
                          endHours = 0;
                        }

                        endDate.setHours(endHours, endMinutes, 0, 0);
                      } else {
                        endDate.setTime(
                          startDate.getTime() + 2 * 60 * 60 * 1000
                        ); // 2 hours later
                      }
                    } else {
                      endDate.setTime(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
                    }

                    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
                    const formatDate = (date) => {
                      return (
                        date.toISOString().replace(/[-:]/g, "").split(".")[0] +
                        "Z"
                      );
                    };

                    const calendarEvent = {
                      title: event.title,
                      start: formatDate(startDate),
                      end: formatDate(endDate),
                      description: event.description || "",
                      location: event.location || "",
                    };

                    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      calendarEvent.title
                    )}&dates=${calendarEvent.start}/${
                      calendarEvent.end
                    }&details=${encodeURIComponent(
                      calendarEvent.description
                    )}&location=${encodeURIComponent(calendarEvent.location)}`;

                    window.open(googleCalendarUrl, "_blank");
                  } catch (error) {
                    console.error("Error creating calendar event:", error);
                    alert("Unable to add to calendar. Please try again.");
                  }
                }}
              />
            </div>
          )}

          {/* Show event status message for completed events */}
          {eventCompleted && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 justify-center text-white">
                <Icon icon="mdi:check-circle" width={24} />
                <span className="font-medium">
                  This event has been completed
                </span>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Event Details Section */}
      <Section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Event */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About This Event
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>{event.description}</p>
                  {event.longDescription && (
                    <div
                      className="not-prose"
                      dangerouslySetInnerHTML={{
                        __html: event.longDescription,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Event Gallery - Only show for completed events */}
              {eventCompleted && eventGallery && eventGallery.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Event Gallery
                    </h2>
                    <Button
                      text="View All Photos"
                      type="secondary"
                      link={`/events/${slug}/gallery`}
                      icon="mdi:arrow-right"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventGallery.slice(0, 6).map((galleryItem, index) => (
                      <div
                        key={galleryItem.id}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                        onClick={() => {
                          // You can add a lightbox/modal here later
                          window.open(galleryItem.image, "_blank");
                        }}
                      >
                        <Image
                          src={galleryItem.image}
                          alt={galleryItem.title || `Event photo ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Icon
                            icon="mdi:fullscreen"
                            width={24}
                            className="text-white"
                          />
                        </div>
                        {galleryItem.title && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {galleryItem.title}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda - Hide for completed events unless specifically needed */}
              {!eventCompleted && event.agenda && event.agenda.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Event Agenda
                  </h2>
                  <div className="space-y-4">
                    {event.agenda.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <span className="text-brand-primary font-medium">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                        {item.speaker && (
                          <p className="text-sm text-gray-500 mt-2">
                            Speaker: {item.speaker}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {eventCompleted ? "Event Speakers" : "Featured Speakers"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-6 shadow-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {speaker.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {speaker.name}
                            </h3>
                            <p className="text-gray-600">{speaker.title}</p>
                            <p className="text-sm text-gray-500">
                              {speaker.company}
                            </p>
                          </div>
                        </div>
                        {speaker.bio && (
                          <p className="text-gray-600 mt-4 text-sm">
                            {speaker.bio}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Event Info Card */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-6 mb-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Event Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:calendar-month-outline"
                      className="text-brand-primary"
                      width={24}
                    />
                    <div>
                      <p className="font-medium text-gray-900">Date</p>
                      <p className="text-gray-600">
                        {formatEventDate(event.date) || event.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:clock-outline"
                      className="text-brand-primary"
                      width={24}
                    />
                    <div>
                      <p className="font-medium text-gray-900">Time</p>
                      <p className="text-gray-600">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:map-marker-outline"
                      className="text-brand-primary"
                      width={24}
                    />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                      {event.venue && (
                        <p className="text-sm text-gray-500">{event.venue}</p>
                      )}
                    </div>
                  </div>

                  {event.price && (
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="mdi:currency-usd"
                        className="text-brand-primary"
                        width={24}
                      />
                      <div>
                        <p className="font-medium text-gray-900">Price</p>
                        <p className="text-gray-600">{event.price}</p>
                      </div>
                    </div>
                  )}

                  {event.capacity && (
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="mdi:account-group"
                        className="text-brand-primary"
                        width={24}
                      />
                      <div>
                        <p className="font-medium text-gray-900">Capacity</p>
                        <p className="text-gray-600">
                          {event.capacity} attendees
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons - conditional based on event status */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {!eventCompleted ? (
                    <>
                      <Button
                        text={
                          event.season
                            ? `Season ${event.season} Registration`
                            : "Company Registration"
                        }
                        type="primary"
                        className="w-full mb-3"
                        link={`/events/season/${
                          event.season || "current"
                        }/register?from=${event.slug}`}
                      />
                      {/* <Button
                        text="Share Event"
                        type="secondary"
                        className="w-full"
                      /> */}
                    </>
                  ) : (
                    <>
                      {event.gallery && event.gallery.length > 0 && (
                        <Button
                          text="View Full Gallery"
                          type="primary"
                          className="w-full mb-3"
                          onClick={() => {
                            document
                              .querySelector('h2:has-text("Event Gallery")')
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                        />
                      )}
                      <Button
                        text="Share Event"
                        type="secondary"
                        className="w-full"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-4">
                  Have questions about this event? Get in touch with our team.
                </p>
                <Button
                  text="Contact Us"
                  type="secondary"
                  link="/contact-us"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Season Events */}
      {event.season && seasonEvents.length > 0 && (
        <Section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50/30">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Other Events in Season {event.season}
              </h2>
              <p className="text-xl text-gray-600">
                Register once for the entire season and choose which events to
                attend
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seasonEvents.map((seasonEvent, index) => (
                <div
                  key={seasonEvent.id || index}
                  className="group transform transition-all duration-300 hover:scale-105"
                >
                  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-brand-primary/20">
                    <div className="relative h-48">
                      <Image
                        src={seasonEvent.background || "/images/hero.png"}
                        alt={seasonEvent.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {seasonEvent.category}
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Season {seasonEvent.season}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {seasonEvent.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:calendar" width={16} />
                          <span>
                            {formatEventDate(seasonEvent.date) ||
                              seasonEvent.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:map-marker" width={16} />
                          <span>{seasonEvent.location}</span>
                        </div>
                      </div>
                      <Button
                        text="View Details"
                        type="secondary"
                        link={`/events/${seasonEvent.slug}`}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button
                text={`Register for Season ${event.season}`}
                type="primary"
                link={`/events/season/${event.season}/register?from=${slug}`}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary w-[30%] mx-auto"
              />
            </div>
          </Container>
        </Section>
      )}

      {/* Related Events */}
      <Section className="py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Related Events
            </h2>
            <p className="text-xl text-gray-600">
              Discover more events you might be interested in
            </p>
          </div>

          {relatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent, index) => (
                <div
                  key={relatedEvent.id || index}
                  className="group transform transition-all duration-300 hover:scale-105"
                >
                  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={relatedEvent.background || "/images/hero.png"}
                        alt={relatedEvent.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {relatedEvent.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {relatedEvent.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:calendar" width={16} />
                          <span>
                            {formatEventDate(relatedEvent.date) ||
                              relatedEvent.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:map-marker" width={16} />
                          <span>{relatedEvent.location}</span>
                        </div>
                      </div>
                      <Button
                        text="View Details"
                        type="secondary"
                        link={`/events/${relatedEvent.slug}`}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon
                icon="mdi:calendar-blank"
                className="text-gray-400 mx-auto mb-4"
                width={64}
              />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No related events found
              </h3>
              <p className="text-gray-500">
                Check back later for more events in this category
              </p>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
